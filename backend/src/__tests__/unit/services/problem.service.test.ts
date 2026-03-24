import { problemService } from '../../../modules/problem/service/problem.service';
import { problemRepository } from '../../../modules/problem/repository/problem.repository';
import { AppError } from '../../../common/errors/AppError';

jest.mock('../../../modules/problem/repository/problem.repository');
const mockedRepo = problemRepository as jest.Mocked<typeof problemRepository>;

describe('problemService', () => {
  const mockProblem = {
    id: 'prob-1',
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'easy',
    url: 'https://leetcode.com/problems/two-sum/', youtube_url: null, video_title: null,
    created_at: new Date(),
  };

  const mockTags = [
    { id: 'tag-1', name: 'Array' },
    { id: 'tag-2', name: 'Hash Table' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('list', () => {
    it('should return all problems with default pagination', async () => {
      mockedRepo.list.mockResolvedValue([mockProblem]);

      const result = await problemService.list();

      expect(mockedRepo.list).toHaveBeenCalledWith(undefined, undefined, undefined, undefined);
      expect(result).toEqual([mockProblem]);
    });

    it('should pass difficulty filter and pagination', async () => {
      mockedRepo.list.mockResolvedValue([]);

      await problemService.list('hard', 10, 20);

      expect(mockedRepo.list).toHaveBeenCalledWith('hard', 10, 20, undefined);
    });

    it('should pass tag filter', async () => {
      mockedRepo.list.mockResolvedValue([mockProblem]);

      await problemService.list('easy', 50, 0, 'Array');

      expect(mockedRepo.list).toHaveBeenCalledWith('easy', 50, 0, 'Array');
    });
  });

  describe('count', () => {
    it('should return count with no filters', async () => {
      mockedRepo.count.mockResolvedValue(42);

      const result = await problemService.count();

      expect(mockedRepo.count).toHaveBeenCalledWith(undefined, undefined);
      expect(result).toBe(42);
    });

    it('should pass difficulty and tag filters', async () => {
      mockedRepo.count.mockResolvedValue(10);

      const result = await problemService.count('hard', 'Graph');

      expect(mockedRepo.count).toHaveBeenCalledWith('hard', 'Graph');
      expect(result).toBe(10);
    });
  });

  describe('getAllTags', () => {
    it('should return all tags with counts', async () => {
      const tags = [
        { name: 'Array', count: 15 },
        { name: 'Hash Table', count: 10 },
      ];
      mockedRepo.getAllTags.mockResolvedValue(tags);

      const result = await problemService.getAllTags();

      expect(mockedRepo.getAllTags).toHaveBeenCalled();
      expect(result).toEqual(tags);
    });
  });

  describe('search', () => {
    it('should search problems with default limit', async () => {
      mockedRepo.search.mockResolvedValue([mockProblem]);

      const result = await problemService.search('two sum');

      expect(mockedRepo.search).toHaveBeenCalledWith('two sum', 20);
      expect(result).toEqual([mockProblem]);
    });

    it('should search problems with custom limit', async () => {
      mockedRepo.search.mockResolvedValue([]);

      const result = await problemService.search('binary', 5);

      expect(mockedRepo.search).toHaveBeenCalledWith('binary', 5);
      expect(result).toEqual([]);
    });
  });

  describe('getBySlug', () => {
    it('should return problem with tags', async () => {
      mockedRepo.findBySlug.mockResolvedValue(mockProblem);
      mockedRepo.getTagsForProblem.mockResolvedValue(mockTags);

      const result = await problemService.getBySlug('two-sum');

      expect(result).toEqual({ ...mockProblem, tags: mockTags });
      expect(mockedRepo.findBySlug).toHaveBeenCalledWith('two-sum');
      expect(mockedRepo.getTagsForProblem).toHaveBeenCalledWith('prob-1');
    });

    it('should throw notFound when problem does not exist', async () => {
      mockedRepo.findBySlug.mockResolvedValue(null);

      await expect(problemService.getBySlug('nonexistent')).rejects.toThrow('Problem not found');
      await expect(problemService.getBySlug('nonexistent')).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });

  describe('getSheets', () => {
    it('should return all sheets', async () => {
      const sheets = [{ id: 's1', name: 'Blind 75', slug: 'blind-75', description: null }];
      mockedRepo.getSheets.mockResolvedValue(sheets);

      const result = await problemService.getSheets();

      expect(result).toEqual(sheets);
    });
  });

  describe('getSheetProblems', () => {
    it('should return problems for a sheet', async () => {
      mockedRepo.getSheetProblems.mockResolvedValue([mockProblem]);

      const result = await problemService.getSheetProblems('blind-75');

      expect(mockedRepo.getSheetProblems).toHaveBeenCalledWith('blind-75');
      expect(result).toEqual([mockProblem]);
    });
  });
});
