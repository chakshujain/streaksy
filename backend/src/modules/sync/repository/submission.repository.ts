import { query, queryOne } from '../../../config/database';

export interface SubmissionRow {
  id: string;
  user_id: string;
  problem_id: string;
  status: string;
  language: string;
  code: string | null;
  runtime_ms: number | null;
  runtime_percentile: number | null;
  memory_kb: number | null;
  memory_percentile: number | null;
  time_spent_seconds: number | null;
  leetcode_submission_id: string | null;
  submitted_at: Date;
  created_at: Date;
}

export const submissionRepository = {
  async create(data: {
    userId: string;
    problemId: string;
    status: string;
    language: string;
    code?: string;
    runtimeMs?: number;
    runtimePercentile?: number;
    memoryKb?: number;
    memoryPercentile?: number;
    timeSpentSeconds?: number;
    leetcodeSubmissionId?: string;
  }): Promise<SubmissionRow> {
    const rows = await query<SubmissionRow>(
      `INSERT INTO submissions (user_id, problem_id, status, language, code, runtime_ms, runtime_percentile, memory_kb, memory_percentile, time_spent_seconds, leetcode_submission_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [data.userId, data.problemId, data.status, data.language, data.code || null,
       data.runtimeMs || null, data.runtimePercentile || null, data.memoryKb || null,
       data.memoryPercentile || null, data.timeSpentSeconds || null, data.leetcodeSubmissionId || null]
    );
    return rows[0];
  },

  async findByLeetcodeId(leetcodeSubmissionId: string): Promise<SubmissionRow | null> {
    return queryOne<SubmissionRow>(
      'SELECT * FROM submissions WHERE leetcode_submission_id = $1',
      [leetcodeSubmissionId]
    );
  },

  async getForUser(userId: string, limit = 20, offset = 0): Promise<SubmissionRow[]> {
    return query<SubmissionRow>(
      `SELECT s.*, p.title as problem_title, p.slug as problem_slug, p.difficulty as problem_difficulty
       FROM submissions s
       JOIN problems p ON p.id = s.problem_id
       WHERE s.user_id = $1
       ORDER BY s.submitted_at DESC LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
  },

  async getForProblem(userId: string, problemId: string): Promise<SubmissionRow[]> {
    return query<SubmissionRow>(
      'SELECT * FROM submissions WHERE user_id = $1 AND problem_id = $2 ORDER BY submitted_at DESC',
      [userId, problemId]
    );
  },

  async getPeerSolutions(problemId: string, excludeUserId: string, limit = 10): Promise<any[]> {
    return query(
      `SELECT s.id, s.language, s.code, s.runtime_ms, s.runtime_percentile, s.memory_kb, s.memory_percentile,
              s.submitted_at, u.display_name, u.id as user_id
       FROM submissions s
       JOIN users u ON u.id = s.user_id
       WHERE s.problem_id = $1 AND s.user_id != $2 AND s.status = 'Accepted' AND s.code IS NOT NULL
       ORDER BY s.runtime_ms ASC NULLS LAST
       LIMIT $3`,
      [problemId, excludeUserId, limit]
    );
  },

  async getStats(userId: string): Promise<{
    totalSubmissions: number;
    acceptedSubmissions: number;
    avgRuntime: number | null;
    avgMemory: number | null;
    languages: { language: string; count: number }[];
    avgTimeSpent: number | null;
  }> {
    const total = await queryOne<{ count: string }>(
      'SELECT COUNT(*) as count FROM submissions WHERE user_id = $1',
      [userId]
    );
    const accepted = await queryOne<{ count: string }>(
      "SELECT COUNT(*) as count FROM submissions WHERE user_id = $1 AND status = 'Accepted'",
      [userId]
    );
    const avgPerf = await queryOne<{ avg_runtime: string; avg_memory: string; avg_time: string }>(
      `SELECT AVG(runtime_ms) as avg_runtime, AVG(memory_kb) as avg_memory, AVG(time_spent_seconds) as avg_time
       FROM submissions WHERE user_id = $1 AND status = 'Accepted'`,
      [userId]
    );
    const langs = await query<{ language: string; count: string }>(
      `SELECT language, COUNT(*)::int as count FROM submissions
       WHERE user_id = $1 AND status = 'Accepted'
       GROUP BY language ORDER BY count DESC`,
      [userId]
    );

    return {
      totalSubmissions: Number(total?.count || 0),
      acceptedSubmissions: Number(accepted?.count || 0),
      avgRuntime: avgPerf?.avg_runtime ? Math.round(Number(avgPerf.avg_runtime)) : null,
      avgMemory: avgPerf?.avg_memory ? Math.round(Number(avgPerf.avg_memory)) : null,
      avgTimeSpent: avgPerf?.avg_time ? Math.round(Number(avgPerf.avg_time)) : null,
      languages: langs.map(l => ({ language: l.language, count: Number(l.count) })),
    };
  },
};
