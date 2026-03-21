import { query, queryOne, transaction } from '../../../config/database';
import crypto from 'crypto';

export interface GroupRow {
  id: string;
  name: string;
  description: string | null;
  invite_code: string;
  created_by: string;
  created_at: Date;
  plan: string | null;
  objective: string | null;
  target_date: Date | null;
}

export interface MemberRow {
  user_id: string;
  display_name: string;
  role: string;
  joined_at: Date;
}

export const groupRepository = {
  async create(name: string, description: string | undefined, userId: string): Promise<GroupRow> {
    const inviteCode = crypto.randomBytes(6).toString('hex');

    return transaction(async (client) => {
      const result = await client.query(
        `INSERT INTO groups (name, description, invite_code, created_by)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [name, description || null, inviteCode, userId]
      );
      const group = result.rows[0];

      await client.query(
        `INSERT INTO group_members (group_id, user_id, role) VALUES ($1, $2, 'admin')`,
        [group.id, userId]
      );

      return group;
    });
  },

  async findByInviteCode(code: string): Promise<GroupRow | null> {
    return queryOne<GroupRow>('SELECT * FROM groups WHERE invite_code = $1', [code]);
  },

  async findById(id: string): Promise<GroupRow | null> {
    return queryOne<GroupRow>('SELECT * FROM groups WHERE id = $1', [id]);
  },

  async addMember(groupId: string, userId: string, role = 'member'): Promise<void> {
    await query(
      `INSERT INTO group_members (group_id, user_id, role) VALUES ($1, $2, $3)
       ON CONFLICT (group_id, user_id) DO NOTHING`,
      [groupId, userId, role]
    );
  },

  async isMember(groupId: string, userId: string): Promise<boolean> {
    const row = await queryOne<{ user_id: string }>(
      'SELECT user_id FROM group_members WHERE group_id = $1 AND user_id = $2',
      [groupId, userId]
    );
    return !!row;
  },

  async getMembers(groupId: string): Promise<MemberRow[]> {
    return query<MemberRow>(
      `SELECT u.id as user_id, u.display_name, gm.role, gm.joined_at
       FROM group_members gm
       JOIN users u ON u.id = gm.user_id
       WHERE gm.group_id = $1
       ORDER BY gm.joined_at`,
      [groupId]
    );
  },

  async getUserGroups(userId: string): Promise<GroupRow[]> {
    return query<GroupRow>(
      `SELECT g.* FROM groups g
       JOIN group_members gm ON gm.group_id = g.id
       WHERE gm.user_id = $1
       ORDER BY g.created_at DESC`,
      [userId]
    );
  },

  async getMember(groupId: string, userId: string): Promise<{ group_id: string; user_id: string; role: string } | null> {
    return queryOne<{ group_id: string; user_id: string; role: string }>(
      'SELECT * FROM group_members WHERE group_id = $1 AND user_id = $2',
      [groupId, userId]
    );
  },

  async updateGroupPlan(groupId: string, data: { plan?: string; objective?: string; targetDate?: string }): Promise<GroupRow> {
    const rows = await query<GroupRow>(
      `UPDATE groups SET
        plan = COALESCE($2, plan),
        objective = COALESCE($3, objective),
        target_date = COALESCE($4::date, target_date)
       WHERE id = $1 RETURNING *`,
      [groupId, data.plan || null, data.objective || null, data.targetDate || null]
    );
    return rows[0];
  },

  async assignSheet(groupId: string, sheetId: string, assignedBy: string): Promise<void> {
    await query(
      'INSERT INTO group_sheets (group_id, sheet_id, assigned_by) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
      [groupId, sheetId, assignedBy]
    );
  },

  async removeSheet(groupId: string, sheetId: string): Promise<void> {
    await query('DELETE FROM group_sheets WHERE group_id = $1 AND sheet_id = $2', [groupId, sheetId]);
  },

  async getGroupSheets(groupId: string): Promise<{ sheet_id: string; name: string; slug: string; description: string | null; assigned_at: Date }[]> {
    return query(
      `SELECT s.id as sheet_id, s.name, s.slug, s.description, gs.assigned_at
       FROM group_sheets gs JOIN sheets s ON s.id = gs.sheet_id
       WHERE gs.group_id = $1 ORDER BY gs.assigned_at DESC`,
      [groupId]
    );
  },

  async removeMember(groupId: string, userId: string): Promise<void> {
    await query('DELETE FROM group_members WHERE group_id = $1 AND user_id = $2', [groupId, userId]);
  },

  async deleteGroup(groupId: string): Promise<void> {
    await query('DELETE FROM groups WHERE id = $1', [groupId]);
  },

  async getMemberCount(groupId: string): Promise<number> {
    const row = await queryOne<{ count: string }>('SELECT COUNT(*) as count FROM group_members WHERE group_id = $1', [groupId]);
    return Number(row?.count || 0);
  },

  async getMemberSheetProgress(groupId: string, sheetId: string): Promise<{ user_id: string; display_name: string; solved: number; total: number }[]> {
    return query(
      `SELECT gm.user_id, u.display_name,
              COUNT(CASE WHEN ups.status = 'solved' THEN 1 END)::int as solved,
              COUNT(sp.problem_id)::int as total
       FROM group_members gm
       JOIN users u ON u.id = gm.user_id
       CROSS JOIN sheet_problems sp
       LEFT JOIN user_problem_status ups ON ups.user_id = gm.user_id AND ups.problem_id = sp.problem_id
       WHERE gm.group_id = $1 AND sp.sheet_id = $2
       GROUP BY gm.user_id, u.display_name
       ORDER BY solved DESC`,
      [groupId, sheetId]
    );
  },

  async joinByInviteCode(inviteCode: string, userId: string): Promise<void> {
    const group = await queryOne<GroupRow>('SELECT * FROM groups WHERE invite_code = $1', [inviteCode]);
    if (group) {
      await query(
        'INSERT INTO group_members (group_id, user_id, role) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
        [group.id, userId, 'member']
      );
    }
  },
};
