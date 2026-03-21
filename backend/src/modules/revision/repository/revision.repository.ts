import { query, queryOne } from '../../../config/database';

export interface RevisionRow {
  id: string;
  user_id: string;
  problem_id: string;
  key_takeaway: string;
  approach: string | null;
  time_complexity: string | null;
  space_complexity: string | null;
  tags: string[];
  difficulty_rating: string | null;
  intuition: string | null;
  points_to_remember: string[] | null;
  ai_generated: boolean;
  last_revised_at: Date | null;
  revision_count: number;
  created_at: Date;
  updated_at: Date;
  problem_title?: string;
  problem_slug?: string;
  problem_difficulty?: string;
}

export const revisionRepository = {
  async createOrUpdate(
    userId: string,
    problemId: string,
    data: {
      keyTakeaway: string;
      approach?: string;
      timeComplexity?: string;
      spaceComplexity?: string;
      tags?: string[];
      difficultyRating?: string;
      intuition?: string;
      pointsToRemember?: string[];
      aiGenerated?: boolean;
    }
  ): Promise<RevisionRow> {
    const rows = await query<RevisionRow>(
      `INSERT INTO revision_notes (user_id, problem_id, key_takeaway, approach, time_complexity, space_complexity, tags, difficulty_rating, intuition, points_to_remember, ai_generated)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (user_id, problem_id) DO UPDATE SET
         key_takeaway = $3, approach = $4, time_complexity = $5, space_complexity = $6,
         tags = $7, difficulty_rating = $8, intuition = $9, points_to_remember = $10, ai_generated = $11
       RETURNING *`,
      [userId, problemId, data.keyTakeaway, data.approach || null, data.timeComplexity || null,
       data.spaceComplexity || null, data.tags || [], data.difficultyRating || null,
       data.intuition || null, data.pointsToRemember || null, data.aiGenerated || false]
    );
    return rows[0];
  },

  async getForUser(userId: string, filters?: { tag?: string; difficulty?: string; limit?: number; offset?: number }): Promise<RevisionRow[]> {
    const conditions = ['rn.user_id = $1'];
    const params: unknown[] = [userId];
    let paramIdx = 2;

    if (filters?.tag) {
      conditions.push(`$${paramIdx} = ANY(rn.tags)`);
      params.push(filters.tag);
      paramIdx++;
    }
    if (filters?.difficulty) {
      conditions.push(`p.difficulty = $${paramIdx}`);
      params.push(filters.difficulty);
      paramIdx++;
    }

    const limit = filters?.limit || 50;
    const offset = filters?.offset || 0;
    params.push(limit, offset);

    return query<RevisionRow>(
      `SELECT rn.*, p.title as problem_title, p.slug as problem_slug, p.difficulty as problem_difficulty
       FROM revision_notes rn
       JOIN problems p ON p.id = rn.problem_id
       WHERE ${conditions.join(' AND ')}
       ORDER BY rn.last_revised_at ASC NULLS FIRST, rn.created_at DESC
       LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
      params
    );
  },

  async getRandomForRevision(userId: string, count = 10): Promise<RevisionRow[]> {
    return query<RevisionRow>(
      `SELECT rn.*, p.title as problem_title, p.slug as problem_slug, p.difficulty as problem_difficulty
       FROM revision_notes rn
       JOIN problems p ON p.id = rn.problem_id
       WHERE rn.user_id = $1
       ORDER BY rn.last_revised_at ASC NULLS FIRST, RANDOM()
       LIMIT $2`,
      [userId, count]
    );
  },

  async getByProblem(userId: string, problemId: string): Promise<RevisionRow | null> {
    return queryOne<RevisionRow>(
      `SELECT rn.*, p.title as problem_title, p.slug as problem_slug, p.difficulty as problem_difficulty
       FROM revision_notes rn
       JOIN problems p ON p.id = rn.problem_id
       WHERE rn.user_id = $1 AND rn.problem_id = $2`,
      [userId, problemId]
    );
  },

  async markRevised(id: string, userId: string): Promise<void> {
    await query(
      `UPDATE revision_notes SET last_revised_at = NOW(), revision_count = revision_count + 1
       WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
  },

  async delete(id: string, userId: string): Promise<void> {
    await query('DELETE FROM revision_notes WHERE id = $1 AND user_id = $2', [id, userId]);
  },

  async findById(id: string): Promise<RevisionRow | null> {
    return queryOne<RevisionRow>('SELECT * FROM revision_notes WHERE id = $1', [id]);
  },
};
