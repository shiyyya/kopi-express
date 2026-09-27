import { sequelize } from './database.js';
import { migrator } from './migrator.js';

try {
  const migrations = await migrator.up();
  console.log(`Applied ${migrations.length} migration(s)`);
} finally {
  await sequelize.close();
}
