import { z } from 'zod';
import { UNIT } from '../constants/inventory.js';

const quantity = z.coerce.number().finite().positive({ message: 'Quantity must be more than 0' })
  .refine((v) => Number.isInteger(Math.round(v * 1000) / 10), { message: 'Quantity can only have 2 decimals' });

export const newStockSchema = z.object({
  name: z.string().trim().min(2).max(50).regex(/[A-Za-z]/, 'Name must contain a letter'),
  unit: z.enum(UNIT),
}).strict();

export const updateIngredientSchema = z.object({
  name: z.string().trim().min(2).max(50).regex(/[A-Za-z]/, 'Name must contain a letter'),
  unit: z.enum(UNIT),
}).strict();

export const newBatchSchema = z.object({
  ingredientId: z.string().trim().min(1),
  quantity,
  purchasedAt: z.coerce.date(),
  expiresAt: z.coerce.date(),
}).strict().refine((v) => v.expiresAt > v.purchasedAt, {
  message: 'Expiry date must be after purchase date',
  path: ['expiresAt'],
});

export const incrementStockSchema = z.object({
  quantity,
}).strict();

export const decrementStockSchema = z.object({
  quantity,
}).strict();

export type NewStockInput = z.infer<typeof newStockSchema>;
export type UpdateIngredientInput = z.infer<typeof updateIngredientSchema>;
export type NewBatchInput = z.infer<typeof newBatchSchema>;
export type IncrementStockInput = z.infer<typeof incrementStockSchema>;
export type DecrementStockInput = z.infer<typeof decrementStockSchema>;