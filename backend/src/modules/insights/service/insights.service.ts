import { insightsRepository } from '../repository/insights.repository';

export const insightsService = {
  async getOverview(userId: string) {
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
};
