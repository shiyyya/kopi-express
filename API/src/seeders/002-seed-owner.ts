import bcrypt from 'bcryptjs';
import type { QueryInterface } from 'sequelize';
import { env } from '../config/env.js';

const userIds = [
  '01M3GYH1QZKXW8T5RJ9F0C2VDN', // replace with a real ULID
];

export async function up({ context }: { context: QueryInterface }) {
  const now = new Date();

  const [ownerHash] = await Promise.all([
    bcrypt.hash('temppasswordowner', env.bcryptRounds),
  ]);

  await context.bulkInsert('users', [
    {
      id: userIds[0],
      email: 'morandarteprimo@gmail.com',
      password_hash: ownerHash,
      role: 'owner',
      status: 'active',
      created_at: now,
      updated_at: now,
    },
  ]);
}

export async function down({ context }: { context: QueryInterface }) {
  await context.bulkDelete('users', { id: userIds });
}