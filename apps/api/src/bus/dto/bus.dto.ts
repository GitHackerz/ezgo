import { z } from 'zod';
import { BusStatus } from '@prisma/client';

export const CreateBusDtoSchema = z.object({
  plateNumber: z.string().min(3),
  capacity: z.number().int().positive(),
  model: z.string().optional(),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
  companyId: z.string().uuid(),
});

export type CreateBusDto = z.infer<typeof CreateBusDtoSchema>;

export const UpdateBusDtoSchema = z.object({
  plateNumber: z.string().min(3).optional(),
  capacity: z.number().int().positive().optional(),
  model: z.string().optional(),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
  status: z.nativeEnum(BusStatus).optional(),
});

export type UpdateBusDto = z.infer<typeof UpdateBusDtoSchema>;

export const UpdateBusLocationDtoSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export type UpdateBusLocationDto = z.infer<typeof UpdateBusLocationDtoSchema>;
