import { checkAIRateLimit } from '../../../common/utils/aiRateLimit';
import { redis } from '../../../config/redis';
import { AppError } from '../../../common/errors/AppError';

const mockRedis = redis as jest.Mocked<typeof redis> & { incr: jest.Mock };

// redis.incr is not in the global mock, so add it here
beforeAll(() => {
  (mockRedis as any).incr = jest.fn();
});

describe('checkAIRateLimit', () => {
  const userId = 'user-123';
  const today = new Date().toISOString().slice(0, 10);
  const expectedKey = `ai_gen:${userId}:${today}`;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('first call (count=1) should set expire and not throw', async () => {
    mockRedis.incr.mockResolvedValue(1);

    await expect(checkAIRateLimit(userId)).resolves.toBeUndefined();

    expect(mockRedis.incr).toHaveBeenCalledWith(expectedKey);
    expect(mockRedis.expire).toHaveBeenCalledWith(expectedKey, 86400);
  });

  it('30th call (count=30) should not throw (at limit)', async () => {
    mockRedis.incr.mockResolvedValue(30);

    await expect(checkAIRateLimit(userId)).resolves.toBeUndefined();
  });

  it('31st call (count=31) should throw 429 AppError', async () => {
    mockRedis.incr.mockResolvedValue(31);

    try {
      await checkAIRateLimit(userId);
      fail('Expected an error to be thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
      expect((err as AppError).statusCode).toBe(429);
      expect((err as AppError).message).toBe(
        'AI generation limit reached. Maximum 30 generations per day.'
      );
    }
  });

  it('should use correct key format with userId and date', async () => {
    mockRedis.incr.mockResolvedValue(1);

    await checkAIRateLimit('abc-456');

    const expectedKeyForUser = `ai_gen:abc-456:${today}`;
    expect(mockRedis.incr).toHaveBeenCalledWith(expectedKeyForUser);
  });

  it('should only call expire when count is 1', async () => {
    // count = 1 -> should call expire
    mockRedis.incr.mockResolvedValue(1);
    await checkAIRateLimit(userId);
    expect(mockRedis.expire).toHaveBeenCalledTimes(1);

    jest.clearAllMocks();

    // count = 5 -> should NOT call expire
    mockRedis.incr.mockResolvedValue(5);
    await checkAIRateLimit(userId);
    expect(mockRedis.expire).not.toHaveBeenCalled();

    jest.clearAllMocks();

    // count = 30 -> should NOT call expire
    mockRedis.incr.mockResolvedValue(30);
    await checkAIRateLimit(userId);
    expect(mockRedis.expire).not.toHaveBeenCalled();
  });
});
