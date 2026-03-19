import { streakService } from '../../../modules/streak/service/streak.service';
import { streakRepository } from '../../../modules/streak/repository/streak.repository';
import { redis } from '../../../config/redis';

jest.mock('../../../modules/streak/repository/streak.repository');
jest.mock('../../../config/redis', () => ({
  redis: {
    get: jest.fn(),
    set: jest.fn(),
  },
}));

const mockedRepo = streakRepository as jest.Mocked<typeof streakRepository>;
const mockedRedis = redis as jest.Mocked<typeof redis>;

describe('streakService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('recordSolve', () => {
    it('should start a new streak when no existing streak', async () => {
      mockedRepo.get.mockResolvedValue(null);
      mockedRepo.upsert.mockResolvedValue();
      mockedRedis.set.mockResolvedValue(null as any);

      const result = await streakService.recordSolve('user-1');

      expect(result).toEqual({ currentStreak: 1, longestStreak: 1 });
      expect(mockedRepo.upsert).toHaveBeenCalledWith(
        'user-1', 1, 1, expect.any(String)
      );
    });

    it('should not change streak when already solved today', async () => {
      const today = new Date().toISOString().split('T')[0];
      mockedRepo.get.mockResolvedValue({
        user_id: 'user-1',
        current_streak: 5,
        longest_streak: 10,
        last_solve_date: today,
      });

      const result = await streakService.recordSolve('user-1');

      expect(result).toEqual({ currentStreak: 5, longestStreak: 10 });
      expect(mockedRepo.upsert).not.toHaveBeenCalled();
    });

    it('should increment streak when last solve was yesterday', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      mockedRepo.get.mockResolvedValue({
        user_id: 'user-1',
        current_streak: 3,
        longest_streak: 5,
        last_solve_date: yesterdayStr,
      });
      mockedRepo.upsert.mockResolvedValue();
      mockedRedis.set.mockResolvedValue(null as any);

      const result = await streakService.recordSolve('user-1');

      expect(result).toEqual({ currentStreak: 4, longestStreak: 5 });
    });

    it('should update longest streak when current exceeds it', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      mockedRepo.get.mockResolvedValue({
        user_id: 'user-1',
        current_streak: 5,
        longest_streak: 5,
        last_solve_date: yesterdayStr,
      });
      mockedRepo.upsert.mockResolvedValue();
      mockedRedis.set.mockResolvedValue(null as any);

      const result = await streakService.recordSolve('user-1');

      expect(result).toEqual({ currentStreak: 6, longestStreak: 6 });
    });

    it('should reset streak when gap is more than one day', async () => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      const twoDaysAgoStr = twoDaysAgo.toISOString().split('T')[0];

      mockedRepo.get.mockResolvedValue({
        user_id: 'user-1',
        current_streak: 10,
        longest_streak: 15,
        last_solve_date: twoDaysAgoStr,
      });
      mockedRepo.upsert.mockResolvedValue();
      mockedRedis.set.mockResolvedValue(null as any);

      const result = await streakService.recordSolve('user-1');

      expect(result).toEqual({ currentStreak: 1, longestStreak: 15 });
    });

    it('should cache streak in Redis', async () => {
      mockedRepo.get.mockResolvedValue(null);
      mockedRepo.upsert.mockResolvedValue();
      mockedRedis.set.mockResolvedValue(null as any);

      await streakService.recordSolve('user-1');

      expect(mockedRedis.set).toHaveBeenCalledWith(
        'streak:user-1',
        JSON.stringify({ currentStreak: 1, longestStreak: 1 }),
        { EX: 86400 }
      );
    });
  });

  describe('getStreak', () => {
    it('should return cached streak from Redis', async () => {
      mockedRedis.get.mockResolvedValue(
        JSON.stringify({ currentStreak: 5, longestStreak: 10 })
      );

      const result = await streakService.getStreak('user-1');

      expect(result).toEqual({ currentStreak: 5, longestStreak: 10 });
      expect(mockedRepo.get).not.toHaveBeenCalled();
    });

    it('should return zero streak when no data exists', async () => {
      mockedRedis.get.mockResolvedValue(null);
      mockedRepo.get.mockResolvedValue(null);

      const result = await streakService.getStreak('user-1');

      expect(result).toEqual({ currentStreak: 0, longestStreak: 0 });
    });

    it('should return active streak from DB when not cached', async () => {
      const today = new Date().toISOString().split('T')[0];
      mockedRedis.get.mockResolvedValue(null);
      mockedRedis.set.mockResolvedValue(null as any);
      mockedRepo.get.mockResolvedValue({
        user_id: 'user-1',
        current_streak: 7,
        longest_streak: 12,
        last_solve_date: today,
      });

      const result = await streakService.getStreak('user-1');

      expect(result).toEqual({ currentStreak: 7, longestStreak: 12 });
    });

    it('should reset current streak to 0 when streak is broken', async () => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      mockedRedis.get.mockResolvedValue(null);
      mockedRedis.set.mockResolvedValue(null as any);
      mockedRepo.get.mockResolvedValue({
        user_id: 'user-1',
        current_streak: 7,
        longest_streak: 12,
        last_solve_date: threeDaysAgo.toISOString().split('T')[0],
      });

      const result = await streakService.getStreak('user-1');

      expect(result).toEqual({ currentStreak: 0, longestStreak: 12 });
    });
  });
});
