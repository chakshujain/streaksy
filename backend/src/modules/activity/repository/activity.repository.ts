import { query } from '../../../config/database';

export interface ActivityRow {
  id: string;
  group_id: string;
  user_id: string;
  action: string;
  metadata: Record<string, unknown>;
  created_at: Date;
  display_name?: string;
}

export const activityRepository = {
  async create(groupId: string, userId: string, action: string, metadata?: Record<string, unknown>): Promise<ActivityRow> {
    const rows = await query<ActivityRow>(
      `INSERT INTO group_activity (group_id, user_id, action, metadata)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [groupId, userId, action, JSON.stringify(metadata || {})]
    );
    return rows[0];
  },

  async getForGroup(groupId: string, limit = 30, offset = 0): Promise<ActivityRow[]> {
    return query<ActivityRow>(
      `SELECT ga.*, u.display_name FROM group_activity ga
       JOIN users u ON u.id = ga.user_id
       WHERE ga.group_id = $1
       ORDER BY ga.created_at DESC LIMIT $2 OFFSET $3`,
      [groupId, limit, offset]
    );
  },
};
