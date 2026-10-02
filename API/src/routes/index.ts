import { Router } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { checkDeliveryEligibility } from '../services/geocoding.service.js';
import { authRouter } from './auth.routes.js';
import { userRouter } from './user.routes.js';
import { invRouter } from './inventory.routes.js';
import { productRouter } from './product.routes.js';
import { addonRouter } from './addon.routes.js';
import { cartRouter } from './cart.routes.js';
import { orderRouter } from './order.routes.js';
import { salesRepRouter } from './sales-rep.routes.js';
import { storeBranchRouter } from './store-branch.routes.js';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/inventory', invRouter);
apiRouter.use('/products', productRouter);
apiRouter.use('/cart', cartRouter);
apiRouter.use('/orders', orderRouter);
apiRouter.use('/addons', addonRouter);
apiRouter.use('/sales-rep', salesRepRouter);
apiRouter.use('/store-branches', storeBranchRouter);

apiRouter.get('/delivery/eligibility', async (request, response, next) => {
    try {
        const address = String(request.query.address || '').trim();
        if (!address) {
            throw new ApiError(400, 'Address is required', 'ADDRESS_REQUIRED');
        }

        const result = await checkDeliveryEligibility(address);
        response.status(200).json({ data: result });
    } catch (error) {
        next(error);
    }
});