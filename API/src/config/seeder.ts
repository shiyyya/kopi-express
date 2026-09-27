import { fileURLToPath } from 'node:url';
import path from 'node:path'; // Add this import
import { SequelizeStorage, Umzug } from 'umzug';
import { sequelize } from './database.js';

const extension = import.meta.url.endsWith('.ts') ? 'ts' : 'js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedersDir = path.resolve(__dirname, '../seeders');
const cleanDir = seedersDir.replace(/\\/g, '/');
const seedersGlob = cleanDir + '/*.' + extension;

const seeder = new Umzug({
  migrations: { glob: seedersGlob },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({
    sequelize,
    modelName: 'SequelizeDataSeeders',
  }),
  logger: console,
});

try {
  await seeder.up();
} finally {
  await sequelize.close();
}
