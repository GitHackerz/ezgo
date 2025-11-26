import { z } from 'zod';

export const CreateRatingDtoSchema = z.object({
  tripId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export type CreateRatingDto = z.infer<typeof CreateRatingDtoSchema>;
