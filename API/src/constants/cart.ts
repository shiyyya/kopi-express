export const PRODUCT_TEMPERATURE = [
    'hot',
    'iced',
] as const;
export type ProductTemperature = typeof PRODUCT_TEMPERATURE[number];