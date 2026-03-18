import { streakRepository } from '../repository/streak.repository';
import { redis } from '../../../config/redis';

export const streakService = {
  /**
   * Updates streak after a problem is solved.
   * Logic:
   * - If last_solve_date is today → no change (already counted)
   * - If last_solve_date is yesterday → increment streak
   * - Otherwise → reset to 1
   */
  async recordSolve(userId: string): Promise<{ currentStreak: number; longestStreak: number }> {
    const today = new Date().toISOString().split('T')[0];
    const streak = await streakRepository.get(userId);

    let currentStreak: number;
    let longestStreak: number;

    if (!streak) {
      currentStreak = 1;
      longestStreak = 1;
    } else if (streak.last_solve_date === today) {
      // Already solved today, no change
      return {
        currentStreak: streak.current_streak,
        longestStreak: streak.longest_streak,
      };
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (streak.last_solve_date === yesterdayStr) {
        currentStreak = streak.current_streak + 1;
      } else {
        currentStreak = 1; // streak broken
      }
      longestStreak = Math.max(currentStreak, streak.longest_streak);
    }

    await streakRepository.upsert(userId, currentStreak, longestStreak, today);

    // Cache in Redis for fast leaderboard access
    await redis.set(`streak:${userId}`, JSON.stringify({ currentStreak, longestStreak }), {
      EX: 86400, // 24 hours
    });

    return { currentStreak, longestStreak };
  },

  async getStreak(userId: string): Promise<{ currentStreak: number; longestStreak: number }> {
    // Try cache first
    const cached = await redis.get(`streak:${userId}`);
    if (cached) return JSON.parse(cached);

    const streak = await streakRepository.get(userId);
    if (!streak) return { currentStreak: 0, longestStreak: 0 };

    // Check if streak is still active (last solve was today or yesterday)
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const isActive = streak.last_solve_date === today || streak.last_solve_date === yesterdayStr;

    const result = {
      currentStreak: isActive ? streak.current_streak : 0,
      longestStreak: streak.longest_streak,
    };

    await redis.set(`streak:${userId}`, JSON.stringify(result), { EX: 86400 });
    return result;
  },
};
