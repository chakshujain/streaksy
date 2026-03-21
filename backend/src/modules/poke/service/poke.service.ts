import { pokeRepository } from '../repository/poke.repository';
import { humorEngine } from './humor';
import { notificationService } from '../../notification/service/notification.service';
import { sendEmail } from '../../../config/email';
import { authRepository } from '../../auth/repository/auth.repository';
import { groupRepository } from '../../group/repository/group.repository';
import { AppError } from '../../../common/errors/AppError';
import { logger } from '../../../config/logger';
import { env } from '../../../config/env';

const DAILY_POKE_LIMIT = 10;

export const pokeService = {
  /** Manual poke: friend pokes another user */
  async pokeFriend(fromUserId: string, toUserId: string, groupId?: string, customMessage?: string) {
    if (fromUserId === toUserId) throw AppError.badRequest("You can't poke yourself!");

    // Verify both users are members of the group if groupId is provided
    if (groupId) {
      const [fromIsMember, toIsMember] = await Promise.all([
        groupRepository.isMember(groupId, fromUserId),
        groupRepository.isMember(groupId, toUserId),
      ]);
      if (!fromIsMember) throw AppError.forbidden('You are not a member of this group');
      if (!toIsMember) throw AppError.forbidden('Target user is not a member of this group');
    }

    // Rate limit: 1 poke per pair per 4 hours
    const recent = await pokeRepository.recentPokeBetween(fromUserId, toUserId);
    if (recent) throw AppError.badRequest('You already poked them recently. Give them some time!');

    // Daily limit
    const todayCount = await pokeRepository.pokessentToday(fromUserId);
    if (todayCount >= DAILY_POKE_LIMIT) throw AppError.badRequest(`You've reached the daily poke limit (${DAILY_POKE_LIMIT})`);

    const fromUser = await authRepository.findById(fromUserId);
    const toUser = await authRepository.findById(toUserId);
    if (!toUser) throw AppError.notFound('User not found');

    // Get escalation level for the target
    const level = await pokeRepository.getEscalationLevel(toUserId);
    const daysInactive = level === 0 ? 0 : level + 1;

    // Generate message
    const message = customMessage || humorEngine.friendPoke(
      toUser.display_name,
      fromUser?.display_name || 'Someone',
      daysInactive
    );

    const poke = await pokeRepository.create(fromUserId, toUserId, message, 'manual', 3, groupId);

    // Send in-app notification
    notificationService.notify(toUserId, 'poke', `${fromUser?.display_name} poked you! 👉`, message).catch(() => {});

    // Send email if user has email nudges enabled
    this.sendPokeEmail(toUser.email, toUser.display_name, message, fromUser?.display_name || 'A friend').catch(() => {});

    return poke;
  },

  /** Get pokes received by a user */
  async getMyPokes(userId: string, limit?: number, offset?: number) {
    return pokeRepository.getReceivedPokes(userId, limit, offset);
  },

  /** Get inactive members of a group (for "poke" UI) */
  async getInactiveMembers(groupId: string, days = 2) {
    return pokeRepository.getInactiveGroupMembers(groupId, days);
  },

  /** Streak risk alert — called by a scheduled job or on login */
  async checkStreakRisk(userId: string) {
    const user = await authRepository.findById(userId);
    if (!user) return null;

    const atRiskUsers = await pokeRepository.getStreakAtRiskUsers();
    const atRisk = atRiskUsers.find(u => u.user_id === userId);
    if (!atRisk) return null;

    // Calculate hours left (streak breaks at midnight)
    const now = new Date();
    const midnight = new Date(now);
    midnight.setDate(midnight.getDate() + 1);
    midnight.setHours(0, 0, 0, 0);
    const hoursLeft = Math.max(1, Math.round((midnight.getTime() - now.getTime()) / 3600000));

    return {
      atRisk: true,
      currentStreak: atRisk.current_streak,
      hoursLeft,
      message: humorEngine.streakRisk(atRisk.current_streak, hoursLeft),
    };
  },

  /** Create recovery challenge when streak breaks */
  async createRecoveryChallenge(userId: string) {
    const existing = await pokeRepository.getActiveChallenge(userId);
    if (existing) return existing;

    const expires = new Date();
    expires.setHours(23, 59, 59, 999); // end of today

    const targetCount = 3; // solve 3 to recover
    const challenge = await pokeRepository.createChallenge(userId, 'streak_recovery', targetCount, expires);

    // Notify
    const message = humorEngine.recovery(targetCount);
    notificationService.notify(userId, 'recovery_challenge', 'Streak Recovery Challenge! 🔥', message).catch(() => {});

    return { ...challenge, message };
  },

  /** Progress recovery challenge (called when user solves a problem) */
  async progressRecoveryChallenge(userId: string) {
    const challenge = await pokeRepository.getActiveChallenge(userId);
    if (!challenge) return null;

    const updated = await pokeRepository.incrementChallenge(challenge.id);
    if (updated?.status === 'completed') {
      notificationService.notify(userId, 'recovery_complete', 'Challenge Complete! 🎉', "You crushed the recovery challenge. You're back in the game!").catch(() => {});
    }
    return updated;
  },

  /** Get active recovery challenge for a user */
  async getActiveChallenge(userId: string) {
    return pokeRepository.getActiveChallenge(userId);
  },

  /** Send poke email with fun styling */
  async sendPokeEmail(toEmail: string, toName: string, message: string, fromName: string) {
    const html = `<!DOCTYPE html><html><head><style>
      body { margin: 0; padding: 0; background-color: #09090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
      .container { max-width: 560px; margin: 0 auto; padding: 40px 24px; }
      .card { background-color: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 40px 32px; text-align: center; }
      .logo { font-size: 24px; font-weight: 700; color: #f4f4f5; margin-bottom: 24px; }
      .logo span { color: #10b981; }
      .poke-emoji { font-size: 48px; margin-bottom: 16px; }
      h1 { color: #f4f4f5; font-size: 22px; font-weight: 600; margin: 0 0 12px 0; }
      p { color: #a1a1aa; font-size: 15px; line-height: 1.6; margin: 0 0 16px 0; }
      .message { background: #27272a; border-radius: 12px; padding: 20px; margin: 20px 0; color: #e4e4e7; font-size: 16px; font-style: italic; }
      .btn { display: inline-block; background: linear-gradient(135deg, #10b981, #06b6d4); color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 15px; margin: 8px 0; }
      .footer { color: #71717a; font-size: 12px; text-align: center; margin-top: 24px; }
    </style></head><body>
    <div class="container"><div class="card">
      <div class="logo">🔥 <span>Streaksy</span></div>
      <div class="poke-emoji">👉</div>
      <h1>${fromName.replace(/</g, '&lt;').replace(/>/g, '&gt;')} poked you!</h1>
      <div class="message">"${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}"</div>
      <p>Don't let your friends down. Solve a problem and show them what you've got!</p>
      <a href="${env.frontendUrl}/problems" class="btn">Solve a Problem Now</a>
    </div>
    <div class="footer">Streaksy — DSA Prep, Together<br/>Manage nudge settings in your preferences.</div>
    </div></body></html>`;

    return sendEmail(toEmail, `👉 ${fromName} poked you on Streaksy!`, html);
  },
};
