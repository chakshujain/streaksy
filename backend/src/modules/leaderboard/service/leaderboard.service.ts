import { redis } from '../../../config/redis';
import { query } from '../../../config/database';
import { groupRepository } from '../../group/repository/group.repository';
import { AppError } from '../../../common/errors/AppError';

interface LeaderboardEntry {
  userId: string;
  displayName: string;
  solvedCount: number;
  currentStreak: number;
  score: number;
}

const LEADERBOARD_TTL = 300; // 5 minutes

export const leaderboardService = {
  /**
   * Score = solved_count * 10 + current_streak * 5
   * Weighted so raw problem count matters more, but streaks provide a bonus.
   */
  calculateScore(solvedCount: number, streak: number): number {
    return solvedCount * 10 + streak * 5;
  },

  async updateUserScore(userId: string, groupId: string): Promise<void> {
    const key = `leaderboard:${groupId}`;
    const stats = await query<{ solved_count: string }>(
      `SELECT COUNT(*) as solved_count FROM user_problem_status
       WHERE user_id = $1 AND status = 'solved'`,
      [userId]
    );

    const solvedCount = parseInt(stats[0]?.solved_count || '0', 10);
    const streakData = await redis.get(`streak:${userId}`);
    const streak = streakData ? JSON.parse(streakData).currentStreak : 0;

    const score = this.calculateScore(solvedCount, streak);
    await redis.zAdd(key, { score, value: userId });
    await redis.expire(key, LEADERBOARD_TTL);
  },

  async getGroupLeaderboard(groupId: string, userId: string): Promise<LeaderboardEntry[]> {
    const isMember = await groupRepository.isMember(groupId, userId);
    if (!isMember) throw AppError.forbidden('Not a member of this group');

    const key = `leaderboard:${groupId}`;
    const cached = await redis.zRangeWithScores(key, 0, -1, { REV: true });

    if (cached.length > 0) {
      return this.hydrateLeaderboard(cached);
    }

    // Rebuild from DB
    return this.rebuildGroupLeaderboard(groupId);
  },

  async rebuildGroupLeaderboard(groupId: string): Promise<LeaderboardEntry[]> {
    const rows = await query<{
      user_id: string;
      display_name: string;
      solved_count: string;
      current_streak: string;
    }>(
      `SELECT u.id as user_id, u.display_name,
              COUNT(ups.problem_id) FILTER (WHERE ups.status = 'solved') as solved_count,
              COALESCE(us.current_streak, 0) as current_streak
       FROM group_members gm
       JOIN users u ON u.id = gm.user_id
       LEFT JOIN user_problem_status ups ON ups.user_id = u.id
       LEFT JOIN user_streaks us ON us.user_id = u.id
       WHERE gm.group_id = $1
       GROUP BY u.id, u.display_name, us.current_streak
       ORDER BY COUNT(ups.problem_id) FILTER (WHERE ups.status = 'solved') DESC`,
      [groupId]
    );

    const key = `leaderboard:${groupId}`;
    const entries: LeaderboardEntry[] = [];

    for (const row of rows) {
      const solvedCount = parseInt(row.solved_count, 10);
      const currentStreak = parseInt(row.current_streak as string, 10);
      const score = this.calculateScore(solvedCount, currentStreak);

      await redis.zAdd(key, { score, value: row.user_id });

      entries.push({
        userId: row.user_id,
        displayName: row.display_name,
        solvedCount,
        currentStreak,
        score,
      });
    }

    await redis.expire(key, LEADERBOARD_TTL);
    return entries;
  },

  async hydrateLeaderboard(
    cached: { score: number; value: string }[]
  ): Promise<LeaderboardEntry[]> {
    if (cached.length === 0) return [];

    const userIds = cached.map((c) => c.value);
    const users = await query<{ id: string; display_name: string }>(
      `SELECT id, display_name FROM users WHERE id = ANY($1)`,
      [userIds]
    );
    const userMap = new Map(users.map((u) => [u.id, u.display_name]));

    return cached.map((c) => {
      const streakStr = 0; // Approximate; full data from score decomposition isn't exact
      return {
        userId: c.value,
        displayName: userMap.get(c.value) || 'Unknown',
        solvedCount: Math.floor(c.score / 10), // Approximate
        currentStreak: streakStr,
        score: c.score,
      };
    });
  },
};
