import type { QueryInterface } from 'sequelize';
import { DataTypes } from 'sequelize';

interface MigrationContext { context: QueryInterface }

export async function up({ context }: MigrationContext): Promise<void> {
  await context.createTable('products', {
    id: { type: DataTypes.STRING(26), primaryKey: true, onDelete: 'CASCADE' },
    name: { type: DataTypes.STRING(100), allowNull: false },
    category: { type: DataTypes.ENUM('coffee', 'non_coffee', 'pastry', 'pasta'), allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DECIMAL(8, 2), allowNull: false },
    is_hot_available: { type: DataTypes.BOOLEAN, allowNull: false },
    is_iced_available: { type: DataTypes.BOOLEAN, allowNull: false },
    image_url: { type: DataTypes.STRING, allowNull: false },
    created_at: { type: DataTypes.DATE, allowNull: false },
    updated_at: { type: DataTypes.DATE, allowNull: false },
  });
}

export async function down({ context }: MigrationContext): Promise<void> {
  await context.dropTable('products');
}