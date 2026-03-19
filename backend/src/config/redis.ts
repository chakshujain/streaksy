import { createClient } from 'redis';
import { env } from './env';
import { logger } from './logger';

export const redis = createClient({ url: env.redis.url });

redis.on('error', (err) => logger.error({ err }, 'Redis Client Error'));

export async function connectRedis(): Promise<void> {
  await redis.connect();
  logger.info('Redis connected');
}
