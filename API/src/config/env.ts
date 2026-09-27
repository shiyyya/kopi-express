import 'dotenv/config';
import { SignOptions } from 'jsonwebtoken';

function integer(name: string, fallback: number): number {
  const value = Number(process.env[name] ?? fallback);
  if (!Number.isInteger(value)) throw new Error(`${name} must be an integer`);
  return value;
}

const nodeEnv = process.env.NODE_ENV ?? 'development';
const jwtSecret = process.env.JWT_SECRET ?? 'development-only-secret-change-me-now';

if (nodeEnv === 'production' && jwtSecret.length < 32) {
  throw new Error('JWT_SECRET must contain at least 32 characters in production');
}

export const env = {
  nodeEnv,
  port: integer('PORT', 3000),
  databaseHost: process.env.DB_HOST ?? 'localhost',
  databasePort: integer('DB_PORT', 3306),
  databaseUser: process.env.DB_USER ?? 'root',
  databasePass: process.env.DB_PASS ?? '',
  databaseName: process.env.DB_NAME ?? 'kopi',
  jwtSecret,
  jwtExpiresIn: (process.env.JWT_EXPIRES_IN ?? '1h') as NonNullable<SignOptions['expiresIn']>,
  bcryptRounds: integer('BCRYPT_ROUNDS', 12),
};
