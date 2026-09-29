import type { RequestHandler } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import * as invService from '../services/inv.service.js';
import type { NewStockInput, NewBatchInput, DecrementStockInput } from '../validators/inv.validators.js';
import { assertAuth } from '../utils/assertions.js';
import { Staff as StaffModel } from '../models/index.js';

async function getStaffBranchId(userId: string) {
    const staff = await StaffModel.findByPk(userId);
    if (!staff) throw new ApiError(404, 'Staff not found', 'STAFF_NOT_FOUND');
    return staff.storeBranchId;
}


export const getIngredients: RequestHandler = asyncHandler(async (request, response) => {
    assertAuth(request.user);
    const inventory = await invService.getIngredients();
    response.status(200).json({ data: { inventory } });
});

export const newIngredient: RequestHandler = asyncHandler(async (request, response) => {
    assertAuth(request.user);
    const ingredient = await invService.newIngredient(request.body as NewStockInput);
    response.status(201).json({ data: { ingredient } });
});

export const removeIngredient: RequestHandler = asyncHandler(async (request, response) => {
    assertAuth(request.user);
    if (typeof request.params.ingredientId !== 'string') throw new ApiError(400, 'Invalid ingredient id', 'INVALID_INGREDIENT_ID');
    await invService.removeIngredient(request.params.ingredientId);
    response.status(204).send();
});


export const getBranchInventory: RequestHandler = asyncHandler(async (request, response) => {
    assertAuth(request.user);
    if (typeof request.params.storeBranchId !== 'string') throw new ApiError(400, 'Invalid store branch id', 'INVALID_STORE_BRANCH_ID');
    const inventory = await invService.getBranchInventory(request.params.storeBranchId);
    response.status(200).json({ data: { inventory } });
});

export const newBranchStock: RequestHandler = asyncHandler(async (request, response) => {
    assertAuth(request.user);
    if (typeof request.params.storeBranchId !== 'string') throw new ApiError(400, 'Invalid store branch id', 'INVALID_STORE_BRANCH_ID');
    const newStock = await invService.newBranchStock(request.params.storeBranchId, request.body as NewBatchInput);
    response.status(201).json({ data: { newStock } });
});

export const removeBranchStock: RequestHandler = asyncHandler(async (request, response) => {
    assertAuth(request.user);
    if (typeof request.params.invItemId !== 'string') throw new ApiError(400, 'Invalid stock id', 'INVALID_STOCK_ID');
    await invService.removeBranchStock(request.params.invItemId);
    response.status(204).send();
});

// export const decrementStockToBranch: RequestHandler = asyncHandler(async (request, response) => {
//     assertAuth(request.user);
//     if (typeof request.params.invItemId !== 'string') throw new ApiError(400, 'Invalid stock id', 'INVALID_STOCK_ID');
//     const decrementedStock = await invService.decrementBranchStock(request.params.invItemId, request.body as DecrementStockInput);
//     response.status(200).json({ data: { decrementedStock } });
// });


export const getOwnBranchInventory: RequestHandler = asyncHandler(async (request, response) => {
    const storeBranchId = await getStaffBranchId(assertAuth(request.user).id);
    const inventory = await invService.getBranchInventory(storeBranchId);
    response.status(200).json({ data: { inventory } });
});

export const newOwnBranchStock: RequestHandler = asyncHandler(async (request, response) => {
    const storeBranchId = await getStaffBranchId(assertAuth(request.user).id);
    const newStock = await invService.newBranchStock(storeBranchId, request.body as NewBatchInput);
    response.status(201).json({ data: { newStock } });
});
