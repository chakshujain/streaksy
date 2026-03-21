import { query, queryOne } from '../../../config/database';

export interface FeedEventRow {
  id: string;
  user_id: string;
  event_type: string;
  title: string;
  description: string | null;
  metadata: Record<string, unknown>;
  created_at: Date;
  display_name?: string;
  avatar_url?: string;
  like_count?: number;
  comment_count?: number;
  liked_by_me?: boolean;
}

export interface FeedCommentRow {
  id: string;
  feed_event_id: string;
  user_id: string;
  content: string;
  created_at: Date;
  display_name?: string;
}

export const feedRepository = {
  async createEvent(userId: string, eventType: string, title: string, description?: string, metadata?: Record<string, unknown>): Promise<FeedEventRow> {
    const rows = await query<FeedEventRow>(
      `INSERT INTO feed_events (user_id, event_type, title, description, metadata)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, eventType, title, description || null, JSON.stringify(metadata || {})]
    );
    return rows[0];
  },

  async getFeed(currentUserId: string, limit = 30, offset = 0): Promise<FeedEventRow[]> {
    return query<FeedEventRow>(
      `SELECT fe.*,
              u.display_name, u.avatar_url,
              (SELECT COUNT(*)::int FROM feed_likes fl WHERE fl.feed_event_id = fe.id) as like_count,
              (SELECT COUNT(*)::int FROM feed_comments fc WHERE fc.feed_event_id = fe.id) as comment_count,
              EXISTS(SELECT 1 FROM feed_likes fl WHERE fl.feed_event_id = fe.id AND fl.user_id = $1) as liked_by_me
       FROM feed_events fe
       JOIN users u ON u.id = fe.user_id
       WHERE fe.user_id IN (
         SELECT gm2.user_id FROM group_members gm
         JOIN group_members gm2 ON gm2.group_id = gm.group_id
         WHERE gm.user_id = $1
       ) OR fe.user_id = $1
       OR fe.user_id IN (
         SELECT CASE WHEN requester_id = $1 THEN addressee_id ELSE requester_id END
         FROM friendships
         WHERE (requester_id = $1 OR addressee_id = $1) AND status = 'accepted'
       )
       ORDER BY fe.created_at DESC
       LIMIT $2 OFFSET $3`,
      [currentUserId, limit, offset]
    );
  },

  async getUserFeed(userId: string, currentUserId: string, limit = 20, offset = 0): Promise<FeedEventRow[]> {
    return query<FeedEventRow>(
      `SELECT fe.*,
              u.display_name, u.avatar_url,
              (SELECT COUNT(*)::int FROM feed_likes fl WHERE fl.feed_event_id = fe.id) as like_count,
              (SELECT COUNT(*)::int FROM feed_comments fc WHERE fc.feed_event_id = fe.id) as comment_count,
              EXISTS(SELECT 1 FROM feed_likes fl WHERE fl.feed_event_id = fe.id AND fl.user_id = $2) as liked_by_me
       FROM feed_events fe
       JOIN users u ON u.id = fe.user_id
       WHERE fe.user_id = $1
       ORDER BY fe.created_at DESC
       LIMIT $3 OFFSET $4`,
      [userId, currentUserId, limit, offset]
    );
  },

  async toggleLike(eventId: string, userId: string): Promise<boolean> {
    const existing = await queryOne<{ feed_event_id: string }>(
      'SELECT feed_event_id FROM feed_likes WHERE feed_event_id = $1 AND user_id = $2',
      [eventId, userId]
    );
    if (existing) {
      await query('DELETE FROM feed_likes WHERE feed_event_id = $1 AND user_id = $2', [eventId, userId]);
      return false;
    } else {
      await query('INSERT INTO feed_likes (feed_event_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [eventId, userId]);
      return true;
    }
  },

  async addComment(eventId: string, userId: string, content: string): Promise<FeedCommentRow> {
    const rows = await query<FeedCommentRow>(
      `INSERT INTO feed_comments (feed_event_id, user_id, content)
       VALUES ($1, $2, $3) RETURNING *`,
      [eventId, userId, content]
    );
    return rows[0];
  },

  async getComments(eventId: string): Promise<FeedCommentRow[]> {
    return query<FeedCommentRow>(
      `SELECT fc.*, u.display_name FROM feed_comments fc
       JOIN users u ON u.id = fc.user_id
       WHERE fc.feed_event_id = $1 ORDER BY fc.created_at ASC`,
      [eventId]
    );
  },

  async deleteComment(commentId: string, userId: string): Promise<void> {
    await query('DELETE FROM feed_comments WHERE id = $1 AND user_id = $2', [commentId, userId]);
  },

  async getLikeCount(eventId: string): Promise<number> {
    const row = await queryOne<{ count: string }>('SELECT COUNT(*)::int as count FROM feed_likes WHERE feed_event_id = $1', [eventId]);
    return Number(row?.count || 0);
  },
};
