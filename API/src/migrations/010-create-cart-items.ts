import type { QueryInterface } from 'sequelize';
import { DataTypes } from 'sequelize';

interface MigrationContext { context: QueryInterface }

export async function up({ context }: MigrationContext): Promise<void> {
  await context.createTable('cart_items', {
    id: { type: DataTypes.STRING(26), primaryKey: true, onDelete: 'CASCADE' },
    customer_id: { type: DataTypes.STRING(26), allowNull: false, references: { model: 'customers', key: 'user_id' } },
    product_id: { type: DataTypes.STRING(26), allowNull: false, references: { model: 'products', key: 'id' } },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
  });
}

export async function down({ context }: MigrationContext): Promise<void> {
  await context.dropTable('cart_items');
}