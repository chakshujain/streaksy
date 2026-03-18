import { query, queryOne } from '../../../config/database';

interface StreakRow {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_solve_date: string | null;
}

export const streakRepository = {
  async get(userId: string): Promise<StreakRow | null> {
    return queryOne<StreakRow>('SELECT * FROM user_streaks WHERE user_id = $1', [userId]);
  },

  async upsert(userId: string, currentStreak: number, longestStreak: number, lastSolveDate: string): Promise<void> {
    await query(
      `INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_solve_date)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id) DO UPDATE SET
         current_streak = $2,
         longest_streak = $3,
         last_solve_date = $4`,
      [userId, currentStreak, longestStreak, lastSolveDate]
    );
  },
};
