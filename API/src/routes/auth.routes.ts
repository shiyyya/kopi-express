import { Router } from 'express';
import * as controller from '../controllers/auth.controller.js';
import { validateBody } from '../middleware/validate.js';
import { loginSchema, registerCustomerSchema, registerStaffSchema, registerOwnerSchema } from '../validators/user.validators.js';

export const authRouter = Router();
authRouter.post('/customer/register', validateBody(registerCustomerSchema), controller.registerCustomer);
authRouter.post('/staff/register', validateBody(registerStaffSchema), controller.registerStaff);
authRouter.post('/owner/register', validateBody(registerOwnerSchema), controller.registerOwner);
authRouter.post('/:role/login', validateBody(loginSchema), controller.login);
