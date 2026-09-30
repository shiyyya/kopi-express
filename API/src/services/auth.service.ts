import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { User } from '../models/User.js';
import { Customer, CustomerAddress, Staff, StoreBranch, User as UserModel } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';
import type { loginInput, registerCustomerInput, registerOwnerInput, registerStaffInput } from '../validators/user.validators.js';
import { UserRole } from '../constants/user.js';

function createToken(user: User): string {
  return jwt.sign(
    { sub: user.id },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn },
  );
}

async function registerUser(email: string, password: string, role: UserRole): Promise<User> {
  const existing = await UserModel.findOne({ where: { email, role } });
  if (existing) throw new ApiError(409, 'User is already registered', 'EMAIL_EXISTS');
  const passwordHash = await bcrypt.hash(password, env.bcryptRounds);

  const user = await UserModel.create({ 
    email, 
    passwordHash, 
    role,
  });

  return user;
}

export async function registerCustomer(input: registerCustomerInput) {
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

export async function registerStaff(input: registerStaffInput) {
  const storeBranch = await StoreBranch.findOne({ where: {address: input.storeBranchAddress} })
  if (!storeBranch) throw new ApiError(404, 'Invalid Store Branch Address', 'STORE_BRANCH_NOT_FOUND');
  const user = await registerUser(input.email, input.password, 'staff');

  const staff = await Staff.create({
    userId: user.id,
    storeBranchId: storeBranch.id,
  });

  return { user, staff, token: createToken(user) };
}

export async function registerOwner(input: registerOwnerInput) {
  const user = await registerUser(input.email, input.password, 'owner');
  return { user, token: createToken(user) };
}

async function authenticate(user: User | null, password: string) {
  if (!user) throw new ApiError(401, 'Invalid email', 'INVALID_EMAIL');
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new ApiError(401, 'Wrong password', 'WRONG_PASSWORD');
  if (user.status !== 'active') throw new ApiError(403, 'Account has been inactive/suspended', 'ACCOUNT_NOT_ACTIVE');

  return user;
}

export async function loginCustomer(input: loginInput) {
  const user = await UserModel.findOne({ where: { email: input.email, role: 'customer' } });
  const authUser = await authenticate(user, input.password);

  const customer = await Customer.findOne({ where: { userId: authUser.id } });
  if (!customer) throw new ApiError(404, 'Customer not found', 'CUSTOMER_NOT_FOUND');

  return { authUser, customer, token: createToken(authUser) };
}

export async function loginAdmin(input: loginInput) {
  let user = await UserModel.findOne({ where: { email: input.email, role: 'owner' } });
  if (!user) user = await UserModel.findOne({ where: { email: input.email, role: 'staff' } });
  const authUser = await authenticate(user, input.password);

  if (authUser.role === 'staff') {
    const staff = await Staff.findOne({ where: { userId: authUser.id } });
    if (!staff) throw new ApiError(404, 'Staff not found', 'STAFF_NOT_FOUND');
    return { authUser, staff, token: createToken(authUser) };
  }

  return { authUser, token: createToken(authUser) };
}