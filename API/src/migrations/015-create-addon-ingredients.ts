import type { QueryInterface } from 'sequelize';
import { DataTypes } from 'sequelize';

interface MigrationContext { context: QueryInterface }

export async function up({ context }: MigrationContext): Promise<void> {
  await context.createTable('add_on_ingredients', {
    addon_id: { type: DataTypes.STRING(26), references: { model: 'add_ons', key: 'id' }, primaryKey: true },
    ingredient_id: { type: DataTypes.STRING(26), references: { model: 'inventory_items', key: 'id' }, primaryKey: true },
    quantity_required: { type: DataTypes.DECIMAL(8, 2), allowNull: false },
  });
}

export async function down({ context }: MigrationContext): Promise<void> {
  await context.dropTable('add_on_ingredients');
}