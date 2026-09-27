import { Sequelize } from "sequelize";
import { ApiError } from "../utils/ApiError.js";
import { StoreBranch } from "../models/StoreBranch.js";
import { InventoryItem } from "../models/InventoryItem.js";
import { InventoryItem as InventoryItemModel, StoreBranch as storeBranchModel } from "../models/index.js";

import { DecrementStockInput, IncrementStockInput, NewStockInput } from "../validators/inv.validators.js";
import { Unit } from "../constants/inventory.js";

type InventorySummary = {
  name: string,
  quantity: number,
  unit: Unit,
};

async function assertStoreBranch(storeBranchId: string) {
  const storeBranch = await StoreBranch.findByPk(storeBranchId);
  if (!storeBranch) throw new ApiError(404, 'Invalid Store Branch Address', 'STORE_BRANCH_NOT_FOUND');
  return storeBranch;
}

async function assertInvItem(itemId: string): Promise<InventoryItem> {
  const invItem = await InventoryItemModel.findOne({ where: { id: itemId } });
  if (!invItem) throw new ApiError(404, 'Inventory item not be found', 'INV_ITEM_NOT_FOUND');
  return invItem;
}


export async function getInventory(): Promise<InventorySummary[]> {
  return await InventoryItem.findAll(/*{
    attributes: [
      'name',
      'unit',
      [Sequelize.fn('SUM', Sequelize.col('quantity')), 'quantity'],
    ],
    group: ['name', 'unit'],
  }*/);
}

export async function newStock(input: NewStockInput) {
  const storeBranches = await storeBranchModel.findAll();
  if ( storeBranches.length === 0 ) throw new ApiError(404, 'No Store Branch Found.', 'NO_STORE_BRANCH__FOUND');

  const existingItems = await InventoryItemModel.findAll({ where: { name: input.name } });
  const existingBranchIds = new Set(existingItems.map(item => item.storeBranchId));
  const missingBranches = storeBranches.filter(branch => !existingBranchIds.has(branch.id));

  await Promise.all(
    missingBranches.map((storeBranch) => InventoryItemModel.create({
      storeBranchId: storeBranch.id,
      name: input.name,
      unit: input.unit,
    }, {ignoreDuplicates: true}))
  );
}

export async function removeStock(itemName: string) {
  const deleted = await InventoryItemModel.destroy({ where: { name: itemName } });
  if (deleted === 0) throw new ApiError(404, 'Inventory item not found.', 'INV_ITEM_NOT_FOUND')
}

export async function incrementStock(itemName: string, input: IncrementStockInput) {
  const [incrementedStocks] = await InventoryItemModel.update(
    {quantity: Sequelize.literal(`quantity + ${input.quantity}`) },
    { where: { name: itemName } });
  if ( incrementedStocks === 0 ) throw new ApiError(404, 'Inventory item not found.', 'INV_ITEM_NOT_FOUND');
}

export async function decrementStock(itemName: string, input: DecrementStockInput) {
  const [decrementedStocks] = await InventoryItemModel.update(
    {quantity: Sequelize.literal(`GREATEST(quantity - ${input.quantity}, 0)`)},
    {where: { name: itemName }});
  if ( decrementedStocks === 0 ) throw new ApiError(404, 'Inventory item not found.', 'INV_ITEM_NOT_FOUND');
}


export async function getBranchInventory(storeBranchId: string): Promise<InventoryItem[]> {
  const storeBranch = await assertStoreBranch(storeBranchId);
  return await InventoryItemModel.findAll({ where: { storeBranchId: storeBranch.id } });
}

export async function newBranchStock(storeBranchId: string, input: NewStockInput): Promise<InventoryItem> {
  const storeBranch = await assertStoreBranch(storeBranchId);
  const quantity = input.quantity ?? 0;
  const invItem = await InventoryItemModel.findOne({ where: { storeBranchId, name: input.name } });

  if ( invItem ) {
    await invItem.update({quantity: Sequelize.literal(`quantity + ${quantity}`)});
    return invItem.reload();
  }

  const newInvItem = await InventoryItemModel.create({
    storeBranchId: storeBranch.id,
    name: input.name,
    quantity,
    unit: input.unit,
  });

  return newInvItem;
}

export async function removeBranchStock(invItemId: string) {
  const invItem = await assertInvItem(invItemId);

  await invItem.destroy();
}

export async function incrementBranchStock(invItemId: string, input: IncrementStockInput): Promise<InventoryItem> {
  const invItem = await assertInvItem(invItemId);
  await invItem.update({quantity: Sequelize.literal(`quantity + ${input.quantity}`)});

  return invItem.reload();
}

export async function decrementBranchStock(invItemId: string, input: DecrementStockInput): Promise<InventoryItem> {
  const invItem = await assertInvItem(invItemId);
  await invItem.update({quantity: Sequelize.literal(`GREATEST(quantity - ${input.quantity}, 0)`) });
  
  return invItem.reload();
}