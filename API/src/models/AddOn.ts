import {
	CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize'; 
import { generateID } from '../utils/idGenerator.js';

export class AddOn extends Model<InferAttributes<AddOn>, InferCreationAttributes<AddOn>> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare price: number;
}

export function initAddOn(sequelize: Sequelize): typeof AddOn {
  AddOn.init(
    {
        id: { type: DataTypes.STRING(26), primaryKey: true, defaultValue: generateID },
        name: { type: DataTypes.STRING(100), allowNull: false },
        price: { type: DataTypes.DECIMAL(8, 2), allowNull: false },
    },
    { sequelize, tableName: 'add_ons', modelName: 'AddOn', underscored: true },
  );
  return AddOn;
}