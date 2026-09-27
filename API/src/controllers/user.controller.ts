import type { RequestHandler } from 'express';
import * as userService from '../services/user.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import type { addCustomerAddressInput, updateUserInput } from '../validators/user.validators.js';
import { assertAuth } from '../utils/assertions.js';

export const updateCustomer: RequestHandler = asyncHandler(async (request, response) => {
  const user = assertAuth(request.user);
  const updated = await userService.updateCustomer(user, request.body as updateUserInput);
  response.json({ data: { user: updated.user.toSafeJSON(), customer: updated.customer } });
});

export const updateStaff: RequestHandler = asyncHandler(async (request, response) => {
  const user = assertAuth(request.user);
  const updated = await userService.updateStaff(user, request.body as updateUserInput);
  response.json({ data: { user: updated.user.toSafeJSON(), staff: updated.staff } });
});

export const suspendUser: RequestHandler = asyncHandler(async (request, response) => {
  const user = assertAuth(request.user);
  await userService.suspendUser(user);
  response.status(204).send();
});

export const addCustomerAddress: RequestHandler = asyncHandler(async (request, response) => {
  const user = assertAuth(request.user);
  const customerAddress = await userService.addCustomerAddress(user.id, request.body as addCustomerAddressInput);
  response.json({ data: { customerAddress } });
});

export const removeCustomerAddress: RequestHandler = asyncHandler(async (request, response) => {
  const user = assertAuth(request.user);
  const customerAddressId = request.params.addressId as string;
  await userService.removeCustomerAddress(user.id, customerAddressId);
  response.status(204).send();
});