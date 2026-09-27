import { sequelize } from './database.js';
import { migrator } from './migrator.js';

try {
  const migrations = await migrator.down();
  console.log(`Reverted ${migrations.length} migration(s)`);
} finally {
  await sequelize.close();
}
