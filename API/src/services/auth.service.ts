import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { User as UserInstance } from '../models/User.js';
import { Customer, CustomerAddress, Staff, StoreBranch, User } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';
import type { LoginInput, RegisterCustomerInput, RegisterOwnerInput, RegisterStaffInput } from '../validators/user.validators.js';
import { UserRole } from '../constants/user.js';

function createToken(user: UserInstance): string {
  return jwt.sign(
    { sub: user.id },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn },
  );
}

async function registerUser(email: string, password: string, role: UserRole): Promise<UserInstance> {
  const existing = await User.findOne({ where: { email, role } });
  if (existing) throw new ApiError(409, 'User is already registered', 'EMAIL_EXISTS');
  const passwordHash = await bcrypt.hash(password, env.bcryptRounds);

  const user = await User.create({ 
    email, 
    passwordHash, 
    role,
  });

  return user;
}

export async function registerCustomer(input: RegisterCustomerInput) {
  const user = await registerUser(input.email, input.password, 'customer');

  const customer = await Customer.create({
    userId: user.id,
    fullName: input.fullName,
    phoneNumber: input.phoneNumber,
  });

  if (input.defaultAddress) {
    await CustomerAddress.create({
      customerId: customer.userId,
      address: input.defaultAddress,
    });
  }
  
  return { user, customer, token: createToken(user) };
}

export async function registerStaff(input: RegisterStaffInput) {
  const storeBranch = await StoreBranch.findOne({ where: {address: input.storeBranchAddress} })
  if (!storeBranch) throw new ApiError(404, 'Invalid Store Branch Address', 'STORE_BRANCH_NOT_FOUND');
  const user = await registerUser(input.email, input.password, 'staff');

  const staff = await Staff.create({
    userId: user.id,
    storeBranchId: storeBranch.id,
  });

  return { user, staff, token: createToken(user) };
}

export async function registerOwner(input: RegisterOwnerInput) {
  const user = await registerUser(input.email, input.password, 'owner');
  return { user, token: createToken(user) };
}

export async function login(input: LoginInput, role: UserRole) {
  const user = await User.findOne({ where: { email: input.email, role: role } });
  const valid = user ? await bcrypt.compare(input.password, user.passwordHash) : false;
  if (!user || !valid) throw new ApiError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
  if (user.status !== 'active') throw new ApiError(403, 'Account has been inactive/suspended', 'ACCOUNT_NOT_ACTIVE');

  let account;

  switch (role) {
    case 'customer':
      account = await Customer.findOne({ where: { userId: user.id } });
      if (!account) throw new ApiError(404, 'Customer not found', 'CUSTOMER_NOT_FOUND');
      break;
    case 'staff':
      account = await Staff.findOne({ where: { userId: user.id } });
      if (!account) throw new ApiError(404, 'Staff not found', 'STAFF_NOT_FOUND');
      break;
  }

  if (!account) return { user, token: createToken(user) };

  return { user, account, token: createToken(user) };
}
