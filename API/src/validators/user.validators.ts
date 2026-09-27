import { z } from 'zod';

const fullName = z.string().trim().min(2).max(255)
        .regex(/[A-Za-z]/, 'Fullname must contain a letter');
const email = z.string().trim().email().max(255).transform((value) => value.toLowerCase());
const phoneNumber = z.string().trim()
        .regex(/^\+639\d{9}$/);
const password = z.string().min(8).max(72)
        .regex(/[A-Za-z]/, 'Password must contain a letter')
        .regex(/\d/, 'Password must contain a number')
        .regex(/^\S+$/, 'Password must not contain spaces');
const otherPassword = z.string().min(1);
const address = z.string().trim().min(2).max(255);
const storeBranchAddress = z.string().trim().min(2).max(255);



export const registerCustomerSchema = z.object({
  fullName, email, phoneNumber, defaultAddress: address.optional(), password
})
.strict();

export const registerStaffSchema = z.object({
  email, storeBranchAddress, password
})
.strict();

export const registerOwnerSchema = z.object({
  email, password
})
.strict();


export const loginSchema = z.object({
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  password: z.string().min(1),
}).strict();

export const updateUserSchema = z.object({
  fullName: fullName.optional(),

  storeBranchAddress: storeBranchAddress.optional(),
  email: email.optional(),
  phoneNumber: z.string().min(1).optional(),
  currentPassword: otherPassword.optional(),
  password: password.optional(),
}).strict().refine((data) => Object.keys(data).some((key) => key !== 'currentPassword'), {
  message: 'At least one field must be updated',
}).refine((data) => !data.password || Boolean(data.currentPassword), {
  message: 'currentPassword is required to change the password',
  path: ['currentPassword'],
});

export const addCustomerAddressSchema = z.object({
  newAddress: address,
}).strict();

export type RegisterCustomerInput = z.infer<typeof registerCustomerSchema>;
export type RegisterStaffInput = z.infer<typeof registerStaffSchema>;
export type RegisterOwnerInput = z.infer<typeof registerOwnerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type addCustomerAddressInput = z.infer<typeof addCustomerAddressSchema>;