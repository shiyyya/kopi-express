import { z } from 'zod';
import { FULFILLMENT_TYPE, PAYMENT_METHOD } from '../constants/order.js';

export const newOrder = z.object({
  customerAddressId: z.string().trim().min(1),
  fulfillmentType: z.enum(FULFILLMENT_TYPE),
  paymentMethod: z.enum(PAYMENT_METHOD),
  paymentReference: z.string().trim().min(1),
  notes: z.string().min(1).max(255).optional(),
}).strict();

export type newOrderInput = z.infer<typeof newOrder>;
