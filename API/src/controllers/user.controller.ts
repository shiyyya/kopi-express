import type { RequestHandler } from 'express';
import * as userService from '../services/user.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import type { UpdateUserInput } from '../validators/user.validators.js';
import { assertAuth } from '../utils/assertions.js';

export const updateCustomer: RequestHandler = asyncHandler(async (request, response) => {
  const user = assertAuth(request.user);
  const updated = await userService.updateCustomer(user, request.body as UpdateUserInput);
  response.json({ data: { user: updated.user.toSafeJSON(), customer: updated.customer } });
});

export const updateStaff: RequestHandler = asyncHandler(async (request, response) => {
  const user = assertAuth(request.user);
  const updated = await userService.updateCustomer(user, request.body as UpdateUserInput);
  response.json({ data: { user: updated.user.toSafeJSON(), customer: updated.customer } });
});

export const deactivate: RequestHandler = asyncHandler(async (request, response) => {
  const user = assertAuth(request.user);
  await userService.suspendUser(user);
  response.status(204).send();
});
