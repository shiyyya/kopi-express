import type { QueryInterface } from 'sequelize';
import { DataTypes } from 'sequelize';

interface MigrationContext { context: QueryInterface }

export async function up({ context }: MigrationContext): Promise<void> {
  await context.createTable('order_item_add_ons', {
    order_item_id: { type: DataTypes.STRING(26), references: { model: 'order_items', key: 'id' }, primaryKey: true },
    add_on_id: { type: DataTypes.STRING(26), references: { model: 'add_ons', key: 'id' }, primaryKey: true },
    unit_price: { type: DataTypes.DECIMAL(8, 2), allowNull: false },
  });
}

export async function down({ context }: MigrationContext): Promise<void> {
  await context.dropTable('order_item_add_ons');
}