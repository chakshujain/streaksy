import { powerupService } from '../../../modules/powerup/service/powerup.service';
import { powerupRepository } from '../../../modules/powerup/repository/powerup.repository';

jest.mock('../../../modules/powerup/repository/powerup.repository');
jest.mock('../../../config/database', () => ({
  pool: { query: jest.fn(), connect: jest.fn(), on: jest.fn() },
  query: jest.fn(),
  queryOne: jest.fn(),
  transaction: jest.fn(),
}));

const mockedRepo = powerupRepository as jest.Mocked<typeof powerupRepository>;

describe('powerupService', () => {
  const mockInventory = [
    { id: 'pu-1', user_id: 'user-1', powerup_type: 'streak_freeze', quantity: 2 },
    { id: 'pu-2', user_id: 'user-1', powerup_type: 'double_xp', quantity: 1 },
  ];

  const mockStreak = {
    user_id: 'user-1',
    current_streak: 10,
    longest_streak: 20,
    last_solve_date: '2024-06-01',
    points: 500,
    freeze_count: 1,
    last_freeze_used: '2024-05-30',
  };

  const mockLog = [
    { id: 'log-1', user_id: 'user-1', powerup_type: 'streak_freeze', action: 'earned', reason: 'Purchased for 100 points', created_at: '2024-06-01' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getInventory', () => {
    it('should return inventory with points and freeze info', async () => {
      mockedRepo.getInventory.mockResolvedValue(mockInventory);
      mockedRepo.getStreakExtended.mockResolvedValue(mockStreak);

      const result = await powerupService.getInventory('user-1');

      expect(mockedRepo.getInventory).toHaveBeenCalledWith('user-1');
      expect(mockedRepo.getStreakExtended).toHaveBeenCalledWith('user-1');
      expect(result).toEqual({
        powerups: mockInventory,
        points: 500,
        freezeCount: 1,
        lastFreezeUsed: '2024-05-30',
      });
    });

    it('should default points and freeze count to 0 when no streak data', async () => {
      mockedRepo.getInventory.mockResolvedValue([]);
      mockedRepo.getStreakExtended.mockResolvedValue(null);

      const result = await powerupService.getInventory('user-1');

      expect(result.points).toBe(0);
      expect(result.freezeCount).toBe(0);
      expect(result.lastFreezeUsed).toBeUndefined();
    });
  });

  describe('getLog', () => {
    it('should return powerup log', async () => {
      mockedRepo.getLog.mockResolvedValue(mockLog);

      const result = await powerupService.getLog('user-1');

      expect(mockedRepo.getLog).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(mockLog);
    });
  });

  describe('purchasePowerup', () => {
    it('should purchase a streak_freeze successfully', async () => {
      mockedRepo.spendPoints.mockResolvedValue(true);
      mockedRepo.addPowerup.mockResolvedValue();
      mockedRepo.logAction.mockResolvedValue();

      const result = await powerupService.purchasePowerup('user-1', 'streak_freeze');

      expect(mockedRepo.spendPoints).toHaveBeenCalledWith('user-1', 100);
      expect(mockedRepo.addPowerup).toHaveBeenCalledWith('user-1', 'streak_freeze', 1);
      expect(mockedRepo.logAction).toHaveBeenCalledWith('user-1', 'streak_freeze', 'earned', 'Purchased for 100 points');
      expect(result).toEqual({ success: true, cost: 100 });
    });

    it('should purchase a double_xp for 150 points', async () => {
      mockedRepo.spendPoints.mockResolvedValue(true);
      mockedRepo.addPowerup.mockResolvedValue();
      mockedRepo.logAction.mockResolvedValue();

      const result = await powerupService.purchasePowerup('user-1', 'double_xp');

      expect(mockedRepo.spendPoints).toHaveBeenCalledWith('user-1', 150);
      expect(result).toEqual({ success: true, cost: 150 });
    });

    it('should purchase a streak_shield for 200 points', async () => {
      mockedRepo.spendPoints.mockResolvedValue(true);
      mockedRepo.addPowerup.mockResolvedValue();
      mockedRepo.logAction.mockResolvedValue();

      const result = await powerupService.purchasePowerup('user-1', 'streak_shield');

      expect(mockedRepo.spendPoints).toHaveBeenCalledWith('user-1', 200);
      expect(result).toEqual({ success: true, cost: 200 });
    });

    it('should throw badRequest for invalid powerup type', async () => {
      await expect(powerupService.purchasePowerup('user-1', 'invalid_type')).rejects.toThrow(
        'Invalid powerup type'
      );
      await expect(powerupService.purchasePowerup('user-1', 'invalid_type')).rejects.toMatchObject({
        statusCode: 400,
      });
    });

    it('should throw badRequest when not enough points', async () => {
      mockedRepo.spendPoints.mockResolvedValue(false);

      await expect(powerupService.purchasePowerup('user-1', 'streak_freeze')).rejects.toThrow(
        'Not enough points'
      );
      await expect(powerupService.purchasePowerup('user-1', 'streak_freeze')).rejects.toMatchObject({
        statusCode: 400,
      });
    });
  });

  describe('useStreakFreeze', () => {
    it('should use a streak freeze successfully', async () => {
      const streakData = { ...mockStreak, last_freeze_used: '2024-05-30' };
      mockedRepo.getStreakExtended.mockResolvedValue(streakData);
      mockedRepo.usePowerup.mockResolvedValue(true);
      mockedRepo.useFreeze.mockResolvedValue();
      mockedRepo.logAction.mockResolvedValue();

      const result = await powerupService.useStreakFreeze('user-1');

      expect(mockedRepo.usePowerup).toHaveBeenCalledWith('user-1', 'streak_freeze');
      expect(mockedRepo.useFreeze).toHaveBeenCalledWith('user-1');
      expect(mockedRepo.logAction).toHaveBeenCalledWith('user-1', 'streak_freeze', 'used', 'Protected streak');
      expect(result).toEqual({ success: true, message: 'Streak protected for today' });
    });

    it('should throw notFound when no streak data exists', async () => {
      mockedRepo.getStreakExtended.mockResolvedValue(null);

      await expect(powerupService.useStreakFreeze('user-1')).rejects.toThrow(
        'No streak data found'
      );
      await expect(powerupService.useStreakFreeze('user-1')).rejects.toMatchObject({
        statusCode: 404,
      });
    });

    it('should throw badRequest when freeze already used today', async () => {
      const today = new Date().toISOString().split('T')[0];
      mockedRepo.getStreakExtended.mockResolvedValue({ ...mockStreak, last_freeze_used: today });

      await expect(powerupService.useStreakFreeze('user-1')).rejects.toThrow(
        'Already used a freeze today'
      );
    });

    it('should throw badRequest when no freezes available', async () => {
      mockedRepo.getStreakExtended.mockResolvedValue({ ...mockStreak, last_freeze_used: '2024-05-30' });
      mockedRepo.usePowerup.mockResolvedValue(false);

      await expect(powerupService.useStreakFreeze('user-1')).rejects.toThrow(
        'No streak freezes available'
      );
    });
  });

  describe('awardSolvePoints', () => {
    it('should award base points for solving', async () => {
      mockedRepo.addPoints.mockResolvedValue();
      mockedRepo.logAction.mockResolvedValue();

      const points = await powerupService.awardSolvePoints('user-1');

      expect(mockedRepo.addPoints).toHaveBeenCalled();
      expect(mockedRepo.logAction).toHaveBeenCalled();
      expect(points).toBeGreaterThanOrEqual(10);
    });
  });

  describe('checkMilestoneRewards', () => {
    it('should award streak_freeze at 7-day streak', async () => {
      mockedRepo.addPowerup.mockResolvedValue();
      mockedRepo.logAction.mockResolvedValue();

      await powerupService.checkMilestoneRewards('user-1', 7);

      expect(mockedRepo.addPowerup).toHaveBeenCalledWith('user-1', 'streak_freeze', 1);
      expect(mockedRepo.logAction).toHaveBeenCalledWith(
        'user-1', 'streak_freeze', 'earned', '7-day streak milestone'
      );
    });

    it('should award double_xp at 14-day streak', async () => {
      mockedRepo.addPowerup.mockResolvedValue();
      mockedRepo.logAction.mockResolvedValue();

      await powerupService.checkMilestoneRewards('user-1', 14);

      expect(mockedRepo.addPowerup).toHaveBeenCalledWith('user-1', 'double_xp', 1);
    });

    it('should award streak_shield at 30-day streak', async () => {
      mockedRepo.addPowerup.mockResolvedValue();
      mockedRepo.logAction.mockResolvedValue();

      await powerupService.checkMilestoneRewards('user-1', 30);

      expect(mockedRepo.addPowerup).toHaveBeenCalledWith('user-1', 'streak_shield', 1);
    });

    it('should not award anything for non-milestone streaks', async () => {
      await powerupService.checkMilestoneRewards('user-1', 5);

      expect(mockedRepo.addPowerup).not.toHaveBeenCalled();
    });
  });

  describe('hasActiveShield', () => {
    it('should return true when shield quantity > 0', async () => {
      mockedRepo.getOne.mockResolvedValue({ id: 'pu-1', user_id: 'user-1', powerup_type: 'streak_shield', quantity: 1 });

      const result = await powerupService.hasActiveShield('user-1');

      expect(mockedRepo.getOne).toHaveBeenCalledWith('user-1', 'streak_shield');
      expect(result).toBe(true);
    });

    it('should return false when shield quantity is 0', async () => {
      mockedRepo.getOne.mockResolvedValue({ id: 'pu-1', user_id: 'user-1', powerup_type: 'streak_shield', quantity: 0 });

      const result = await powerupService.hasActiveShield('user-1');

      expect(result).toBe(false);
    });

    it('should return false when no shield record exists', async () => {
      mockedRepo.getOne.mockResolvedValue(null);

      const result = await powerupService.hasActiveShield('user-1');

      expect(result).toBe(false);
    });
  });

  describe('hasActiveDoubleXp', () => {
    it('should return true when double_xp quantity > 0', async () => {
      mockedRepo.getOne.mockResolvedValue({ id: 'pu-1', user_id: 'user-1', powerup_type: 'double_xp', quantity: 3 });

      const result = await powerupService.hasActiveDoubleXp('user-1');

      expect(mockedRepo.getOne).toHaveBeenCalledWith('user-1', 'double_xp');
      expect(result).toBe(true);
    });

    it('should return false when no double_xp available', async () => {
      mockedRepo.getOne.mockResolvedValue(null);

      const result = await powerupService.hasActiveDoubleXp('user-1');

      expect(result).toBe(false);
    });
  });

  describe('useDoubleXp', () => {
    it('should delegate to repository usePowerup', async () => {
      mockedRepo.usePowerup.mockResolvedValue(true);

      const result = await powerupService.useDoubleXp('user-1');

      expect(mockedRepo.usePowerup).toHaveBeenCalledWith('user-1', 'double_xp');
      expect(result).toBe(true);
    });

    it('should return false when no double_xp to use', async () => {
      mockedRepo.usePowerup.mockResolvedValue(false);

      const result = await powerupService.useDoubleXp('user-1');

      expect(result).toBe(false);
    });
  });

  describe('getPowerupCosts', () => {
    it('should return cost map for all powerup types', () => {
      const costs = powerupService.getPowerupCosts();

      expect(costs).toEqual({
        streak_freeze: 100,
        double_xp: 150,
        streak_shield: 200,
      });
    });
  });
});
