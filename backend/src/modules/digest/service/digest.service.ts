import { digestRepository } from '../repository/digest.repository';
import { sendEmail } from '../../../config/email';
import { env } from '../../../config/env';
import { logger } from '../../../config/logger';

function esc(str: string | number): string {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const baseStyles = `
  body { margin: 0; padding: 0; background: #09090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  .container { max-width: 600px; margin: 0 auto; padding: 32px 16px; }
  .card { background: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 32px; }
  .logo { font-size: 24px; font-weight: bold; color: #10b981; margin-bottom: 24px; }
  .logo span { background: linear-gradient(135deg, #10b981, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  h2 { color: #f4f4f5; margin: 0 0 16px; font-size: 20px; }
  p { color: #a1a1aa; line-height: 1.6; margin: 8px 0; }
  .stat-box { display: inline-block; background: #27272a; border-radius: 12px; padding: 16px 20px; margin: 6px; text-align: center; }
  .stat-value { font-size: 28px; font-weight: bold; color: #10b981; display: block; }
  .stat-label { font-size: 12px; color: #71717a; text-transform: uppercase; margin-top: 4px; display: block; }
  .btn { display: inline-block; background: linear-gradient(135deg, #10b981, #06b6d4); color: #fff; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px; }
  .footer { text-align: center; color: #52525b; font-size: 12px; margin-top: 24px; }
  .highlight { color: #10b981; font-weight: 600; }
  .section { margin-top: 20px; padding-top: 20px; border-top: 1px solid #27272a; }
`;

export const digestService = {
  async sendMorningDigest(userId: string) {
    const [user, stats] = await Promise.all([
      digestRepository.getDigestPreferences(userId),
      digestRepository.getUserStats(userId),
    ]);

    if (!user || !stats) return false;
    if (await digestRepository.wasDigestSentToday(userId, 'morning')) return false;

    const friendsText = stats.friends_solved_yesterday > 0
      ? `<span class="highlight">${stats.friends_solved_yesterday} friends</span> solved problems yesterday.`
      : 'Be the first in your group to solve today!';

    const html = `<!DOCTYPE html><html><head><style>${baseStyles}</style></head><body>
      <div class="container"><div class="card">
        <div class="logo">🔥 <span>Streaksy</span></div>
        <h2>Good morning, ${esc(user.display_name)}! ☀️</h2>
        <p>Here's your daily prep summary:</p>

        <div style="text-align: center; margin: 20px 0;">
          <div class="stat-box">
            <span class="stat-value">${stats.current_streak}</span>
            <span class="stat-label">Day Streak</span>
          </div>
          <div class="stat-box">
            <span class="stat-value">${stats.total_solved}</span>
            <span class="stat-label">Total Solved</span>
          </div>
          <div class="stat-box">
            <span class="stat-value">${stats.week_solved}</span>
            <span class="stat-label">This Week</span>
          </div>
        </div>

        <div class="section">
          <p>📊 ${friendsText}</p>
          ${stats.current_streak > 0 ? `<p>🔥 Keep your <span class="highlight">${stats.current_streak}-day streak</span> alive — solve at least one problem today!</p>` : '<p>💪 Start a new streak today!</p>'}
        </div>

        <div style="text-align: center;">
          <a href="${env.frontendUrl}/dashboard" class="btn">Start Solving →</a>
        </div>
      </div>
      <div class="footer">Streaksy — DSA Prep, Together<br/>
        <a href="${env.frontendUrl}/settings" style="color: #52525b;">Manage email preferences</a>
      </div></div></body></html>`;

    const sent = await sendEmail(user.email, `☀️ Daily Digest — ${stats.current_streak}-day streak`, html);
    if (sent) await digestRepository.logDigest(userId, 'morning');
    return sent;
  },

  async sendEveningReminder(userId: string) {
    const [user, noActivity] = await Promise.all([
      digestRepository.getDigestPreferences(userId),
      digestRepository.hasNoActivityToday(userId),
    ]);

    if (!user || !noActivity) return false;
    if (await digestRepository.wasDigestSentToday(userId, 'evening')) return false;

    const stats = await digestRepository.getUserStats(userId);
    if (!stats) return false;

    const streakWarning = stats.current_streak > 0
      ? `<p>⚠️ Your <span class="highlight">${stats.current_streak}-day streak</span> will break if you don't solve a problem before midnight!</p>`
      : '<p>Solve one problem to start building a streak!</p>';

    const html = `<!DOCTYPE html><html><head><style>${baseStyles}</style></head><body>
      <div class="container"><div class="card">
        <div class="logo">🔥 <span>Streaksy</span></div>
        <h2>Evening check-in 🌙</h2>
        <p>Hey ${esc(user.display_name)}, you haven't solved any problems today.</p>
        ${streakWarning}

        <div style="text-align: center;">
          <a href="${env.frontendUrl}/problems" class="btn">Solve Now →</a>
        </div>
      </div>
      <div class="footer">Streaksy — DSA Prep, Together<br/>
        <a href="${env.frontendUrl}/settings" style="color: #52525b;">Manage email preferences</a>
      </div></div></body></html>`;

    const sent = await sendEmail(user.email, `🌙 Don't lose your ${stats.current_streak}-day streak!`, html);
    if (sent) await digestRepository.logDigest(userId, 'evening');
    return sent;
  },

  async sendWeeklyReport(userId: string) {
    const [user, stats, weekData] = await Promise.all([
      digestRepository.getDigestPreferences(userId),
      digestRepository.getUserStats(userId),
      digestRepository.getWeekStats(userId),
    ]);

    if (!user || !stats) return false;
    if (await digestRepository.wasDigestSentToday(userId, 'weekly')) return false;

    const diffMap: Record<string, number> = {};
    weekData.difficultyBreakdown.forEach(d => { diffMap[d.difficulty] = d.count; });

    const html = `<!DOCTYPE html><html><head><style>${baseStyles}</style></head><body>
      <div class="container"><div class="card">
        <div class="logo">🔥 <span>Streaksy</span></div>
        <h2>Your Weekly Report 📈</h2>
        <p>Here's how you did this week, ${esc(user.display_name)}:</p>

        <div style="text-align: center; margin: 20px 0;">
          <div class="stat-box">
            <span class="stat-value">${stats.week_solved}</span>
            <span class="stat-label">Solved This Week</span>
          </div>
          <div class="stat-box">
            <span class="stat-value">${stats.current_streak}</span>
            <span class="stat-label">Current Streak</span>
          </div>
          <div class="stat-box">
            <span class="stat-value">${stats.points}</span>
            <span class="stat-label">Points Earned</span>
          </div>
        </div>

        <div class="section">
          <h2 style="font-size: 16px;">Difficulty Breakdown</h2>
          <p>🟢 Easy: <span class="highlight">${diffMap['easy'] || 0}</span> · 🟡 Medium: <span class="highlight">${diffMap['medium'] || 0}</span> · 🔴 Hard: <span class="highlight">${diffMap['hard'] || 0}</span></p>
        </div>

        <div class="section">
          <h2 style="font-size: 16px;">Daily Activity</h2>
          ${weekData.solvedByDay.map(d => `<p>${d.day}: <span class="highlight">${d.count}</span> problem${d.count !== 1 ? 's' : ''}</p>`).join('')}
          ${weekData.solvedByDay.length === 0 ? '<p>No problems solved this week — let\'s change that! 💪</p>' : ''}
        </div>

        <div style="text-align: center;">
          <a href="${env.frontendUrl}/insights" class="btn">View Full Insights →</a>
        </div>
      </div>
      <div class="footer">Streaksy — DSA Prep, Together<br/>
        <a href="${env.frontendUrl}/settings" style="color: #52525b;">Manage email preferences</a>
      </div></div></body></html>`;

    const sent = await sendEmail(user.email, `📈 Weekly Report — ${stats.week_solved} problems solved`, html);
    if (sent) await digestRepository.logDigest(userId, 'weekly');
    return sent;
  },

  async runMorningDigests() {
    const users = await digestRepository.getDigestUsers('morning');
    let sent = 0;
    for (const u of users) {
      try {
        const ok = await this.sendMorningDigest(u.user_id);
        if (ok) sent++;
      } catch (err) {
        logger.error({ err, userId: u.user_id }, 'Failed to send morning digest');
      }
    }
    logger.info({ sent, total: users.length }, 'Morning digests completed');
    return sent;
  },

  async runEveningReminders() {
    const users = await digestRepository.getDigestUsers('evening');
    let sent = 0;
    for (const u of users) {
      try {
        const ok = await this.sendEveningReminder(u.user_id);
        if (ok) sent++;
      } catch (err) {
        logger.error({ err, userId: u.user_id }, 'Failed to send evening reminder');
      }
    }
    logger.info({ sent, total: users.length }, 'Evening reminders completed');
    return sent;
  },

  async runWeeklyReports() {
    const users = await digestRepository.getDigestUsers('weekly');
    let sent = 0;
    for (const u of users) {
      try {
        const ok = await this.sendWeeklyReport(u.user_id);
        if (ok) sent++;
      } catch (err) {
        logger.error({ err, userId: u.user_id }, 'Failed to send weekly report');
      }
    }
    logger.info({ sent, total: users.length }, 'Weekly reports completed');
    return sent;
  },

  async getPreferences(userId: string) {
    return digestRepository.getDigestPreferences(userId);
  },

  async updatePreferences(userId: string, prefs: {
    digest_enabled?: boolean;
    digest_time?: string;
    digest_frequency?: string;
    evening_reminder?: boolean;
    weekly_report?: boolean;
  }) {
    await digestRepository.updateDigestPreferences(userId, prefs);
    return { success: true };
  },
};
