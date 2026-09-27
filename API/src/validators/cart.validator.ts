import { z } from 'zod';

export const addToCartSchema = z.object({
  productId: z.string().trim().min(1),
  quantity: z.coerce.number().int('Quantity must be whole number').positive('Quantity must have a value equal or more than 1'),
  addonIds: z.array(z.string().trim().min(1)).refine( (ids) => new Set(ids).size === ids.length, 'Addon IDs must be unique'),
}).strict();

export type addToCartInput = z.infer<typeof addToCartSchema>;
