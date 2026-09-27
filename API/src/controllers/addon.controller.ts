import type { RequestHandler } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import * as addonService from "../services/addon.service.js";
import { addAddOnIngredientInput, newAddOnInput, updateAddOnInput, } from "../validators/addon.validator.js";

export const getAddOns: RequestHandler = asyncHandler( async (_request, response) => {
  const addons = await addonService.getAddOns();
  response.json({ data: { addons } });
});

export const getAddOn: RequestHandler = asyncHandler( async (request, response) => {
  if (typeof request.params.id !== "string") throw new ApiError( 400, "Invalid addon id", "INVALID_ADDON_ID" );
  const addon = await addonService.getAddOn(request.params.id);
  response.json({ data: { addon } });
});

export const newAddOn: RequestHandler = asyncHandler( async (request, response) => {
  const addon = await addonService.newAddOn( request.body as newAddOnInput );
  response.json({ data: { addon } });
});

export const removeAddOn: RequestHandler = asyncHandler( async (request, response) => {
  if (typeof request.params.id !== "string") throw new ApiError( 400, "Invalid addon id", "INVALID_ADDON_ID" );
  await addonService.removeAddOn(request.params.id);
  response.status(204).send();
});

export const updateAddOn: RequestHandler = asyncHandler( async (request, response) => {
  if (typeof request.params.id !== "string") throw new ApiError( 400, "Invalid addon id", "INVALID_ADDON_ID" );
  const addon = await addonService.updateAddOn( request.params.id, request.body as updateAddOnInput );
  response.json({ data: { addon } });
});

export const getAddOnIngredients: RequestHandler = asyncHandler( async (request, response) => {
  if (typeof request.params.id !== "string") throw new ApiError( 400, "Invalid addon id", "INVALID_ADDON_ID" );
  const addonIngredients = await addonService.getAddOnIngredients(request.params.id);
  response.json({ data: { addonIngredients } });
});

export const addAddOnIngredient: RequestHandler = asyncHandler( async (request, response) => {
  if (typeof request.params.id !== "string") throw new ApiError( 400, "Invalid addon id", "INVALID_ADDON_ID" ); 
  const addonIngredient = await addonService.addAddOnIngredient( request.params.id, request.body as addAddOnIngredientInput );
  response.json({ data: { addonIngredient } });
});

export const removeAddOnIngredient: RequestHandler = asyncHandler( async (request, response) => { 
  if (typeof request.params.id !== "string") throw new ApiError( 400, "Invalid addon id", "INVALID_ADDON_ID" );
  if (typeof request.params.ingredientId !== "string") throw new ApiError( 400, "Invalid ingredient id", "INVALID_INGREDIENT_ID" );
  await addonService.removeAddOnIngredient( request.params.id, request.params.ingredientId );
  response.status(204).send();
});