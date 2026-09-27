import { ApiError } from "../utils/ApiError.js";
import { InventoryItem as InventoryItemModel, ProductIngredient as ProductIngredientModel, Product as ProductModel, sequelize } from "../models/index.js";
import { addProductIngredientInput, newProductInput, updateProductInput } from "../validators/product.validator.js";
import { Category } from "../constants/product.js";

export async function getProducts(category?: Category) {
  const products = await ProductModel.findAll({...(category !== undefined && { where: { category } })});
  if (products.length === 0) throw new ApiError(404, 'No product found', 'NO_PRODUCT_FOUND');
  return products;
}

export async function getProduct(id: string) {
  const product = await ProductModel.findByPk(id);
  if (!product) throw new ApiError(404, 'Product not found', 'PRODUCT_NOT_FOUND');
  return product;
}

export async function newProduct(input: newProductInput, imageUrl: string) { return sequelize.transaction(async (transaction) => {
  const ingredientIds = input.ingredients.map(ingredient => ingredient.id);
  const ingredients = await InventoryItemModel.findAll({ where: { id: ingredientIds }, transaction });
  if (ingredients.length !== ingredientIds.length) throw new ApiError(400, 'One or more ingredients not found', 'INGREDIENT_NOT_FOUND');
  
  const product = await ProductModel.create({
    name: input.name,
    category: input.category,
    description: input.description,
    price: input.price,
    isHotAvailable: input.isHotAvailable,
    isIcedAvailable: input.isIcedAvailable,
    imageUrl,
  }, {transaction});

  await ProductIngredientModel.bulkCreate(
    input.ingredients.map(ingredient => ({
      productId: product.id,
      ingredientId: ingredient.id,
      quantityRequired: ingredient.quantity,
    })), {transaction}
  );

  return product;
})}

export async function removeProduct(id: string) { return sequelize.transaction(async (transaction) => {
  const deleted = await ProductModel.destroy({ where: { id }, transaction });
  if (deleted === 0) throw new ApiError(404, 'Product not found', 'PRODUCT_NOT_FOUND');

  await ProductIngredientModel.destroy({ where: { productId: id }, transaction });
})}

export async function updateProduct(id: string, input: updateProductInput, imageUrl?: string) {
  const product = await ProductModel.findByPk(id);
  if (!product) throw new ApiError(404, 'Product not found', 'PRODUCT_NOT_FOUND');
  
  if (input.name !== undefined) product.name = input.name;
  if (input.category !== undefined) product.category = input.category;
  if (input.description !== undefined) product.description = input.description;
  if (input.price !== undefined) product.price = input.price;
  if (input.isHotAvailable !== undefined) product.isHotAvailable = input.isHotAvailable;
  if (input.isIcedAvailable !== undefined) product.isIcedAvailable = input.isIcedAvailable;
  if (imageUrl !== undefined) product.imageUrl = imageUrl;

  return product.save();
}

export async function getProductIngredients(id: string) {
  const product = await ProductModel.findByPk(id);
  if (!product) throw new ApiError(404, 'Product not found', 'PRODUCT_NOT_FOUND');

  return ProductIngredientModel.findAll({ where: { productId: id } });
}

export async function addProductIngredient(id: string, input: addProductIngredientInput) {
  const product = await ProductModel.findByPk(id);
  if (!product) throw new ApiError(404, 'Product not found', 'PRODUCT_NOT_FOUND');
  const ingredient = await InventoryItemModel.findByPk(input.ingredientId);
  if (!ingredient) throw new ApiError(404, 'Ingredient not found', 'INGREDIENT_NOT_FOUND');


  return ProductIngredientModel.upsert({
    productId: id,
    ingredientId: input.ingredientId,
    quantityRequired: input.quantityRequired,
  });
}

export async function removeProductIngredient(id: string, ingredientId: string) {
  const deleted = await ProductIngredientModel.destroy({ where: { productId: id, ingredientId } });
  if (deleted === 0) throw new ApiError(404, 'Product ingredient not found', 'PRODUCT_INGREDIENT_NOT_FOUND');
}

