import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { requireRole } from "../middleware/authorization.js";
import * as controller from "../controllers/order.controller.js";

export const orderRouter = Router();
// ccustomer
orderRouter.post( "/:storeBranchId", authenticate, requireRole('customer'), controller.newOrder);
orderRouter.get( "/customer", authenticate, requireRole('customer'), controller.getCustomerOrders);
orderRouter.get( "/customer/:orderId", authenticate, requireRole('customer'), controller.getCustomerOrder);

// staff
orderRouter.get( "/", authenticate, requireRole('staff'), controller.getOrders);
orderRouter.get( "/:orderId", authenticate, requireRole('staff'), controller.getOrder);
orderRouter.patch( "/:orderId/advance", authenticate, requireRole('staff'), controller.advanceOrder);
orderRouter.patch( "/:orderId/decline-cancel", authenticate, requireRole('staff'), controller.declineOrCancelOrder);