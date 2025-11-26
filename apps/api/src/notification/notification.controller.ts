import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import type { CreateNotificationDto, SendBulkNotificationDto } from './dto/notification.dto';
import { CreateNotificationDtoSchema, SendBulkNotificationDtoSchema } from './dto/notification.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { Role } from '@prisma/client';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @Roles(Role.ADMIN, Role.COMPANY_ADMIN)
  create(@Body(new ZodValidationPipe(CreateNotificationDtoSchema)) createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Post('bulk')
  @Roles(Role.ADMIN, Role.COMPANY_ADMIN)
  sendBulk(@Body(new ZodValidationPipe(SendBulkNotificationDtoSchema)) dto: SendBulkNotificationDto) {
    return this.notificationService.sendBulk(dto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.notificationService.findAll(user.id);
  }

  @Get('unread-count')
  getUnreadCount(@CurrentUser() user: any) {
    return this.notificationService.getUnreadCount(user.id);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string, @CurrentUser() user: any) {
    return this.notificationService.markAsRead(id, user.id);
  }

  @Patch('read-all')
  markAllAsRead(@CurrentUser() user: any) {
    return this.notificationService.markAllAsRead(user.id);
  }
}
