import { query, queryOne } from '../../../config/database';

export interface NoteRow {
  id: string;
  user_id: string;
  problem_id: string;
  group_id: string | null;
  content: string;
  visibility: string;
  created_at: Date;
  updated_at: Date;
}

export const notesRepository = {
  async create(
    userId: string,
    problemId: string,
    content: string,
    visibility: string,
    groupId?: string
  ): Promise<NoteRow> {
    const rows = await query<NoteRow>(
      `INSERT INTO notes (user_id, problem_id, content, visibility, group_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, problemId, content, visibility, groupId || null]
    );
    return rows[0];
  },

  async update(noteId: string, userId: string, content: string): Promise<NoteRow | null> {
    const rows = await query<NoteRow>(
      `UPDATE notes SET content = $1 WHERE id = $2 AND user_id = $3 RETURNING *`,
      [content, noteId, userId]
    );
    return rows[0] ?? null;
  },

  async delete(noteId: string, userId: string): Promise<boolean> {
    const rows = await query<{ id: string }>(
      'DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING id',
      [noteId, userId]
    );
    return rows.length > 0;
  },

  async getPersonalNotes(userId: string, problemId: string): Promise<NoteRow[]> {
    return query<NoteRow>(
      `SELECT * FROM notes WHERE user_id = $1 AND problem_id = $2 AND visibility = 'personal'
       ORDER BY created_at DESC`,
      [userId, problemId]
    );
  },

  async getGroupNotes(groupId: string, problemId: string): Promise<NoteRow[]> {
    return query<NoteRow>(
      `SELECT n.*, u.display_name as author_name FROM notes n
       JOIN users u ON u.id = n.user_id
       WHERE n.group_id = $1 AND n.problem_id = $2 AND n.visibility = 'group'
       ORDER BY n.created_at DESC`,
      [groupId, problemId]
    );
  },
};
