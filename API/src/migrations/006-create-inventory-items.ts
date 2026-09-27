import type { QueryInterface } from 'sequelize';
import { DataTypes } from 'sequelize';
import { UNIT } from '../constants/inventory.js';

interface MigrationContext { context: QueryInterface }

export async function up({ context }: MigrationContext): Promise<void> {
  await context.createTable('inventory_items', {
    id: { type: DataTypes.STRING(26), primaryKey: true, onDelete: 'CASCADE' },
    store_branch_id: { type: DataTypes.STRING(26), allowNull: false, references: { model: 'store_branches', key: 'id' } },
    name: { type: DataTypes.STRING(100), allowNull: false },
    quantity: { type: DataTypes.DECIMAL(8, 2), allowNull: false, defaultValue: 0 },
    unit: { type: DataTypes.ENUM(...UNIT), allowNull: false },
    expires_at: { type: DataTypes.DATE, allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: false },
    updated_at: {type: DataTypes.DATE, allowNull: false },
  });
  
  await context.addIndex('inventory_items', ['store_branch_id', 'name'], { unique: true, name: 'unique_inv_items_branch_name' })
}

export async function down({ context }: MigrationContext): Promise<void> {
  await context.dropTable('inventory_items');
}