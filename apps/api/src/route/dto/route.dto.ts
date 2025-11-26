import { z } from 'zod';

export const CreateRouteDtoSchema = z.object({
  name: z.string().min(3),
  origin: z.string().min(2),
  destination: z.string().min(2),
  distance: z.number().positive().optional(),
  duration: z.number().int().positive().optional(),
  stops: z.array(z.object({
    name: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    order: z.number().int(),
  })).optional(),
  companyId: z.string().uuid(),
});

export type CreateRouteDto = z.infer<typeof CreateRouteDtoSchema>;

export const UpdateRouteDtoSchema = z.object({
  name: z.string().min(3).optional(),
  origin: z.string().min(2).optional(),
  destination: z.string().min(2).optional(),
  distance: z.number().positive().optional(),
  duration: z.number().int().positive().optional(),
  stops: z.array(z.object({
    name: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    order: z.number().int(),
  })).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateRouteDto = z.infer<typeof UpdateRouteDtoSchema>;
