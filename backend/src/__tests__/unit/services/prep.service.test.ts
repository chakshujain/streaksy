import { prepService } from '../../../modules/prep/service/prep.service';
import { prepRepository } from '../../../modules/prep/repository/prep.repository';
import { queryOne } from '../../../config/database';
import { AppError } from '../../../common/errors/AppError';

jest.mock('../../../modules/prep/repository/prep.repository');
jest.mock('../../../config/database', () => ({
  pool: { query: jest.fn(), connect: jest.fn(), on: jest.fn() },
  query: jest.fn(),
  queryOne: jest.fn(),
  transaction: jest.fn(),
}));

const mockedRepo = prepRepository as jest.Mocked<typeof prepRepository>;
const mockedQueryOne = queryOne as jest.MockedFunction<typeof queryOne>;

describe('prepService', () => {
  const mockRoadmap = {
    id: 'roadmap-1',
    user_id: 'user-1',
    group_id: null,
    answers: { experience: 'intermediate' },
    days: [{ day: 1, topics: ['arrays'] }],
    total_days: 30,
    share_code: 'abc123',
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
  };

  const mockProgress = {
    roadmap_id: 'roadmap-1',
    user_id: 'user-1',
    day_number: 1,
    completed: true,
    completed_at: new Date(),
  };

  const mockLeaderboard = [
    { user_id: 'user-1', display_name: 'User One', avatar_url: null, completed_count: 10 },
    { user_id: 'user-2', display_name: 'User Two', avatar_url: null, completed_count: 7 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a roadmap without group', async () => {
      mockedRepo.create.mockResolvedValue(mockRoadmap);

      const result = await prepService.create(
        'user-1',
        { experience: 'intermediate' },
        [{ day: 1, topics: ['arrays'] }],
        30
      );

      expect(mockedRepo.create).toHaveBeenCalledWith(
        'user-1',
        { experience: 'intermediate' },
        [{ day: 1, topics: ['arrays'] }],
        30,
        undefined
      );
      expect(result).toEqual(mockRoadmap);
    });

    it('should create a roadmap with group when user is a member', async () => {
      mockedQueryOne.mockResolvedValue({ user_id: 'user-1' });
      mockedRepo.create.mockResolvedValue({ ...mockRoadmap, group_id: 'group-1' });

      const result = await prepService.create(
        'user-1',
        { experience: 'intermediate' },
        [{ day: 1, topics: ['arrays'] }],
        30,
        'group-1'
      );

      expect(mockedQueryOne).toHaveBeenCalledWith(
        'SELECT user_id FROM group_members WHERE group_id = $1 AND user_id = $2',
        ['group-1', 'user-1']
      );
      expect(result.group_id).toBe('group-1');
    });

    it('should throw forbidden when user is not a group member', async () => {
      mockedQueryOne.mockResolvedValue(null);

      await expect(
        prepService.create('user-1', {}, [], 30, 'group-1')
      ).rejects.toThrow('Not a member of this group');
      await expect(
        prepService.create('user-1', {}, [], 30, 'group-1')
      ).rejects.toMatchObject({ statusCode: 403 });
    });
  });

  describe('getActive', () => {
    it('should return the active roadmap', async () => {
      mockedRepo.getActive.mockResolvedValue(mockRoadmap);

      const result = await prepService.getActive('user-1');

      expect(mockedRepo.getActive).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(mockRoadmap);
    });

    it('should return null when no active roadmap', async () => {
      mockedRepo.getActive.mockResolvedValue(null);

      const result = await prepService.getActive('user-1');

      expect(result).toBeNull();
    });
  });

  describe('getById', () => {
    it('should return the roadmap by id', async () => {
      mockedRepo.getById.mockResolvedValue(mockRoadmap);

      const result = await prepService.getById('roadmap-1');

      expect(mockedRepo.getById).toHaveBeenCalledWith('roadmap-1');
      expect(result).toEqual(mockRoadmap);
    });

    it('should throw notFound when roadmap does not exist', async () => {
      mockedRepo.getById.mockResolvedValue(null);

      await expect(prepService.getById('nonexistent')).rejects.toThrow('Roadmap not found');
      await expect(prepService.getById('nonexistent')).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });

  describe('getByShareCode', () => {
    it('should return the roadmap by share code', async () => {
      mockedRepo.getByShareCode.mockResolvedValue(mockRoadmap);

      const result = await prepService.getByShareCode('abc123');

      expect(mockedRepo.getByShareCode).toHaveBeenCalledWith('abc123');
      expect(result).toEqual(mockRoadmap);
    });

    it('should throw notFound when share code is invalid', async () => {
      mockedRepo.getByShareCode.mockResolvedValue(null);

      await expect(prepService.getByShareCode('invalid')).rejects.toThrow('Roadmap not found');
      await expect(prepService.getByShareCode('invalid')).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });

  describe('updateProgress', () => {
    it('should update progress for a valid roadmap', async () => {
      mockedRepo.getById.mockResolvedValue(mockRoadmap);
      mockedRepo.updateProgress.mockResolvedValue(mockProgress);

      const result = await prepService.updateProgress('roadmap-1', 'user-1', 1, true);

      expect(mockedRepo.getById).toHaveBeenCalledWith('roadmap-1');
      expect(mockedRepo.updateProgress).toHaveBeenCalledWith('roadmap-1', 'user-1', 1, true);
      expect(result).toEqual(mockProgress);
    });

    it('should throw notFound when roadmap does not exist', async () => {
      mockedRepo.getById.mockResolvedValue(null);

      await expect(
        prepService.updateProgress('nonexistent', 'user-1', 1, true)
      ).rejects.toThrow('Roadmap not found');
    });
  });

  describe('getProgress', () => {
    it('should return progress for a valid roadmap', async () => {
      mockedRepo.getById.mockResolvedValue(mockRoadmap);
      mockedRepo.getProgress.mockResolvedValue([mockProgress]);

      const result = await prepService.getProgress('roadmap-1');

      expect(mockedRepo.getProgress).toHaveBeenCalledWith('roadmap-1');
      expect(result).toEqual([mockProgress]);
    });

    it('should throw notFound when roadmap does not exist', async () => {
      mockedRepo.getById.mockResolvedValue(null);

      await expect(prepService.getProgress('nonexistent')).rejects.toThrow('Roadmap not found');
    });
  });

  describe('getUserProgress', () => {
    it('should return user progress', async () => {
      mockedRepo.getUserProgress.mockResolvedValue([mockProgress]);

      const result = await prepService.getUserProgress('roadmap-1', 'user-1');

      expect(mockedRepo.getUserProgress).toHaveBeenCalledWith('roadmap-1', 'user-1');
      expect(result).toEqual([mockProgress]);
    });
  });

  describe('linkGroup', () => {
    it('should link a group to the roadmap', async () => {
      mockedRepo.getById.mockResolvedValue(mockRoadmap);
      mockedQueryOne.mockResolvedValue({ user_id: 'user-1' });
      mockedRepo.linkGroup.mockResolvedValue();

      await prepService.linkGroup('roadmap-1', 'user-1', 'group-1');

      expect(mockedRepo.linkGroup).toHaveBeenCalledWith('roadmap-1', 'group-1');
    });

    it('should throw notFound when roadmap does not exist', async () => {
      mockedRepo.getById.mockResolvedValue(null);

      await expect(
        prepService.linkGroup('nonexistent', 'user-1', 'group-1')
      ).rejects.toThrow('Roadmap not found');
    });

    it('should throw forbidden when user does not own the roadmap', async () => {
      mockedRepo.getById.mockResolvedValue({ ...mockRoadmap, user_id: 'other-user' });

      await expect(
        prepService.linkGroup('roadmap-1', 'user-1', 'group-1')
      ).rejects.toThrow('Not your roadmap');
      await expect(
        prepService.linkGroup('roadmap-1', 'user-1', 'group-1')
      ).rejects.toMatchObject({ statusCode: 403 });
    });

    it('should throw forbidden when user is not a member of the group', async () => {
      mockedRepo.getById.mockResolvedValue(mockRoadmap);
      mockedQueryOne.mockResolvedValue(null);

      await expect(
        prepService.linkGroup('roadmap-1', 'user-1', 'group-1')
      ).rejects.toThrow('Not a member of this group');
    });
  });

  describe('getLeaderboard', () => {
    it('should return leaderboard for a valid roadmap', async () => {
      mockedRepo.getById.mockResolvedValue(mockRoadmap);
      mockedRepo.getLeaderboard.mockResolvedValue(mockLeaderboard);

      const result = await prepService.getLeaderboard('roadmap-1');

      expect(mockedRepo.getLeaderboard).toHaveBeenCalledWith('roadmap-1');
      expect(result).toEqual(mockLeaderboard);
    });

    it('should throw notFound when roadmap does not exist', async () => {
      mockedRepo.getById.mockResolvedValue(null);

      await expect(prepService.getLeaderboard('nonexistent')).rejects.toThrow('Roadmap not found');
    });
  });
});
