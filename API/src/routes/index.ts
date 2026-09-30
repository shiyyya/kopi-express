import { Router } from 'express';
import { authRouter } from './auth.routes.js';
import { userRouter } from './user.routes.js';
import { invRouter } from './inventory.routes.js';
import { productRouter } from './product.routes.js';
import { addonRouter } from './addon.routes.js';
import { cartRouter } from './cart.routes.js';
import { orderRouter } from './order.routes.js';

export const apiRouter = Router();
apiRouter.use('/auth', authRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/inventory', invRouter);
apiRouter.use('/products', productRouter);
apiRouter.use('/cart', cartRouter);
apiRouter.use('/orders', orderRouter);
apiRouter.use('/addons', addonRouter);
