import { Injectable, Logger } from "@nestjs/common";

export interface LogContext {
	userId?: string;
	userEmail?: string;
	userRole?: string;
	ip?: string;
	userAgent?: string;
	method: string;
	url: string;
	statusCode: number;
	responseTime: number;
	requestBody?: Record<string, unknown>;
	responseBody?: Record<string, unknown>;
	error?: Error | string;
	timestamp?: Date;
	requestId?: string;
}

@Injectable()
export class LoggingService {
	private readonly logger = new Logger("HTTP");

	logRequest(context: LogContext) {
		const logMessage = this.formatLogMessage(context);

		if (context.statusCode >= 400) {
			this.logger.error(
				logMessage,
				context.error instanceof Error ? context.error.stack : undefined,
			);
		} else if (context.statusCode >= 300) {
			this.logger.warn(logMessage);
		} else {
			this.logger.log(logMessage);
		}
	}

	private formatLogMessage(context: LogContext): string {
		const {
			requestId,
			method,
			url,
			statusCode,
			responseTime,
			userId,
			userEmail,
			userRole,
			ip,
			userAgent,
			timestamp,
		} = context;

		const baseInfo = `[${requestId || "UNKNOWN"}] ${method} ${url} ${statusCode} ${responseTime}ms`;

		const userInfo = userId ? ` User: ${userEmail} (${userRole})` : "";
		const clientInfo = ip ? ` IP: ${ip}` : "";
		const agentInfo = userAgent ? ` Agent: ${userAgent}` : "";
		const timeInfo = timestamp ? ` - ${timestamp.toISOString()}` : "";

		return `${baseInfo}${userInfo}${clientInfo}${agentInfo}${timeInfo}`;
	}

	logError(error: Error | string, context?: Partial<LogContext>) {
		const errorMessage = error instanceof Error ? error.message : error;
		const errorStack = error instanceof Error ? error.stack : undefined;

		this.logger.error(
			`[${context?.requestId || "UNKNOWN"}] Error: ${errorMessage}`,
			errorStack,
			context,
		);
	}

	logAuth(action: string, userId?: string, details?: Record<string, unknown>) {
		this.logger.log(
			`[AUTH] ${action}${userId ? ` - User: ${userId}` : ""}`,
			details,
		);
	}

	logDatabase(
		operation: string,
		table: string,
		details?: Record<string, unknown>,
	) {
		this.logger.log(`[DB] ${operation} on ${table}`, details);
	}

	logBusiness(operation: string, details?: Record<string, unknown>) {
		this.logger.log(`[BUSINESS] ${operation}`, details);
	}
}
