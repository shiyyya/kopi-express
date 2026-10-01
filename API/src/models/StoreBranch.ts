import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { BRANCH_STATUS, BranchStatus } from '../constants/storeBranch.js';
import { generateID } from '../utils/idGenerator.js';

export class StoreBranch extends Model<InferAttributes<StoreBranch>, InferCreationAttributes<StoreBranch>> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare address: string;
  declare phoneNumber: string;
  declare status: CreationOptional<BranchStatus>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare latitude: number;
  declare longitude: number;
  declare deliveryAreas: string[];
}

export function initStoreBranch(sequelize: Sequelize): typeof StoreBranch {
	StoreBranch.init(
		{
      id: { type: DataTypes.STRING(26), primaryKey: true, defaultValue: generateID },
      name: { type: DataTypes.STRING, allowNull: false },
      address: { type: DataTypes.STRING, allowNull: false },
      phoneNumber: { type: DataTypes.STRING(11), allowNull: false, field: 'phone_number' },
      status: { type: DataTypes.ENUM(...BRANCH_STATUS), allowNull: false, defaultValue: 'closed' },
      latitude: { type: DataTypes.DECIMAL(10, 7), allowNull: false },
      longitude: { type: DataTypes.DECIMAL(10, 7), allowNull: false },
      deliveryAreas: { type: DataTypes.JSON, allowNull: false, defaultValue: [], field: 'delivery_areas' },
      createdAt: { type: DataTypes.DATE, allowNull: false, field: 'created_at' },
      updatedAt: {type: DataTypes.DATE, allowNull: false, field: 'updated_at'},
		},
		{ sequelize, tableName: 'store_branches', modelName: 'StoreBranch', underscored: true },
	);
	return StoreBranch;
}