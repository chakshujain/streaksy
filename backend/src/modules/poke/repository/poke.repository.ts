import { query, queryOne } from '../../../config/database';

export interface PokeRow {
  id: string;
  from_user_id: string;
  to_user_id: string;
  group_id: string | null;
  message: string;
  poke_type: string;
  escalation_level: number;
  created_at: Date;
  from_display_name?: string;
}

export interface RecoveryChallengeRow {
  id: string;
  user_id: string;
  challenge_type: string;
  target_count: number;
  completed_count: number;
  status: string;
  expires_at: Date;
  created_at: Date;
}

export interface InactiveUserRow {
  user_id: string;
  display_name: string;
  days_inactive: number;
  last_solve_date: string | null;
  current_streak: number;
}

export const pokeRepository = {
  async create(fromUserId: string, toUserId: string, message: string, pokeType: string, escalationLevel: number, groupId?: string): Promise<PokeRow> {
    const rows = await query<PokeRow>(
      `INSERT INTO pokes (from_user_id, to_user_id, group_id, message, poke_type, escalation_level)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [fromUserId, toUserId, groupId || null, message, pokeType, escalationLevel]
    );
    return rows[0];
  },

  async getReceivedPokes(userId: string, limit = 20, offset = 0): Promise<PokeRow[]> {
    return query<PokeRow>(
      `SELECT p.*, u.display_name as from_display_name
       FROM pokes p JOIN users u ON u.id = p.from_user_id
       WHERE p.to_user_id = $1 ORDER BY p.created_at DESC LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
  },

  /** Check if a poke was sent recently (cooldown: 1 per pair per 4 hours) */
  async recentPokeBetween(fromUserId: string, toUserId: string): Promise<boolean> {
    const row = await queryOne<{ id: string }>(
      `SELECT id FROM pokes WHERE from_user_id = $1 AND to_user_id = $2
       AND created_at > NOW() - INTERVAL '4 hours' LIMIT 1`,
      [fromUserId, toUserId]
    );
    return !!row;
  },

  /** Get poke count sent by a user today (daily limit) */
  async pokessentToday(userId: string): Promise<number> {
    const row = await queryOne<{ count: string }>(
      `SELECT COUNT(*) as count FROM pokes
       WHERE from_user_id = $1 AND poke_type = 'manual' AND created_at::date = CURRENT_DATE`,
      [userId]
    );
    return Number(row?.count || 0);
  },

  /** Find inactive group members (no solve in N days) */
  async getInactiveGroupMembers(groupId: string, inactiveDays: number): Promise<InactiveUserRow[]> {
    return query<InactiveUserRow>(
      `SELECT u.id as user_id, u.display_name,
              COALESCE(CURRENT_DATE - us.last_solve_date::date, 999) as days_inactive,
              us.last_solve_date::text,
              COALESCE(us.current_streak, 0) as current_streak
       FROM group_members gm
       JOIN users u ON u.id = gm.user_id
       LEFT JOIN user_streaks us ON us.user_id = u.id
       WHERE gm.group_id = $1
         AND (us.last_solve_date IS NULL OR CURRENT_DATE - us.last_solve_date::date >= $2)
       ORDER BY days_inactive DESC`,
      [groupId, inactiveDays]
    );
  },

  /** Find users whose streak is at risk (solved yesterday but not today) */
  async getStreakAtRiskUsers(): Promise<{ user_id: string; email: string; display_name: string; current_streak: number }[]> {
    return query(
      `SELECT u.id as user_id, u.email, u.display_name, us.current_streak
       FROM user_streaks us
       JOIN users u ON u.id = us.user_id
       WHERE us.current_streak >= 3
         AND us.last_solve_date = CURRENT_DATE - INTERVAL '1 day'
         AND NOT EXISTS (
           SELECT 1 FROM user_problem_status ups
           WHERE ups.user_id = us.user_id AND ups.status = 'solved' AND ups.solved_at::date = CURRENT_DATE
         )`,
      []
    );
  },

  // Recovery challenges
  async createChallenge(userId: string, challengeType: string, targetCount: number, expiresAt: Date): Promise<RecoveryChallengeRow> {
    const rows = await query<RecoveryChallengeRow>(
      `INSERT INTO recovery_challenges (user_id, challenge_type, target_count, expires_at)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, challengeType, targetCount, expiresAt]
    );
    return rows[0];
  },

  async getActiveChallenge(userId: string): Promise<RecoveryChallengeRow | null> {
    return queryOne<RecoveryChallengeRow>(
      `SELECT * FROM recovery_challenges
       WHERE user_id = $1 AND status = 'active' AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );
  },

  async incrementChallenge(id: string): Promise<RecoveryChallengeRow | null> {
    return queryOne<RecoveryChallengeRow>(
      `UPDATE recovery_challenges SET completed_count = completed_count + 1,
       status = CASE WHEN completed_count + 1 >= target_count THEN 'completed' ELSE 'active' END
       WHERE id = $1 RETURNING *`,
      [id]
    );
  },

  /** Determine current escalation level for a user based on inactivity */
  async getEscalationLevel(userId: string): Promise<number> {
    const days = await this.getDaysInactive(userId);
    if (days <= 1) return 0; // active, no nudge
    if (days <= 2) return 1; // gentle
    if (days <= 4) return 2; // humor
    if (days <= 7) return 3; // friend poke territory
    return 4; // group notification
  },

  /** Get actual days inactive for a user */
  async getDaysInactive(userId: string): Promise<number> {
    const row = await queryOne<{ days_inactive: number }>(
      `SELECT COALESCE(CURRENT_DATE - us.last_solve_date::date, 999) as days_inactive
       FROM user_streaks us WHERE us.user_id = $1`,
      [userId]
    );
    return Number(row?.days_inactive || 0);
  },
};
