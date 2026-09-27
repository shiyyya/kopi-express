import type { QueryInterface } from 'sequelize';
import { DataTypes } from 'sequelize';

interface MigrationContext { context: QueryInterface }

export async function up({ context }: MigrationContext): Promise<void> {
  await context.createTable('add_ons', {
    id: { type: DataTypes.STRING(26), primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    price: { type: DataTypes.DECIMAL(8, 2), allowNull: false },
  });
}

export async function down({ context }: MigrationContext): Promise<void> {
  await context.dropTable('add_ons');
}