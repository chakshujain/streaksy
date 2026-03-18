import { query, queryOne } from '../../../config/database';

export interface OverviewRow {
  total_solved: number;
  easy_count: number;
  medium_count: number;
  hard_count: number;
}

export interface WeeklyRow {
  week_start: string;
  count: number;
}

export interface TagStatsRow {
  tag_name: string;
  solved_count: number;
  total_count: number;
}

export interface DifficultyTrendRow {
  month: string;
  easy: number;
  medium: number;
  hard: number;
}

export interface StreakRow {
  current_streak: number;
  longest_streak: number;
}

export interface ActiveDaysRow {
  total_active_days: number;
}

export const insightsRepository = {
  async getOverview(userId: string): Promise<OverviewRow> {
    const row = await queryOne<OverviewRow>(
      `SELECT
        COUNT(*) FILTER (WHERE status = 'solved') AS total_solved,
        COUNT(*) FILTER (WHERE status = 'solved' AND p.difficulty = 'easy') AS easy_count,
        COUNT(*) FILTER (WHERE status = 'solved' AND p.difficulty = 'medium') AS medium_count,
        COUNT(*) FILTER (WHERE status = 'solved' AND p.difficulty = 'hard') AS hard_count
      FROM user_problem_status ups
      JOIN problems p ON p.id = ups.problem_id
      WHERE ups.user_id = $1`,
      [userId]
    );
    return row ?? { total_solved: 0, easy_count: 0, medium_count: 0, hard_count: 0 };
  },

  async getStreak(userId: string): Promise<StreakRow> {
    const row = await queryOne<StreakRow>(
      `SELECT current_streak, longest_streak FROM user_streaks WHERE user_id = $1`,
      [userId]
    );
    return row ?? { current_streak: 0, longest_streak: 0 };
  },

  async getActiveDays(userId: string): Promise<number> {
    const row = await queryOne<ActiveDaysRow>(
      `SELECT COUNT(DISTINCT DATE(solved_at)) AS total_active_days
       FROM user_problem_status
       WHERE user_id = $1 AND status = 'solved' AND solved_at IS NOT NULL`,
      [userId]
    );
    return row?.total_active_days ?? 0;
  },

  async getWeekly(userId: string): Promise<WeeklyRow[]> {
    return query<WeeklyRow>(
      `SELECT
        DATE_TRUNC('week', solved_at)::date AS week_start,
        COUNT(*) AS count
      FROM user_problem_status
      WHERE user_id = $1
        AND status = 'solved'
        AND solved_at >= NOW() - INTERVAL '12 weeks'
      GROUP BY week_start
      ORDER BY week_start`,
      [userId]
    );
  },

  async getTagStats(userId: string): Promise<TagStatsRow[]> {
    return query<TagStatsRow>(
      `SELECT
        t.name AS tag_name,
        COUNT(*) FILTER (WHERE ups.status = 'solved') AS solved_count,
        COUNT(*) AS total_count
      FROM tags t
      JOIN problem_tags pt ON pt.tag_id = t.id
      LEFT JOIN user_problem_status ups ON ups.problem_id = pt.problem_id AND ups.user_id = $1
      GROUP BY t.name
      ORDER BY solved_count DESC`,
      [userId]
    );
  },

  async getDifficultyTrend(userId: string): Promise<DifficultyTrendRow[]> {
    return query<DifficultyTrendRow>(
      `SELECT
        TO_CHAR(DATE_TRUNC('month', ups.solved_at), 'YYYY-MM') AS month,
        COUNT(*) FILTER (WHERE p.difficulty = 'easy') AS easy,
        COUNT(*) FILTER (WHERE p.difficulty = 'medium') AS medium,
        COUNT(*) FILTER (WHERE p.difficulty = 'hard') AS hard
      FROM user_problem_status ups
      JOIN problems p ON p.id = ups.problem_id
      WHERE ups.user_id = $1
        AND ups.status = 'solved'
        AND ups.solved_at >= NOW() - INTERVAL '6 months'
      GROUP BY month
      ORDER BY month`,
      [userId]
    );
  },
};
