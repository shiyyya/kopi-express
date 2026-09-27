import { Router } from 'express';
import { authRouter } from './auth.routes.js';
import { userRouter } from './user.routes.js';
import { invRouter } from './inventory.routes.js';
import { productRouter } from './product.routes.js';

export const apiRouter = Router();
apiRouter.use('/auth', authRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/inventory', invRouter);
apiRouter.use('/products', productRouter);