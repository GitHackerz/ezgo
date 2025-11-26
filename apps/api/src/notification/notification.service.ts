import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto, SendBulkNotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async create(createNotificationDto: CreateNotificationDto) {
    return this.prisma.notification.create({
      data: createNotificationDto,
    });
  }

  async sendBulk(dto: SendBulkNotificationDto) {
    let userIds = dto.userIds;

    // If role is specified, get all users with that role
    if (dto.role && !userIds) {
      const users = await this.prisma.user.findMany({
        where: { role: dto.role as any },
        select: { id: true },
      });
      userIds = users.map((u) => u.id);
    }

    if (!userIds || userIds.length === 0) {
      return { message: 'No users to notify' };
    }

    // Create notifications for all users
    const notifications = await this.prisma.notification.createMany({
      data: userIds.map((userId) => ({
        userId,
        title: dto.title,
        message: dto.message,
        type: dto.type,
      })),
    });

    return {
      message: `Sent ${notifications.count} notifications`,
      count: notifications.count,
    };
  }

  async findAll(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async markAsRead(id: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        id,
        userId,
      },
      data: {
        isRead: true,
      },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }

  async getUnreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return { count };
  }
}
