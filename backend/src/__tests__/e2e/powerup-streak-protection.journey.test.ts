import request from 'supertest';
import app from '../../app';
import { generateTestToken } from '../helpers';
import { powerupRepository } from '../../modules/powerup/repository/powerup.repository';
import { streakRepository } from '../../modules/streak/repository/streak.repository';
import { query, queryOne } from '../../config/database';

jest.mock('../../modules/powerup/repository/powerup.repository');
jest.mock('../../modules/streak/repository/streak.repository');
jest.mock('../../modules/streak/service/streaks-engine', () => ({
  streaksEngine: {
    calculatePoints: jest.fn().mockResolvedValue({ totalPoints: 15, basePoints: 10, streakBonus: 5, multipliers: [] }),
    calculateCompletionBonus: jest.fn().mockReturnValue({ bonus: 100 }),
    cacheMultiplierPreview: jest.fn().mockResolvedValue(undefined),
  },
}));

const mockedPowerupRepo = powerupRepository as jest.Mocked<typeof powerupRepository>;
const mockedStreakRepo = streakRepository as jest.Mocked<typeof streakRepository>;
const mockedQuery = query as jest.MockedFunction<typeof query>;
const mockedQueryOne = queryOne as jest.MockedFunction<typeof queryOne>;

describe('E2E Journey: Powerup & Streak Protection', () => {
  const userId = 'user-powerup';
  const email = 'powerup@test.com';
  const token = generateTestToken(userId, email);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Step 1: Check powerup costs', () => {
    it('should return available powerup costs', async () => {
      const res = await request(app)
        .get('/api/powerups/costs')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.costs).toBeDefined();
      expect(res.body.costs.streak_freeze).toBeDefined();
      expect(res.body.costs.double_xp).toBeDefined();
      expect(res.body.costs.streak_shield).toBeDefined();
    });
  });

  describe('Step 2: View empty inventory', () => {
    it('should show empty powerup inventory initially', async () => {
      mockedPowerupRepo.getInventory.mockResolvedValue([]);
      mockedPowerupRepo.getStreakExtended.mockResolvedValue(null);

      const res = await request(app)
        .get('/api/powerups')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.powerups).toHaveLength(0);
      expect(res.body.points).toBe(0);
    });
  });

  describe('Step 3: Purchase a streak freeze', () => {
    it('should purchase a streak freeze powerup', async () => {
      mockedPowerupRepo.spendPoints.mockResolvedValue(true);
      mockedPowerupRepo.addPowerup.mockResolvedValue();
      mockedPowerupRepo.logAction.mockResolvedValue();

      const res = await request(app)
        .post('/api/powerups/purchase')
        .set('Authorization', `Bearer ${token}`)
        .send({ type: 'streak_freeze' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('should reject purchase with insufficient points', async () => {
      mockedPowerupRepo.spendPoints.mockResolvedValue(false);

      const res = await request(app)
        .post('/api/powerups/purchase')
        .set('Authorization', `Bearer ${token}`)
        .send({ type: 'streak_freeze' });

      expect(res.status).toBe(400);
    });
  });

  describe('Step 4: Purchase a double XP powerup', () => {
    it('should purchase double XP', async () => {
      mockedPowerupRepo.spendPoints.mockResolvedValue(true);
      mockedPowerupRepo.addPowerup.mockResolvedValue();
      mockedPowerupRepo.logAction.mockResolvedValue();

      const res = await request(app)
        .post('/api/powerups/purchase')
        .set('Authorization', `Bearer ${token}`)
        .send({ type: 'double_xp' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });
  });

  describe('Step 5: Purchase a streak shield', () => {
    it('should purchase streak shield', async () => {
      mockedPowerupRepo.spendPoints.mockResolvedValue(true);
      mockedPowerupRepo.addPowerup.mockResolvedValue();
      mockedPowerupRepo.logAction.mockResolvedValue();

      const res = await request(app)
        .post('/api/powerups/purchase')
        .set('Authorization', `Bearer ${token}`)
        .send({ type: 'streak_shield' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });
  });

  describe('Step 6: View inventory after purchases', () => {
    it('should show purchased powerups in inventory', async () => {
      mockedPowerupRepo.getInventory.mockResolvedValue([
        { id: 'pu-1', user_id: userId, powerup_type: 'streak_freeze', quantity: 1 },
        { id: 'pu-2', user_id: userId, powerup_type: 'double_xp', quantity: 1 },
        { id: 'pu-3', user_id: userId, powerup_type: 'streak_shield', quantity: 1 },
      ]);
      mockedPowerupRepo.getStreakExtended.mockResolvedValue({
        user_id: userId, current_streak: 5, longest_streak: 10, last_solve_date: '2026-03-22',
        points: 500, freeze_count: 0, last_freeze_used: null,
      });

      const res = await request(app)
        .get('/api/powerups')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.powerups).toHaveLength(3);
      expect(res.body.points).toBe(500);
    });
  });

  describe('Step 7: Use streak freeze to protect streak', () => {
    it('should activate a streak freeze', async () => {
      mockedPowerupRepo.getStreakExtended.mockResolvedValue({
        user_id: userId, current_streak: 5, longest_streak: 10, last_solve_date: '2026-03-22',
        points: 500, freeze_count: 0, last_freeze_used: null,
      });
      mockedPowerupRepo.usePowerup.mockResolvedValue(true);
      mockedPowerupRepo.useFreeze.mockResolvedValue();
      mockedPowerupRepo.logAction.mockResolvedValue();

      const res = await request(app)
        .post('/api/powerups/freeze')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should reject freeze when no streak data', async () => {
      mockedPowerupRepo.getStreakExtended.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/powerups/freeze')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });

  describe('Step 8: Check purchase log', () => {
    it('should show all powerup transactions', async () => {
      mockedPowerupRepo.getLog.mockResolvedValue([
        { id: 'log-1', user_id: userId, powerup_type: 'streak_freeze', action: 'used', reason: 'Protected streak', created_at: '2026-03-22T10:00:00Z' },
        { id: 'log-2', user_id: userId, powerup_type: 'streak_shield', action: 'earned', reason: null, created_at: '2026-03-22T09:00:00Z' },
        { id: 'log-3', user_id: userId, powerup_type: 'double_xp', action: 'earned', reason: null, created_at: '2026-03-22T08:00:00Z' },
        { id: 'log-4', user_id: userId, powerup_type: 'streak_freeze', action: 'earned', reason: null, created_at: '2026-03-22T07:00:00Z' },
      ]);

      const res = await request(app)
        .get('/api/powerups/log')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.log).toHaveLength(4);
      expect(res.body.log[0].action).toBe('used');
    });
  });

  describe('Step 9: Validate invalid powerup type', () => {
    it('should reject purchase of invalid powerup type', async () => {
      const res = await request(app)
        .post('/api/powerups/purchase')
        .set('Authorization', `Bearer ${token}`)
        .send({ type: 'invalid_powerup' });

      expect(res.status).toBe(400);
    });
  });

  describe('Step 10: Check streak multiplier preview', () => {
    it('should show multiplier preview', async () => {
      mockedStreakRepo.get.mockResolvedValue({
        user_id: userId,
        current_streak: 10,
        longest_streak: 15,
        last_solve_date: '2026-03-22',
      });

      const res = await request(app)
        .get('/api/streaks/multipliers')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
    });
  });
});
