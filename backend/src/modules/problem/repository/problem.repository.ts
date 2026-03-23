import { query, queryOne } from '../../../config/database';

export interface ProblemRow {
  id: string;
  title: string;
  slug: string;
  difficulty: string;
  url: string | null;
  youtube_url: string | null;
  video_title: string | null;
  created_at: Date;
}

export interface SheetRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export const problemRepository = {
  async findBySlug(slug: string): Promise<ProblemRow | null> {
    return queryOne<ProblemRow>('SELECT * FROM problems WHERE slug = $1', [slug]);
  },

  async findById(id: string): Promise<ProblemRow | null> {
    return queryOne<ProblemRow>('SELECT * FROM problems WHERE id = $1', [id]);
  },

  async list(difficulty?: string, limit = 50, offset = 0, tag?: string): Promise<ProblemRow[]> {
    const conditions: string[] = [];
    const params: unknown[] = [];
    let i = 1;

    if (difficulty) {
      conditions.push(`p.difficulty = $${i++}`);
      params.push(difficulty);
    }
    if (tag) {
      conditions.push(`EXISTS (SELECT 1 FROM problem_tags pt JOIN tags t ON t.id = pt.tag_id WHERE pt.problem_id = p.id AND t.name = $${i++})`);
      params.push(tag);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    params.push(limit, offset);

    return query<ProblemRow>(
      `SELECT p.* FROM problems p ${where} ORDER BY p.title LIMIT $${i++} OFFSET $${i++}`,
      params
    );
  },

  async count(difficulty?: string, tag?: string): Promise<number> {
    const conditions: string[] = [];
    const params: unknown[] = [];
    let i = 1;

    if (difficulty) {
      conditions.push(`p.difficulty = $${i++}`);
      params.push(difficulty);
    }
    if (tag) {
      conditions.push(`EXISTS (SELECT 1 FROM problem_tags pt JOIN tags t ON t.id = pt.tag_id WHERE pt.problem_id = p.id AND t.name = $${i++})`);
      params.push(tag);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const row = await queryOne<{ count: string }>(`SELECT COUNT(*) as count FROM problems p ${where}`, params);
    return Number(row?.count || 0);
  },

  async getAllTags(): Promise<{ name: string; count: number }[]> {
    return query<{ name: string; count: number }>(
      `SELECT t.name, COUNT(pt.problem_id)::int as count
       FROM tags t
       JOIN problem_tags pt ON pt.tag_id = t.id
       GROUP BY t.name
       ORDER BY t.name`
    );
  },

  async getSheets(): Promise<SheetRow[]> {
    return query<SheetRow>('SELECT * FROM sheets ORDER BY name');
  },

  async getSheetProblems(sheetSlug: string): Promise<ProblemRow[]> {
    return query<ProblemRow>(
      `SELECT p.* FROM problems p
       JOIN sheet_problems sp ON sp.problem_id = p.id
       JOIN sheets s ON s.id = sp.sheet_id
       WHERE s.slug = $1
       ORDER BY sp.position`,
      [sheetSlug]
    );
  },

  async getTagsForProblem(problemId: string): Promise<{ id: string; name: string }[]> {
    return query(
      `SELECT t.id, t.name FROM tags t
       JOIN problem_tags pt ON pt.tag_id = t.id
       WHERE pt.problem_id = $1`,
      [problemId]
    );
  },

  async search(q: string, limit = 20): Promise<ProblemRow[]> {
    return query<ProblemRow>(
      `SELECT *, ts_rank(search_vector, plainto_tsquery('english', $1)) as rank
       FROM problems
       WHERE search_vector @@ plainto_tsquery('english', $1)
       ORDER BY rank DESC LIMIT $2`,
      [q, limit]
    );
  },
};
