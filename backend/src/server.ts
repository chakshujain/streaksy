import app from './app';
import { env } from './config/env';
import { connectRedis } from './config/redis';
import { pool } from './config/database';

async function start() {
  // Test DB connection
  try {
    await pool.query('SELECT 1');
    console.log('PostgreSQL connected');
  } catch (err) {
    console.error('Failed to connect to PostgreSQL:', err);
    process.exit(1);
  }

  // Connect Redis
  await connectRedis();

  app.listen(env.port, () => {
    console.log(`Solvo API running on port ${env.port} [${env.nodeEnv}]`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
