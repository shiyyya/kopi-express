import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from 'sequelize';
import { AddOn } from './AddOn.js';

export class CartItemAddOn extends Model<InferAttributes<CartItemAddOn>, InferCreationAttributes<CartItemAddOn>> {
  declare cartItemId: string;
  declare addOnId: string;
  declare AddOn?: NonAttribute<AddOn>;
}

export function initCartItemAddOn(sequelize: Sequelize): typeof CartItemAddOn {
  CartItemAddOn.init(
    {
      cartItemId: { type: DataTypes.STRING(26), references: { model: 'cart_items', key: 'id' }, primaryKey: true, field: 'cart_item_id' },
      addOnId: { type: DataTypes.STRING(26), references: { model: 'add_ons', key: 'id' }, primaryKey: true, field: 'add_on_id' },
    },
    { sequelize, tableName: 'cart_item_add_ons', modelName: 'CartItemAddOn', underscored: true },
  );
  return CartItemAddOn;
}
