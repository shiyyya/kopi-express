import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize'; 
import { generateID } from '../utils/idGenerator.js';

export class CustomerAddress extends Model<InferAttributes<CustomerAddress>, InferCreationAttributes<CustomerAddress>> {
  declare id: CreationOptional<string>;
  declare customerId: string;
  declare address: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initCustomerAddress(sequelize: Sequelize): typeof CustomerAddress {
  CustomerAddress.init(
    {
      id: { type: DataTypes.STRING(26), primaryKey: true, defaultValue: generateID },
      customerId: { type: DataTypes.STRING(26), allowNull: false, references: { model: 'customers', key: 'user_id' }, field: 'customer_id' },
      address: { type: DataTypes.STRING, allowNull: false },
      createdAt: { type: DataTypes.DATE, allowNull: false, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, allowNull: false, field: 'updated_at' },
    },
    { sequelize, tableName: 'customer_addresses', modelName: 'CustomerAddress', underscored: true },
  );
  return CustomerAddress;
}
