import { query, queryOne } from '../../../config/database';

export interface DigestLogRow {
  id: string;
  user_id: string;
  digest_type: string;
  sent_at: string;
}

export interface DigestUserRow {
  user_id: string;
  email: string;
  display_name: string;
  digest_enabled: boolean;
  digest_time: string;
  digest_frequency: string;
  evening_reminder: boolean;
  weekly_report: boolean;
}

export interface UserStatsRow {
  current_streak: number;
  longest_streak: number;
  points: number;
  total_solved: number;
  week_solved: number;
  friends_solved_yesterday: number;
}

export const digestRepository = {
  async getDigestUsers(digestType: string): Promise<DigestUserRow[]> {
    if (digestType === 'morning') {
      return query<DigestUserRow>(
        `SELECT u.id AS user_id, u.email, u.display_name,
                COALESCE(p.digest_enabled, true) AS digest_enabled,
                COALESCE(p.digest_time, '08:00') AS digest_time,
                COALESCE(p.digest_frequency, 'daily') AS digest_frequency,
                COALESCE(p.evening_reminder, true) AS evening_reminder,
                COALESCE(p.weekly_report, true) AS weekly_report
         FROM users u
         LEFT JOIN user_preferences p ON p.user_id = u.id
         WHERE COALESCE(p.digest_enabled, true) = true
           AND COALESCE(p.digest_frequency, 'daily') != 'off'`
      );
    }
    if (digestType === 'evening') {
      return query<DigestUserRow>(
        `SELECT u.id AS user_id, u.email, u.display_name,
                COALESCE(p.digest_enabled, true) AS digest_enabled,
                COALESCE(p.digest_time, '08:00') AS digest_time,
                COALESCE(p.digest_frequency, 'daily') AS digest_frequency,
                COALESCE(p.evening_reminder, true) AS evening_reminder,
                COALESCE(p.weekly_report, true) AS weekly_report
         FROM users u
         LEFT JOIN user_preferences p ON p.user_id = u.id
         WHERE COALESCE(p.evening_reminder, true) = true`
      );
    }
    // weekly
    return query<DigestUserRow>(
      `SELECT u.id AS user_id, u.email, u.display_name,
              COALESCE(p.digest_enabled, true) AS digest_enabled,
              COALESCE(p.digest_time, '08:00') AS digest_time,
              COALESCE(p.digest_frequency, 'daily') AS digest_frequency,
              COALESCE(p.evening_reminder, true) AS evening_reminder,
              COALESCE(p.weekly_report, true) AS weekly_report
       FROM users u
       LEFT JOIN user_preferences p ON p.user_id = u.id
       WHERE COALESCE(p.weekly_report, true) = true`
    );
  },

  async getUserStats(userId: string): Promise<UserStatsRow | null> {
    return queryOne<UserStatsRow>(
      `SELECT
         COALESCE(s.current_streak, 0) AS current_streak,
         COALESCE(s.longest_streak, 0) AS longest_streak,
         COALESCE(s.points, 0) AS points,
         (SELECT COUNT(*)::int FROM user_problem_status WHERE user_id = $1 AND status = 'solved') AS total_solved,
         (SELECT COUNT(*)::int FROM user_problem_status WHERE user_id = $1 AND status = 'solved' AND solved_at >= NOW() - INTERVAL '7 days') AS week_solved,
         (SELECT COUNT(DISTINCT ups2.user_id)::int
          FROM user_problem_status ups2
          JOIN group_members gm1 ON gm1.user_id = ups2.user_id
          JOIN group_members gm2 ON gm2.group_id = gm1.group_id AND gm2.user_id = $1
          WHERE ups2.user_id != $1
            AND ups2.status = 'solved'
            AND ups2.solved_at >= NOW() - INTERVAL '1 day') AS friends_solved_yesterday
       FROM user_streaks s
       WHERE s.user_id = $1`,
      [userId]
    );
  },

  async hasNoActivityToday(userId: string): Promise<boolean> {
    const row = await queryOne<{ count: number }>(
      `SELECT COUNT(*)::int AS count FROM user_problem_status
       WHERE user_id = $1 AND status = 'solved' AND solved_at::date = CURRENT_DATE`,
      [userId]
    );
    return (row?.count ?? 0) === 0;
  },

  async logDigest(userId: string, digestType: string): Promise<void> {
    await query(
      'INSERT INTO digest_log (user_id, digest_type) VALUES ($1, $2)',
      [userId, digestType]
    );
  },

  async wasDigestSentToday(userId: string, digestType: string): Promise<boolean> {
    const row = await queryOne<{ count: number }>(
      `SELECT COUNT(*)::int AS count FROM digest_log
       WHERE user_id = $1 AND digest_type = $2 AND sent_at::date = CURRENT_DATE`,
      [userId, digestType]
    );
    return (row?.count ?? 0) > 0;
  },

  async getWeekStats(userId: string) {
    const solvedByDay = await query<{ day: string; count: number }>(
      `SELECT solved_at::date::text AS day, COUNT(*)::int AS count
       FROM user_problem_status
       WHERE user_id = $1 AND status = 'solved' AND solved_at >= NOW() - INTERVAL '7 days'
       GROUP BY solved_at::date ORDER BY day`,
      [userId]
    );
    const difficultyBreakdown = await query<{ difficulty: string; count: number }>(
      `SELECT p.difficulty, COUNT(*)::int AS count
       FROM user_problem_status ups
       JOIN problems p ON p.id = ups.problem_id
       WHERE ups.user_id = $1 AND ups.status = 'solved' AND ups.solved_at >= NOW() - INTERVAL '7 days'
       GROUP BY p.difficulty`,
      [userId]
    );
    return { solvedByDay, difficultyBreakdown };
  },

  async getDigestPreferences(userId: string) {
    return queryOne<DigestUserRow>(
      `SELECT u.id AS user_id, u.email, u.display_name,
              COALESCE(p.digest_enabled, true) AS digest_enabled,
              COALESCE(p.digest_time, '08:00') AS digest_time,
              COALESCE(p.digest_frequency, 'daily') AS digest_frequency,
              COALESCE(p.evening_reminder, true) AS evening_reminder,
              COALESCE(p.weekly_report, true) AS weekly_report
       FROM users u
       LEFT JOIN user_preferences p ON p.user_id = u.id
       WHERE u.id = $1`,
      [userId]
    );
  },

  async updateDigestPreferences(userId: string, prefs: {
    digest_enabled?: boolean;
    digest_time?: string;
    digest_frequency?: string;
    evening_reminder?: boolean;
    weekly_report?: boolean;
  }): Promise<void> {
    const sets: string[] = [];
    const vals: unknown[] = [];
    let i = 2;
    if (prefs.digest_enabled !== undefined) { sets.push(`digest_enabled = $${i++}`); vals.push(prefs.digest_enabled); }
    if (prefs.digest_time !== undefined) { sets.push(`digest_time = $${i++}`); vals.push(prefs.digest_time); }
    if (prefs.digest_frequency !== undefined) { sets.push(`digest_frequency = $${i++}`); vals.push(prefs.digest_frequency); }
    if (prefs.evening_reminder !== undefined) { sets.push(`evening_reminder = $${i++}`); vals.push(prefs.evening_reminder); }
    if (prefs.weekly_report !== undefined) { sets.push(`weekly_report = $${i++}`); vals.push(prefs.weekly_report); }

    if (sets.length === 0) return;

    // Ensure user_preferences row exists before updating
    await query(
      `INSERT INTO user_preferences (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING`,
      [userId]
    );

    await query(
      `UPDATE user_preferences SET ${sets.join(', ')} WHERE user_id = $1`,
      [userId, ...vals]
    );
  },
};
