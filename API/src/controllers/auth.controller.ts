import type { RequestHandler } from 'express';
import * as authService from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import type { LoginInput, RegisterCustomerInput, RegisterStaffInput, RegisterOwnerInput } from '../validators/user.validators.js';
import { USER_ROLE, UserRole } from '../constants/user.js';
import { ApiError } from '../utils/ApiError.js';

export const registerCustomer: RequestHandler = asyncHandler(async (request, response) => {
  const result = await authService.registerCustomer(request.body as RegisterCustomerInput);
  response.status(201).json({ data: { user: result.user.toSafeJSON(), customer: result.customer, token: result.token } });
});

export const registerStaff: RequestHandler = asyncHandler(async (request, response) => {
  const result = await authService.registerStaff(request.body as RegisterStaffInput);
  response.status(201).json({ data: { user: result.user.toSafeJSON(), staff: result.staff, token: result.token } });
});

export const registerOwner: RequestHandler = asyncHandler(async (request, response) => {
  const result = await authService.registerOwner(request.body as RegisterOwnerInput);
  response.status(201).json({ data: { user: result.user.toSafeJSON(), token: result.token } });
});

export const login: RequestHandler = asyncHandler(async (request, response) => {
  const role = request.params.role as UserRole;
  if (!USER_ROLE.includes(role as UserRole)) throw new ApiError(400, 'Invalid role', 'INVALID_ROLE');
  const result = await authService.login(request.body as LoginInput, role);
  response.json({ data: { user: result.user.toSafeJSON(), account: result.account, token: result.token } });
});
