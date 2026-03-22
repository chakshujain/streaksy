import request from 'supertest';
import app from '../../app';
import { pokeService } from '../../modules/poke/service/poke.service';
import { groupRepository } from '../../modules/group/repository/group.repository';
import { generateTestToken } from '../helpers';

jest.mock('../../modules/poke/service/poke.service');
jest.mock('../../modules/group/repository/group.repository');
const mockedService = pokeService as jest.Mocked<typeof pokeService>;
const mockedGroupRepo = groupRepository as jest.Mocked<typeof groupRepository>;

describe('Poke Routes', () => {
  const token = generateTestToken('user-1', 'user@test.com');

  const mockPoke = {
    id: 'poke-1',
    from_user_id: 'user-2',
    to_user_id: 'user-1',
    group_id: 'group-1',
    message: 'Keep going!',
    created_at: new Date(),
    from_display_name: 'User Two',
    from_avatar_url: null,
  };

  const mockInactiveMember = {
    user_id: 'user-3',
    display_name: 'Inactive User',
    avatar_url: null,
    last_active: new Date('2025-01-01'),
  };

  const mockRisk = {
    atRisk: true,
    currentStreak: 5,
    lastActivity: new Date('2025-01-14'),
  };

  const mockChallenge = {
    id: 'challenge-1',
    challenger_id: 'user-2',
    problem_id: 'prob-1',
    status: 'pending',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/pokes', () => {
    it('should poke a friend', async () => {
      mockedService.pokeFriend.mockResolvedValue(mockPoke);

      const res = await request(app)
        .post('/api/pokes')
        .set('Authorization', `Bearer ${token}`)
        .send({ toUserId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' });

      expect(res.status).toBe(201);
      expect(res.body.poke).toBeDefined();
    });

    it('should poke with optional message and groupId', async () => {
      mockedService.pokeFriend.mockResolvedValue(mockPoke);

      const res = await request(app)
        .post('/api/pokes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          toUserId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
          groupId: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
          message: 'Keep going!',
        });

      expect(res.status).toBe(201);
      expect(res.body.poke).toBeDefined();
    });

    it('should return 400 for missing toUserId', async () => {
      const res = await request(app)
        .post('/api/pokes')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.status).toBe(400);
    });

    it('should return 400 for non-uuid toUserId', async () => {
      const res = await request(app)
        .post('/api/pokes')
        .set('Authorization', `Bearer ${token}`)
        .send({ toUserId: 'not-a-uuid' });

      expect(res.status).toBe(400);
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .post('/api/pokes')
        .send({ toUserId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/pokes/received', () => {
    it('should return received pokes', async () => {
      mockedService.getMyPokes.mockResolvedValue([mockPoke]);

      const res = await request(app)
        .get('/api/pokes/received')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.pokes).toHaveLength(1);
    });

    it('should return empty list when no pokes', async () => {
      mockedService.getMyPokes.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/pokes/received')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.pokes).toHaveLength(0);
    });

    it('should support pagination params', async () => {
      mockedService.getMyPokes.mockResolvedValue([]);

      await request(app)
        .get('/api/pokes/received?limit=5&offset=10')
        .set('Authorization', `Bearer ${token}`);

      expect(mockedService.getMyPokes).toHaveBeenCalledWith('user-1', 5, 10);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/pokes/received');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/pokes/inactive/:groupId', () => {
    it('should return inactive members', async () => {
      mockedGroupRepo.isMember.mockResolvedValue(true);
      mockedService.getInactiveMembers.mockResolvedValue([mockInactiveMember]);

      const res = await request(app)
        .get('/api/pokes/inactive/group-1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.members).toHaveLength(1);
    });

    it('should support days query param', async () => {
      mockedGroupRepo.isMember.mockResolvedValue(true);
      mockedService.getInactiveMembers.mockResolvedValue([]);

      await request(app)
        .get('/api/pokes/inactive/group-1?days=5')
        .set('Authorization', `Bearer ${token}`);

      expect(mockedService.getInactiveMembers).toHaveBeenCalledWith('group-1', 5);
    });

    it('should return 403 when not a group member', async () => {
      mockedGroupRepo.isMember.mockResolvedValue(false);

      const res = await request(app)
        .get('/api/pokes/inactive/group-1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/pokes/inactive/group-1');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/pokes/streak-risk', () => {
    it('should return streak risk status', async () => {
      mockedService.checkStreakRisk.mockResolvedValue(mockRisk);

      const res = await request(app)
        .get('/api/pokes/streak-risk')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.risk.atRisk).toBe(true);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/pokes/streak-risk');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/pokes/challenge', () => {
    it('should return active challenge', async () => {
      mockedService.getActiveChallenge.mockResolvedValue(mockChallenge);

      const res = await request(app)
        .get('/api/pokes/challenge')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.challenge).toBeDefined();
    });

    it('should return null when no active challenge', async () => {
      mockedService.getActiveChallenge.mockResolvedValue(null);

      const res = await request(app)
        .get('/api/pokes/challenge')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.challenge).toBeNull();
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/pokes/challenge');
      expect(res.status).toBe(401);
    });
  });
});
