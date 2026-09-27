export const FULFILLMENT_TYPE = [
    'delivery',
    'self_pick_up',
] as const;
export type FulfillmentType = typeof FULFILLMENT_TYPE[number];

export const PAYMENT_METHOD = [
    'cash',
    'gcash',
] as const;
export type PaymentMethod = typeof PAYMENT_METHOD[number];

export const ORDER_STATUS = [
    'pending',
    'declined',
    'queued',
    'preparing',
    'ready',
    'completed',
    'cancelled',
] as const;
export type OrderStatus = typeof ORDER_STATUS[number];