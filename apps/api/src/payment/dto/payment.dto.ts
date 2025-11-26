import { z } from 'zod';

export const CreatePaymentDtoSchema = z.object({
  bookingId: z.string().uuid(),
  amount: z.number().positive(),
  paymentMethod: z.enum(['card', 'cash', 'wallet']),
});

export type CreatePaymentDto = z.infer<typeof CreatePaymentDtoSchema>;

export const CreatePaymentIntentDtoSchema = z.object({
  bookingId: z.string().uuid(),
});

export type CreatePaymentIntentDto = z.infer<typeof CreatePaymentIntentDtoSchema>;

export const ConfirmPaymentDtoSchema = z.object({
  paymentIntentId: z.string(),
});

export type ConfirmPaymentDto = z.infer<typeof ConfirmPaymentDtoSchema>;
