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

export class Ingredient extends Model<InferAttributes<Ingredient>, InferCreationAttributes<Ingredient>> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare unit: Unit;
}

export function initIngredient(sequelize: Sequelize): typeof Ingredient {
  Ingredient.init(
    {
      id: { type: DataTypes.STRING(26), primaryKey: true, defaultValue: generateID },
      name: { type: DataTypes.STRING(100), allowNull: false },
      unit: { type: DataTypes.ENUM(...UNIT), allowNull: false },
    },
    { sequelize, tableName: 'ingredients', modelName: 'Ingredient', underscored: true },
  );
  return Ingredient;
}