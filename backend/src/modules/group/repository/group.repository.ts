import { query, queryOne, transaction } from '../../../config/database';
import crypto from 'crypto';

export interface GroupRow {
  id: string;
  name: string;
  description: string | null;
  invite_code: string;
  created_by: string;
  created_at: Date;
}

export interface MemberRow {
  user_id: string;
  display_name: string;
  email: string;
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
      `SELECT u.id as user_id, u.display_name, u.email, gm.role, gm.joined_at
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
};
