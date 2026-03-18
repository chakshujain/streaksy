import { query, queryOne } from '../../../config/database';

interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  display_name: string;
  leetcode_username: string | null;
  created_at: Date;
}

export const authRepository = {
  async findByEmail(email: string): Promise<UserRow | null> {
    return queryOne<UserRow>('SELECT * FROM users WHERE email = $1', [email]);
  },

  async create(email: string, passwordHash: string, displayName: string): Promise<UserRow> {
    const rows = await query<UserRow>(
      `INSERT INTO users (email, password_hash, display_name)
       VALUES ($1, $2, $3) RETURNING *`,
      [email, passwordHash, displayName]
    );
    return rows[0];
  },

  async connectLeetcode(userId: string, username: string): Promise<void> {
    await query(
      'UPDATE users SET leetcode_username = $1 WHERE id = $2',
      [username, userId]
    );
  },

  async findById(userId: string): Promise<UserRow | null> {
    return queryOne<UserRow>('SELECT * FROM users WHERE id = $1', [userId]);
  },
};
