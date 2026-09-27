import type { QueryInterface } from 'sequelize';
import { DataTypes } from 'sequelize';
import { FULFILLMENT_TYPE, PAYMENT_METHOD, ORDER_STATUS } from '../constants/order.js';

interface MigrationContext { context: QueryInterface }

export async function up({ context }: MigrationContext): Promise<void> {
  await context.createTable('orders', {
    id: { type: DataTypes.STRING(26), primaryKey: true, onDelete: 'CASCADE' },
    customer_id: { type: DataTypes.STRING(26), allowNull: true, references: { model: 'customers', key: 'user_id' } },
    customer_address: { type: DataTypes.STRING, allowNull: true },
    store_branch_id: { type: DataTypes.STRING(26), allowNull: false, references: { model: 'store_branches', key: 'id' } },
    fulfillment_type: { type: DataTypes.ENUM(...FULFILLMENT_TYPE), allowNull: false, defaultValue: 'walk_in' },
    payment_method: { type: DataTypes.ENUM(...PAYMENT_METHOD), allowNull: false, defaultValue: 'cash' },
    payment_reference: { type: DataTypes.STRING(30), allowNull: true },
    notes: { type: DataTypes.STRING, allowNull: true },
    delivery_fee: { type: DataTypes.DECIMAL(8, 2), allowNull: true },
    status: { type: DataTypes.ENUM(...ORDER_STATUS), allowNull: false, defaultValue: 'pending' },
    updated_at: { type: DataTypes.DATE, allowNull: false },
    created_at: { type: DataTypes.DATE, allowNull: false },
  });
}

export async function down({ context }: MigrationContext): Promise<void> {
  await context.dropTable('orders');
}
