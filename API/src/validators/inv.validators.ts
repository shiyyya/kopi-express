import { z } from 'zod';
import { UNIT } from '../constants/inventory.js';

const quantity = z.coerce.number().int({ message: 'Quantity must be a whole number' });

export const newStockSchema = z.object({
  name: z.string().trim().min(2).max(50).regex(/[A-Za-z]/, 'Name must contain a letter'),
  quantity: quantity.nonnegative({ message: 'Quantity cannot be negative' }).optional(),
  unit: z.enum(UNIT),
}).strict();

export const incrementStockSchema = z.object({
  quantity: quantity.positive({ message: 'Quantity to increment must be atleast 1' }),
}).strict();

export const decrementStockSchema = z.object({
  quantity: quantity.positive({ message: 'Quantity to decrement must be atleast 1' }),
}).strict();

export type NewStockInput = z.infer<typeof newStockSchema>;
export type IncrementStockInput = z.infer<typeof incrementStockSchema>;
export type DecrementStockInput = z.infer<typeof decrementStockSchema>;