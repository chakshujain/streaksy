import { redis } from '../../config/redis';
import { AppError } from '../errors/AppError';

const MAX_AI_GENERATIONS_PER_DAY = 30;

export async function checkAIRateLimit(userId: string): Promise<void> {
  const rateLimitKey = `ai_gen:${userId}:${new Date().toISOString().slice(0, 10)}`;
  const currentCount = await redis.incr(rateLimitKey);
  if (currentCount === 1) {
    await redis.expire(rateLimitKey, 86400);
  }
  if (currentCount > MAX_AI_GENERATIONS_PER_DAY) {
    throw new AppError(429, 'AI generation limit reached. Maximum 30 generations per day.');
  }
}
