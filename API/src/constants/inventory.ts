export const UNIT = [
    'g',
    'ml',
    'pcs',
] as const;
export type Unit = typeof UNIT[number];