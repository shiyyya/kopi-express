import type { RequestHandler } from 'express';
import * as authService from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import type { loginInput, registerCustomerInput, registerStaffInput, registerOwnerInput } from '../validators/user.validators.js';
import { USER_ROLE, UserRole } from '../constants/user.js';
import { ApiError } from '../utils/ApiError.js';

export const registerCustomer: RequestHandler = asyncHandler(async (request, response) => {
  const result = await authService.registerCustomer(request.body as registerCustomerInput);
  response.status(201).json({ data: { user: result.user.toSafeJSON(), customer: result.customer, token: result.token } });
});

export const registerStaff: RequestHandler = asyncHandler(async (request, response) => {
  const result = await authService.registerStaff(request.body as registerStaffInput);
  response.status(201).json({ data: { user: result.user.toSafeJSON(), staff: result.staff, token: result.token } });
});

export const registerOwner: RequestHandler = asyncHandler(async (request, response) => {
  const result = await authService.registerOwner(request.body as registerOwnerInput);
  response.status(201).json({ data: { user: result.user.toSafeJSON(), token: result.token } });
});

export const login: RequestHandler = asyncHandler(async (request, response) => {
  const result = await authService.loginCustomer(request.body as loginInput);
  response.json({ data: { user: result.authUser.toSafeJSON(), account: result.customer, token: result.token } });
});

export const loginAdmin: RequestHandler = asyncHandler(async (request, response) => {
  const result = await authService.loginAdmin(request.body as loginInput);
  response.json({ data: { user: result.authUser.toSafeJSON(), account: result.staff ?? null, token: result.token } });
});