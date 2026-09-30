import type { QueryInterface } from 'sequelize';
import { DataTypes, Op } from 'sequelize';
import { UNIT } from '../constants/inventory.js';

interface MigrationContext { context: QueryInterface }

export async function up({ context }: MigrationContext): Promise<void> {
  await context.createTable('inventory_loans', {
    id: { type: DataTypes.STRING(26) },
    order_id: { type: DataTypes.STRING(26), allowNull: false, primaryKey: true, references: { model: 'orders', key: 'id', }, onDelete: 'CASCADE', },
    inventory_item_id: { type: DataTypes.STRING(26), allowNull: false, primaryKey: true, references: { model: 'inventory_items', key: 'id', }, onDelete: 'RESTRICT', },
    quantity: { type: DataTypes.DECIMAL(8, 2), allowNull: false,
    },
  });

  await context.addConstraint('inventory_loans', {
    type: 'check',
    fields: ['quantity'],
    where: { quantity: { [Op.gt]: 0 } },
    name: 'inventory_loans_quantity_positive',
  });
}

export async function down({ context }: MigrationContext): Promise<void> {
  await context.dropTable('inventory_loans');
}