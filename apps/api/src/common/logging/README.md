# Logging System Documentation

## Overview
The logging system provides comprehensive request logging for all API endpoints in the NestJS application. It captures detailed information about each HTTP request and response, including user context, timing, and security-related data.

## Components

### 1. LoggingService (`logging.service.ts`)
- **Purpose**: Centralized service for structured logging
- **Features**:
  - Request logging with detailed context
  - Error logging with stack traces
  - Business logic logging helpers
  - Sensitive data sanitization
  - Structured log formatting

### 2. LoggingInterceptor (`logging.interceptor.ts`)
- **Purpose**: HTTP interceptor that captures all incoming requests and outgoing responses
- **Features**:
  - Global request/response interception
  - Request ID generation for tracking
  - User context extraction from JWT
  - Client IP detection (with proxy support)
  - Response time measurement
  - Sensitive data sanitization

### 3. LoggingModule (`logging.module.ts`)
- **Purpose**: Module that organizes the logging components
- **Features**:
  - Global module for application-wide availability
  - Exports logging service and interceptor

## Logged Information

### Request Data
- **Request ID**: Unique UUID for request tracking
- **Method**: HTTP method (GET, POST, PUT, DELETE, etc.)
- **URL**: Full request URL
- **User Agent**: Client user agent string
- **Client IP**: Real client IP (handles proxies)
- **User Context**: ID, email, and role (if authenticated)
- **Request Body**: Sanitized (passwords/tokens removed)
- **Query Parameters**: All query parameters
- **Headers**: Selected headers (excluding sensitive ones)

### Response Data
- **Status Code**: HTTP response status
- **Response Time**: Time taken to process request (in ms)
- **Response Size**: Size of response body (if applicable)
- **Error Details**: Stack traces and error messages for failed requests

### Security Features
- **Data Sanitization**: Automatically removes passwords, tokens, and other sensitive data
- **IP Detection**: Properly handles X-Forwarded-For and other proxy headers
- **User Context**: Extracts user information from JWT tokens

## Usage

The logging system is automatically enabled globally. No additional configuration is required for basic request logging.

### Manual Logging in Services

```typescript
import { LoggingService } from './common/logging/logging.service';

@Injectable()
export class SomeService {
  constructor(private loggingService: LoggingService) {}

  async someMethod(userId: string) {
    // Log business logic
    this.loggingService.logBusiness('Processing payment', {
      userId,
      amount: 100,
      currency: 'USD'
    });

    // Log errors
    try {
      // some operation
    } catch (error) {
      this.loggingService.logError('Payment processing failed', error, {
        userId,
        amount: 100
      });
    }
  }
}
```

## Log Output Format

Logs are output in a structured JSON format:

```json
{
  "level": "info",
  "message": "HTTP Request",
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "method": "POST",
  "url": "/api/auth/login",
  "statusCode": 200,
  "responseTime": 150,
  "userId": "user123",
  "userEmail": "user@example.com",
  "ip": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Configuration

The logging system is configured globally in `app.module.ts`:

```typescript
@Module({
  imports: [
    // ... other modules
    LoggingModule,
  ],
  providers: [
    // ... other providers
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
```

## Benefits

1. **Complete Request Tracking**: Every API request is logged with full context
2. **Security Monitoring**: Sensitive data is automatically sanitized
3. **Performance Monitoring**: Response times help identify slow endpoints
4. **User Activity Tracking**: User actions are logged with context
5. **Debugging Support**: Request IDs help trace issues across services
6. **Audit Trail**: Complete record of all API interactions

## Future Enhancements

- Log aggregation and analysis
- Configurable log levels per endpoint
- Log shipping to external services (ELK stack, etc.)
- Performance metrics dashboard
- Alerting on error patterns