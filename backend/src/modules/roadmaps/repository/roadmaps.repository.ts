import { query, queryOne } from '../../../config/database';

export interface RoadmapCategoryRow {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  color: string | null;
  position: number;
}

export interface RoadmapTemplateRow {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  duration_days: number;
  difficulty: string;
  is_featured: boolean;
  participant_count: number;
  created_at: Date;
  task_count?: number;
  category_slug?: string;
  category_name?: string;
}

export interface TemplateTaskRow {
  id: string;
  template_id: string;
  day_number: number;
  title: string;
  description: string | null;
  task_type: string;
  link: string | null;
  metadata: Record<string, unknown>;
  position: number;
}

export interface UserRoadmapRow {
  id: string;
  user_id: string;
  template_id: string | null;
  group_id: string | null;
  name: string;
  category_id: string | null;
  duration_days: number;
  start_date: string;
  status: string;
  custom_tasks: unknown;
  share_code: string;
  created_at: Date;
  updated_at: Date;
  completed_days?: number;
  template_slug?: string;
  category_slug?: string;
  category_icon?: string;
}

export interface DayProgressRow {
  roadmap_id: string;
  user_id: string;
  day_number: number;
  completed: boolean;
  completed_at: Date | null;
  notes: string | null;
}

export interface RoadmapStreakRow {
  id: string;
  roadmap_id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
}

export interface RoadmapLeaderboardEntry {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  completed_count: number;
  current_streak: number;
}

