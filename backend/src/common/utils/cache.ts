import { redis } from '../../config/redis';

/**
 * Generic cache-aside helper.
 * Returns cached value if available, otherwise executes fn and caches the result.
 */
export async function cached<T>(key: string, ttlSeconds: number, fn: () => Promise<T>): Promise<T> {
  const hit = await redis.get(key);
  if (hit) return JSON.parse(hit) as T;

  const result = await fn();
  await redis.set(key, JSON.stringify(result), { EX: ttlSeconds });
  return result;
}

/**
 * Invalidate all keys matching a glob pattern.
 */
export async function invalidate(pattern: string): Promise<void> {
  for await (const key of redis.scanIterator({ MATCH: pattern, COUNT: 100 })) {
    if (Array.isArray(key)) {
      for (const k of key) await redis.del(k);
    } else {
      await redis.del(key);
    }
  }
}
