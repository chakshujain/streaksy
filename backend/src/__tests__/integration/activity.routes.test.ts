import request from 'supertest';
import app from '../../app';
import { activityService } from '../../modules/activity/service/activity.service';
import { groupRepository } from '../../modules/group/repository/group.repository';
import { generateTestToken } from '../helpers';

jest.mock('../../modules/activity/service/activity.service');
jest.mock('../../modules/group/repository/group.repository');
const mockedService = activityService as jest.Mocked<typeof activityService>;
const mockedGroupRepo = groupRepository as jest.Mocked<typeof groupRepository>;

describe('Activity Routes', () => {
  const token = generateTestToken('user-1', 'user@test.com');

  const mockActivity = {
    id: 'act-1',
    group_id: 'group-1',
    user_id: 'user-1',
    action: 'solved_problem',
    metadata: { problemTitle: 'Two Sum' },
    created_at: new Date(),
    display_name: 'User One',
    avatar_url: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/groups/:id/activity', () => {
    it('should return group activity', async () => {
      mockedGroupRepo.isMember.mockResolvedValue(true);
      mockedService.getForGroup.mockResolvedValue([mockActivity]);

      const res = await request(app)
        .get('/api/groups/group-1/activity')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.activity).toHaveLength(1);
      expect(res.body.activity[0].action).toBe('solved_problem');
    });

    it('should return empty list when no activity', async () => {
      mockedGroupRepo.isMember.mockResolvedValue(true);
      mockedService.getForGroup.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/groups/group-1/activity')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.activity).toHaveLength(0);
    });

    it('should support pagination params', async () => {
      mockedGroupRepo.isMember.mockResolvedValue(true);
      mockedService.getForGroup.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/groups/group-1/activity?limit=10&offset=5')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(mockedService.getForGroup).toHaveBeenCalledWith('group-1', 10, 5);
    });

    it('should cap limit at 100', async () => {
      mockedGroupRepo.isMember.mockResolvedValue(true);
      mockedService.getForGroup.mockResolvedValue([]);

      await request(app)
        .get('/api/groups/group-1/activity?limit=500')
        .set('Authorization', `Bearer ${token}`);

      expect(mockedService.getForGroup).toHaveBeenCalledWith('group-1', 100, 0);
    });

    it('should return 403 when not a group member', async () => {
      mockedGroupRepo.isMember.mockResolvedValue(false);

      const res = await request(app)
        .get('/api/groups/group-1/activity')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/groups/group-1/activity');
      expect(res.status).toBe(401);
    });
  });
});
