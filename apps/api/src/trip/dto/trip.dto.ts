import { z } from 'zod';
import { TripStatus } from '@prisma/client';

export const CreateTripDtoSchema = z.object({
  departureTime: z.string().datetime(),
  arrivalTime: z.string().datetime().optional(),
  price: z.number().positive(),
  availableSeats: z.number().int().positive(),
  routeId: z.string().uuid(),
  busId: z.string().uuid(),
  driverId: z.string().uuid(),
});

export type CreateTripDto = z.infer<typeof CreateTripDtoSchema>;

export const UpdateTripDtoSchema = z.object({
  departureTime: z.string().datetime().optional(),
  arrivalTime: z.string().datetime().optional(),
  actualDeparture: z.string().datetime().optional(),
  actualArrival: z.string().datetime().optional(),
  status: z.nativeEnum(TripStatus).optional(),
  price: z.number().positive().optional(),
  availableSeats: z.number().int().positive().optional(),
});

export type UpdateTripDto = z.infer<typeof UpdateTripDtoSchema>;
