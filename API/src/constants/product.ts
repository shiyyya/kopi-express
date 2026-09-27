export const CATEGORY = [
    'coffee',
    'non_coffee',
    'pastry',
    'pasta',
] as const;
export type Category = typeof CATEGORY[number];