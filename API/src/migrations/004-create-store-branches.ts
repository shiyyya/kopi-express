import type { QueryInterface } from 'sequelize';
import { DataTypes } from 'sequelize';
import { BRANCH_STATUS } from '../constants/storeBranch.js';

interface MigrationContext { context: QueryInterface }

export async function up({ context }: MigrationContext): Promise<void> {
  await context.createTable('store_branches', {
    id: { type: DataTypes.STRING(26), primaryKey: true, onDelete: 'CASCADE' },
    name: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    phone_number: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.ENUM(...BRANCH_STATUS), allowNull: false, defaultValue: 'closed' },
    created_at: { type: DataTypes.DATE, allowNull: false },
    updated_at: {type: DataTypes.DATE, allowNull: false },
  });
}

export async function down({ context }: MigrationContext): Promise<void> {
  await context.dropTable('store_branches');
}
