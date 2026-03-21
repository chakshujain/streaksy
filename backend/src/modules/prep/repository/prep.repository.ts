import { query, queryOne } from '../../../config/database';

export interface RoadmapRow {
  id: string;
  user_id: string;
  group_id: string | null;
  answers: Record<string, unknown>;
  days: Record<string, unknown>[];
  total_days: number;
  share_code: string;
  created_at: Date;
  updated_at: Date;
}

export interface RoadmapProgressRow {
  roadmap_id: string;
  user_id: string;
  day_number: number;
  completed: boolean;
  completed_at: Date | null;
}

export interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  completed_count: number;
}

export const prepRepository = {
  async create(
    userId: string,
    answers: Record<string, unknown>,
    days: Record<string, unknown>[],
    totalDays: number,
    groupId?: string
  ): Promise<RoadmapRow> {
    const rows = await query<RoadmapRow>(
      `INSERT INTO interview_roadmaps (user_id, answers, days, total_days, group_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, JSON.stringify(answers), JSON.stringify(days), totalDays, groupId || null]
    );
    return rows[0];
  },

  async getActive(userId: string): Promise<RoadmapRow | null> {
    return queryOne<RoadmapRow>(
      `SELECT * FROM interview_roadmaps
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [userId]
    );
  },

  async getById(id: string): Promise<RoadmapRow | null> {
    return queryOne<RoadmapRow>(
      'SELECT * FROM interview_roadmaps WHERE id = $1',
      [id]
    );
  },

  async getByShareCode(code: string): Promise<RoadmapRow | null> {
    return queryOne<RoadmapRow>(
      'SELECT * FROM interview_roadmaps WHERE share_code = $1',
      [code]
    );
  },

  async updateProgress(
    roadmapId: string,
    userId: string,
    dayNumber: number,
    completed: boolean
  ): Promise<RoadmapProgressRow> {
    const rows = await query<RoadmapProgressRow>(
      `INSERT INTO roadmap_progress (roadmap_id, user_id, day_number, completed, completed_at)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (roadmap_id, user_id, day_number) DO UPDATE SET
         completed = $4,
         completed_at = $5
       RETURNING *`,
      [roadmapId, userId, dayNumber, completed, completed ? new Date() : null]
    );
    return rows[0];
  },

  async getProgress(roadmapId: string): Promise<RoadmapProgressRow[]> {
    return query<RoadmapProgressRow>(
      'SELECT * FROM roadmap_progress WHERE roadmap_id = $1 ORDER BY day_number',
      [roadmapId]
    );
  },

  async getUserProgress(roadmapId: string, userId: string): Promise<RoadmapProgressRow[]> {
    return query<RoadmapProgressRow>(
      'SELECT * FROM roadmap_progress WHERE roadmap_id = $1 AND user_id = $2 ORDER BY day_number',
      [roadmapId, userId]
    );
  },

  async linkGroup(roadmapId: string, groupId: string): Promise<void> {
    await query(
      'UPDATE interview_roadmaps SET group_id = $1, updated_at = NOW() WHERE id = $2',
      [groupId, roadmapId]
    );
  },

  async getLeaderboard(roadmapId: string): Promise<LeaderboardEntry[]> {
    return query<LeaderboardEntry>(
      `SELECT rp.user_id, u.display_name, u.avatar_url,
              COUNT(*) FILTER (WHERE rp.completed = true)::int AS completed_count
       FROM roadmap_progress rp
       JOIN users u ON u.id = rp.user_id
       WHERE rp.roadmap_id = $1
       GROUP BY rp.user_id, u.display_name, u.avatar_url
       ORDER BY completed_count DESC`,
      [roadmapId]
    );
  },
};
