import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { UNIT, Unit } from '../constants/inventory.js';
import { generateID } from '../utils/idGenerator.js';

export class InventoryItem extends Model<InferAttributes<InventoryItem>, InferCreationAttributes<InventoryItem>> {
  declare id: CreationOptional<string>;
  declare storeBranchId: string;
  declare name: string;
  declare quantity: CreationOptional<number>;
  declare unit: Unit;
  declare expiresAt: CreationOptional<Date>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initInventoryItem(sequelize: Sequelize): typeof InventoryItem {
  InventoryItem.init(
    {
      id: { type: DataTypes.STRING(26), primaryKey: true, defaultValue: generateID },
      storeBranchId: { type: DataTypes.STRING(26), allowNull: false, references: { model: 'store_branches', key: 'id' }, field: 'store_branch_id' },
      name: { type: DataTypes.STRING(100), allowNull: false },
      quantity: { type: DataTypes.DECIMAL(8, 2), allowNull: false, defaultValue: 0 },
      unit: { type: DataTypes.ENUM(...UNIT), allowNull: false },
      expiresAt: { type: DataTypes.DATE, allowNull: true, field: 'expires_at' },
      createdAt: { type: DataTypes.DATE, allowNull: false, field: 'created_at' },
      updatedAt: {type: DataTypes.DATE, allowNull: false, field: 'updated_at'},
    },
    { sequelize, tableName: 'inventory_items', modelName: 'InventoryItem', underscored: true,
      indexes: [
        { unique: true, fields: ['storeBranchId', 'name'], name: 'unique_inv_items_branch_name' }
      ]
    },
  );
  return InventoryItem;
}