import webpush from 'web-push';
import { env } from '../../../config/env';
import { query } from '../../../config/database';
import { logger } from '../../../config/logger';

// Configure web-push with VAPID keys
webpush.setVapidDetails(
  env.vapid.subject,
  env.vapid.publicKey,
  env.vapid.privateKey
);

interface PushSubscriptionRow {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
}

export const pushService = {
  /** Save a push subscription for a user */
  async subscribe(userId: string, subscription: { endpoint: string; keys: { p256dh: string; auth: string } }, userAgent?: string): Promise<void> {
    await query(
      `INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth, user_agent)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, endpoint) DO UPDATE SET p256dh = $3, auth = $4, user_agent = $5`,
      [userId, subscription.endpoint, subscription.keys.p256dh, subscription.keys.auth, userAgent || null]
    );
  },

  /** Remove a push subscription */
  async unsubscribe(userId: string, endpoint: string): Promise<void> {
    await query('DELETE FROM push_subscriptions WHERE user_id = $1 AND endpoint = $2', [userId, endpoint]);
  },

  /** Send push notification to all of a user's devices */
  async sendPush(userId: string, payload: { title: string; body?: string; icon?: string; url?: string; tag?: string }): Promise<number> {
    const subs = await query<PushSubscriptionRow>(
      'SELECT * FROM push_subscriptions WHERE user_id = $1',
      [userId]
    );

    if (subs.length === 0) return 0;

    const data = JSON.stringify({
      title: payload.title,
      body: payload.body || '',
      icon: payload.icon || '/icons/icon-192.png',
      badge: '/icons/badge-72.png',
      url: payload.url || '/',
      tag: payload.tag || 'streaksy',
    });

    let sent = 0;
    for (const sub of subs) {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          data
        );
        sent++;
      } catch (err: any) {
        // If subscription is expired/invalid, clean it up
        if (err.statusCode === 410 || err.statusCode === 404) {
          await query('DELETE FROM push_subscriptions WHERE id = $1', [sub.id]);
          logger.info({ userId, endpoint: sub.endpoint }, 'Removed expired push subscription');
        } else {
          logger.error({ err, userId }, 'Failed to send push notification');
        }
      }
    }
    return sent;
  },

  /** Get VAPID public key (for frontend) */
  getPublicKey(): string {
    return env.vapid.publicKey;
  },
};
