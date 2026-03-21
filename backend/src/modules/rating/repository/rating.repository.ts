import { query, queryOne } from '../../../config/database';

export interface RatingRow {
  user_id: string;
  problem_id: string;
  difficulty_rating: number;
  created_at: string;
  updated_at: string;
}

export interface RatingStatsRow {
  problem_id: string;
  avg_rating: number;
  rating_count: number;
}

export interface CompanyTagRow {
  id: string;
  name: string;
}

export interface ProblemCompanyRow {
  problem_id: string;
  company_tag_id: string;
  company_name: string;
  report_count: number;
}

export const ratingRepository = {
  async upsert(userId: string, problemId: string, rating: number): Promise<RatingRow> {
    const rows = await query<RatingRow>(
      `INSERT INTO problem_ratings (user_id, problem_id, difficulty_rating)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, problem_id) DO UPDATE SET
         difficulty_rating = $3, updated_at = NOW()
       RETURNING *`,
      [userId, problemId, rating]
    );
    return rows[0];
  },

  async getUserRating(userId: string, problemId: string): Promise<RatingRow | null> {
    return queryOne<RatingRow>(
      'SELECT * FROM problem_ratings WHERE user_id = $1 AND problem_id = $2',
      [userId, problemId]
    );
  },

  async getStats(problemId: string): Promise<RatingStatsRow | null> {
    return queryOne<RatingStatsRow>(
      `SELECT problem_id,
              ROUND(AVG(difficulty_rating)::numeric, 1)::float AS avg_rating,
              COUNT(*)::int AS rating_count
       FROM problem_ratings WHERE problem_id = $1
       GROUP BY problem_id`,
      [problemId]
    );
  },

  async getStatsMultiple(problemIds: string[]): Promise<RatingStatsRow[]> {
    if (problemIds.length === 0) return [];
    const placeholders = problemIds.map((_, i) => `$${i + 1}`).join(',');
    return query<RatingStatsRow>(
      `SELECT problem_id,
              ROUND(AVG(difficulty_rating)::numeric, 1)::float AS avg_rating,
              COUNT(*)::int AS rating_count
       FROM problem_ratings WHERE problem_id IN (${placeholders})
       GROUP BY problem_id`,
      problemIds
    );
  },

  async getRatingDistribution(problemId: string): Promise<{ rating: number; count: number }[]> {
    return query<{ rating: number; count: number }>(
      `SELECT difficulty_rating AS rating, COUNT(*)::int AS count
       FROM problem_ratings WHERE problem_id = $1
       GROUP BY difficulty_rating ORDER BY difficulty_rating`,
      [problemId]
    );
  },

  async listCompanyTags(): Promise<CompanyTagRow[]> {
    return query<CompanyTagRow>('SELECT * FROM company_tags ORDER BY name');
  },

  async getCompanyTagsForProblem(problemId: string): Promise<ProblemCompanyRow[]> {
    return query<ProblemCompanyRow>(
      `SELECT pct.problem_id, pct.company_tag_id, ct.name AS company_name, pct.report_count
       FROM problem_company_tags pct
       JOIN company_tags ct ON ct.id = pct.company_tag_id
       WHERE pct.problem_id = $1
       ORDER BY pct.report_count DESC`,
      [problemId]
    );
  },

  async reportCompanyTag(problemId: string, companyTagId: string, userId: string): Promise<void> {
    await query(
      `INSERT INTO problem_company_tags (problem_id, company_tag_id, reported_by, report_count)
       VALUES ($1, $2, $3, 1)
       ON CONFLICT (problem_id, company_tag_id) DO UPDATE SET
         report_count = problem_company_tags.report_count + 1`,
      [problemId, companyTagId, userId]
    );
  },
};
