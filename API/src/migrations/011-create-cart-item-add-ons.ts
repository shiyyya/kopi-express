import type { QueryInterface } from 'sequelize';
import { DataTypes } from 'sequelize';

interface MigrationContext { context: QueryInterface }

export async function up({ context }: MigrationContext): Promise<void> {
  await context.createTable('cart_item_add_ons', {
    cart_item_id: {  type: DataTypes.STRING(26), references: { model: 'cart_items', key: 'id' }, primaryKey: true, onDelete: 'CASCADE' },
    add_on_id: { type: DataTypes.STRING(26), references: { model: 'add_ons', key: 'id' }, primaryKey: true },
  });
}

export async function down({ context }: MigrationContext): Promise<void> {
  await context.dropTable('cart_item_add_ons');
}