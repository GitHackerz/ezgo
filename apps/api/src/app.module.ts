import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { AnalyticsModule } from "./analytics/analytics.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { BookingModule } from "./booking/booking.module";
import { BusModule } from "./bus/bus.module";
import { LoggingInterceptor } from "./common/logging/logging.interceptor";
import { LoggingModule } from "./common/logging/logging.module";
import { CompanyModule } from "./company/company.module";
import { LocationModule } from "./location/location.module";
import { NotificationModule } from "./notification/notification.module";
import { PaymentModule } from "./payment/payment.module";
import { PrismaModule } from "./prisma/prisma.module";
import { RatingModule } from "./rating/rating.module";
import { RouteModule } from "./route/route.module";
import { TripModule } from "./trip/trip.module";
import { UserModule } from "./user/user.module";
import { WebsocketModule } from "./websocket/websocket.module";

@Module({
	imports: [
		PrismaModule,
		AuthModule,
		UserModule,
		BusModule,
		CompanyModule,
		LocationModule,
		RouteModule,
		TripModule,
		BookingModule,
		PaymentModule,
		RatingModule,
		WebsocketModule,
		NotificationModule,
		AnalyticsModule,
		LoggingModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_INTERCEPTOR,
			useClass: LoggingInterceptor,
		},
	],
})
export class AppModule {}
