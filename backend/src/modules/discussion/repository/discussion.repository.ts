import { query, queryOne } from '../../../config/database';

export interface CommentRow {
  id: string;
  problem_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  created_at: Date;
  updated_at: Date;
  display_name?: string;
}

export const discussionRepository = {
  async create(problemId: string, userId: string, content: string, parentId?: string): Promise<CommentRow> {
    const rows = await query<CommentRow>(
      `INSERT INTO comments (problem_id, user_id, content, parent_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [problemId, userId, content, parentId || null]
    );
    return rows[0];
  },

  async getForProblem(problemId: string, limit = 50, offset = 0): Promise<CommentRow[]> {
    return query<CommentRow>(
      `SELECT c.*, u.display_name FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.problem_id = $1 AND c.parent_id IS NULL
       ORDER BY c.created_at DESC LIMIT $2 OFFSET $3`,
      [problemId, limit, offset]
    );
  },

  async getReplies(commentId: string): Promise<CommentRow[]> {
    return query<CommentRow>(
      `SELECT c.*, u.display_name FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.parent_id = $1
       ORDER BY c.created_at ASC`,
      [commentId]
    );
  },

  async findById(id: string): Promise<CommentRow | null> {
    return queryOne<CommentRow>('SELECT * FROM comments WHERE id = $1', [id]);
  },

  async update(id: string, content: string): Promise<void> {
    await query('UPDATE comments SET content = $1 WHERE id = $2', [content, id]);
  },

  async delete(id: string): Promise<void> {
    await query('DELETE FROM comments WHERE id = $1', [id]);
  },

  async getProblemIdFromSlug(slug: string): Promise<string | null> {
    const row = await queryOne<{ id: string }>('SELECT id FROM problems WHERE slug = $1', [slug]);
    return row?.id || null;
  },
};
