import request from 'supertest';
import app from '../../app';
import { badgeRepository } from '../../modules/badge/repository/badge.repository';
import { generateTestToken } from '../helpers';

jest.mock('../../modules/badge/repository/badge.repository');
const mockedRepo = badgeRepository as jest.Mocked<typeof badgeRepository>;

describe('Badge Routes', () => {
  const token = generateTestToken('user-1', 'user@test.com');

  const mockBadge = {
    id: 'badge-1',
    name: 'First Solve',
    description: 'Solved your first problem',
    icon: 'Trophy',
    category: 'milestone',
    criteria: { solveCount: 1 },
  };

  const mockUserBadge = {
    user_id: 'user-1',
    badge_id: 'badge-1',
    earned_at: new Date(),
    name: 'First Solve',
    description: 'Solved your first problem',
    icon: 'Trophy',
    category: 'milestone',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/badges', () => {
    it('should return all badges', async () => {
      mockedRepo.getAll.mockResolvedValue([mockBadge]);

      const res = await request(app)
        .get('/api/badges')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.badges).toHaveLength(1);
      expect(res.body.badges[0].name).toBe('First Solve');
    });

    it('should return empty list when no badges exist', async () => {
      mockedRepo.getAll.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/badges')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.badges).toHaveLength(0);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/badges');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/badges/mine', () => {
    it('should return user earned badges', async () => {
      mockedRepo.getUserBadges.mockResolvedValue([mockUserBadge]);

      const res = await request(app)
        .get('/api/badges/mine')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.badges).toHaveLength(1);
      expect(res.body.badges[0].name).toBe('First Solve');
      expect(res.body.badges[0].earned_at).toBeDefined();
    });

    it('should return empty list when no badges earned', async () => {
      mockedRepo.getUserBadges.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/badges/mine')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.badges).toHaveLength(0);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/badges/mine');
      expect(res.status).toBe(401);
    });
  });
});
