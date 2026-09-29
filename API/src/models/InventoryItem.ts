import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { generateID } from '../utils/idGenerator.js';

export class InventoryItem extends Model<InferAttributes<InventoryItem>, InferCreationAttributes<InventoryItem>> {
  declare id: CreationOptional<string>;
  declare storeBranchId: string;
  declare ingredientId: string;
  declare quantity: CreationOptional<number>;
  declare purchasedAt: Date;
  declare expiresAt: Date;
}

export function initInventoryItem(sequelize: Sequelize): typeof InventoryItem {
  InventoryItem.init(
    {
      id: { type: DataTypes.STRING(26), primaryKey: true, defaultValue: generateID },
      storeBranchId: { type: DataTypes.STRING(26), allowNull: false, references: { model: 'store_branches', key: 'id' }, field: 'store_branch_id' },
      ingredientId: { type: DataTypes.STRING(26), allowNull: false, references: { model: 'ingredients', key: 'id' }, field: 'ingredient_id' },
      quantity: { type: DataTypes.DECIMAL(8, 2), allowNull: false, defaultValue: 0 },
      purchasedAt: { type: DataTypes.DATE, allowNull: false, field: 'purchased_at' },
      expiresAt: { type: DataTypes.DATE, allowNull: false, field: 'expires_at' },
    },
    { sequelize, tableName: 'inventory_items', modelName: 'InventoryItem', underscored: true, timestamps: false },
  );
  return InventoryItem;
}