import { badgeRepository } from '../repository/badge.repository';
import { query } from '../../../config/database';
import { logger } from '../../../config/logger';

export const badgeService = {
  async getAll() {
    return badgeRepository.getAll();
  },

  async getUserBadges(userId: string) {
    return badgeRepository.getUserBadges(userId);
  },

  /**
   * Check and award badges after a solve event.
   * Runs async — failures don't block the main flow.
   */
  async checkAndAward(userId: string): Promise<string[]> {
    const awarded: string[] = [];

    try {
      const badges = await badgeRepository.getAll();

      // Get user stats
      const solveCountRow = await query<{ count: string }>(
        "SELECT COUNT(*) as count FROM user_problem_status WHERE user_id = $1 AND status = 'solved'",
        [userId]
      );
      const solveCount = Number(solveCountRow[0]?.count || 0);

      const streakRow = await query<{ current_streak: number }>(
        'SELECT current_streak FROM user_streaks WHERE user_id = $1',
        [userId]
      );
      const currentStreak = streakRow[0]?.current_streak || 0;

      const diffCounts = await query<{ difficulty: string; count: string }>(
        `SELECT p.difficulty, COUNT(*) as count
         FROM user_problem_status ups
         JOIN problems p ON p.id = ups.problem_id
         WHERE ups.user_id = $1 AND ups.status = 'solved'
         GROUP BY p.difficulty`,
        [userId]
      );
      const diffMap: Record<string, number> = {};
      for (const d of diffCounts) {
        diffMap[d.difficulty] = Number(d.count);
      }

      const revisionCountRow = await query<{ count: string }>(
        'SELECT COUNT(*) as count FROM revision_notes WHERE user_id = $1',
        [userId]
      );
      const revisionCount = Number(revisionCountRow[0]?.count || 0);

      // Batch fetch all earned badges to avoid N+1 queries
      const earnedBadges = await badgeRepository.getUserBadges(userId);
      const earnedIds = new Set(earnedBadges.map(b => b.badge_id));

      for (const badge of badges) {
        if (earnedIds.has(badge.id)) continue;

        const criteria = badge.criteria as any;
        let earned = false;

        if (criteria.solveCount && solveCount >= criteria.solveCount) earned = true;
        if (criteria.streakDays && currentStreak >= criteria.streakDays) earned = true;
        if (criteria.difficulty && criteria.count) {
          if ((diffMap[criteria.difficulty] || 0) >= criteria.count) earned = true;
        }
        if (criteria.revisionCount && revisionCount >= criteria.revisionCount) earned = true;

        if (earned) {
          await badgeRepository.award(userId, badge.id);
          awarded.push(badge.name);

          // Post feed event for badge earned
          import('../../feed/service/feed.service').then(m => {
            m.feedService.postEvent(userId, 'badge_earned', `Earned the "${badge.name}" badge`, undefined, { badgeId: badge.id, badgeName: badge.name });
          }).catch(() => {});
        }
      }
    } catch (err) {
      logger.error({ err, userId }, 'Failed to check badges');
    }

    return awarded;
  },
};
