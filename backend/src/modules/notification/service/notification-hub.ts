import { notificationRepository } from '../repository/notification.repository';
import { pushService } from './push.service';
import { sendEmail } from '../../../config/email';
import { env } from '../../../config/env';
import { query, queryOne } from '../../../config/database';
import { logger } from '../../../config/logger';

const log = logger.child({ module: 'notification-hub' });

/**
 * Notification category → determines which preference toggle controls it
 */
type NotifCategory = 'social' | 'roadmap' | 'room' | 'achievement' | 'smart';

/**
 * Maps notification types to categories
 */
const TYPE_CATEGORY: Record<string, NotifCategory> = {
  // Social
  poke: 'social',
  friend_request: 'social',
  friend_accepted: 'social',
  group_join: 'social',
  group_activity: 'social',
  feed_like: 'social',
  feed_comment: 'social',
  // Roadmap
  roadmap_started: 'roadmap',
  roadmap_complete: 'roadmap',
  roadmap_streak: 'roadmap',
  roadmap_reminder: 'roadmap',
  // Room
  room_join: 'room',
  room_start: 'room',
  room_end: 'room',
  room_solve: 'room',
  // Achievement
  badge_earned: 'achievement',
  streak_milestone: 'achievement',
  recovery_challenge: 'achievement',
  recovery_complete: 'achievement',
  // Smart
  lagging_behind: 'smart',
  friend_solving: 'smart',
  inactivity_warning: 'smart',
};

interface NotifPrefs {
  in_app_enabled: boolean;
  email_enabled: boolean;
  push_enabled: boolean;
  social_enabled: boolean;
  roadmap_enabled: boolean;
  room_enabled: boolean;
  achievement_enabled: boolean;
  smart_enabled: boolean;
  quiet_start: string;
  quiet_end: string;
}

const DEFAULT_PREFS: NotifPrefs = {
  in_app_enabled: true,
  email_enabled: true,
  push_enabled: true,
  social_enabled: true,
  roadmap_enabled: true,
  room_enabled: true,
  achievement_enabled: true,
  smart_enabled: true,
  quiet_start: '22:00',
  quiet_end: '07:00',
};

async function getUserPrefs(userId: string): Promise<NotifPrefs> {
  const row = await queryOne<NotifPrefs>(
    'SELECT * FROM notification_preferences WHERE user_id = $1',
    [userId]
  );
  return row || DEFAULT_PREFS;
}

function isQuietHour(prefs: NotifPrefs): boolean {
  const now = new Date();
  const hour = now.getUTCHours();
  const min = now.getUTCMinutes();
  const current = hour * 60 + min;
  const [qs, qe] = [prefs.quiet_start, prefs.quiet_end].map(t => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  });
  // Handle overnight quiet hours (e.g., 22:00 - 07:00)
  if (qs > qe) return current >= qs || current < qe;
  return current >= qs && current < qe;
}

function isCategoryEnabled(prefs: NotifPrefs, category: NotifCategory): boolean {
  const key = `${category}_enabled` as keyof NotifPrefs;
  return prefs[key] !== false;
}

/**
 * Email template generator for notification types
 */
function buildNotifEmail(type: string, title: string, body: string, data?: Record<string, unknown>): { subject: string; html: string } | null {
  const actionUrl = getActionUrl(type, data);
  const actionText = getActionText(type);

  return {
    subject: title,
    html: `<!DOCTYPE html><html><head><style>
      body { margin: 0; padding: 0; background: #09090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
      .container { max-width: 560px; margin: 0 auto; padding: 32px 16px; }
      .card { background: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 32px; }
      .logo { font-size: 20px; font-weight: bold; margin-bottom: 20px; }
      .logo span { color: #10b981; }
      h2 { color: #f4f4f5; margin: 0 0 12px; font-size: 18px; }
      p { color: #a1a1aa; line-height: 1.6; margin: 8px 0; font-size: 15px; }
      .highlight { color: #10b981; font-weight: 600; }
      .btn { display: inline-block; background: linear-gradient(135deg, #10b981, #06b6d4); color: #fff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px; }
      .footer { text-align: center; color: #52525b; font-size: 12px; margin-top: 24px; }
    </style></head><body>
    <div class="container"><div class="card">
      <div class="logo">🔥 <span>Streaksy</span></div>
      <h2>${escHtml(title)}</h2>
      <p>${escHtml(body)}</p>
      ${actionUrl ? `<div style="text-align:center;"><a href="${actionUrl}" class="btn">${actionText}</a></div>` : ''}
    </div>
    <div class="footer">Streaksy — Crush Your Goals With Friends<br/>
      <a href="${env.frontendUrl}/settings" style="color:#52525b;">Manage notifications</a>
    </div></div></body></html>`,
  };
}

function getActionUrl(type: string, data?: Record<string, unknown>): string {
  if (!data) return `${env.frontendUrl}/dashboard`;
  switch (type) {
    case 'poke':
    case 'friend_request':
    case 'friend_accepted':
      return `${env.frontendUrl}/friends`;
    case 'group_join':
    case 'group_activity':
      return data.groupId ? `${env.frontendUrl}/groups/${data.groupId}` : `${env.frontendUrl}/groups`;
    case 'room_join':
    case 'room_start':
    case 'room_end':
    case 'room_solve':
      return data.roomId ? `${env.frontendUrl}/rooms/${data.roomId}` : `${env.frontendUrl}/rooms`;
    case 'badge_earned':
      return `${env.frontendUrl}/achievements`;
    case 'roadmap_complete':
    case 'roadmap_started':
    case 'roadmap_streak':
    case 'roadmap_reminder':
      return data.roadmapId ? `${env.frontendUrl}/roadmaps/${data.roadmapId}` : `${env.frontendUrl}/roadmaps`;
    case 'streak_milestone':
      return `${env.frontendUrl}/dashboard`;
    case 'lagging_behind':
    case 'friend_solving':
      return `${env.frontendUrl}/dashboard`;
    default:
      return `${env.frontendUrl}/notifications`;
  }
}

