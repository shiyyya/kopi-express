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
import { CartItemAddOn } from './CartItemAddOn.js';
import { PRODUCT_TEMPERATURE, ProductTemperature } from '../constants/cart.js';

export class CartItem extends Model<InferAttributes<CartItem>, InferCreationAttributes<CartItem>> {
  declare id: CreationOptional<string>;
  declare customerId: string;
  declare productId: string;
  declare quantity: number;
  declare productTemp: ProductTemperature;
  declare Product?: NonAttribute<Product>;
  declare CartItemAddOns?: NonAttribute<CartItemAddOn[]>;
}

export function initCartItem(sequelize: Sequelize): typeof CartItem {
  CartItem.init(
    {
      id: { type: DataTypes.STRING(26), primaryKey: true, defaultValue: generateID },
      customerId: { type: DataTypes.STRING(26), allowNull: false, references: { model: 'customers', key: 'user_id' }, field: 'customer_id' },
      productId: { type: DataTypes.STRING(26), allowNull: false, references: { model: 'products', key: 'id' }, field: 'product_id' },
      quantity: { type: DataTypes.INTEGER, allowNull: false },      
      productTemp: { type: DataTypes.ENUM(...PRODUCT_TEMPERATURE), allowNull: false, field: 'product_temperature' },
    },
    { sequelize, tableName: 'cart_items', modelName: 'CartItem', underscored: true },
  );
  return CartItem;
}