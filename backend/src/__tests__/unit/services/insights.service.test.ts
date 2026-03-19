import { insightsService } from '../../../modules/insights/service/insights.service';
import { insightsRepository } from '../../../modules/insights/repository/insights.repository';

jest.mock('../../../modules/insights/repository/insights.repository');
const mockedRepo = insightsRepository as jest.Mocked<typeof insightsRepository>;

describe('insightsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getOverview', () => {
    it('should combine and format overview data', async () => {
      mockedRepo.getOverview.mockResolvedValue({
        total_solved: 50,
        easy_count: 20,
        medium_count: 20,
        hard_count: 10,
      });
      mockedRepo.getStreak.mockResolvedValue({
        current_streak: 5,
        longest_streak: 12,
      });
      mockedRepo.getActiveDays.mockResolvedValue(30);

      const result = await insightsService.getOverview('user-1');

      expect(result).toEqual({
        totalSolved: 50,
        solveRateByDifficulty: {
          easy: { count: 20, percentage: 40 },
          medium: { count: 20, percentage: 40 },
          hard: { count: 10, percentage: 20 },
        },
        currentStreak: 5,
        longestStreak: 12,
        totalActiveDays: 30,
      });
    });

    it('should handle zero total solved (no division by zero)', async () => {
      mockedRepo.getOverview.mockResolvedValue({
        total_solved: 0,
        easy_count: 0,
        medium_count: 0,
        hard_count: 0,
      });
      mockedRepo.getStreak.mockResolvedValue({ current_streak: 0, longest_streak: 0 });
      mockedRepo.getActiveDays.mockResolvedValue(0);

      const result = await insightsService.getOverview('user-1');

      expect(result.solveRateByDifficulty.easy.percentage).toBe(0);
      expect(result.solveRateByDifficulty.medium.percentage).toBe(0);
      expect(result.solveRateByDifficulty.hard.percentage).toBe(0);
    });

    it('should round percentages', async () => {
      mockedRepo.getOverview.mockResolvedValue({
        total_solved: 3,
        easy_count: 1,
        medium_count: 1,
        hard_count: 1,
      });
      mockedRepo.getStreak.mockResolvedValue({ current_streak: 0, longest_streak: 0 });
      mockedRepo.getActiveDays.mockResolvedValue(0);

      const result = await insightsService.getOverview('user-1');

      expect(result.solveRateByDifficulty.easy.percentage).toBe(33);
      expect(result.solveRateByDifficulty.medium.percentage).toBe(33);
      expect(result.solveRateByDifficulty.hard.percentage).toBe(33);
    });
  });

  describe('getWeekly', () => {
    it('should format weekly data', async () => {
      mockedRepo.getWeekly.mockResolvedValue([
        { week_start: '2024-01-01', count: 5 },
        { week_start: '2024-01-08', count: 3 },
      ]);

      const result = await insightsService.getWeekly('user-1');

      expect(result).toEqual([
        { weekStart: '2024-01-01', count: 5 },
        { weekStart: '2024-01-08', count: 3 },
      ]);
    });

    it('should return empty array when no data', async () => {
      mockedRepo.getWeekly.mockResolvedValue([]);

      const result = await insightsService.getWeekly('user-1');

      expect(result).toEqual([]);
    });
  });

  describe('getTagStats', () => {
    it('should format tag statistics', async () => {
      mockedRepo.getTagStats.mockResolvedValue([
        { tag_name: 'Array', solved_count: 10, total_count: 20 },
        { tag_name: 'DP', solved_count: 3, total_count: 15 },
      ]);

      const result = await insightsService.getTagStats('user-1');

      expect(result).toEqual([
        { tagName: 'Array', solvedCount: 10, totalCount: 20 },
        { tagName: 'DP', solvedCount: 3, totalCount: 15 },
      ]);
    });
  });

  describe('getDifficultyTrend', () => {
    it('should format difficulty trend data', async () => {
      mockedRepo.getDifficultyTrend.mockResolvedValue([
        { month: '2024-01', easy: 5, medium: 3, hard: 1 },
      ]);

      const result = await insightsService.getDifficultyTrend('user-1');

      expect(result).toEqual([
        { month: '2024-01', easy: 5, medium: 3, hard: 1 },
      ]);
    });
  });
});
