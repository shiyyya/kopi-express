import { Router } from 'express';
import * as controller from '../controllers/sales-rep.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/authorization.js';

export const salesRepRouter = Router();

salesRepRouter.get('/', authenticate, requireRole('staff', 'owner'), controller.getSalesReport);