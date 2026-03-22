import request from 'supertest';
import app from '../../app';
import { leaderboardService } from '../../modules/leaderboard/service/leaderboard.service';
import { roadmapsService } from '../../modules/roadmaps/service/roadmaps.service';
import { generateTestToken } from '../helpers';

jest.mock('../../modules/leaderboard/service/leaderboard.service');
jest.mock('../../modules/roadmaps/service/roadmaps.service');
const mockedLeaderboardService = leaderboardService as jest.Mocked<typeof leaderboardService>;
const mockedRoadmapsService = roadmapsService as jest.Mocked<typeof roadmapsService>;

describe('Leaderboard Routes', () => {
  const token = generateTestToken('user-1', 'user@test.com');

  const mockLeaderboardEntry = {
    userId: 'user-1',
    displayName: 'User One',
    solvedCount: 50,
    currentStreak: 10,
    score: 500,
  };

  const mockGlobalEntry = {
    user_id: 'user-2',
    display_name: 'User Two',
    avatar_url: null,
    total_points: 300,
    current_streak: 5,
    longest_streak: 12,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/leaderboard/global', () => {
    it('should return global leaderboard', async () => {
      mockedRoadmapsService.getGlobalLeaderboard.mockResolvedValue([mockGlobalEntry]);

      const res = await request(app)
        .get('/api/leaderboard/global')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.leaderboard).toHaveLength(1);
      expect(res.body.leaderboard[0].display_name).toBe('User Two');
    });

    it('should return empty leaderboard', async () => {
      mockedRoadmapsService.getGlobalLeaderboard.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/leaderboard/global')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.leaderboard).toHaveLength(0);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/leaderboard/global');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/leaderboard/group/:groupId', () => {
    it('should return group leaderboard', async () => {
      mockedLeaderboardService.getGroupLeaderboard.mockResolvedValue([mockLeaderboardEntry]);

      const res = await request(app)
        .get('/api/leaderboard/group/group-1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.leaderboard).toHaveLength(1);
      expect(res.body.leaderboard[0].score).toBe(500);
    });

    it('should return empty group leaderboard', async () => {
      mockedLeaderboardService.getGroupLeaderboard.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/leaderboard/group/group-1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.leaderboard).toHaveLength(0);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/leaderboard/group/group-1');
      expect(res.status).toBe(401);
    });
  });
});
