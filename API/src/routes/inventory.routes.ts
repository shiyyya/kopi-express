import { Router } from "express";
import { authenticate } from '../middleware/authenticate.js';
import { validateBody } from "../middleware/validate.js";
import * as controller from "../controllers/inv.controller.js"
import { decrementStockSchema, incrementStockSchema, newStockSchema } from "../validators/inv.validators.js";
import { requireRole } from "../middleware/authorization.js";

export const invRouter = Router();
invRouter.get('/', authenticate, requireRole('owner'), controller.getAllStocks);
invRouter.post('/', authenticate, requireRole('owner'), validateBody(newStockSchema), controller.newStockToAll);
invRouter.delete('/:name', authenticate, requireRole('owner'), controller.removeStockToAll);
invRouter.patch('/:name/increment', authenticate, requireRole('owner'), validateBody(incrementStockSchema), controller.incrementStockToAll);
invRouter.patch('/:name/decrement', authenticate, requireRole('owner'), validateBody(decrementStockSchema), controller.decrementStockToAll);

invRouter.get('/branches/:storeBranchId', authenticate, requireRole('owner', 'staff'), controller.getBranchStocks);
invRouter.post('/branches/:storeBranchId', authenticate, requireRole('owner', 'staff'), validateBody(newStockSchema), controller.newStockToBranch);
invRouter.delete('/items/:invItemId', authenticate, requireRole('owner', 'staff'), controller.removeStockToBranch);
invRouter.patch('/items/:invItemId/increment', authenticate, requireRole('owner', 'staff'), validateBody(incrementStockSchema), controller.incrementStockToBranch);
invRouter.patch('/items/:invItemId/decrement', authenticate, requireRole('owner', 'staff'), validateBody(decrementStockSchema), controller.decrementStockToBranch);