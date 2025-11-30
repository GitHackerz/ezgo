import { Global, Module } from '@nestjs/common';
import { LoggingInterceptor } from './logging.interceptor';
import { LoggingService } from './logging.service';

@Global()
@Module({
	providers: [LoggingService, LoggingInterceptor],
	exports: [LoggingService, LoggingInterceptor],
})
export class LoggingModule {}