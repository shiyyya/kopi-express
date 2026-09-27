import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from 'sequelize';
import { AddOn } from './AddOn.js';

export class OrderItemAddOn extends Model<InferAttributes<OrderItemAddOn>, InferCreationAttributes<OrderItemAddOn>> {
  declare orderItemId: string;
  declare addOnId: string;
  declare unitPrice: number;
  declare AddOn?: NonAttribute<AddOn>;
}

export function initOrderItemAddOn(sequelize: Sequelize): typeof OrderItemAddOn {
  OrderItemAddOn.init(
    {
      orderItemId: { type: DataTypes.STRING(26), references: { model: 'order_items', key: 'id' }, primaryKey: true, field: 'order_item_id' },
      addOnId: { type: DataTypes.STRING(26), references: { model: 'add_ons', key: 'id' }, primaryKey: true, field: 'add_on_id' },
      unitPrice: { type: DataTypes.DECIMAL(8, 2), allowNull: false },
    },
    { sequelize, tableName: 'order_item_add_ons', modelName: 'OrderItemAddOn', underscored: true },
  );
  return OrderItemAddOn;
}
