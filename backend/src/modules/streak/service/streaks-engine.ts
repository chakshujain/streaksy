/**
 * Streaks Engine — Point multiplier rules for rewarding consistency and group discipline.
 *
 * RULES:
 *
 * 1. BASE POINTS
 *    - 10 points per completed task
 *
 * 2. STREAK MULTIPLIER (consecutive days)
 *    - 1–2 days:  1x (base)
 *    - 3–6 days:  1.5x
 *    - 7–13 days: 2x  (weekly warrior)
 *    - 14–29:     3x  (fortnight fury)
 *    - 30–59:     4x  (monthly master)
 *    - 60–99:     5x  (two-month titan)
 *    - 100+:      7x  (centurion)
 *
 * 3. GROUP DISCIPLINE BONUS
 *    If the user is in a group and the group is disciplined:
 *    - All members active in last 24h:  5x bonus ("Perfect Day")
 *    - ≥80% members active in last 24h: 3x bonus ("Squad Goals")
 *    - ≥60% members active in last 24h: 2x bonus ("Team Effort")
 *    - ≥40% members active in last 24h: 1.5x bonus ("Getting There")
 *    - Below 40%: 1x (no bonus)
 *
 * 4. EARLY BIRD BONUS
 *    - Task completed before 9 AM local time: 1.5x
 *
 * 5. WEEKEND WARRIOR BONUS
 *    - Task completed on Saturday or Sunday: 1.3x
 *
 * 6. COMEBACK BONUS
 *    - If the user previously had a streak > 5 that broke,
 *      and is now starting a new streak: 2x for first 3 days
 *
 * 7. ROADMAP COMPLETION BONUS
 *    - 100 points flat bonus when a roadmap is 100% complete
 *    - If completed ahead of schedule: extra 50 points
 *
 * All multipliers STACK multiplicatively:
 *   finalPoints = basePoints × streakMultiplier × groupBonus × timeBonuses
 *
 * Example: 10 base × 3x (14-day streak) × 5x (perfect group day) × 1.5x (early bird)
 *        = 225 points for ONE task!
 */

import { query, queryOne } from '../../../config/database';
import { redis } from '../../../config/redis';
import { logger } from '../../../config/logger';

const BASE_POINTS = 10;
const ROADMAP_COMPLETION_BONUS = 100;
const AHEAD_OF_SCHEDULE_BONUS = 50;

export interface PointBreakdown {
  basePoints: number;
  streakMultiplier: number;
  groupDisciplineMultiplier: number;
  groupDisciplineLabel: string;
  earlyBirdMultiplier: number;
  weekendWarriorMultiplier: number;
  comebackMultiplier: number;
  totalPoints: number;
  bonuses: string[];
}

/* ── Streak tiers ── */
function getStreakMultiplier(streakDays: number): { multiplier: number; tier: string } {
  if (streakDays >= 100) return { multiplier: 7, tier: 'Centurion' };
  if (streakDays >= 60) return { multiplier: 5, tier: 'Two-Month Titan' };
  if (streakDays >= 30) return { multiplier: 4, tier: 'Monthly Master' };
  if (streakDays >= 14) return { multiplier: 3, tier: 'Fortnight Fury' };
  if (streakDays >= 7) return { multiplier: 2, tier: 'Weekly Warrior' };
  if (streakDays >= 3) return { multiplier: 1.5, tier: 'Getting Warm' };
  return { multiplier: 1, tier: 'Starting Out' };
}

/* ── Group discipline check ── */
async function getGroupDisciplineMultiplier(
  userId: string,
  groupId: string | null
): Promise<{ multiplier: number; label: string; activeRatio: number }> {
  if (!groupId) return { multiplier: 1, label: 'Solo', activeRatio: 0 };

  try {
    // Count total members in group
    const totalResult = await queryOne<{ count: string }>(
      'SELECT COUNT(*)::text AS count FROM group_members WHERE group_id = $1',
      [groupId]
    );
    const totalMembers = parseInt(totalResult?.count || '0', 10);
    if (totalMembers <= 1) return { multiplier: 1, label: 'Solo Group', activeRatio: 1 };

    // Count members who have been active in the last 24 hours
    // "Active" = completed at least one roadmap day progress in last 24h
    const activeResult = await queryOne<{ count: string }>(
      `SELECT COUNT(DISTINCT rdp.user_id)::text AS count
       FROM roadmap_day_progress rdp
       JOIN group_members gm ON gm.user_id = rdp.user_id AND gm.group_id = $1
       WHERE rdp.completed = true
         AND rdp.completed_at >= NOW() - INTERVAL '24 hours'`,
      [groupId]
    );
    const activeMembers = parseInt(activeResult?.count || '0', 10);
    const ratio = activeMembers / totalMembers;

    if (ratio >= 1) return { multiplier: 5, label: 'Perfect Day', activeRatio: ratio };
    if (ratio >= 0.8) return { multiplier: 3, label: 'Squad Goals', activeRatio: ratio };
    if (ratio >= 0.6) return { multiplier: 2, label: 'Team Effort', activeRatio: ratio };
    if (ratio >= 0.4) return { multiplier: 1.5, label: 'Getting There', activeRatio: ratio };
    return { multiplier: 1, label: 'Needs Work', activeRatio: ratio };
  } catch (err) {
    logger.error({ err }, 'Failed to calculate group discipline');
    return { multiplier: 1, label: 'Error', activeRatio: 0 };
  }
}

