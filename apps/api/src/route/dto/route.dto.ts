import { z } from "zod";

export const CreateRouteDtoSchema = z.object({
	name: z.string().min(3),
	originId: z.string().uuid(),
	destinationId: z.string().uuid(),
	distance: z.number().positive().optional(),
	duration: z.number().int().positive().optional(),
	stops: z
		.array(
			z.object({
				name: z.string(),
				latitude: z.number(),
				longitude: z.number(),
				order: z.number().int(),
			}),
		)
		.optional(),
	tripType: z.enum(["REGULAR", "SPECIAL"]).optional(),
	companyId: z.string().uuid(),
});

export type CreateRouteDto = z.infer<typeof CreateRouteDtoSchema>;

export const UpdateRouteDtoSchema = z.object({
	name: z.string().min(3).optional(),
	originId: z.string().uuid().optional(),
	destinationId: z.string().uuid().optional(),
	distance: z.number().positive().optional(),
	duration: z.number().int().positive().optional(),
	stops: z
		.array(
			z.object({
				name: z.string(),
				latitude: z.number(),
				longitude: z.number(),
				order: z.number().int(),
			}),
		)
		.optional(),
	tripType: z.enum(["REGULAR", "SPECIAL"]).optional(),
	isActive: z.boolean().optional(),
});

export type UpdateRouteDto = z.infer<typeof UpdateRouteDtoSchema>;
