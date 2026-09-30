import type { QueryInterface } from 'sequelize';
import { DataTypes } from 'sequelize';

interface MigrationContext { context: QueryInterface }

export async function up({ context }: MigrationContext): Promise<void> {
  await context.createTable('cart_items', {
    id: {type: DataTypes.STRING(26),primaryKey: true},
    customer_id: {type: DataTypes.STRING(26),allowNull: false,references: { model: 'customers', key: 'user_id' },onDelete: 'CASCADE'},
    product_id: {type: DataTypes.STRING(26),allowNull: false,references: { model: 'products', key: 'id' },onDelete: 'CASCADE'},
    quantity: {type: DataTypes.INTEGER,allowNull: false,},
    product_temperature: {type: DataTypes.ENUM('hot', 'iced'),allowNull: true,},
    created_at: {type: DataTypes.DATE,allowNull: false,},
    updated_at: {type: DataTypes.DATE,allowNull: false,},
  });
}

export async function down({ context }: MigrationContext): Promise<void> {
  await context.dropTable('cart_items');
}