export const roadmapsRepository = {
  async getCategories(): Promise<RoadmapCategoryRow[]> {
    return query<RoadmapCategoryRow>(
      'SELECT * FROM roadmap_categories ORDER BY position'
    );
  },

  async getTemplates(categorySlug?: string): Promise<RoadmapTemplateRow[]> {
    if (categorySlug) {
      return query<RoadmapTemplateRow>(
        `SELECT rt.*, rc.slug AS category_slug, rc.name AS category_name,
                (SELECT COUNT(*)::int FROM template_tasks tt WHERE tt.template_id = rt.id) AS task_count
         FROM roadmap_templates rt
         JOIN roadmap_categories rc ON rc.id = rt.category_id
         WHERE rc.slug = $1
         ORDER BY rt.is_featured DESC, rt.participant_count DESC`,
        [categorySlug]
      );
    }
    return query<RoadmapTemplateRow>(
      `SELECT rt.*, rc.slug AS category_slug, rc.name AS category_name,
              (SELECT COUNT(*)::int FROM template_tasks tt WHERE tt.template_id = rt.id) AS task_count
       FROM roadmap_templates rt
       JOIN roadmap_categories rc ON rc.id = rt.category_id
       ORDER BY rt.is_featured DESC, rt.participant_count DESC`
    );
  },

  async getTemplateBySlug(slug: string): Promise<(RoadmapTemplateRow & { tasks: TemplateTaskRow[] }) | null> {
    const template = await queryOne<RoadmapTemplateRow>(
      `SELECT rt.*, rc.slug AS category_slug, rc.name AS category_name
       FROM roadmap_templates rt
       JOIN roadmap_categories rc ON rc.id = rt.category_id
       WHERE rt.slug = $1`,
      [slug]
    );
    if (!template) return null;

    const tasks = await query<TemplateTaskRow>(
      'SELECT * FROM template_tasks WHERE template_id = $1 ORDER BY day_number, position',
      [template.id]
    );

    return { ...template, tasks };
  },

  async getFeaturedTemplates(): Promise<RoadmapTemplateRow[]> {
    return query<RoadmapTemplateRow>(
      `SELECT rt.*, rc.slug AS category_slug, rc.name AS category_name,
              (SELECT COUNT(*)::int FROM template_tasks tt WHERE tt.template_id = rt.id) AS task_count
       FROM roadmap_templates rt
       JOIN roadmap_categories rc ON rc.id = rt.category_id
       WHERE rt.is_featured = true
       ORDER BY rt.participant_count DESC`
    );
  },

  async createUserRoadmap(
    userId: string,
    data: {
      templateId?: string;
      groupId?: string;
      name: string;
      categoryId?: string;
      durationDays: number;
      startDate?: string;
      customTasks?: unknown;
    }
  ): Promise<UserRoadmapRow> {
    const rows = await query<UserRoadmapRow>(
      `INSERT INTO user_roadmaps (user_id, template_id, group_id, name, category_id, duration_days, start_date, custom_tasks)
       VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7::date, CURRENT_DATE), $8)
       RETURNING *`,
      [
        userId,
        data.templateId || null,
        data.groupId || null,
        data.name,
        data.categoryId || null,
        data.durationDays,
        data.startDate || null,
        data.customTasks ? JSON.stringify(data.customTasks) : null,
      ]
    );

    // Increment participant count on template
    if (data.templateId) {
      await query(
        'UPDATE roadmap_templates SET participant_count = participant_count + 1 WHERE id = $1',
        [data.templateId]
      );
    }

    return rows[0];
  },

  async getActiveRoadmaps(userId: string): Promise<UserRoadmapRow[]> {
    return query<UserRoadmapRow>(
      `SELECT ur.*,
              rt.slug AS template_slug,
              rc.slug AS category_slug,
              rc.icon AS category_icon,
              (SELECT COUNT(*)::int FROM roadmap_day_progress rdp
               WHERE rdp.roadmap_id = ur.id AND rdp.user_id = $1 AND rdp.completed = true) AS completed_days
       FROM user_roadmaps ur
       LEFT JOIN roadmap_templates rt ON rt.id = ur.template_id
       LEFT JOIN roadmap_categories rc ON rc.id = ur.category_id
       WHERE ur.user_id = $1 AND ur.status = 'active'
       ORDER BY ur.created_at DESC`,
      [userId]
    );
  },

  async getAllRoadmaps(userId: string): Promise<UserRoadmapRow[]> {
    return query<UserRoadmapRow>(
      `SELECT ur.*,
              rt.slug AS template_slug,
              rc.slug AS category_slug,
              rc.icon AS category_icon,
              (SELECT COUNT(*)::int FROM roadmap_day_progress rdp
               WHERE rdp.roadmap_id = ur.id AND rdp.user_id = $1 AND rdp.completed = true) AS completed_days
       FROM user_roadmaps ur
       LEFT JOIN roadmap_templates rt ON rt.id = ur.template_id
       LEFT JOIN roadmap_categories rc ON rc.id = ur.category_id
       WHERE ur.user_id = $1
       ORDER BY ur.created_at DESC`,
      [userId]
    );
  },

  async getRoadmapById(id: string): Promise<UserRoadmapRow | null> {
    return queryOne<UserRoadmapRow>(
      `SELECT ur.*,
              rt.slug AS template_slug,
              rc.slug AS category_slug,
              rc.icon AS category_icon
       FROM user_roadmaps ur
       LEFT JOIN roadmap_templates rt ON rt.id = ur.template_id
       LEFT JOIN roadmap_categories rc ON rc.id = ur.category_id
       WHERE ur.id = $1`,
      [id]
    );
  },

  async getTemplateTasks(templateId: string): Promise<TemplateTaskRow[]> {
    return query<TemplateTaskRow>(
      'SELECT * FROM template_tasks WHERE template_id = $1 ORDER BY day_number, position',
      [templateId]
    );
  },

  async updateRoadmap(id: string, data: { status?: string; name?: string }): Promise<UserRoadmapRow | null> {
    const sets: string[] = ['updated_at = NOW()'];
    const params: unknown[] = [];
    let idx = 1;

    if (data.status) {
      sets.push(`status = $${idx}`);
      params.push(data.status);
      idx++;
    }
    if (data.name) {
      sets.push(`name = $${idx}`);
      params.push(data.name);
      idx++;
    }

    params.push(id);
    return queryOne<UserRoadmapRow>(
      `UPDATE user_roadmaps SET ${sets.join(', ')} WHERE id = $${idx} RETURNING *`,
      params
    );
  },

  async deleteRoadmap(id: string): Promise<void> {
    await query('DELETE FROM user_roadmaps WHERE id = $1', [id]);
  },

  async updateDayProgress(
    roadmapId: string,
    userId: string,
    dayNumber: number,
    completed: boolean
  ): Promise<DayProgressRow> {
    const rows = await query<DayProgressRow>(
      `INSERT INTO roadmap_day_progress (roadmap_id, user_id, day_number, completed, completed_at)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (roadmap_id, user_id, day_number) DO UPDATE SET
         completed = $4,
         completed_at = $5
       RETURNING *`,
      [roadmapId, userId, dayNumber, completed, completed ? new Date() : null]
    );
    return rows[0];
  },

  async getDayProgress(roadmapId: string, userId?: string): Promise<DayProgressRow[]> {
    if (userId) {
      return query<DayProgressRow>(
        'SELECT * FROM roadmap_day_progress WHERE roadmap_id = $1 AND user_id = $2 ORDER BY day_number',
        [roadmapId, userId]
      );
    }
    return query<DayProgressRow>(
      'SELECT * FROM roadmap_day_progress WHERE roadmap_id = $1 ORDER BY day_number',
      [roadmapId]
    );
  },

  async getStreak(roadmapId: string, userId: string): Promise<RoadmapStreakRow | null> {
    return queryOne<RoadmapStreakRow>(
      'SELECT * FROM roadmap_streaks WHERE roadmap_id = $1 AND user_id = $2',
      [roadmapId, userId]
    );
  },

  async updateStreak(roadmapId: string, userId: string): Promise<RoadmapStreakRow> {
    const today = new Date().toISOString().split('T')[0];
    const existing = await this.getStreak(roadmapId, userId);

    let currentStreak: number;
    let longestStreak: number;

    if (!existing) {
      currentStreak = 1;
      longestStreak = 1;
    } else if (existing.last_activity_date === today) {
      return existing;
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (existing.last_activity_date === yesterdayStr) {
        currentStreak = existing.current_streak + 1;
      } else {
        currentStreak = 1;
      }
      longestStreak = Math.max(currentStreak, existing.longest_streak);
    }

    const rows = await query<RoadmapStreakRow>(
      `INSERT INTO roadmap_streaks (roadmap_id, user_id, current_streak, longest_streak, last_activity_date)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (roadmap_id, user_id) DO UPDATE SET
         current_streak = $3,
         longest_streak = $4,
         last_activity_date = $5
       RETURNING *`,
      [roadmapId, userId, currentStreak, longestStreak, today]
    );
    return rows[0];
  },

  async getLeaderboard(roadmapId: string): Promise<RoadmapLeaderboardEntry[]> {
    return query<RoadmapLeaderboardEntry>(
      `SELECT rdp.user_id, u.display_name, u.avatar_url,
              COUNT(*) FILTER (WHERE rdp.completed = true)::int AS completed_count,
              COALESCE(rs.current_streak, 0)::int AS current_streak
       FROM roadmap_day_progress rdp
       JOIN users u ON u.id = rdp.user_id
       LEFT JOIN roadmap_streaks rs ON rs.roadmap_id = rdp.roadmap_id AND rs.user_id = rdp.user_id
       WHERE rdp.roadmap_id = $1
       GROUP BY rdp.user_id, u.display_name, u.avatar_url, rs.current_streak
       ORDER BY completed_count DESC`,
      [roadmapId]
    );
  },

  async getByShareCode(code: string): Promise<UserRoadmapRow | null> {
    return queryOne<UserRoadmapRow>(
      `SELECT ur.*,
              rt.slug AS template_slug,
              rc.slug AS category_slug,
              rc.icon AS category_icon
       FROM user_roadmaps ur
       LEFT JOIN roadmap_templates rt ON rt.id = ur.template_id
       LEFT JOIN roadmap_categories rc ON rc.id = ur.category_id
       WHERE ur.share_code = $1`,
      [code]
    );
  },

  async linkGroup(roadmapId: string, groupId: string): Promise<void> {
    await query(
      'UPDATE user_roadmaps SET group_id = $1, updated_at = NOW() WHERE id = $2',
      [groupId, roadmapId]
    );
  },

  async getTodayTasks(userId: string): Promise<Array<{
    roadmap_id: string;
    roadmap_name: string;
    day_number: number;
    title: string;
    description: string | null;
    task_type: string;
    link: string | null;
    completed: boolean;
  }>> {
    return query(
      `SELECT
         ur.id AS roadmap_id,
         ur.name AS roadmap_name,
         today.day_number,
         COALESCE(tt.title, (ct->>'title')::text) AS title,
         COALESCE(tt.description, (ct->>'description')::text) AS description,
         COALESCE(tt.task_type, 'custom') AS task_type,
         tt.link,
         COALESCE(rdp.completed, false) AS completed
       FROM user_roadmaps ur
       CROSS JOIN LATERAL (
         SELECT (CURRENT_DATE - ur.start_date + 1)::int AS day_number
       ) today
       LEFT JOIN roadmap_templates rt ON rt.id = ur.template_id
       LEFT JOIN template_tasks tt ON tt.template_id = rt.id AND tt.day_number = today.day_number
       LEFT JOIN LATERAL (
         SELECT elem AS ct
         FROM jsonb_array_elements(ur.custom_tasks) WITH ORDINALITY AS t(elem, ord)
         WHERE (elem->>'day_number')::int = today.day_number
         LIMIT 1
       ) custom_task ON ur.template_id IS NULL
       LEFT JOIN roadmap_day_progress rdp ON rdp.roadmap_id = ur.id AND rdp.user_id = $1 AND rdp.day_number = today.day_number
       WHERE ur.user_id = $1
         AND ur.status = 'active'
         AND today.day_number >= 1
         AND today.day_number <= ur.duration_days
       ORDER BY ur.created_at`,
      [userId]
    );
  },

  async getGlobalLeaderboard(limit: number = 50): Promise<Array<{
    user_id: string;
    display_name: string;
    avatar_url: string | null;
    total_points: number;
    current_streak: number;
    longest_streak: number;
  }>> {
    return query(
      `SELECT u.id AS user_id, u.display_name, u.avatar_url,
              COALESCE(us.total_points, 0)::int AS total_points,
              COALESCE(us.current_streak, 0)::int AS current_streak,
              COALESCE(us.longest_streak, 0)::int AS longest_streak
       FROM users u
       LEFT JOIN user_streaks us ON us.user_id = u.id
       WHERE COALESCE(us.total_points, 0) > 0
       ORDER BY total_points DESC
       LIMIT $1`,
      [limit]
    );
  },

  async addPoints(userId: string, points: number): Promise<void> {
    await query(
      `UPDATE user_streaks SET total_points = COALESCE(total_points, 0) + $1 WHERE user_id = $2`,
      [points, userId]
    );
    // If no row exists, insert one
    const result = await queryOne<{ user_id: string }>(
      'SELECT user_id FROM user_streaks WHERE user_id = $1',
      [userId]
    );
    if (!result) {
      await query(
        `INSERT INTO user_streaks (user_id, total_points, current_streak, longest_streak)
         VALUES ($1, $2, 0, 0)
         ON CONFLICT (user_id) DO UPDATE SET total_points = COALESCE(user_streaks.total_points, 0) + $2`,
        [userId, points]
      );
    }
  },
};
