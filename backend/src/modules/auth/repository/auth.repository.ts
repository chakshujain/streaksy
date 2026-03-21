import { query, queryOne } from '../../../config/database';

interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  display_name: string;
  leetcode_username: string | null;
  email_verified: boolean;
  email_verification_token: string | null;
  email_verification_expires: Date | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  created_at: Date;
}

interface PasswordResetRow {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: Date;
  used_at: Date | null;
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

  async findByOAuth(provider: string, oauthId: string): Promise<UserRow | null> {
    return queryOne<UserRow>(
      'SELECT * FROM users WHERE oauth_provider = $1 AND oauth_id = $2',
      [provider, oauthId]
    );
  },

  async createOAuth(email: string, displayName: string, provider: string, oauthId: string): Promise<UserRow> {
    const rows = await query<UserRow>(
      `INSERT INTO users (id, email, display_name, oauth_provider, oauth_id)
       VALUES (gen_random_uuid(), $1, $2, $3, $4)
       RETURNING *`,
      [email, displayName, provider, oauthId]
    );
    return rows[0];
  },

  // Password reset
  async createPasswordResetToken(userId: string, tokenHash: string, expiresAt: Date): Promise<void> {
    await query(
      `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
      [userId, tokenHash, expiresAt]
    );
  },

  async findValidResetToken(tokenHash: string): Promise<PasswordResetRow | null> {
    return queryOne<PasswordResetRow>(
      `SELECT * FROM password_reset_tokens
       WHERE token_hash = $1 AND used_at IS NULL AND expires_at > NOW()`,
      [tokenHash]
    );
  },

  async markResetTokenUsed(id: string): Promise<void> {
    await query('UPDATE password_reset_tokens SET used_at = NOW() WHERE id = $1', [id]);
  },

  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    await query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, userId]);
  },

  // Email verification
  async setVerificationToken(userId: string, token: string, expires: Date): Promise<void> {
    await query(
      `UPDATE users SET email_verification_token = $1, email_verification_expires = $2 WHERE id = $3`,
      [token, expires, userId]
    );
  },

  async findByVerificationToken(token: string): Promise<UserRow | null> {
    return queryOne<UserRow>(
      `SELECT * FROM users WHERE email_verification_token = $1 AND email_verification_expires > NOW()`,
      [token]
    );
  },

  async markEmailVerified(userId: string): Promise<void> {
    await query(
      `UPDATE users SET email_verified = TRUE, email_verification_token = NULL, email_verification_expires = NULL WHERE id = $1`,
      [userId]
    );
  },

  // Profile
  async updateProfile(userId: string, data: {
    displayName?: string;
    bio?: string;
    location?: string;
    githubUrl?: string;
    linkedinUrl?: string;
  }): Promise<UserRow> {
    const rows = await query<UserRow>(
      `UPDATE users SET
        display_name = COALESCE($2, display_name),
        bio = CASE WHEN $3::text IS NOT NULL THEN $3 ELSE bio END,
        location = CASE WHEN $4::text IS NOT NULL THEN $4 ELSE location END,
        github_url = CASE WHEN $5::text IS NOT NULL THEN $5 ELSE github_url END,
        linkedin_url = CASE WHEN $6::text IS NOT NULL THEN $6 ELSE linkedin_url END
       WHERE id = $1 RETURNING *`,
      [userId, data.displayName || null, data.bio ?? null, data.location ?? null, data.githubUrl ?? null, data.linkedinUrl ?? null]
    );
    return rows[0];
  },

  async updateAvatar(userId: string, avatarUrl: string): Promise<void> {
    await query('UPDATE users SET avatar_url = $1 WHERE id = $2', [avatarUrl, userId]);
  },
};
