import { Router } from 'express';
import * as controller from '../controllers/user.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validateBody } from '../middleware/validate.js';
import { updateUserSchema } from '../validators/user.validators.js';
import { requireRole } from '../middleware/authorization.js';

export const userRouter = Router();
userRouter.get('/me', authenticate, requireRole('customer'), controller.getCustomerProfile);
userRouter.patch('/me', authenticate, validateBody(updateUserSchema), controller.updateCustomer);
// userRouter.patch('/staffs/me', authenticate, validateBody(updateUserSchema), controller.updateStaff);
// userRouter.patch('/owners/:id', authenticate, validateBody(updateUserSchema), controller.update);
userRouter.patch('/me/suspend', authenticate, controller.suspendUser);
userRouter.post('/me', authenticate, requireRole('customer'), controller.addCustomerAddress);
userRouter.delete('/me/addresses/:addressId', authenticate, requireRole('customer'), controller.removeCustomerAddress);