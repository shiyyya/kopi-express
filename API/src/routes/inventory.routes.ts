import { Router } from "express";
import { authenticate } from '../middleware/authenticate.js';
import { validateBody } from "../middleware/validate.js";
import * as controller from "../controllers/inv.controller.js"
import { decrementStockSchema, incrementStockSchema, newBatchSchema, newStockSchema, updateIngredientSchema } from "../validators/inv.validators.js";
import { requireRole } from "../middleware/authorization.js";

export const invRouter = Router();

invRouter.get('/', authenticate, requireRole('owner'), controller.getIngredients);
invRouter.post('/', authenticate, requireRole('owner'), validateBody(newStockSchema), controller.newIngredient);
invRouter.patch('/ingredients/:ingredientId', authenticate, requireRole('owner'), validateBody(updateIngredientSchema), controller.updateIngredient);
invRouter.delete('/ingredients/:ingredientId', authenticate, requireRole('owner'), controller.removeIngredient);
invRouter.get('/branches/ownStoreBranch', authenticate, requireRole('staff'), controller.getOwnBranchInventory);
invRouter.post('/branches/ownStoreBranch', authenticate, requireRole('staff'), validateBody(newBatchSchema), controller.newOwnBranchStock);
invRouter.get('/branches/:storeBranchId', authenticate, requireRole('owner'), controller.getBranchInventory);
invRouter.post('/branches/:storeBranchId', authenticate, requireRole('owner'), validateBody(newBatchSchema), controller.newBranchStock);
invRouter.delete('/items/:invItemId', authenticate, requireRole('owner', 'staff'), controller.removeBranchStock);
// invRouter.patch('/items/:invItemId/decrement', authenticate, requireRole('owner', 'staff'), validateBody(decrementStockSchema), controller.decrementStockToBranch);