import { Router } from 'express';
import * as controller from '../controllers/user.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validateBody } from '../middleware/validate.js';
import { updateUserSchema } from '../validators/user.validators.js';

export const userRouter = Router();
userRouter.patch('/me', authenticate, validateBody(updateUserSchema), controller.updateCustomer);
userRouter.patch('/staffs/me', authenticate, validateBody(updateUserSchema), controller.updateStaff);
// userRouter.patch('/owners/:id', authenticate, validateBody(updateUserSchema), controller.update);
userRouter.patch('/:id/deactivate', authenticate, controller.deactivate);
