import type { RequestHandler } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import * as invService from '../services/inv.service.js';
import type { NewStockInput, IncrementStockInput, DecrementStockInput } from '../validators/inv.validators.js';


export const getAllStocks: RequestHandler = asyncHandler(async (request, response) => {
    const inventory = await invService.getInventory();
    response.status(200).json({ data: { inventory } });
});

export const newStockToAll: RequestHandler = asyncHandler(async (request, response) => {
    await invService.newStock(request.body as NewStockInput);
    response.status(204).send();
});

export const removeStockToAll: RequestHandler = asyncHandler(async (request, response) => {
    if (typeof request.params.name !== 'string') throw new ApiError(400, 'Invalid stock name', 'INVALID_STOCK_NAME');
    await invService.removeStock(request.params.name);
    response.status(204).send();
});

export const incrementStockToAll: RequestHandler = asyncHandler(async (request, response) => {
    if (typeof request.params.name !== 'string') throw new ApiError(400, 'Invalid stock name', 'INVALID_STOCK_NAME');
    await invService.incrementStock(request.params.name, request.body as IncrementStockInput);
    response.status(200).send();
})

export const decrementStockToAll: RequestHandler = asyncHandler(async (request, response) => {
    if (typeof request.params.name !== 'string') throw new ApiError(400, 'Invalid stock name', 'INVALID_STOCK_NAME');
    await invService.decrementStock(request.params.name, request.body as DecrementStockInput);
    response.status(200).send();
})


export const getBranchStocks: RequestHandler = asyncHandler(async (request, response) => {
    if (typeof request.params.storeBranchId !== 'string') throw new ApiError(400, 'Invalid store branch id', 'INVALID_STORE_BRANCH_ID');
    const inventory = await invService.getBranchInventory(request.params.storeBranchId);
    response.status(200).json({ data: { inventory } });
});

export const newStockToBranch: RequestHandler = asyncHandler(async (request, response) => {
    if (typeof request.params.storeBranchId !== 'string') throw new ApiError(400, 'Invalid store branch id', 'INVALID_STORE_BRANCH_ID');
    const newStock = await invService.newBranchStock(request.params.storeBranchId , request.body as NewStockInput);
    response.status(201).json({ data: { newStock } });

})

export const removeStockToBranch: RequestHandler = asyncHandler(async (request, response) => {
    if (typeof request.params.invItemId !== 'string') throw new ApiError(400, 'Invalid stock id', 'INVALID_STOCK_ID');
    await invService.removeBranchStock(request.params.invItemId);
    response.status(204).send();
});

export const incrementStockToBranch: RequestHandler = asyncHandler(async (request, response) => {
    if (typeof request.params.invItemId !== 'string') throw new ApiError(400, 'Invalid stock id', 'INVALID_STOCK_ID');
    const incrementedStock = await invService.incrementBranchStock(request.params.invItemId, request.body as IncrementStockInput);
    response.status(200).json({ data: { incrementedStock } });
});

export const decrementStockToBranch: RequestHandler = asyncHandler(async (request, response) => {
    if (typeof request.params.invItemId !== 'string') throw new ApiError(400, 'Invalid stock id', 'INVALID_STOCK_ID');
    const decrementedStock = await invService.decrementBranchStock(request.params.invItemId, request.body as DecrementStockInput);
    response.status(200).json({ data: { decrementedStock } });
});