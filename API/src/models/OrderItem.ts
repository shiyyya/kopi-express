import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from 'sequelize'; 
import { generateID } from '../utils/idGenerator.js';
import { Product } from './Product.js';
import { OrderItemAddOn } from './OrderItemAddOn.js';

export class OrderItem extends Model<InferAttributes<OrderItem>, InferCreationAttributes<OrderItem>> {
  declare id: CreationOptional<string>;
  declare orderId: string;
  declare productId: string;
  declare quantity: number;
  declare unitPrice: number;
  declare Product?: NonAttribute<Product>;
  declare OrderItemAddOns?: NonAttribute<OrderItemAddOn[]>;
}

export function initOrderItem(sequelize: Sequelize): typeof OrderItem {
  OrderItem.init(
    {
      id: { type: DataTypes.STRING(26), primaryKey: true, defaultValue: generateID },
      orderId: { type: DataTypes.STRING(26), allowNull: false, references: { model: 'orders', key: 'id' }, field: 'order_id' },
      productId: { type: DataTypes.STRING(26), allowNull: false, references: { model: 'products', key: 'id' }, field: 'product_id' },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      unitPrice: { type: DataTypes.DECIMAL(8, 2), allowNull: false, field: 'unit_price' },
    },
    { sequelize, tableName: 'order_items', modelName: 'OrderItem', underscored: true },
  );
  return OrderItem;
}