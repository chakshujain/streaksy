import { progressService } from '../../../modules/progress/service/progress.service';
import { progressRepository } from '../../../modules/progress/repository/progress.repository';

jest.mock('../../../modules/progress/repository/progress.repository');
const mockedRepo = progressRepository as jest.Mocked<typeof progressRepository>;

describe('progressService', () => {
  const mockProgress = {
    user_id: 'user-1',
    problem_id: 'prob-1',
    status: 'solved' as const,
    solved_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateStatus', () => {
    it('should upsert progress via repository', async () => {
      mockedRepo.upsert.mockResolvedValue(mockProgress);

      const result = await progressService.updateStatus('user-1', 'prob-1', 'solved');

      expect(mockedRepo.upsert).toHaveBeenCalledWith('user-1', 'prob-1', 'solved');
      expect(result).toEqual(mockProgress);
    });

    it('should handle attempted status', async () => {
      const attempted = { ...mockProgress, status: 'attempted' as const, solved_at: null };
      mockedRepo.upsert.mockResolvedValue(attempted);

      const result = await progressService.updateStatus('user-1', 'prob-1', 'attempted');

      expect(result.status).toBe('attempted');
      expect(result.solved_at).toBeNull();
    });
  });

  describe('getUserProgress', () => {
    it('should return all progress for a user', async () => {
      mockedRepo.getUserProgress.mockResolvedValue([mockProgress]);

      const result = await progressService.getUserProgress('user-1');

      expect(mockedRepo.getUserProgress).toHaveBeenCalledWith('user-1');
      expect(result).toEqual([mockProgress]);
    });

    it('should return empty array when no progress exists', async () => {
      mockedRepo.getUserProgress.mockResolvedValue([]);

      const result = await progressService.getUserProgress('new-user');

      expect(result).toEqual([]);
    });
  });

  describe('getUserProgressForSheet', () => {
    it('should return progress for a specific sheet', async () => {
      const sheetProgress = [
        { slug: 'two-sum', title: 'Two Sum', difficulty: 'easy', status: 'solved', solved_at: new Date() },
      ];
      mockedRepo.getUserProgressForSheet.mockResolvedValue(sheetProgress as any);

      const result = await progressService.getUserProgressForSheet('user-1', 'blind-75');

      expect(mockedRepo.getUserProgressForSheet).toHaveBeenCalledWith('user-1', 'blind-75');
      expect(result).toEqual(sheetProgress);
    });
  });
});
