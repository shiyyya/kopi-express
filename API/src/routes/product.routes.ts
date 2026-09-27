import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { requireRole } from "../middleware/authorization.js";
import * as controller from "../controllers/product.controller.js";
import { upload } from "../middleware/upload.js";
import { validateBody } from "../middleware/validate.js";
import { addProductIngredientSchema, newProductSchema, updateProductSchema } from "../validators/product.validator.js";

export const productRouter = Router();
productRouter.get('/', authenticate, controller.getAllProducts);
productRouter.get('/:id', authenticate, controller.getProduct);
productRouter.post('/', authenticate, requireRole('owner'), upload.single('image'), validateBody(newProductSchema), controller.newProduct);
productRouter.delete('/:id', authenticate, requireRole('owner'), controller.removeProduct);
productRouter.patch('/:id', authenticate, requireRole('owner'), upload.single('image'), validateBody(updateProductSchema), controller.updateProduct);
productRouter.get('/:id/ingredients', authenticate, requireRole('staff', 'owner'), controller.getProductIngredients);
productRouter.post('/:id/ingredients', authenticate, requireRole('owner'), validateBody(addProductIngredientSchema), controller.getProductIngredients);
productRouter.delete('/:id/ingredients', authenticate, requireRole('owner'), controller.getProductIngredients);
