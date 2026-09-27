import type { QueryInterface } from 'sequelize';
import { DataTypes } from 'sequelize';

interface MigrationContext { context: QueryInterface }

export async function up({ context }: MigrationContext): Promise<void> {
  await context.createTable('order_items', {
    id: { type: DataTypes.STRING(26), primaryKey: true, onDelete: 'CASCADE' },
    order_id: { type: DataTypes.STRING(26), allowNull: false, references: { model: 'orders', key: 'id' } },
    product_id: { type: DataTypes.STRING(26), allowNull: false, references: { model: 'products', key: 'id' } },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    unit_price: { type: DataTypes.DECIMAL(8, 2), allowNull: false },
  });
}

export async function down({ context }: MigrationContext): Promise<void> {
  await context.dropTable('order_items');
}