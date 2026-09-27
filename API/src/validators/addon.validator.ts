import { z } from 'zod';

const name = z.string().trim().min(2).max(50).regex(/[A-Za-z]/, 'Name must contain a letter');
const price = z.coerce.number().finite().nonnegative({ message: 'Price cannot be negative' })
        .refine((value) => Number.isInteger(value * 100), { message: 'Price can only have 2 decimals' });
const ingredients = z.array(
  z.object({id: z.string().trim(), quantity: z.number().positive()}));
// formData.append('sizes', JSON.stringify(['small', 'medium', 'large']));

export const newAddOnSchema = z.object({
  name,
  price,
  ingredients,
}).strict();

export const updateAddOnSchema = z.object({
  name: name.optional(),
  price: price.optional(),
}).strict()
.refine(data => Object.keys(data).length > 0, { message: 'At least one field must be updated' });

export const addAddOnIngredientSchema = z.object({
  ingredientId: z.string().trim().min(1),
  quantityRequired: z.coerce.number().int('Quantity must be a whole number').positive(),
})

export type newAddOnInput = z.infer<typeof newAddOnSchema>;
export type updateAddOnInput = z.infer<typeof updateAddOnSchema>;
export type addAddOnIngredientInput = z.infer<typeof addAddOnIngredientSchema>;