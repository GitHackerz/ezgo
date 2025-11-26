import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BusModule } from './bus/bus.module';
import { RouteModule } from './route/route.module';
import { TripModule } from './trip/trip.module';
import { BookingModule } from './booking/booking.module';
import { PaymentModule } from './payment/payment.module';
import { RatingModule } from './rating/rating.module';
import { WebsocketModule } from './websocket/websocket.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, BusModule, RouteModule, TripModule, BookingModule, PaymentModule, RatingModule, WebsocketModule, NotificationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
