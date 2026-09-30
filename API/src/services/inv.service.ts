import { Op, Transaction } from "sequelize";
import { ApiError } from "../utils/ApiError.js";
import {
  Ingredient as IngredientModel,
  InventoryItem as InventoryItemModel,
  StoreBranch as StoreBranchModel,
  OrderItem as OrderItemModel,
  OrderItemAddOn as OrderItemAddOnModel,
  ProductIngredient as ProductIngredientModel,
  AddOnIngredient as AddOnIngredientModel,
} from "../models/index.js";
import { DecrementStockInput, NewBatchInput, NewStockInput, UpdateIngredientInput } from "../validators/inv.validators.js";

const round2 = (n: number) => Math.round(n * 100) / 100;

async function assertStoreBranch(storeBranchId: string) {
  const storeBranch = await StoreBranchModel.findByPk(storeBranchId);
  if (!storeBranch) throw new ApiError(404, 'Invalid Store Branch Address', 'STORE_BRANCH_NOT_FOUND');
  return storeBranch;
}

async function assertInvItem(itemId: string) {
  const invItem = await InventoryItemModel.findByPk(itemId);
  if (!invItem) throw new ApiError(404, 'Inventory item not found', 'INV_ITEM_NOT_FOUND');
  return invItem;
}

export async function getIngredients() {
  return IngredientModel.findAll({ order: [['name', 'ASC']] });
}

export async function newIngredient(input: NewStockInput) {
  const [ingredient, created] = await IngredientModel.findOrCreate({
    where: { name: input.name },
    defaults: { name: input.name, unit: input.unit },
  });
  if (!created) throw new ApiError(409, 'Ingredient already exists', 'INGREDIENT_EXISTS');
  return ingredient;
}

export async function updateIngredient(ingredientId: string, input: UpdateIngredientInput) {
  const ingredient = await IngredientModel.findByPk(ingredientId);
  if (!ingredient) throw new ApiError(404, 'Ingredient not found', 'INGREDIENT_NOT_FOUND');
  if (input.name !== ingredient.name) {
    const existing = await IngredientModel.findOne({ where: { name: input.name, id: { [Op.ne]: ingredientId } } });
    if (existing) throw new ApiError(409, 'Ingredient already exists', 'INGREDIENT_EXISTS');
  }
  if (input.unit !== ingredient.unit) {
    const inventoryCount = await InventoryItemModel.count({ where: { ingredientId, quantity: { [Op.gt]: 0 } } });
    if (inventoryCount > 0) throw new ApiError(409, 'Ingredient unit cannot be changed while stock remains', 'INGREDIENT_UNIT_IN_USE');
    const productRecipeCount = await ProductIngredientModel.count({ where: { ingredientId } });
    const addOnRecipeCount = await AddOnIngredientModel.count({ where: { ingredientId } });
    if (productRecipeCount > 0 || addOnRecipeCount > 0) throw new ApiError(409, 'Ingredient unit cannot be changed while it is used in a recipe', 'INGREDIENT_UNIT_IN_USE');
  }
  ingredient.name = input.name;
  ingredient.unit = input.unit;
  return ingredient.save();
}

export async function removeIngredient(ingredientId: string) {
  const ingredient = await IngredientModel.findByPk(ingredientId);
  if (!ingredient) throw new ApiError(404, 'Ingredient not found', 'INGREDIENT_NOT_FOUND');
  const inventoryCount = await InventoryItemModel.count({ where: { ingredientId } });
  if (inventoryCount > 0) throw new ApiError(409, 'Ingredient cannot be deleted because it is used by inventory', 'INGREDIENT_IN_USE');
  const productRecipeCount = await ProductIngredientModel.count({ where: { ingredientId } });
  if (productRecipeCount > 0) throw new ApiError(409, 'Ingredient cannot be deleted because it is used in a product recipe', 'INGREDIENT_IN_USE');
  const addOnRecipeCount = await AddOnIngredientModel.count({ where: { ingredientId } });
  if (addOnRecipeCount > 0) throw new ApiError(409, 'Ingredient cannot be deleted because it is used in an add-on recipe', 'INGREDIENT_IN_USE');
  await ingredient.destroy();
}

export async function getBranchInventory(storeBranchId: string) {
  const storeBranch = await assertStoreBranch(storeBranchId);
  return InventoryItemModel.findAll({
    where: { storeBranchId: storeBranch.id },
    include: [{ model: IngredientModel, attributes: ['name', 'unit'] }],
    order: [['expiresAt', 'ASC']],
  });
}

export async function newBranchStock(storeBranchId: string, input: NewBatchInput) {
  const storeBranch = await assertStoreBranch(storeBranchId);
  const ingredient = await IngredientModel.findByPk(input.ingredientId);
  if (!ingredient) throw new ApiError(404, 'Ingredient not found', 'INGREDIENT_NOT_FOUND');
  return InventoryItemModel.create({
    storeBranchId: storeBranch.id,
    ingredientId: ingredient.id,
    quantity: input.quantity,
    purchasedAt: input.purchasedAt,
    expiresAt: input.expiresAt,
  });
}

export async function removeBranchStock(invItemId: string) {
  const invItem = await assertInvItem(invItemId);
  await invItem.destroy();
}

// export async function decrementBranchStock(invItemId: string, input: DecrementStockInput) {
//   const invItem = await assertInvItem(invItemId);
//   invItem.quantity = Math.max(round2(Number(invItem.quantity) - input.quantity), 0);
//   return invItem.save();
// }

async function computeOrderNeeds(orderId: string, transaction: Transaction) {
  const needs = new Map<string, number>();
  const add = (id: string, qty: number) => needs.set(id, round2((needs.get(id) ?? 0) + qty));
  const items = await OrderItemModel.findAll({ where: { orderId }, transaction });
  for (const item of items) {
    const recipe = await ProductIngredientModel.findAll({ where: { productId: item.productId }, transaction });
    for (const r of recipe) add(r.ingredientId, Number(r.quantityRequired) * item.quantity);
    // add-ons are priced once per order item, so they are deducted once per order item too
    const chosen = await OrderItemAddOnModel.findAll({ where: { orderItemId: item.id }, transaction });
    for (const c of chosen) {
      const addonRecipe = await AddOnIngredientModel.findAll({ where: { addonId: c.addOnId }, transaction });
      for (const r of addonRecipe) add(r.ingredientId, Number(r.quantityRequired));
    }
  }
  return needs;
}

export async function deductOrderStock(orderId: string, storeBranchId: string, transaction: Transaction) {
  const needs = await computeOrderNeeds(orderId, transaction);
  const now = new Date();
  for (const [ingredientId, needed] of needs) {
    let remaining = needed;
    const batches = await InventoryItemModel.findAll({
      where: {
        storeBranchId,
        ingredientId,
        quantity: { [Op.gt]: 0 },
        expiresAt: { [Op.gt]: now },
      },
      order: [['expiresAt', 'ASC'], ['purchasedAt', 'ASC']],
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    for (const batch of batches) {
      if (remaining <= 0) break;
      const take = Math.min(Number(batch.quantity), remaining);
      batch.quantity = round2(Number(batch.quantity) - take);
      await batch.save({ transaction });
      remaining = round2(remaining - take);
    }
    if (remaining > 0) throw new ApiError(409, 'Not enough stock to accept this order', 'INSUFFICIENT_STOCK');
  }
}