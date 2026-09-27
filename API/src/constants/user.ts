export const USER_ROLE = [
    'customer',
    'staff',
    'owner',
] as const;
export type UserRole = typeof USER_ROLE[number];

export const USER_STATUS = [
    'active',
    'inactive',
    'suspended',
] as const;
export type UserStatus = typeof USER_STATUS[number];