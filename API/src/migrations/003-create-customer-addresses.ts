import type { QueryInterface } from 'sequelize';
import { DataTypes } from 'sequelize';

interface MigrationContext { context: QueryInterface }

export async function up({ context }: MigrationContext): Promise<void> {
  await context.createTable('customer_addresses', {
    id: { type: DataTypes.STRING(26), primaryKey: true },
    customer_id: { type: DataTypes.STRING(26), allowNull: false, references: { model: 'customers', key: 'user_id' } },
    address: { type: DataTypes.STRING, allowNull: false },
    created_at: { type: DataTypes.DATE, allowNull: false },
    updated_at: { type: DataTypes.DATE, allowNull: false },
  });
}

export async function down({ context }: MigrationContext): Promise<void> {
  await context.dropTable('customer_addresses');
}
