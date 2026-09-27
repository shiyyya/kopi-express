import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { requireRole } from "../middleware/authorization.js";
import * as controller from "../controllers/addon.controller.js";
import { validateBody } from "../middleware/validate.js";
import { addAddOnIngredientSchema, newAddOnSchema, updateAddOnSchema } from "../validators/addon.validator.js";

export const addonRouter = Router();

addonRouter.get( "/", authenticate, controller.getAddOns );
addonRouter.get( "/:id", authenticate, controller.getAddOn );
addonRouter.post( "/", authenticate, requireRole("owner"), validateBody(newAddOnSchema), controller.newAddOn );
addonRouter.patch( "/:id", authenticate, requireRole("owner"), validateBody(updateAddOnSchema), controller.updateAddOn );
addonRouter.delete( "/:id", authenticate, requireRole("owner"), controller.removeAddOn );
addonRouter.get( "/:id/ingredients", authenticate, requireRole('staff', 'owner'), controller.getAddOnIngredients );
addonRouter.post( "/:id/ingredients", authenticate, requireRole("owner"), validateBody(addAddOnIngredientSchema), controller.addAddOnIngredient );
addonRouter.delete( "/:id/ingredients/:ingredientId", authenticate, requireRole("owner"), controller.removeAddOnIngredient );