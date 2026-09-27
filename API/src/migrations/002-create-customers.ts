import type { QueryInterface } from 'sequelize';
import { DataTypes } from 'sequelize';

interface MigrationContext { context: QueryInterface }

export async function up({ context }: MigrationContext): Promise<void> {
  await context.createTable('customers', {
    user_id: { type: DataTypes.STRING(26), references: { model: 'users', key: 'id' }, primaryKey: true, onDelete: 'CASCADE' },
    full_name: { type: DataTypes.STRING(255), allowNull: false },
    phone_number: { type: DataTypes.STRING(13), allowNull: false },
    created_at: { type: DataTypes.DATE, allowNull: false },
    updated_at: { type: DataTypes.DATE, allowNull: false },
  });
}

export async function down({ context }: MigrationContext): Promise<void> {
  await context.dropTable('customers');
}
