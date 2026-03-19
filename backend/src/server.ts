import http from 'http';
import app from './app';
import { env } from './config/env';
import { connectRedis, redis } from './config/redis';
import { pool } from './config/database';
import { logger } from './config/logger';
import { initSocketServer } from './config/socket';

let server: http.Server;

async function start() {
  // Test DB connection
  try {
    await pool.query('SELECT 1');
    logger.info('PostgreSQL connected');
  } catch (err) {
    logger.fatal({ err }, 'Failed to connect to PostgreSQL');
    process.exit(1);
  }

  // Connect Redis
  await connectRedis();

  // Create HTTP server and attach Socket.IO
  server = http.createServer(app);
  initSocketServer(server);

  // Check for scheduled rooms every 30 seconds
  const { roomService } = await import('./modules/room/service/room.service');
  setInterval(async () => {
    try {
      await roomService.autoStartScheduledRooms();
    } catch (err) {
      logger.error({ err }, 'Failed to auto-start scheduled rooms');
    }
  }, 30_000);

  server.listen(env.port, '0.0.0.0', () => {
    logger.info(`Streaksy API + WebSocket running on 0.0.0.0:${env.port} [${env.nodeEnv}]`);
  });
}

// Graceful shutdown
async function shutdown(signal: string) {
  logger.info({ signal }, 'Shutdown signal received, closing gracefully...');

  const forceTimeout = setTimeout(() => {
    logger.error('Forceful shutdown — timeout exceeded');
    process.exit(1);
  }, 10_000);

  try {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server.close((err) => (err ? reject(err) : resolve()));
      });
      logger.info('HTTP server closed');
    }

    await redis.quit().catch(() => {});
    logger.info('Redis disconnected');

    await pool.end();
    logger.info('PostgreSQL pool closed');

    clearTimeout(forceTimeout);
    process.exit(0);
  } catch (err) {
    logger.error({ err }, 'Error during shutdown');
    clearTimeout(forceTimeout);
    process.exit(1);
  }
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

start().catch((err) => {
  logger.fatal({ err }, 'Failed to start server');
  process.exit(1);
});
