import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

export class Customer extends Model<InferAttributes<Customer>, InferCreationAttributes<Customer>> {
  declare userId: string;
  declare fullName: string;
  declare phoneNumber: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initCustomer(sequelize: Sequelize): typeof Customer {
  Customer.init(
    {
      userId: { type: DataTypes.STRING(26), references: { model: 'users', key: 'id' }, primaryKey: true, field: 'user_id' },
      fullName: { type: DataTypes.STRING(255), allowNull: false, field: 'full_name' },
      phoneNumber: { type: DataTypes.STRING(13), allowNull: false, field: 'phone_number' },
      createdAt: { type: DataTypes.DATE, allowNull: false, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, allowNull: false, field: 'updated_at' },
    },
    { sequelize, tableName: 'customers', modelName: 'Customer', underscored: true },
  );
  return Customer;
}