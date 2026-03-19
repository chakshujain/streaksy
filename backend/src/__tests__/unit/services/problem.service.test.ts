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
    url: 'https://leetcode.com/problems/two-sum/',
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

      expect(mockedRepo.list).toHaveBeenCalledWith(undefined, undefined, undefined);
      expect(result).toEqual([mockProblem]);
    });

    it('should pass difficulty filter and pagination', async () => {
      mockedRepo.list.mockResolvedValue([]);

      await problemService.list('hard', 10, 20);

      expect(mockedRepo.list).toHaveBeenCalledWith('hard', 10, 20);
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
