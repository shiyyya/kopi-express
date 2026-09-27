import type { QueryInterface } from 'sequelize';
import { DataTypes } from 'sequelize';

interface MigrationContext { context: QueryInterface }

export async function up({ context }: MigrationContext): Promise<void> {
  await context.createTable('staff', {
    user_id: { type: DataTypes.STRING(26), references: { model: 'users', key: 'id' }, primaryKey: true },
    store_branch_id: { type: DataTypes.STRING(26), allowNull: false, references: { model: 'store_branches', key: 'id' } },
    created_at: { type: DataTypes.DATE, allowNull: false },
    updated_at: { type: DataTypes.DATE, allowNull: false },
  });
}

export async function down({ context }: MigrationContext): Promise<void> {
  await context.dropTable('staff');
}
