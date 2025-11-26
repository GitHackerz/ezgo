import { z } from 'zod';
import { Role } from '@prisma/client';

export const CreateUserDtoSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().optional(),
  role: z.nativeEnum(Role),
  companyId: z.string().uuid().optional(),
});

export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;

export const UpdateUserDtoSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phone: z.string().optional(),
  avatar: z.string().url().optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserDtoSchema>;

export const UpdatePasswordDtoSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8),
});

export type UpdatePasswordDto = z.infer<typeof UpdatePasswordDtoSchema>;
