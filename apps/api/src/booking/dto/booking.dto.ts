import { z } from 'zod';
import { BookingStatus } from '@prisma/client';

export const CreateBookingDtoSchema = z.object({
  tripId: z.string().uuid(),
  seatNumber: z.string().optional(),
});

export type CreateBookingDto = z.infer<typeof CreateBookingDtoSchema>;

export const UpdateBookingDtoSchema = z.object({
  status: z.nativeEnum(BookingStatus),
});

export type UpdateBookingDto = z.infer<typeof UpdateBookingDtoSchema>;
