import { badgeService } from '../../../modules/badge/service/badge.service';
import { badgeRepository } from '../../../modules/badge/repository/badge.repository';
import { query } from '../../../config/database';

jest.mock('../../../modules/badge/repository/badge.repository');
jest.mock('../../../config/database', () => ({
  pool: { query: jest.fn(), connect: jest.fn(), on: jest.fn() },
  query: jest.fn(),
  queryOne: jest.fn(),
  transaction: jest.fn(),
}));

const mockedRepo = badgeRepository as jest.Mocked<typeof badgeRepository>;
const mockedQuery = query as jest.MockedFunction<typeof query>;

describe('badgeService', () => {
  const mockBadge = {
    id: 'badge-1',
    name: 'First Solve',
    description: 'Solve your first problem',
    icon: '🏆',
    category: 'progress',
    criteria: { solveCount: 1 },
  };

  const mockUserBadge = {
    user_id: 'user-1',
    badge_id: 'badge-1',
    earned_at: new Date(),
    name: 'First Solve',
    description: 'Solve your first problem',
    icon: '🏆',
    category: 'progress',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all badges', async () => {
      mockedRepo.getAll.mockResolvedValue([mockBadge]);

      const result = await badgeService.getAll();

      expect(mockedRepo.getAll).toHaveBeenCalled();
      expect(result).toEqual([mockBadge]);
    });
  });

  describe('getUserBadges', () => {
    it('should return badges for a user', async () => {
      mockedRepo.getUserBadges.mockResolvedValue([mockUserBadge]);

      const result = await badgeService.getUserBadges('user-1');

      expect(mockedRepo.getUserBadges).toHaveBeenCalledWith('user-1');
      expect(result).toEqual([mockUserBadge]);
    });
  });

  describe('checkAndAward', () => {
    it('should award a badge when solve count criteria is met', async () => {
      mockedRepo.getAll.mockResolvedValue([mockBadge]);
      mockedRepo.getUserBadges.mockResolvedValue([]); // No badges earned yet

      // solve count query
      mockedQuery.mockResolvedValueOnce([{ count: '5' }]);
      // streak query
      mockedQuery.mockResolvedValueOnce([{ current_streak: 0 }]);
      // difficulty breakdown query
      mockedQuery.mockResolvedValueOnce([]);
      // revision count query
      mockedQuery.mockResolvedValueOnce([{ count: '0' }]);

      mockedRepo.award.mockResolvedValue();

      const awarded = await badgeService.checkAndAward('user-1');

      expect(awarded).toContain('First Solve');
      expect(mockedRepo.award).toHaveBeenCalledWith('user-1', 'badge-1');
    });

    it('should not award already earned badges', async () => {
      mockedRepo.getAll.mockResolvedValue([mockBadge]);
      mockedRepo.getUserBadges.mockResolvedValue([mockUserBadge]); // Already earned

      // solve count query
      mockedQuery.mockResolvedValueOnce([{ count: '5' }]);
      // streak query
      mockedQuery.mockResolvedValueOnce([{ current_streak: 0 }]);
      // difficulty breakdown query
      mockedQuery.mockResolvedValueOnce([]);
      // revision count query
      mockedQuery.mockResolvedValueOnce([{ count: '0' }]);

      const awarded = await badgeService.checkAndAward('user-1');

      expect(awarded).toEqual([]);
      expect(mockedRepo.award).not.toHaveBeenCalled();
    });

    it('should award streak badge when streak criteria is met', async () => {
      const streakBadge = {
        id: 'badge-2',
        name: 'Streak Master',
        description: '7-day streak',
        icon: '🔥',
        category: 'streak',
        criteria: { streakDays: 7 },
      };
      mockedRepo.getAll.mockResolvedValue([streakBadge]);
      mockedRepo.getUserBadges.mockResolvedValue([]);

      mockedQuery.mockResolvedValueOnce([{ count: '0' }]); // solve count
      mockedQuery.mockResolvedValueOnce([{ current_streak: 10 }]); // streak
      mockedQuery.mockResolvedValueOnce([]); // difficulty
      mockedQuery.mockResolvedValueOnce([{ count: '0' }]); // revision

      mockedRepo.award.mockResolvedValue();

      const awarded = await badgeService.checkAndAward('user-1');

      expect(awarded).toContain('Streak Master');
    });

    it('should award difficulty-based badge', async () => {
      const hardBadge = {
        id: 'badge-3',
        name: 'Hard Crusher',
        description: 'Solve 5 hard problems',
        icon: '💎',
        category: 'difficulty',
        criteria: { difficulty: 'hard', count: 5 },
      };
      mockedRepo.getAll.mockResolvedValue([hardBadge]);
      mockedRepo.getUserBadges.mockResolvedValue([]);

      mockedQuery.mockResolvedValueOnce([{ count: '10' }]); // solve count
      mockedQuery.mockResolvedValueOnce([{ current_streak: 0 }]); // streak
      mockedQuery.mockResolvedValueOnce([{ difficulty: 'hard', count: '7' }]); // difficulty
      mockedQuery.mockResolvedValueOnce([{ count: '0' }]); // revision

      mockedRepo.award.mockResolvedValue();

      const awarded = await badgeService.checkAndAward('user-1');

      expect(awarded).toContain('Hard Crusher');
    });

    it('should not throw on internal error (returns empty)', async () => {
      mockedRepo.getAll.mockRejectedValue(new Error('DB error'));

      const awarded = await badgeService.checkAndAward('user-1');

      expect(awarded).toEqual([]);
    });
  });
});
