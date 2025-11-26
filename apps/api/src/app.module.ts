import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BusModule } from './bus/bus.module';
import { RouteModule } from './route/route.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, BusModule, RouteModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
