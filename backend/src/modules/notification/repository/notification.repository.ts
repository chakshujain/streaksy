import { query, queryOne } from '../../../config/database';

export interface NotificationRow {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string | null;
  data: Record<string, unknown>;
  read_at: Date | null;
  created_at: Date;
}

export const notificationRepository = {
  async create(userId: string, type: string, title: string, body?: string, data?: Record<string, unknown>): Promise<NotificationRow> {
    const rows = await query<NotificationRow>(
      `INSERT INTO notifications (user_id, type, title, body, data)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, type, title, body || null, JSON.stringify(data || {})]
    );
    return rows[0];
  },

  async getForUser(userId: string, limit = 20, offset = 0): Promise<NotificationRow[]> {
    return query<NotificationRow>(
      `SELECT * FROM notifications WHERE user_id = $1
       ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
  },

  async getUnreadCount(userId: string): Promise<number> {
    const row = await queryOne<{ count: string }>(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND read_at IS NULL',
      [userId]
    );
    return Number(row?.count || 0);
  },

  async markRead(id: string, userId: string): Promise<void> {
    await query(
      'UPDATE notifications SET read_at = NOW() WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
  },

  async markAllRead(userId: string): Promise<void> {
    await query(
      'UPDATE notifications SET read_at = NOW() WHERE user_id = $1 AND read_at IS NULL',
      [userId]
    );
  },
};