/* ── Time-based bonuses ── */
function getEarlyBirdMultiplier(completedAt: Date): number {
  const hour = completedAt.getHours();
  return hour < 9 ? 1.5 : 1;
}

function getWeekendWarriorMultiplier(completedAt: Date): number {
  const day = completedAt.getDay();
  return (day === 0 || day === 6) ? 1.3 : 1;
}

/* ── Comeback detection ── */
async function getComebackMultiplier(userId: string, currentStreak: number): Promise<number> {
  if (currentStreak > 3) return 1; // Only applies to first 3 days of a new streak

  try {
    // Check if user previously had a streak > 5 (using global streaks)
    const prev = await queryOne<{ longest_streak: number }>(
      'SELECT longest_streak FROM user_streaks WHERE user_id = $1',
      [userId]
    );
    if (prev && prev.longest_streak > 5 && currentStreak <= 3) {
      return 2; // Comeback bonus!
    }
  } catch { /* ignore */ }
  return 1;
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN ENGINE: Calculate points for a completed task
   ═══════════════════════════════════════════════════════════════════ */
export const streaksEngine = {
  /**
   * Calculate total points earned for completing a roadmap task.
   * Call this from roadmapsService.updateDayProgress when completed=true.
   */
  async calculatePoints(
    userId: string,
    currentStreak: number,
    groupId: string | null,
    completedAt: Date = new Date()
  ): Promise<PointBreakdown> {
    const bonuses: string[] = [];

    // 1. Streak multiplier
    const { multiplier: streakMult, tier } = getStreakMultiplier(currentStreak);
    if (streakMult > 1) bonuses.push(`${tier} (${streakMult}x streak)`);

    // 2. Group discipline
    const group = await getGroupDisciplineMultiplier(userId, groupId);
    if (group.multiplier > 1) bonuses.push(`${group.label} (${group.multiplier}x group)`);

    // 3. Early bird
    const earlyBird = getEarlyBirdMultiplier(completedAt);
    if (earlyBird > 1) bonuses.push('Early Bird (1.5x)');

    // 4. Weekend warrior
    const weekend = getWeekendWarriorMultiplier(completedAt);
    if (weekend > 1) bonuses.push('Weekend Warrior (1.3x)');

    // 5. Comeback
    const comeback = await getComebackMultiplier(userId, currentStreak);
    if (comeback > 1) bonuses.push('Comeback (2x)');

    // Stack all multipliers
    const totalMultiplier = streakMult * group.multiplier * earlyBird * weekend * comeback;
    const totalPoints = Math.round(BASE_POINTS * totalMultiplier);

    return {
      basePoints: BASE_POINTS,
      streakMultiplier: streakMult,
      groupDisciplineMultiplier: group.multiplier,
      groupDisciplineLabel: group.label,
      earlyBirdMultiplier: earlyBird,
      weekendWarriorMultiplier: weekend,
      comebackMultiplier: comeback,
      totalPoints,
      bonuses,
    };
  },

  /**
   * Calculate completion bonus when a roadmap is fully done.
   */
  calculateCompletionBonus(
    completedDays: number,
    totalDays: number,
    startDate: string
  ): { bonus: number; aheadOfSchedule: boolean } {
    let bonus = ROADMAP_COMPLETION_BONUS;
    const start = new Date(startDate);
    const now = new Date();
    const elapsedDays = Math.floor((now.getTime() - start.getTime()) / 86400000);
    const aheadOfSchedule = elapsedDays < totalDays;

    if (aheadOfSchedule) {
      bonus += AHEAD_OF_SCHEDULE_BONUS;
    }

    return { bonus, aheadOfSchedule };
  },

  /**
   * Get the current multiplier info for a user (for display in UI).
   */
  async getMultiplierPreview(
    userId: string,
    groupId: string | null
  ): Promise<{
    streakTier: string;
    streakMultiplier: number;
    groupLabel: string;
    groupMultiplier: number;
    potentialPoints: number;
  }> {
    // Get current global streak
    const streakRow = await queryOne<{ current_streak: number }>(
      'SELECT current_streak FROM user_streaks WHERE user_id = $1',
      [userId]
    );
    const currentStreak = streakRow?.current_streak || 0;
    const { multiplier: streakMult, tier } = getStreakMultiplier(currentStreak);
    const group = await getGroupDisciplineMultiplier(userId, groupId);

    return {
      streakTier: tier,
      streakMultiplier: streakMult,
      groupLabel: group.label,
      groupMultiplier: group.multiplier,
      potentialPoints: Math.round(BASE_POINTS * streakMult * group.multiplier),
    };
  },

  /**
   * Cache multiplier info in Redis for fast dashboard access.
   */
  async cacheMultiplierPreview(userId: string, groupId: string | null): Promise<void> {
    try {
      const preview = await this.getMultiplierPreview(userId, groupId);
      await redis.set(
        `streak_preview:${userId}`,
        JSON.stringify(preview),
        { EX: 3600 } // 1 hour
      );
    } catch { /* non-critical */ }
  },
};
