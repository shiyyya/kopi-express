import { Sequelize } from 'sequelize';
import { env } from './env.js';

export const sequelize = new Sequelize({
  dialect: 'mysql',
  host: env.databaseHost,
  port: env.databasePort,
  username: env.databaseUser,
  password: env.databasePass,
  database: env.databaseName,
  logging: env.nodeEnv === 'development' ? console.log : false,
});
