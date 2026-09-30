import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { generateID } from '../utils/idGenerator.js';

export class InventoryLoan extends Model<InferAttributes<InventoryLoan>, InferCreationAttributes<InventoryLoan>> {
  declare id: CreationOptional<string>;
  declare orderId: string;
  declare inventoryItemId: string;
  declare quantity: number;
}

export function initInventoryLoan(sequelize: Sequelize): typeof InventoryLoan {
  InventoryLoan.init(
    {
      id: { type: DataTypes.STRING(26), primaryKey: true, defaultValue: generateID, },
      orderId: { type: DataTypes.STRING(26), allowNull: false, references: { model: 'orders', key: 'id', }, field: 'order_id', },
      inventoryItemId: { type: DataTypes.STRING(26), allowNull: false, references: { model: 'inventory_items', key: 'id', }, field: 'inventory_item_id', },
      quantity: { type: DataTypes.DECIMAL(8, 2), allowNull: false, },
    },
    { sequelize, tableName: 'inventory_loans', modelName: 'InventoryLoan', underscored: true, timestamps: false, },
  );

  return InventoryLoan;
}