import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from "@nestjs/common";
import { Request, Response } from "express";
import { Observable, tap } from "rxjs";
import { LoggingService } from "./logging.service";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	constructor(private readonly loggingService: LoggingService) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
		const request = context.switchToHttp().getRequest<Request>();
		const response = context.switchToHttp().getResponse<Response>();
		const startTime = Date.now();

		return next.handle().pipe(
			tap({
				next: () => {
					const responseTime = Date.now() - startTime;
					const statusCode = response.statusCode;
					this.loggingService.logRequest({
						method: request.method,
						url: request.url,
						statusCode,
						responseTime,
					});
				},
				error: (error: unknown) => {
					const responseTime = Date.now() - startTime;
					const statusCode = (error as { status?: number })?.status || 500;
					this.loggingService.logRequest({
						method: request.method,
						url: request.url,
						statusCode,
						responseTime,
					});
					this.loggingService.logError(error as Error | string);
				},
			}),
		);
	}
}
