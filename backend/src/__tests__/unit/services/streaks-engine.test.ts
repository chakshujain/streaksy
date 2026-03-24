import { streaksEngine } from '../../../modules/streak/service/streaks-engine';
import { queryOne } from '../../../config/database';
import { redis } from '../../../config/redis';

jest.mock('../../../config/database', () => ({
  query: jest.fn(),
  queryOne: jest.fn(),
}));

jest.mock('../../../config/redis', () => ({
  redis: {
    get: jest.fn(),
    set: jest.fn(),
  },
}));

jest.mock('../../../config/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

const mockedQueryOne = queryOne as jest.MockedFunction<typeof queryOne>;
const mockedRedis = redis as jest.Mocked<typeof redis>;

describe('streaksEngine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('calculatePoints', () => {
    // Helper: a weekday at noon (not early bird, not weekend)
    const weekdayNoon = new Date('2026-03-24T12:00:00'); // Tuesday

    it('should return base 10 points with no streak and no group', async () => {
      // currentStreak=0, no group => streak 1x, group 1x, no time bonuses
      // Comeback check: currentStreak=0 <= 3, so queryOne is called
      mockedQueryOne.mockResolvedValue(null); // no previous streak record

      const result = await streaksEngine.calculatePoints('user-1', 0, null, weekdayNoon);

      expect(result.basePoints).toBe(10);
      expect(result.streakMultiplier).toBe(1);
      expect(result.groupDisciplineMultiplier).toBe(1);
      expect(result.groupDisciplineLabel).toBe('Solo');
      expect(result.earlyBirdMultiplier).toBe(1);
      expect(result.weekendWarriorMultiplier).toBe(1);
      expect(result.comebackMultiplier).toBe(1);
      expect(result.totalPoints).toBe(10);
      expect(result.bonuses).toHaveLength(0);
    });

    it('should apply 2x streak multiplier for 7-day streak', async () => {
      mockedQueryOne.mockResolvedValue(null);

      const result = await streaksEngine.calculatePoints('user-1', 7, null, weekdayNoon);

      expect(result.streakMultiplier).toBe(2);
      expect(result.totalPoints).toBe(20);
      expect(result.bonuses).toContainEqual(expect.stringContaining('2x streak'));
    });

    it('should apply 3x streak multiplier for 14-day streak', async () => {
      const result = await streaksEngine.calculatePoints('user-1', 14, null, weekdayNoon);

      expect(result.streakMultiplier).toBe(3);
      expect(result.totalPoints).toBe(30);
    });

    it('should apply 7x streak multiplier for 100-day streak', async () => {
      const result = await streaksEngine.calculatePoints('user-1', 100, null, weekdayNoon);

      expect(result.streakMultiplier).toBe(7);
      expect(result.totalPoints).toBe(70);
    });

    it('should apply 1.5x early bird bonus for completion before 9 AM', async () => {
      const earlyMorning = new Date('2026-03-24T08:00:00'); // Tuesday 8 AM
      mockedQueryOne.mockResolvedValue(null);

      const result = await streaksEngine.calculatePoints('user-1', 0, null, earlyMorning);

      expect(result.earlyBirdMultiplier).toBe(1.5);
      expect(result.totalPoints).toBe(15); // 10 * 1 * 1 * 1.5 * 1 * 1
      expect(result.bonuses).toContainEqual(expect.stringContaining('Early Bird'));
    });

    it('should apply 1.3x weekend warrior bonus on Saturday', async () => {
      const saturday = new Date('2026-03-28T12:00:00'); // Saturday noon
      mockedQueryOne.mockResolvedValue(null);

      const result = await streaksEngine.calculatePoints('user-1', 0, null, saturday);

      expect(result.weekendWarriorMultiplier).toBe(1.3);
      expect(result.totalPoints).toBe(13); // 10 * 1.3 = 13
      expect(result.bonuses).toContainEqual(expect.stringContaining('Weekend Warrior'));
    });

    it('should stack streak + early bird + weekend multipliers', async () => {
      // 7-day streak (2x) + early bird (1.5x) + Saturday (1.3x)
      const saturdayEarly = new Date('2026-03-28T07:00:00'); // Saturday 7 AM

      const result = await streaksEngine.calculatePoints('user-1', 7, null, saturdayEarly);

      expect(result.streakMultiplier).toBe(2);
      expect(result.earlyBirdMultiplier).toBe(1.5);
      expect(result.weekendWarriorMultiplier).toBe(1.3);
      // 10 * 2 * 1 * 1.5 * 1.3 * 1 = 39
      expect(result.totalPoints).toBe(39);
      expect(result.bonuses).toHaveLength(3);
    });

    it('should apply 2x comeback bonus when previous longest > 5 and current <= 3', async () => {
      // Comeback: queryOne returns longest_streak > 5, currentStreak <= 3
      mockedQueryOne.mockResolvedValue({ longest_streak: 10 });

      const result = await streaksEngine.calculatePoints('user-1', 2, null, weekdayNoon);

      expect(result.comebackMultiplier).toBe(2);
      // 10 * 1 (streak 2 days = 1x) * 1 * 1 * 1 * 2 = 20
      expect(result.totalPoints).toBe(20);
      expect(result.bonuses).toContainEqual(expect.stringContaining('Comeback'));
    });

    it('should apply 5x group discipline when all members active (100%)', async () => {
      // First call: total members count
      // Second call: active members count
      // Third call: comeback check (longest_streak)
      mockedQueryOne
        .mockResolvedValueOnce({ count: '5' })  // total members
        .mockResolvedValueOnce({ count: '5' })  // active members (100%)
        .mockResolvedValueOnce(null);            // no previous streak

      const result = await streaksEngine.calculatePoints('user-1', 0, 'group-1', weekdayNoon);

      expect(result.groupDisciplineMultiplier).toBe(5);
      expect(result.groupDisciplineLabel).toBe('Perfect Day');
      // 10 * 1 * 5 * 1 * 1 * 1 = 50
      expect(result.totalPoints).toBe(50);
      expect(result.bonuses).toContainEqual(expect.stringContaining('Perfect Day'));
    });

    it('should apply 3x group discipline when >= 80% members active', async () => {
      mockedQueryOne
        .mockResolvedValueOnce({ count: '10' })  // total members
        .mockResolvedValueOnce({ count: '8' })   // active members (80%)
        .mockResolvedValueOnce(null);

      const result = await streaksEngine.calculatePoints('user-1', 0, 'group-1', weekdayNoon);

      expect(result.groupDisciplineMultiplier).toBe(3);
      expect(result.groupDisciplineLabel).toBe('Squad Goals');
      expect(result.totalPoints).toBe(30); // 10 * 1 * 3
    });
  });

  describe('calculateCompletionBonus', () => {
    it('should return 100 points when completed on schedule', () => {
      // Start 30 days ago, total 30 days => elapsed == totalDays, not ahead
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      const result = streaksEngine.calculateCompletionBonus(
        30,
        30,
        startDate.toISOString()
      );

      expect(result.bonus).toBe(100);
      expect(result.aheadOfSchedule).toBe(false);
    });

    it('should return 150 points when completed ahead of schedule', () => {
      // Start 10 days ago, total 30 days => elapsed(10) < totalDays(30), ahead!
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 10);

      const result = streaksEngine.calculateCompletionBonus(
        30,
        30,
        startDate.toISOString()
      );

      expect(result.bonus).toBe(150);
      expect(result.aheadOfSchedule).toBe(true);
    });
  });

  describe('getMultiplierPreview', () => {
    it('should return correct streak tier and multipliers', async () => {
      // First call: current_streak for preview
      // Second call: group total members
      // Third call: group active members
      mockedQueryOne
        .mockResolvedValueOnce({ current_streak: 14 })  // user streak
        .mockResolvedValueOnce({ count: '5' })           // total members
        .mockResolvedValueOnce({ count: '5' });          // active members (100%)

      const result = await streaksEngine.getMultiplierPreview('user-1', 'group-1');

      expect(result.streakTier).toBe('Fortnight Fury');
      expect(result.streakMultiplier).toBe(3);
      expect(result.groupLabel).toBe('Perfect Day');
      expect(result.groupMultiplier).toBe(5);
      // 10 * 3 * 5 = 150
      expect(result.potentialPoints).toBe(150);
    });

    it('should return solo defaults when no group', async () => {
      mockedQueryOne.mockResolvedValueOnce({ current_streak: 0 });

      const result = await streaksEngine.getMultiplierPreview('user-1', null);

      expect(result.streakTier).toBe('Starting Out');
      expect(result.streakMultiplier).toBe(1);
      expect(result.groupLabel).toBe('Solo');
      expect(result.groupMultiplier).toBe(1);
      expect(result.potentialPoints).toBe(10);
    });
  });

  describe('cacheMultiplierPreview', () => {
    it('should cache the preview in Redis with 1 hour TTL', async () => {
      mockedQueryOne
        .mockResolvedValueOnce({ current_streak: 7 })  // user streak
        .mockResolvedValueOnce(null);                   // no group (solo)
      mockedRedis.set.mockResolvedValue('OK' as any);

      await streaksEngine.cacheMultiplierPreview('user-1', null);

      expect(mockedRedis.set).toHaveBeenCalledWith(
        'streak_preview:user-1',
        expect.any(String),
        { EX: 3600 }
      );

      // Verify the cached JSON contains correct values
      const cachedJson = (mockedRedis.set as jest.Mock).mock.calls[0][1];
      const cached = JSON.parse(cachedJson);
      expect(cached.streakTier).toBe('Weekly Warrior');
      expect(cached.streakMultiplier).toBe(2);
      expect(cached.potentialPoints).toBe(20);
    });
  });
});
