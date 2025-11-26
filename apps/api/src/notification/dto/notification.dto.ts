import { z } from 'zod';
import { NotificationType } from '@prisma/client';

export const CreateNotificationDtoSchema = z.object({
  title: z.string().min(1),
  message: z.string().min(1),
  type: z.nativeEnum(NotificationType),
  userId: z.string().uuid(),
  data: z.record(z.any()).optional(),
});

export type CreateNotificationDto = z.infer<typeof CreateNotificationDtoSchema>;

export const SendBulkNotificationDtoSchema = z.object({
  title: z.string().min(1),
  message: z.string().min(1),
  type: z.nativeEnum(NotificationType),
  userIds: z.array(z.string().uuid()).optional(),
  role: z.string().optional(),
});

export type SendBulkNotificationDto = z.infer<typeof SendBulkNotificationDtoSchema>;
