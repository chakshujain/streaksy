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

  async list(difficulty?: string, limit = 50, offset = 0): Promise<ProblemRow[]> {
    if (difficulty) {
      return query<ProblemRow>(
        'SELECT * FROM problems WHERE difficulty = $1 ORDER BY title LIMIT $2 OFFSET $3',
        [difficulty, limit, offset]
      );
    }
    return query<ProblemRow>(
      'SELECT * FROM problems ORDER BY title LIMIT $1 OFFSET $2',
      [limit, offset]
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
