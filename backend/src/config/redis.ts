import { createClient } from 'redis';
import { env } from './env';

export const redis = createClient({ url: env.redis.url });

redis.on('error', (err) => console.error('Redis Client Error', err));

export async function connectRedis(): Promise<void> {
  await redis.connect();
  console.log('Redis connected');
}
