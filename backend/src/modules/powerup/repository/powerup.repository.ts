import { query, queryOne } from '../../../config/database';

export interface PowerupRow {
  id: string;
  user_id: string;
  powerup_type: string;
  quantity: number;
}

export interface PowerupLogRow {
  id: string;
  user_id: string;
  powerup_type: string;
  action: string;
  reason: string | null;
  created_at: string;
}

export interface StreakExtendedRow {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_solve_date: string | null;
  points: number;
  freeze_count: number;
  last_freeze_used: string | null;
}

export const powerupRepository = {
  async getInventory(userId: string): Promise<PowerupRow[]> {
    return query<PowerupRow>(
      'SELECT * FROM user_powerups WHERE user_id = $1',
      [userId]
    );
  },

  async getOne(userId: string, type: string): Promise<PowerupRow | null> {
    return queryOne<PowerupRow>(
      'SELECT * FROM user_powerups WHERE user_id = $1 AND powerup_type = $2',
      [userId, type]
    );
  },

  async addPowerup(userId: string, type: string, quantity: number): Promise<void> {
    await query(
      `INSERT INTO user_powerups (user_id, powerup_type, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, powerup_type) DO UPDATE SET
         quantity = user_powerups.quantity + $3`,
      [userId, type, quantity]
    );
  },

  async usePowerup(userId: string, type: string): Promise<boolean> {
    const rows = await query<PowerupRow>(
      `UPDATE user_powerups SET quantity = quantity - 1
       WHERE user_id = $1 AND powerup_type = $2 AND quantity > 0
       RETURNING *`,
      [userId, type]
    );
    return rows.length > 0;
  },

  async logAction(userId: string, type: string, action: string, reason?: string): Promise<void> {
    await query(
      'INSERT INTO powerup_log (user_id, powerup_type, action, reason) VALUES ($1, $2, $3, $4)',
      [userId, type, action, reason || null]
    );
  },

  async getLog(userId: string, limit: number = 20): Promise<PowerupLogRow[]> {
    return query<PowerupLogRow>(
      'SELECT * FROM powerup_log WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
      [userId, limit]
    );
  },

  async getStreakExtended(userId: string): Promise<StreakExtendedRow | null> {
    return queryOne<StreakExtendedRow>(
      'SELECT * FROM user_streaks WHERE user_id = $1',
      [userId]
    );
  },

  async addPoints(userId: string, points: number): Promise<void> {
    await query(
      `INSERT INTO user_streaks (user_id, points) VALUES ($1, $2)
       ON CONFLICT (user_id) DO UPDATE SET points = user_streaks.points + $2`,
      [userId, points]
    );
  },

  async spendPoints(userId: string, points: number): Promise<boolean> {
    const rows = await query<StreakExtendedRow>(
      `UPDATE user_streaks SET points = points - $2
       WHERE user_id = $1 AND points >= $2
       RETURNING *`,
      [userId, points]
    );
    return rows.length > 0;
  },

  async useFreeze(userId: string): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    await query(
      `UPDATE user_streaks SET freeze_count = freeze_count + 1, last_freeze_used = $2
       WHERE user_id = $1`,
      [userId, today]
    );
  },

  async getPoints(userId: string): Promise<number> {
    const row = await queryOne<{ points: number }>('SELECT points FROM user_streaks WHERE user_id = $1', [userId]);
    return row?.points ?? 0;
  },
};
