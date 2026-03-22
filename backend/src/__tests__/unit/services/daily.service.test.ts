import { dailyService } from '../../../modules/daily/service/daily.service';
import { query } from '../../../config/database';

jest.mock('../../../config/database', () => ({
  pool: { query: jest.fn(), connect: jest.fn(), on: jest.fn() },
  query: jest.fn(),
  queryOne: jest.fn(),
  transaction: jest.fn(),
}));

const mockedQuery = query as jest.MockedFunction<typeof query>;

describe('dailyService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getDailyProblems', () => {
    it('should return daily problems for a user', async () => {
      const groupProblems = [
        { id: 'p-1', title: 'Two Sum', slug: 'two-sum', difficulty: 'easy', url: null, youtube_url: null, sheet_name: 'NeetCode' },
        { id: 'p-2', title: 'Add Two Numbers', slug: 'add-two-numbers', difficulty: 'medium', url: null, youtube_url: null, sheet_name: 'NeetCode' },
        { id: 'p-3', title: '3Sum', slug: '3sum', difficulty: 'medium', url: null, youtube_url: null, sheet_name: 'NeetCode' },
        { id: 'p-4', title: 'Median of Two', slug: 'median', difficulty: 'hard', url: null, youtube_url: null, sheet_name: 'NeetCode' },
        { id: 'p-5', title: 'Valid Parens', slug: 'valid-parens', difficulty: 'easy', url: null, youtube_url: null, sheet_name: 'NeetCode' },
      ];

      // First call: group problems, second call: popular problems (should not be called if enough)
      mockedQuery.mockResolvedValueOnce(groupProblems);

      const result = await dailyService.getDailyProblems('user-1', 4);

      expect(mockedQuery).toHaveBeenCalledTimes(1);
      expect(result.length).toBeLessThanOrEqual(4);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return empty array when no problems available', async () => {
      mockedQuery.mockResolvedValueOnce([]); // group problems
      mockedQuery.mockResolvedValueOnce([]); // popular problems

      const result = await dailyService.getDailyProblems('user-1', 4);

      expect(result).toEqual([]);
    });

    it('should fall back to popular sheets if group problems are insufficient', async () => {
      const fewGroupProblems = [
        { id: 'p-1', title: 'Two Sum', slug: 'two-sum', difficulty: 'easy', url: null, youtube_url: null, sheet_name: 'Sheet' },
      ];
      const popularProblems = [
        { id: 'p-2', title: 'Best Time', slug: 'best-time', difficulty: 'medium', url: null, youtube_url: null, sheet_name: 'NeetCode' },
        { id: 'p-3', title: 'Contains Dup', slug: 'contains-dup', difficulty: 'easy', url: null, youtube_url: null, sheet_name: 'NeetCode' },
        { id: 'p-4', title: 'Merge Sort', slug: 'merge-sort', difficulty: 'hard', url: null, youtube_url: null, sheet_name: 'Blind 75' },
      ];

      mockedQuery.mockResolvedValueOnce(fewGroupProblems);
      mockedQuery.mockResolvedValueOnce(popularProblems);

      const result = await dailyService.getDailyProblems('user-1', 4);

      expect(mockedQuery).toHaveBeenCalledTimes(2);
      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBeLessThanOrEqual(4);
    });

    it('should default to 4 problems', async () => {
      const problems = [
        { id: 'p-1', title: 'A', slug: 'a', difficulty: 'easy', url: null, youtube_url: null, sheet_name: null },
        { id: 'p-2', title: 'B', slug: 'b', difficulty: 'medium', url: null, youtube_url: null, sheet_name: null },
        { id: 'p-3', title: 'C', slug: 'c', difficulty: 'medium', url: null, youtube_url: null, sheet_name: null },
        { id: 'p-4', title: 'D', slug: 'd', difficulty: 'hard', url: null, youtube_url: null, sheet_name: null },
        { id: 'p-5', title: 'E', slug: 'e', difficulty: 'easy', url: null, youtube_url: null, sheet_name: null },
      ];
      mockedQuery.mockResolvedValueOnce(problems);

      const result = await dailyService.getDailyProblems('user-1');

      expect(result.length).toBeLessThanOrEqual(4);
    });
  });
});
