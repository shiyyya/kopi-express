import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { requireRole } from "../middleware/authorization.js";
import * as controller from "../controllers/cart.controller.js";
import { validateBody } from "../middleware/validate.js";
import { addToCartSchema } from "../validators/cart.validator.js";

export const cartRouter = Router();

cartRouter.get( "/", authenticate, controller.getCart );
cartRouter.post( "/", authenticate, requireRole("customer"), validateBody(addToCartSchema), controller.addToCart );
cartRouter.delete( "/:id", authenticate, requireRole("customer"), controller.removeCartItem );