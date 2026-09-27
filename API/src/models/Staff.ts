import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

export class Staff extends Model<InferAttributes<Staff>, InferCreationAttributes<Staff>> {
  declare userId: string;
  declare storeBranchId: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initStaff(sequelize: Sequelize): typeof Staff {
  Staff.init(
    {
      userId: { type: DataTypes.STRING(26), references: { model: 'users', key: 'id' }, primaryKey: true, field: 'user_id' },
      storeBranchId: { type: DataTypes.STRING(26), allowNull: false, references: { model: 'store_branches', key: 'id' }, field: 'store_branch_id' },
      createdAt: { type: DataTypes.DATE, allowNull: false, field: 'created_at' },
      updatedAt: {type: DataTypes.DATE, allowNull: false, field: 'updated_at'},
    },
    { sequelize, tableName: 'staff', modelName: 'Staff', underscored: true },
  );
  return Staff;
}
