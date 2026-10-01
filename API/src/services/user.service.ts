import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import type { User } from '../models/User.js';
import type { Customer } from '../models/Customer.js';
import { StoreBranch as StoreBranchModel, Staff as StaffModel, Customer as CustomerModel, User as UserModel, CustomerAddress as CustomerAddressModel} from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';
import type { addCustomerAddressInput, updateUserInput } from '../validators/user.validators.js';
import { UserRole } from '../constants/user.js';
import { Staff } from '../models/Staff.js';
import { geocodeAddress, getBranchesForArea } from './geocoding.service.js';

async function updateUser(requestedUser: User, input: updateUserInput, role: UserRole): Promise<User> {
  if (input.email && input.email !== requestedUser.email) {
    const existing = await UserModel.findOne({ where: { email: input.email, role } });
    if (existing) throw new ApiError(409, 'Email is already registered', 'EMAIL_EXISTS');
  }
  if (input.password) {
    const valid = await bcrypt.compare(input.currentPassword ?? '', requestedUser.passwordHash);
    if (!valid) throw new ApiError(401, 'Current password is incorrect', 'INVALID_CURRENT_PASSWORD');
    requestedUser.passwordHash = await bcrypt.hash(input.password, env.bcryptRounds);
  }
  if (input.email) requestedUser.email = input.email;
  return requestedUser.save();
}

export async function getCustomerProfile(userId: string) {
  const user = await UserModel.findByPk(userId);
  const customer = await CustomerModel.findOne({ where: { userId } });
  if (!user || !customer) throw new ApiError(404, 'Customer not found', 'CUSTOMER_NOT_FOUND');

  const addresses = await CustomerAddressModel.findAll({ where: { customerId: userId }, order: [['createdAt', 'ASC']] });

  return { user: user.toSafeJSON(), customer, addresses };
}

export async function updateCustomer(requestedUser: User, input: updateUserInput): Promise<{user: User, customer: Customer}> {
  const user = await updateUser(requestedUser, input, 'customer');
  const requestedCustomer = await CustomerModel.findOne({ where: { userId: user.id } });
  if (!requestedCustomer) throw new ApiError(404, 'Customer doesn\'t exist, the User might not be a Customer', 'CUSTOMER_NOT_FOUND');

  if (input.fullName) requestedCustomer.fullName = input.fullName;
  if (input.phoneNumber) requestedCustomer.phoneNumber = input.phoneNumber;
  const customer = await requestedCustomer.save();

  return { user, customer };
}

export async function updateStaff(requestedUser: User, input: updateUserInput): Promise<{user: User, staff: Staff}> {
  const user = await updateUser(requestedUser, input, 'staff');
  const requestedStaff = await StaffModel.findOne({ where: { userId: user.id } });
  if (!requestedStaff) throw new ApiError(404, 'Staff doesn\'t exist, the User might not be a Staff', 'STAFF_NOT_FOUND');

  const storeBranch = await StoreBranchModel.findOne({ where: { address: input.storeBranchAddress } });
  if (!storeBranch) throw new ApiError(404, 'Store Branch not found, or wrong address', 'STORE_BRANCH_NOT_FOUND');

  if (storeBranch.id) requestedStaff.storeBranchId = storeBranch.id;
  const staff = await requestedStaff.save();

  return { user, staff };
}

export async function suspendUser(user: User): Promise<User> {
  if (user.status === 'suspended') throw new ApiError(409, 'User is already suspended.', 'USER_ALREADY_SUSPENDED');
  user.status = 'suspended';
  return user.save();
}

export async function addCustomerAddress(id: string, input: addCustomerAddressInput) {
  let location;
  try {
    location = await geocodeAddress(input.newAddress);
  } catch {
    throw new ApiError(502, 'Address lookup is unavailable. Please try again.', 'GEOCODING_FAILED');
  }

  if (!location) throw new ApiError(400, 'We could not find that address. Please be more specific.', 'INVALID_ADDRESS');
  if (!location.barangay) throw new ApiError(400, 'Please include your barangay in the address.', 'AREA_NOT_FOUND');

  const branches = await getBranchesForArea(location.barangay);
  if (branches.length === 0) throw new ApiError(400, 'Not within reach of any area', 'AREA_NOT_WITHIN_REACH');

  return await CustomerAddressModel.create({
    customerId: id,
    address: input.newAddress,
    latitude: location.latitude,
    longitude: location.longitude,
  });
}

export async function removeCustomerAddress(id: string, addressId: string) {
  const deleted = await CustomerAddressModel.destroy({ where: { id: addressId, customerId: id } });
  if (deleted === 0) throw new ApiError(404, 'Customer address not found', 'CUSTOMER_ADDRESS_NOT_FOUND');
}