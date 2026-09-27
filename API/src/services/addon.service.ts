import { ApiError } from "../utils/ApiError.js";
import { sequelize, InventoryItem as InventoryItemModel, AddOn as AddOnModel, AddOnIngredient as AddOnIngredientModel} from "../models/index.js";
import { addAddOnIngredientInput, newAddOnInput, updateAddOnInput } from "../validators/addon.validator.js";

export async function getAddOns() {
  const addons = await AddOnModel.findAll();
  if (addons.length === 0) throw new ApiError(404, 'No addon found', 'NO_ADDON_FOUND');
  return addons;
}

export async function getAddOn(id: string) {
  const addon = await AddOnModel.findByPk(id);
  if (!addon) throw new ApiError(404, 'Addon not found', 'ADDON_NOT_FOUND');
  return addon;
}

export async function newAddOn(input: newAddOnInput) { return sequelize.transaction(async (transaction) => {
  const ingredientIds = input.ingredients.map(ingredient => ingredient.id);
  const ingredients = await InventoryItemModel.findAll({ where: { id: ingredientIds }, transaction });
  if (ingredients.length !== ingredientIds.length) throw new ApiError(400, 'One or more ingredients not found', 'INGREDIENT_NOT_FOUND');
  
  const addon = await AddOnModel.create({
    name: input.name,
    price: input.price,
  }, {transaction});

  await AddOnIngredientModel.bulkCreate(
    input.ingredients.map(ingredient => ({
      addonId: addon.id,
      ingredientId: ingredient.id,
      quantityRequired: ingredient.quantity,
    })), {transaction}
  );

  return addon;
})}

export async function removeAddOn(id: string) { return sequelize.transaction(async (transaction) => {
  const deleted = await AddOnModel.destroy({ where: { id }, transaction });
  if (deleted === 0) throw new ApiError(404, 'Addon not found', 'ADDON_NOT_FOUND');

  await AddOnIngredientModel.destroy({ where: { addonId: id }, transaction });
})}

export async function updateAddOn(id: string, input: updateAddOnInput) {
  const addon = await AddOnModel.findByPk(id);
  if (!addon) throw new ApiError(404, 'Addon not found', 'ADDON_NOT_FOUND');
  
  if (input.name !== undefined) addon.name = input.name;
  if (input.price !== undefined) addon.price = input.price;

  return addon.save();
}

export async function getAddOnIngredients(id: string) {
  const addon = await AddOnModel.findByPk(id);
  if (!addon) throw new ApiError(404, 'Addon not found', 'ADDON_NOT_FOUND');

  return AddOnIngredientModel.findAll({ where: { addonId: id } });
}

export async function addAddOnIngredient(id: string, input: addAddOnIngredientInput) {
  const addon = await AddOnModel.findByPk(id);
  if (!addon) throw new ApiError(404, 'Addon not found', 'ADDON_NOT_FOUND');
  const ingredient = await InventoryItemModel.findByPk(input.ingredientId);
  if (!ingredient) throw new ApiError(404, 'Ingredient not found', 'INGREDIENT_NOT_FOUND');
  

  return AddOnIngredientModel.upsert({
    addonId: id,
    ingredientId: input.ingredientId,
    quantityRequired: input.quantityRequired,
  });
}

export async function removeAddOnIngredient(id: string, ingredientId: string) {
  const deleted = await AddOnIngredientModel.destroy({ where: { addonId: id, ingredientId } });
  if (deleted === 0) throw new ApiError(404, 'Addon ingredient not found', 'ADDON_INGREDIENT_NOT_FOUND');
}

