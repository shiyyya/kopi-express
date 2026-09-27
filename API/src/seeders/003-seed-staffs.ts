import bcrypt from 'bcryptjs';
import type { QueryInterface } from 'sequelize';
import { env } from '../config/env.js';

const userIds = [
  '01M3GYFW6R99CFNGJ56HDKV4EZ',
  '01M3GYG7H3XSGKTABQ1ZQSN57E',
  '01M3GYGETVAR6K4X65Z10CK7J4',
];

export async function up({ context }: { context: QueryInterface }) {
  const now = new Date();

  const [poblacionHash, bunsuranHash, cacarongHash] = await Promise.all([
    bcrypt.hash('temppasswordpoblacion', env.bcryptRounds),
    bcrypt.hash('temppasswordbunsuran', env.bcryptRounds),
    bcrypt.hash('temppasswordcacarong', env.bcryptRounds),
  ]);

  await context.bulkInsert('users', [
    {
      id: userIds[0],
      email: 'tempaccountpoblacion@gmail.com',
      password_hash: poblacionHash,
      role: 'staff',
      status: 'active',
      created_at: now,
      updated_at: now,
    },
    {
      id: userIds[1],
      email: 'tempaccountbunsuran@gmail.com',
      password_hash: bunsuranHash,
      role: 'staff',
      status: 'active',
      created_at: now,
      updated_at: now,
    },
    {
      id: userIds[2],
      email: 'tempaccountcacarong@gmail.com',
      password_hash: cacarongHash,
      role: 'staff',
      status: 'active',
      created_at: now,
      updated_at: now,
    },
  ]);

  await context.bulkInsert('staffs', [
    {
      user_id: userIds[0],
      store_branch_id: '01M34B40SEJKXD58FB337RY1RD',
      created_at: now,
      updated_at: now,
    },
    {
      user_id: userIds[1],
      store_branch_id: '01M34B3AZHBT272V4H49CWZZ4E',
      created_at: now,
      updated_at: now,
    },
    {
      user_id: userIds[2],
      store_branch_id: '01M34B2F2M5GH5EHJA2PARV0TK',
      created_at: now,
      updated_at: now,
    },
  ]);
}

export async function down({ context }: { context: QueryInterface }) {
  await context.bulkDelete('staffs', { user_id: userIds });
  await context.bulkDelete('users', { id: userIds });
}