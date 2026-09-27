import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

export class AddOnIngredient extends Model<InferAttributes<AddOnIngredient>, InferCreationAttributes<AddOnIngredient>> {
  declare addonId: string;
  declare ingredientId: string;
  declare quantityRequired: number;
}

export function initAddOnIngredient(sequelize: Sequelize): typeof AddOnIngredient {
  AddOnIngredient.init(
    {
      addonId: { type: DataTypes.STRING(26), references: { model: 'add_ons', key: 'id' }, primaryKey: true, field: 'add_on_id' },
      ingredientId: { type: DataTypes.STRING(26), references: { model: 'inventory_items', key: 'id' }, primaryKey: true, field: 'ingredient_id' },
      quantityRequired: { type: DataTypes.DECIMAL(8, 2), allowNull: false, field: 'quantity_required' },
    },
    { sequelize, tableName: 'add_on_ingredients', modelName: 'AddOnIngredient', underscored: true },
  );
  return AddOnIngredient;
}

