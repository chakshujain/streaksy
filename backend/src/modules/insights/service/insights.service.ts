import { insightsRepository } from '../repository/insights.repository';
import { cached } from '../../../common/utils/cache';
import { generateDashboardInsight } from '../../ai/service/ai.service';
import { checkAIRateLimit } from '../../../common/utils/aiRateLimit';
import { env } from '../../../config/env';
import { AppError } from '../../../common/errors/AppError';
import { query } from '../../../config/database';

export const insightsService = {
  async getOverview(userId: string) {
    return cached(`insights:overview:${userId}`, 300, () => this._getOverviewUncached(userId));
  },

  async _getOverviewUncached(userId: string) {
    const [overview, streak, activeDays] = await Promise.all([
      insightsRepository.getOverview(userId),
      insightsRepository.getStreak(userId),
      insightsRepository.getActiveDays(userId),
    ]);

    const totalSolved = Number(overview.total_solved);
    const easyCount = Number(overview.easy_count);
    const mediumCount = Number(overview.medium_count);
    const hardCount = Number(overview.hard_count);

    return {
      totalSolved,
      solveRateByDifficulty: {
        easy: {
          count: easyCount,
          percentage: totalSolved > 0 ? Math.round((easyCount / totalSolved) * 100) : 0,
        },
        medium: {
          count: mediumCount,
          percentage: totalSolved > 0 ? Math.round((mediumCount / totalSolved) * 100) : 0,
        },
        hard: {
          count: hardCount,
          percentage: totalSolved > 0 ? Math.round((hardCount / totalSolved) * 100) : 0,
        },
      },
      currentStreak: streak.current_streak,
      longestStreak: streak.longest_streak,
      totalActiveDays: activeDays,
    };
  },

  async getWeekly(userId: string) {
    const rows = await insightsRepository.getWeekly(userId);
    return rows.map((r) => ({
      weekStart: r.week_start,
      count: Number(r.count),
    }));
  },

  async getTagStats(userId: string) {
    const rows = await insightsRepository.getTagStats(userId);
    return rows.map((r) => ({
      tagName: r.tag_name,
      solvedCount: Number(r.solved_count),
      totalCount: Number(r.total_count),
    }));
  },

  async getDifficultyTrend(userId: string) {
    const rows = await insightsRepository.getDifficultyTrend(userId);
    return rows.map((r) => ({
      month: r.month,
      easy: Number(r.easy),
      medium: Number(r.medium),
      hard: Number(r.hard),
    }));
  },

  async getAICoachTip(userId: string) {
    if (!env.ai.apiKey) {
      throw new AppError(503, 'AI generation is not available. NVIDIA_API_KEY is not configured.');
    }

    await checkAIRateLimit(userId);

    const overview = await this._getOverviewUncached(userId);
    const tagStats = await insightsRepository.getTagStats(userId);

    // Find weak tags (lowest solve rate with at least some problems)
    const weakTags = tagStats
      .filter(t => Number(t.total_count) >= 3)
      .sort((a, b) => (Number(a.solved_count) / Number(a.total_count)) - (Number(b.solved_count) / Number(b.total_count)))
      .slice(0, 3)
      .map(t => t.tag_name);

    // Count active roadmaps
    const roadmapRows = await query<{ count: string }>(
      `SELECT COUNT(*) as count FROM user_roadmaps WHERE user_id = $1 AND status = 'active'`,
      [userId]
    );
    const activeRoadmaps = Number(roadmapRows[0]?.count || 0);

    const tip = await generateDashboardInsight({
      totalSolved: overview.totalSolved,
      easy: overview.solveRateByDifficulty.easy.count,
      medium: overview.solveRateByDifficulty.medium.count,
      hard: overview.solveRateByDifficulty.hard.count,
      currentStreak: overview.currentStreak,
      weakTags,
      activeRoadmaps,
    });

    if (!tip) {
      throw new AppError(502, 'AI service failed to generate coach tip. Please try again later.');
    }

    return tip;
  },
};
