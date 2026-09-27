import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

export class ProductIngredient extends Model<InferAttributes<ProductIngredient>, InferCreationAttributes<ProductIngredient>> {
  declare productId: string;
  declare ingredientId: string;
  declare quantityRequired: number;
}

export function initProductIngredient(sequelize: Sequelize): typeof ProductIngredient {
  ProductIngredient.init(
    {
      productId: { type: DataTypes.STRING(26), references: { model: 'products', key: 'id' }, primaryKey: true, field: 'product_id' },
      ingredientId: { type: DataTypes.STRING(26), references: { model: 'inventory_items', key: 'id' }, primaryKey: true, field: 'ingredient_id' },
      quantityRequired: { type: DataTypes.DECIMAL(8, 2), allowNull: false, field: 'quantity_required' },
    },
    { sequelize, tableName: 'product_ingredients', modelName: 'ProductIngredient', underscored: true },
  );
  return ProductIngredient;
}
