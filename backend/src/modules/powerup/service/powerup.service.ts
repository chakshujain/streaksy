import { powerupRepository } from '../repository/powerup.repository';
import { AppError } from '../../../common/errors/AppError';
import { logger } from '../../../config/logger';

const POWERUP_COSTS: Record<string, number> = {
  streak_freeze: 100,
  double_xp: 150,
  streak_shield: 200,
};

const MILESTONE_REWARDS: { streakDays: number; reward: string }[] = [
  { streakDays: 7, reward: 'streak_freeze' },
  { streakDays: 14, reward: 'double_xp' },
  { streakDays: 30, reward: 'streak_shield' },
];

const POINTS_PER_SOLVE = 10;
const BONUS_WEEKEND_POINTS = 5;

export const powerupService = {
  async getInventory(userId: string) {
    const [inventory, streak] = await Promise.all([
      powerupRepository.getInventory(userId),
      powerupRepository.getStreakExtended(userId),
    ]);
    return {
      powerups: inventory,
      points: streak?.points ?? 0,
      freezeCount: streak?.freeze_count ?? 0,
      lastFreezeUsed: streak?.last_freeze_used,
    };
  },

  async getLog(userId: string) {
    return powerupRepository.getLog(userId);
  },

  async purchasePowerup(userId: string, type: string) {
    const cost = POWERUP_COSTS[type];
    if (!cost) throw AppError.badRequest('Invalid powerup type');

    const spent = await powerupRepository.spendPoints(userId, cost);
    if (!spent) throw AppError.badRequest('Not enough points');

    await powerupRepository.addPowerup(userId, type, 1);
    await powerupRepository.logAction(userId, type, 'earned', `Purchased for ${cost} points`);
    logger.info({ userId, type, cost }, 'Powerup purchased');

    return { success: true, cost };
  },

  async useStreakFreeze(userId: string) {
    const streak = await powerupRepository.getStreakExtended(userId);
    if (!streak) throw AppError.notFound('No streak data found');

    const today = new Date().toISOString().split('T')[0];
    if (streak.last_freeze_used === today) {
      throw AppError.badRequest('Already used a freeze today');
    }

    const used = await powerupRepository.usePowerup(userId, 'streak_freeze');
    if (!used) throw AppError.badRequest('No streak freezes available');

    await powerupRepository.useFreeze(userId);
    await powerupRepository.logAction(userId, 'streak_freeze', 'used', 'Protected streak');
    logger.info({ userId }, 'Streak freeze used');

    return { success: true, message: 'Streak protected for today' };
  },

  async awardSolvePoints(userId: string) {
    const isWeekend = [0, 6].includes(new Date().getDay());
    const points = POINTS_PER_SOLVE + (isWeekend ? BONUS_WEEKEND_POINTS : 0);
    await powerupRepository.addPoints(userId, points);
    await powerupRepository.logAction(userId, 'points', 'earned', `+${points} for solving${isWeekend ? ' (weekend bonus)' : ''}`);
    return points;
  },

  async checkMilestoneRewards(userId: string, currentStreak: number) {
    for (const milestone of MILESTONE_REWARDS) {
      if (currentStreak === milestone.streakDays) {
        await powerupRepository.addPowerup(userId, milestone.reward, 1);
        await powerupRepository.logAction(
          userId, milestone.reward, 'earned',
          `${milestone.streakDays}-day streak milestone`
        );
        logger.info({ userId, streak: milestone.streakDays, reward: milestone.reward }, 'Milestone reward granted');
      }
    }
  },

  async hasActiveShield(userId: string): Promise<boolean> {
    const shield = await powerupRepository.getOne(userId, 'streak_shield');
    return (shield?.quantity ?? 0) > 0;
  },

  async hasActiveDoubleXp(userId: string): Promise<boolean> {
    const dxp = await powerupRepository.getOne(userId, 'double_xp');
    return (dxp?.quantity ?? 0) > 0;
  },

  async useDoubleXp(userId: string): Promise<boolean> {
    return powerupRepository.usePowerup(userId, 'double_xp');
  },

  getPowerupCosts() {
    return POWERUP_COSTS;
  },
};
