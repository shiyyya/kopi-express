import { app } from './app.js';
import { sequelize } from './models/index.js';
import { env } from './config/env.js';

async function start(): Promise<void> {
  await sequelize.authenticate();
  const server = app.listen(env.port, () => console.log(`API listening on http://localhost:${env.port}`));

  const shutdown = () => {
    server.close(() => void sequelize.close().finally(() => process.exit(0)));
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

start().catch((error: unknown) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