function getActionText(type: string): string {
  switch (type) {
    case 'poke': return 'Solve Now →';
    case 'friend_request': return 'View Requests →';
    case 'friend_accepted': return 'View Friends →';
    case 'room_start':
    case 'room_join': return 'Join Room →';
    case 'badge_earned': return 'View Achievements →';
    case 'roadmap_reminder': return 'Continue →';
    case 'lagging_behind':
    case 'friend_solving': return 'Catch Up →';
    default: return 'Open Streaksy →';
  }
}

function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * The Notification Hub — central dispatcher for all channels.
 *
 * Usage: `notificationHub.send(userId, type, title, body, data)`
 *
 * This dispatches to:
 * 1. In-app (database + WebSocket) — always, unless user disabled
 * 2. Browser Push — if subscribed and not quiet hours
 * 3. Email — for important types, if enabled and not quiet hours
 */
export const notificationHub = {
  /**
   * Send a notification through all enabled channels
   */
  async send(
    userId: string,
    type: string,
    title: string,
    body?: string,
    data?: Record<string, unknown>,
    opts?: { skipEmail?: boolean; skipPush?: boolean; emailOverride?: { subject: string; html: string } }
  ): Promise<void> {
    const prefs = await getUserPrefs(userId);
    const category = TYPE_CATEGORY[type] || 'social';

    // Check if category is enabled
    if (!isCategoryEnabled(prefs, category)) return;

    const quiet = isQuietHour(prefs);

    // 1. In-app notification (always unless disabled)
    if (prefs.in_app_enabled) {
      try {
        await notificationRepository.create(userId, type, title, body, data);
        // Push via WebSocket
        import('../../../config/socket')
          .then(m => m.pushNotification(userId, { type, title, body }))
          .catch(() => {});
      } catch (err) {
        log.error({ err, userId, type }, 'Failed to create in-app notification');
      }
    }

    // 2. Browser Push (if subscribed, enabled, and not quiet hours)
    if (prefs.push_enabled && !quiet && !opts?.skipPush) {
      pushService.sendPush(userId, {
        title,
        body: body || '',
        url: getActionUrl(type, data),
        tag: type,
      }).catch(err => log.error({ err, userId }, 'Failed to send push'));
    }

    // 3. Email (for important types, if enabled and not quiet hours)
    if (prefs.email_enabled && !quiet && !opts?.skipEmail) {
      const shouldEmail = this.shouldSendEmail(type);
      if (shouldEmail) {
        this.sendNotifEmail(userId, type, title, body || '', data, opts?.emailOverride).catch(() => {});
      }
    }
  },

  /**
   * Send to multiple users (e.g., all room participants)
   */
  async sendToMany(
    userIds: string[],
    type: string,
    title: string,
    body?: string,
    data?: Record<string, unknown>,
    opts?: { excludeUserId?: string; skipEmail?: boolean }
  ): Promise<void> {
    const filtered = opts?.excludeUserId
      ? userIds.filter(id => id !== opts.excludeUserId)
      : userIds;

    // Parallel dispatch
    await Promise.allSettled(
      filtered.map(userId => this.send(userId, type, title, body, data, opts))
    );
  },

  /**
   * Determine if a notification type should trigger an email
   * (we don't email for every notification — only important ones)
   */
  shouldSendEmail(type: string): boolean {
    const emailTypes = new Set([
      'poke',
      'friend_request',
      'room_start',
      'badge_earned',
      'streak_milestone',
      'lagging_behind',
      'inactivity_warning',
      'roadmap_complete',
    ]);
    return emailTypes.has(type);
  },

  /**
   * Send email notification
   */
  async sendNotifEmail(
    userId: string,
    type: string,
    title: string,
    body: string,
    data?: Record<string, unknown>,
    override?: { subject: string; html: string }
  ): Promise<void> {
    // Get user email
    const user = await queryOne<{ email: string; display_name: string }>(
      'SELECT email, display_name FROM users WHERE id = $1',
      [userId]
    );
    if (!user) return;

    const email = override || buildNotifEmail(type, title, body, data);
    if (!email) return;

    await sendEmail(user.email, email.subject, email.html);
  },

  /**
   * Get/update notification preferences
   */
  async getPreferences(userId: string): Promise<NotifPrefs> {
    return getUserPrefs(userId);
  },

  async updatePreferences(userId: string, prefs: Partial<NotifPrefs>): Promise<void> {
    const fields: string[] = [];
    const values: unknown[] = [userId];
    let i = 2;

    for (const [key, val] of Object.entries(prefs)) {
      if (key in DEFAULT_PREFS) {
        fields.push(`${key} = $${i}`);
        values.push(val);
        i++;
      }
    }

    if (fields.length === 0) return;

    await query(
      `INSERT INTO notification_preferences (user_id, ${Object.keys(prefs).filter(k => k in DEFAULT_PREFS).join(', ')})
       VALUES ($1, ${Object.keys(prefs).filter(k => k in DEFAULT_PREFS).map((_, idx) => `$${idx + 2}`).join(', ')})
       ON CONFLICT (user_id) DO UPDATE SET ${fields.join(', ')}`,
      values
    );
  },
};
