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

  // Smart notification scheduler — lagging behind, group pressure, streak risk
  const { smartNotifications } = await import('./modules/notification/service/smart-notifications');
  setInterval(async () => {
    const now = new Date();
    const hour = now.getUTCHours();
    try {
      // Lagging behind: send at 14:00 UTC (afternoon motivation)
      if (hour === 14) {
        await smartNotifications.checkLaggingBehind();
      }
      // Group pressure: send at 16:00 UTC
      if (hour === 16) {
        await smartNotifications.checkGroupPressure();
      }
      // Streak at risk: send at 18:00 and 20:00 UTC (evening warnings)
      if (hour === 18 || hour === 20) {
        await smartNotifications.checkStreakAtRisk();
      }
    } catch (err) {
      logger.error({ err }, 'Failed to run smart notifications');
    }
  }, 30 * 60_000); // Check every 30 minutes

  // Digest scheduler — morning at 8am, evening at 9pm, weekly on Monday 9am
  const { digestService } = await import('./modules/digest/service/digest.service');
  setInterval(async () => {
    const now = new Date();
    const hour = now.getUTCHours();
    const minute = now.getUTCMinutes();
    const day = now.getUTCDay();

    try {
      // Morning digest at 8:00 UTC
      if (hour === 8 && minute < 5) {
        await digestService.runMorningDigests();
      }
      // Evening reminder at 21:00 UTC
      if (hour === 21 && minute < 5) {
        await digestService.runEveningReminders();
      }
      // Weekly report on Monday at 9:00 UTC
      if (day === 1 && hour === 9 && minute < 5) {
        await digestService.runWeeklyReports();
      }
    } catch (err) {
      logger.error({ err }, 'Failed to run digest scheduler');
    }
  }, 5 * 60_000); // Check every 5 minutes

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
