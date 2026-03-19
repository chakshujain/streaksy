import { query, queryOne } from '../../../config/database';

export interface BadgeRow {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  criteria: Record<string, unknown>;
}

export interface UserBadgeRow {
  user_id: string;
  badge_id: string;
  earned_at: Date;
  name: string;
  description: string;
  icon: string;
  category: string;
}

export const badgeRepository = {
  async getAll(): Promise<BadgeRow[]> {
    return query<BadgeRow>('SELECT * FROM badges ORDER BY category, name');
  },

  async getUserBadges(userId: string): Promise<UserBadgeRow[]> {
    return query<UserBadgeRow>(
      `SELECT ub.user_id, ub.badge_id, ub.earned_at, b.name, b.description, b.icon, b.category
       FROM user_badges ub JOIN badges b ON b.id = ub.badge_id
       WHERE ub.user_id = $1 ORDER BY ub.earned_at DESC`,
      [userId]
    );
  },

  async award(userId: string, badgeId: string): Promise<void> {
    await query(
      'INSERT INTO user_badges (user_id, badge_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [userId, badgeId]
    );
  },

  async hasEarned(userId: string, badgeId: string): Promise<boolean> {
    const row = await queryOne<{ user_id: string }>(
      'SELECT user_id FROM user_badges WHERE user_id = $1 AND badge_id = $2',
      [userId, badgeId]
    );
    return !!row;
  },

  async findByName(name: string): Promise<BadgeRow | null> {
    return queryOne<BadgeRow>('SELECT * FROM badges WHERE name = $1', [name]);
  },
};
