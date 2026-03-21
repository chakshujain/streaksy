import { query } from '../../../config/database';
import { notificationHub } from './notification-hub';
import { logger } from '../../../config/logger';

const log = logger.child({ module: 'smart-notifications' });

/**
 * Smart Notification Engine
 * Runs on a schedule to generate contextual, motivational notifications:
 * - "You're lagging behind" — when friends/group members are more active
 * - "Your friend just solved X" — real-time friend activity alerts
 * - "Streak at risk" — evening warnings for active streakers
 * - "Group members are waiting" — when group has active members but you haven't done today's task
 */
export const smartNotifications = {
  /**
   * Run all smart notification checks (called by scheduler every 30 min)
   */
  async runAll(): Promise<void> {
    try {
      await Promise.allSettled([
        this.checkLaggingBehind(),
        this.checkGroupPressure(),
        this.checkStreakAtRisk(),
      ]);
    } catch (err) {
      log.error({ err }, 'Smart notifications failed');
    }
  },

  /**
   * "You're lagging behind" — users whose friends solved more this week
   * Sent once per day, around 14:00 UTC (afternoon push)
   */
  async checkLaggingBehind(): Promise<number> {
    // Find users who have active friends that solved more this week
    const rows = await query<{
      user_id: string;
      user_name: string;
      user_solved: number;
      top_friend_name: string;
      top_friend_solved: number;
    }>(`
      WITH user_week AS (
        SELECT user_id, COUNT(*) as solved_count
        FROM user_problem_status
        WHERE status = 'solved' AND solved_at > NOW() - INTERVAL '7 days'
        GROUP BY user_id
      ),
      friend_week AS (
        SELECT
          f.user_id_1 as user_id,
          f.user_id_2 as friend_id,
          COALESCE(uw.solved_count, 0) as friend_solved,
          u2.display_name as friend_name
        FROM friendships f
        JOIN users u2 ON u2.id = f.user_id_2
        LEFT JOIN user_week uw ON uw.user_id = f.user_id_2
        WHERE f.status = 'accepted'
        UNION ALL
        SELECT
          f.user_id_2 as user_id,
          f.user_id_1 as friend_id,
          COALESCE(uw.solved_count, 0) as friend_solved,
          u1.display_name as friend_name
        FROM friendships f
        JOIN users u1 ON u1.id = f.user_id_1
        LEFT JOIN user_week uw ON uw.user_id = f.user_id_1
        WHERE f.status = 'accepted'
      )
      SELECT
        u.id as user_id,
        u.display_name as user_name,
        COALESCE(uw.solved_count, 0)::int as user_solved,
        fw.friend_name as top_friend_name,
        fw.friend_solved::int as top_friend_solved
      FROM users u
      LEFT JOIN user_week uw ON uw.user_id = u.id
      JOIN (
        SELECT DISTINCT ON (user_id)
          user_id, friend_name, friend_solved
        FROM friend_week
        ORDER BY user_id, friend_solved DESC
      ) fw ON fw.user_id = u.id
      JOIN notification_preferences np ON np.user_id = u.id AND np.smart_enabled = true
      WHERE fw.friend_solved > COALESCE(uw.solved_count, 0) + 2
        AND NOT EXISTS (
          SELECT 1 FROM notifications n
          WHERE n.user_id = u.id AND n.type = 'lagging_behind'
            AND n.created_at > NOW() - INTERVAL '24 hours'
        )
      LIMIT 100
    `);

    let sent = 0;
    for (const row of rows) {
      const diff = row.top_friend_solved - row.user_solved;
      const title = `${row.top_friend_name} is ${diff} problems ahead this week`;
      const body = row.user_solved === 0
        ? `${row.top_friend_name} has solved ${row.top_friend_solved} problems this week while you haven't started yet. Time to catch up!`
        : `You've solved ${row.user_solved} problems, but ${row.top_friend_name} has solved ${row.top_friend_solved}. Don't fall behind!`;

      await notificationHub.send(row.user_id, 'lagging_behind', title, body).catch(() => {});
      sent++;
    }

    if (sent > 0) log.info({ sent }, 'Lagging-behind notifications sent');
    return sent;
  },

  /**
   * "Your group is waiting" — group members who haven't done today's roadmap task
   * while other members have
   */
  async checkGroupPressure(): Promise<number> {
    const rows = await query<{
      user_id: string;
      group_name: string;
      active_count: number;
      group_id: string;
    }>(`
      WITH today_active AS (
        SELECT DISTINCT rdp.user_id, ur.group_id
        FROM roadmap_day_progress rdp
        JOIN user_roadmaps ur ON ur.id = rdp.roadmap_id
        WHERE rdp.completed = true
          AND rdp.completed_at::date = CURRENT_DATE
          AND ur.group_id IS NOT NULL
      ),
      group_activity AS (
        SELECT group_id, COUNT(*) as active_count
        FROM today_active
        GROUP BY group_id
      )
      SELECT
        gm.user_id,
        g.name as group_name,
        ga.active_count::int,
        g.id as group_id
      FROM group_members gm
      JOIN groups g ON g.id = gm.group_id
      JOIN group_activity ga ON ga.group_id = gm.group_id
      WHERE gm.user_id NOT IN (SELECT user_id FROM today_active WHERE group_id = gm.group_id)
        AND ga.active_count >= 2
        AND NOT EXISTS (
          SELECT 1 FROM notifications n
          WHERE n.user_id = gm.user_id AND n.type = 'group_activity'
            AND n.created_at > NOW() - INTERVAL '12 hours'
        )
      LIMIT 100
    `);

    let sent = 0;
    for (const row of rows) {
      const title = `${row.active_count} members in "${row.group_name}" already completed today's task`;
      const body = `Don't be the last one! Your group is making progress — join them.`;

      await notificationHub.send(row.user_id, 'group_activity', title, body, { groupId: row.group_id }).catch(() => {});
      sent++;
    }

    if (sent > 0) log.info({ sent }, 'Group pressure notifications sent');
    return sent;
  },

  /**
   * "Streak at risk" — users with active streaks who haven't solved today
   * Sent in the evening (around 18:00-20:00 UTC)
   */
  async checkStreakAtRisk(): Promise<number> {
    const rows = await query<{
      user_id: string;
      current_streak: number;
    }>(`
      SELECT us.user_id, us.current_streak
      FROM user_streaks us
      WHERE us.current_streak >= 3
        AND NOT EXISTS (
          SELECT 1 FROM user_problem_status ups
          WHERE ups.user_id = us.user_id
            AND ups.status = 'solved'
            AND ups.solved_at::date = CURRENT_DATE
        )
        AND NOT EXISTS (
          SELECT 1 FROM notifications n
          WHERE n.user_id = us.user_id AND n.type = 'inactivity_warning'
            AND n.created_at > NOW() - INTERVAL '12 hours'
        )
      LIMIT 100
    `);

    let sent = 0;
    for (const row of rows) {
      const title = `Your ${row.current_streak}-day streak is at risk!`;
      const body = row.current_streak >= 30
        ? `You've built an incredible ${row.current_streak}-day streak. Don't let it slip — solve just one problem before midnight!`
        : row.current_streak >= 7
          ? `${row.current_streak} days of consistency is impressive! Solve one problem to keep it alive.`
          : `You're ${row.current_streak} days in — don't break the chain! One problem is all it takes.`;

      await notificationHub.send(row.user_id, 'inactivity_warning', title, body).catch(() => {});
      sent++;
    }

    if (sent > 0) log.info({ sent }, 'Streak-at-risk notifications sent');
    return sent;
  },

  /**
   * Real-time "friend just solved" — called from sync service when a user solves
   * Notifies close friends who are currently online
   */
  async notifyFriendsOfSolve(userId: string, problemTitle: string, difficulty: string): Promise<void> {
    const friends = await query<{ friend_id: string }>(
      `SELECT CASE WHEN user_id_1 = $1 THEN user_id_2 ELSE user_id_1 END as friend_id
       FROM friendships
       WHERE (user_id_1 = $1 OR user_id_2 = $1) AND status = 'accepted'`,
      [userId]
    );

    const user = await query<{ display_name: string }>('SELECT display_name FROM users WHERE id = $1', [userId]);
    const name = user[0]?.display_name || 'A friend';

    const diffEmoji = difficulty === 'hard' ? '🔴' : difficulty === 'medium' ? '🟡' : '🟢';
    const title = `${name} just solved "${problemTitle}" ${diffEmoji}`;
    const body = difficulty === 'hard'
      ? `${name} crushed a hard problem! Can you do the same?`
      : `${name} is on fire today! Don't fall behind.`;

    // Only send to friends who have smart notifications enabled (via push only, no email)
    for (const f of friends) {
      await notificationHub.send(f.friend_id, 'friend_solving', title, body, {}, { skipEmail: true }).catch(() => {});
    }
  },
};
