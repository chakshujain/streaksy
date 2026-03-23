import { query, queryOne } from '../../../config/database';
import { ProblemStatus } from '../../../common/types';

export interface ProgressRow {
  user_id: string;
  problem_id: string;
  status: ProblemStatus;
  solved_at: Date | null;
  updated_at: Date;
}

export const progressRepository = {
  async upsert(userId: string, problemId: string, status: ProblemStatus): Promise<ProgressRow> {
    if (status === 'not_started') {
      await query('DELETE FROM user_problem_status WHERE user_id = $1 AND problem_id = $2', [userId, problemId]);
      return { user_id: userId, problem_id: problemId, status: 'not_started', solved_at: null, updated_at: new Date() };
    }
    const rows = await query<ProgressRow>(
      `INSERT INTO user_problem_status (user_id, problem_id, status, solved_at)
       VALUES ($1, $2, $3, CASE WHEN $3 = 'solved' THEN NOW() ELSE NULL END)
       ON CONFLICT (user_id, problem_id) DO UPDATE SET
         status = EXCLUDED.status,
         solved_at = CASE WHEN EXCLUDED.status = 'solved' THEN NOW()
                         ELSE NULL END
       RETURNING *`,
      [userId, problemId, status]
    );
    return rows[0];
  },

  async getUserProgress(userId: string): Promise<ProgressRow[]> {
    return query<ProgressRow>(
      `SELECT * FROM user_problem_status WHERE user_id = $1 ORDER BY updated_at DESC`,
      [userId]
    );
  },

  async getUserProgressForSheet(userId: string, sheetSlug: string) {
    return query(
      `SELECT p.slug, p.title, p.difficulty, COALESCE(ups.status, 'not_started') as status, ups.solved_at
       FROM problems p
       JOIN sheet_problems sp ON sp.problem_id = p.id
       JOIN sheets s ON s.id = sp.sheet_id
       LEFT JOIN user_problem_status ups ON ups.problem_id = p.id AND ups.user_id = $1
       WHERE s.slug = $2
       ORDER BY sp.position`,
      [userId, sheetSlug]
    );
  },

  async getSolvedCountToday(userId: string): Promise<number> {
    const row = await queryOne<{ count: string }>(
      `SELECT COUNT(*) as count FROM user_problem_status
       WHERE user_id = $1 AND status = 'solved'
       AND solved_at::date = CURRENT_DATE`,
      [userId]
    );
    return parseInt(row?.count || '0', 10);
  },

  async getTotalSolvedCount(userId: string): Promise<number> {
    const row = await queryOne<{ count: string }>(
      `SELECT COUNT(*) as count FROM user_problem_status
       WHERE user_id = $1 AND status = 'solved'`,
      [userId]
    );
    return parseInt(row?.count || '0', 10);
  },
};
