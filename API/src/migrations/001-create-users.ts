import type { QueryInterface } from 'sequelize';
import { DataTypes } from 'sequelize';

interface MigrationContext { context: QueryInterface }

export async function up({ context }: MigrationContext): Promise<void> {
  await context.createTable('users', {
    id: { type: DataTypes.STRING(26), primaryKey: true, onDelete: 'CASCADE' },
    email: { type: DataTypes.STRING(255), allowNull: false },
    password_hash: { type: DataTypes.STRING(255), allowNull: false },
    role: { type: DataTypes.ENUM('customer', 'staff', 'owner'), allowNull: false, defaultValue: 'customer' },
    status: { type: DataTypes.ENUM('active', 'inactive', 'suspended'), allowNull: false, defaultValue: 'active' },
    created_at: { type: DataTypes.DATE, allowNull: false },
    updated_at: { type: DataTypes.DATE, allowNull: false },
  });

  await context.addIndex('users', ['email', 'role'], { unique: true, name: 'unique_users_email_role' })
}

export async function down({ context }: MigrationContext): Promise<void> {
  await context.dropTable('users');
}