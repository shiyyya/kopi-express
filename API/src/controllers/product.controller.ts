import type { RequestHandler } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import * as productService from '../services/product.service.js'
import { Category } from '../constants/product.js';
import { addProductIngredientInput, newProductInput, updateProductInput } from '../validators/product.validator.js';
import { addAddOnIngredientInput } from '../validators/addon.validator.js';

export const getAllProducts: RequestHandler = asyncHandler( async (request, response) => {
  const products = await productService.getProducts(request.query.category as Category | undefined);
  response.json({ data: { products } });
})

export const getProduct: RequestHandler = asyncHandler( async (request, response) => {
  if (typeof request.params.id !== 'string') throw new ApiError(400, 'Invalid product id', 'INVALID_PRODUCT_ID');
  const product = await productService.getProduct(request.params.id);
  response.json({ data: { product } });
})

export const newProduct: RequestHandler = asyncHandler( async (request, response) => {
  if (!request.file) throw new ApiError(400, 'Product image is required', 'IMAGE_REQUIRED');
  const imageUrl = `/uploads/products/${request.file.filename}`;
  const product = await productService.newProduct(request.body as newProductInput, imageUrl);
  response.json({ data: { product } });
})

export const removeProduct: RequestHandler = asyncHandler( async (request, response) => {
  if (typeof request.params.id !== 'string') throw new ApiError(400, 'Invalid product id', 'INVALID_PRODUCT_ID');
  await productService.removeProduct(request.params.id);
  response.status(204).send();
})

export const updateProduct: RequestHandler = asyncHandler( async (request, response) => {
  if (typeof request.params.id !== 'string') throw new ApiError(400, 'Invalid product id', 'INVALID_PRODUCT_ID');
  const imageUrl = request.file ? `/uploads/products/${request.file.filename}` : undefined;
  const product = await productService.updateProduct(request.params.id, request.body as updateProductInput, imageUrl);
  response.json({ data: { product } });
})

export const getProductIngredients: RequestHandler = asyncHandler( async (request, response) => {
  if (typeof request.params.id !== 'string') throw new ApiError(400, 'Invalid product id', 'INVALID_PRODUCT_ID');
  const productIngredients = await productService.getProductIngredients(request.params.id);
  response.json({ data: { productIngredients } });
})

export const addProductIngredient: RequestHandler = asyncHandler( async (request, response) => {
  if (typeof request.params.id !== 'string') throw new ApiError(400, 'Invalid product id', 'INVALID_PRODUCT_ID');
  const productIngredient = await productService.addProductIngredient(request.params.id, request.body as addProductIngredientInput);
  response.json({ data: { productIngredient } });
})

export const removeProductIngredient: RequestHandler = asyncHandler( async (request, response) => {
  if (typeof request.params.id !== 'string') throw new ApiError(400, 'Invalid product id', 'INVALID_PRODUCT_ID');
  if (typeof request.params.ingredientId !== 'string') throw new ApiError(400, 'Invalid ingredient id', 'INVALID_INGREDIENT_ID');
  await productService.removeProductIngredient(request.params.id, request.params.ingredientId);
  response.status(204).send();
})