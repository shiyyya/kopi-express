import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { SequelizeStorage, Umzug } from 'umzug';
import { sequelize } from './database.js';

const extension = import.meta.url.endsWith('.ts') ? 'ts' : 'js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.resolve(__dirname, '../migrations');
const cleanDir = migrationsDir.replace(/\\/g, '/');
const globPattern = cleanDir + '/*.' + extension;

export const migrator = new Umzug({
  migrations: { 
    glob: globPattern 
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});
