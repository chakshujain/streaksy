import { query, queryOne } from '../../../config/database';

export interface FriendshipRow {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface FriendRow {
  id: string;
  friendship_id: string;
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  current_streak: number;
  total_points: number;
  last_active: Date | null;
}

export interface UserSearchRow {
  id: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  friendship_status: string | null;
  friendship_id: string | null;
}

export const friendsRepository = {
  async sendRequest(requesterId: string, addresseeId: string): Promise<FriendshipRow> {
    const rows = await query<FriendshipRow>(
      `INSERT INTO friendships (requester_id, addressee_id, status)
       VALUES ($1, $2, 'pending')
       RETURNING *`,
      [requesterId, addresseeId]
    );
    return rows[0];
  },

  async acceptRequest(friendshipId: string, userId: string): Promise<FriendshipRow | null> {
    const rows = await query<FriendshipRow>(
      `UPDATE friendships
       SET status = 'accepted', updated_at = NOW()
       WHERE id = $1 AND addressee_id = $2 AND status = 'pending'
       RETURNING *`,
      [friendshipId, userId]
    );
    return rows[0] ?? null;
  },

  async rejectRequest(friendshipId: string, userId: string): Promise<boolean> {
    const rows = await query<FriendshipRow>(
      `DELETE FROM friendships
       WHERE id = $1 AND (addressee_id = $2 OR requester_id = $2) AND status = 'pending'
       RETURNING id`,
      [friendshipId, userId]
    );
    return rows.length > 0;
  },

  async removeFriend(userId: string, friendId: string): Promise<boolean> {
    const rows = await query<FriendshipRow>(
      `DELETE FROM friendships
       WHERE status = 'accepted'
         AND ((requester_id = $1 AND addressee_id = $2)
           OR (requester_id = $2 AND addressee_id = $1))
       RETURNING id`,
      [userId, friendId]
    );
    return rows.length > 0;
  },

  async removeByFriendshipId(friendshipId: string, userId: string): Promise<boolean> {
    const rows = await query<FriendshipRow>(
      `DELETE FROM friendships
       WHERE id = $1
         AND (requester_id = $2 OR addressee_id = $2)
       RETURNING id`,
      [friendshipId, userId]
    );
    return rows.length > 0;
  },

  async getFriends(userId: string): Promise<FriendRow[]> {
    return query<FriendRow>(
      `SELECT
         f.id AS friendship_id,
         u.id AS user_id,
         u.display_name,
         u.avatar_url,
         u.bio,
         COALESCE(s.current_streak, 0) AS current_streak,
         COALESCE(s.total_points, 0) AS total_points,
         u.updated_at AS last_active
       FROM friendships f
       JOIN users u ON u.id = CASE
         WHEN f.requester_id = $1 THEN f.addressee_id
         ELSE f.requester_id
       END
       LEFT JOIN user_streaks s ON s.user_id = u.id
       WHERE f.status = 'accepted'
         AND (f.requester_id = $1 OR f.addressee_id = $1)
       ORDER BY u.display_name`,
      [userId]
    );
  },

  async getPendingRequests(userId: string): Promise<FriendRow[]> {
    return query<FriendRow>(
      `SELECT
         f.id AS friendship_id,
         u.id AS user_id,
         u.display_name,
         u.avatar_url,
         u.bio,
         COALESCE(s.current_streak, 0) AS current_streak,
         COALESCE(s.total_points, 0) AS total_points,
         f.created_at AS last_active
       FROM friendships f
       JOIN users u ON u.id = f.requester_id
       LEFT JOIN user_streaks s ON s.user_id = u.id
       WHERE f.addressee_id = $1 AND f.status = 'pending'
       ORDER BY f.created_at DESC`,
      [userId]
    );
  },

  async getSentRequests(userId: string): Promise<FriendRow[]> {
    return query<FriendRow>(
      `SELECT
         f.id AS friendship_id,
         u.id AS user_id,
         u.display_name,
         u.avatar_url,
         u.bio,
         COALESCE(s.current_streak, 0) AS current_streak,
         COALESCE(s.total_points, 0) AS total_points,
         f.created_at AS last_active
       FROM friendships f
       JOIN users u ON u.id = f.addressee_id
       LEFT JOIN user_streaks s ON s.user_id = u.id
       WHERE f.requester_id = $1 AND f.status = 'pending'
       ORDER BY f.created_at DESC`,
      [userId]
    );
  },

  async getFriendshipStatus(userId1: string, userId2: string): Promise<FriendshipRow | null> {
    return queryOne<FriendshipRow>(
      `SELECT * FROM friendships
       WHERE (requester_id = $1 AND addressee_id = $2)
          OR (requester_id = $2 AND addressee_id = $1)`,
      [userId1, userId2]
    );
  },

  async getFriendIds(userId: string): Promise<string[]> {
    const rows = await query<{ friend_id: string }>(
      `SELECT CASE WHEN requester_id = $1 THEN addressee_id ELSE requester_id END AS friend_id
       FROM friendships WHERE (requester_id = $1 OR addressee_id = $1) AND status = 'accepted'`,
      [userId]
    );
    return rows.map(r => r.friend_id);
  },

  async getFriendsWithContext(userId: string) {
    // Step 1: get accepted friends with profile data
    const friends = await query<{
      friendship_id: string;
      user_id: string;
      display_name: string;
      avatar_url: string | null;
      bio: string | null;
      current_streak: number;
      total_points: number;
      last_active: string | null;
    }>(
      `SELECT f.id AS friendship_id,
              CASE WHEN f.requester_id = $1 THEN f.addressee_id ELSE f.requester_id END AS user_id,
              u.display_name, u.avatar_url, u.bio,
              COALESCE(us.current_streak, 0)::int AS current_streak,
              COALESCE(us.total_points, 0)::int AS total_points,
              u.last_active_at AS last_active
       FROM friendships f
       JOIN users u ON u.id = CASE WHEN f.requester_id = $1 THEN f.addressee_id ELSE f.requester_id END
       LEFT JOIN user_streaks us ON us.user_id = u.id
       WHERE (f.requester_id = $1 OR f.addressee_id = $1) AND f.status = 'accepted'`,
      [userId]
    );

    if (friends.length === 0) return [];

    const friendIds = friends.map(f => f.user_id);

    // Step 2: shared groups (groups where both user and friend are members)
    const sharedGroups = await query<{ friend_id: string; group_id: string; group_name: string }>(
      `SELECT gm2.user_id AS friend_id, g.id AS group_id, g.name AS group_name
       FROM group_members gm1
       JOIN group_members gm2 ON gm2.group_id = gm1.group_id AND gm2.user_id = ANY($2::uuid[])
       JOIN groups g ON g.id = gm1.group_id
       WHERE gm1.user_id = $1`,
      [userId, friendIds]
    );

    // Step 3: friends' active roadmaps
    const activeRoadmaps = await query<{ user_id: string; roadmap_id: string; roadmap_name: string; template_slug: string | null }>(
      `SELECT ur.user_id, ur.id AS roadmap_id, ur.name AS roadmap_name, rt.slug AS template_slug
       FROM user_roadmaps ur
       LEFT JOIN roadmap_templates rt ON rt.id = ur.template_id
       WHERE ur.user_id = ANY($1::uuid[]) AND ur.status = 'active'`,
      [friendIds]
    );

    // Step 4: friends in active rooms
    const activeRooms = await query<{ user_id: string; room_id: string; room_name: string; room_code: string; room_status: string }>(
      `SELECT rp.user_id, r.id AS room_id, r.name AS room_name, r.code AS room_code, r.status AS room_status
       FROM room_participants rp
       JOIN rooms r ON r.id = rp.room_id
       WHERE rp.user_id = ANY($1::uuid[]) AND r.status IN ('waiting', 'active', 'scheduled')`,
      [friendIds]
    );

    // Step 5: assemble
    return friends.map(f => ({
      ...f,
      shared_groups: sharedGroups.filter(sg => sg.friend_id === f.user_id).map(sg => ({ id: sg.group_id, name: sg.group_name })),
      active_roadmaps: activeRoadmaps.filter(ar => ar.user_id === f.user_id).map(ar => ({ id: ar.roadmap_id, name: ar.roadmap_name, template_slug: ar.template_slug })),
      active_rooms: activeRooms.filter(ar => ar.user_id === f.user_id).map(ar => ({ id: ar.room_id, name: ar.room_name, code: ar.room_code, status: ar.room_status })),
    }));
  },

  async searchUsers(searchQuery: string, userId: string): Promise<UserSearchRow[]> {
    if (searchQuery.trim().length > 0) {
      return query<UserSearchRow>(
        `SELECT
           u.id, u.display_name, u.avatar_url, u.bio,
           f.status AS friendship_status, f.id AS friendship_id
         FROM users u
         LEFT JOIN friendships f ON (
           (f.requester_id = $2 AND f.addressee_id = u.id)
           OR (f.requester_id = u.id AND f.addressee_id = $2)
         )
         WHERE u.id != $2 AND u.display_name ILIKE $1
         ORDER BY u.display_name
         LIMIT 30`,
        [`%${searchQuery}%`, userId]
      );
    }
    // No query — return all users (suggested)
    return query<UserSearchRow>(
      `SELECT
         u.id, u.display_name, u.avatar_url, u.bio,
         f.status AS friendship_status, f.id AS friendship_id
       FROM users u
       LEFT JOIN friendships f ON (
         (f.requester_id = $1 AND f.addressee_id = u.id)
         OR (f.requester_id = u.id AND f.addressee_id = $1)
       )
       WHERE u.id != $1
       ORDER BY f.status ASC NULLS LAST, u.display_name
       LIMIT 30`,
      [userId]
    );
  },
};
