import { activityService } from '../../../modules/activity/service/activity.service';
import { activityRepository } from '../../../modules/activity/repository/activity.repository';

jest.mock('../../../modules/activity/repository/activity.repository');
const mockedRepo = activityRepository as jest.Mocked<typeof activityRepository>;

describe('activityService', () => {
  const mockActivity = {
    id: 'act-1',
    group_id: 'group-1',
    user_id: 'user-1',
    action: 'solved_problem',
    metadata: { problemTitle: 'Two Sum' },
    created_at: new Date(),
    display_name: 'Test User',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('log', () => {
    it('should create an activity log entry', async () => {
      mockedRepo.create.mockResolvedValue(mockActivity);

      await activityService.log('group-1', 'user-1', 'solved_problem', { problemTitle: 'Two Sum' });

      expect(mockedRepo.create).toHaveBeenCalledWith(
        'group-1', 'user-1', 'solved_problem', { problemTitle: 'Two Sum' }
      );
    });

    it('should work without metadata', async () => {
      mockedRepo.create.mockResolvedValue(mockActivity);

      await activityService.log('group-1', 'user-1', 'joined_group');

      expect(mockedRepo.create).toHaveBeenCalledWith(
        'group-1', 'user-1', 'joined_group', undefined
      );
    });

    it('should not throw on repository error (fire-and-forget)', async () => {
      mockedRepo.create.mockRejectedValue(new Error('DB error'));

      await expect(
        activityService.log('group-1', 'user-1', 'solved_problem')
      ).resolves.toBeUndefined();
    });
  });

  describe('getForGroup', () => {
    it('should return activity for a group', async () => {
      mockedRepo.getForGroup.mockResolvedValue([mockActivity]);

      const result = await activityService.getForGroup('group-1');

      expect(mockedRepo.getForGroup).toHaveBeenCalledWith('group-1', undefined, undefined);
      expect(result).toEqual([mockActivity]);
    });

    it('should pass limit and offset', async () => {
      mockedRepo.getForGroup.mockResolvedValue([]);

      await activityService.getForGroup('group-1', 10, 5);

      expect(mockedRepo.getForGroup).toHaveBeenCalledWith('group-1', 10, 5);
    });

    it('should return empty array when no activity exists', async () => {
      mockedRepo.getForGroup.mockResolvedValue([]);

      const result = await activityService.getForGroup('group-1');

      expect(result).toEqual([]);
    });
  });
});
