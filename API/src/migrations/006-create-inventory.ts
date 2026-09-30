import type { QueryInterface } from 'sequelize';
import { DataTypes, Op } from 'sequelize';
import { UNIT } from '../constants/inventory.js';

interface MigrationContext { context: QueryInterface }

export async function up({ context }: MigrationContext): Promise<void> {
  await context.createTable('ingredients', {
    id: { type: DataTypes.STRING(26), primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    unit: { type: DataTypes.ENUM(...UNIT), allowNull: false },
    created_at: { type: DataTypes.DATE, allowNull: false },
    updated_at: { type: DataTypes.DATE, allowNull: false },
  });

  await context.createTable('inventory_items', {
    id: { type: DataTypes.STRING(26), primaryKey: true },
    store_branch_id: {
      type: DataTypes.STRING(26), allowNull: false,
      references: { model: 'store_branches', key: 'id' }, onDelete: 'RESTRICT',
    },
    ingredient_id: {
      type: DataTypes.STRING(26), allowNull: false,
      references: { model: 'ingredients', key: 'id' }, onDelete: 'RESTRICT',
    },
    quantity: { type: DataTypes.DECIMAL(8, 2), allowNull: false, defaultValue: 0 },
    purchased_at: { type: DataTypes.DATE, allowNull: false },
    expires_at: { type: DataTypes.DATE, allowNull: false },
  });

  await context.addIndex('inventory_items', ['store_branch_id', 'ingredient_id', 'expires_at'], {
    name: 'inv_items_branch_ingredient_expires',
  });

  await context.addConstraint('inventory_items', {
    type: 'check',
    fields: ['quantity'],
    where: { quantity: { [Op.gte]: 0 } },
    name: 'inv_items_quantity_non_negative',
  });
}

export async function down({ context }: MigrationContext): Promise<void> {
  await context.dropTable('inventory_items');
  await context.dropTable('ingredients');
  await context.sequelize.query('DROP TYPE IF EXISTS "enum_ingredients_unit"');
}