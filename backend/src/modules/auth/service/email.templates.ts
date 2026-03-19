import { env } from '../../../config/env';

const baseStyles = `
  body { margin: 0; padding: 0; background-color: #09090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  .container { max-width: 560px; margin: 0 auto; padding: 40px 24px; }
  .card { background-color: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 40px 32px; }
  .logo { font-size: 24px; font-weight: 700; color: #f4f4f5; margin-bottom: 24px; }
  .logo span { color: #10b981; }
  h1 { color: #f4f4f5; font-size: 22px; font-weight: 600; margin: 0 0 12px 0; }
  p { color: #a1a1aa; font-size: 15px; line-height: 1.6; margin: 0 0 16px 0; }
  .btn { display: inline-block; background: linear-gradient(135deg, #10b981, #06b6d4); color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 15px; margin: 8px 0 24px 0; }
  .feature { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px; }
  .feature-dot { width: 8px; height: 8px; border-radius: 50%; background: #10b981; margin-top: 6px; flex-shrink: 0; }
  .feature-text { color: #d4d4d8; font-size: 14px; }
  .divider { border: none; border-top: 1px solid #27272a; margin: 24px 0; }
  .footer { color: #71717a; font-size: 12px; text-align: center; margin-top: 24px; }
  .stat { display: inline-block; text-align: center; margin: 0 16px; }
  .stat-value { font-size: 28px; font-weight: 700; color: #10b981; }
  .stat-label { font-size: 12px; color: #71717a; text-transform: uppercase; letter-spacing: 1px; }
`;

export function welcomeEmail(displayName: string): { subject: string; html: string } {
  return {
    subject: 'Welcome to Streaksy — Let\'s start solving!',
    html: `<!DOCTYPE html><html><head><style>${baseStyles}</style></head><body>
      <div class="container"><div class="card">
        <div class="logo">🔥 <span>Streaksy</span></div>
        <h1>Welcome aboard, ${displayName}!</h1>
        <p>You've just joined a community of developers who are serious about mastering data structures and algorithms. Here's what you can do next:</p>
        <div class="feature"><div class="feature-dot"></div><div class="feature-text"><strong>Connect your LeetCode account</strong> — Auto-sync your accepted submissions.</div></div>
        <div class="feature"><div class="feature-dot"></div><div class="feature-text"><strong>Browse problem sheets</strong> — Striver, Top 150, Love Babbar, and more.</div></div>
        <div class="feature"><div class="feature-dot"></div><div class="feature-text"><strong>Join or create a group</strong> — Compete with friends on the leaderboard.</div></div>
        <div class="feature"><div class="feature-dot"></div><div class="feature-text"><strong>Start your streak</strong> — Solve at least one problem daily.</div></div>
        <a href="${env.frontendUrl}/dashboard" class="btn">Go to Dashboard</a>
        <hr class="divider" />
        <p style="font-size: 13px;">Need the Chrome extension? Install it to auto-sync your LeetCode progress.</p>
      </div>
      <div class="footer">Streaksy — DSA Prep, Together<br/>You're receiving this because you signed up for Streaksy.</div>
      </div></body></html>`,
  };
}

export function streakMilestoneEmail(displayName: string, streakDays: number): { subject: string; html: string } {
  const emoji = streakDays >= 30 ? '🏆' : streakDays >= 14 ? '🔥' : '⚡';
  return {
    subject: `${emoji} ${streakDays}-day streak! Keep it going, ${displayName}!`,
    html: `<!DOCTYPE html><html><head><style>${baseStyles}</style></head><body>
      <div class="container"><div class="card">
        <div class="logo">🔥 <span>Streaksy</span></div>
        <h1>${emoji} ${streakDays}-Day Streak!</h1>
        <p>Incredible work, ${displayName}! You've solved at least one problem every day for <strong>${streakDays} days straight</strong>. That's serious dedication.</p>
        <div style="text-align: center; margin: 24px 0;">
          <div class="stat"><div class="stat-value">${streakDays}</div><div class="stat-label">Day Streak</div></div>
        </div>
        <p>Keep the momentum going. Every problem you solve makes you a stronger engineer.</p>
        <a href="${env.frontendUrl}/dashboard" class="btn">Continue Your Streak</a>
        <hr class="divider" />
        <p style="font-size: 13px; color: #71717a;">You hit a milestone! We'll notify you at the next one.</p>
      </div>
      <div class="footer">Streaksy — DSA Prep, Together</div>
      </div></body></html>`,
  };
}

export function weeklyProgressEmail(
  displayName: string,
  solvedThisWeek: number,
  totalSolved: number,
  currentStreak: number,
  weeklyGoal: number
): { subject: string; html: string } {
  const goalMet = solvedThisWeek >= weeklyGoal;
  return {
    subject: `Your weekly Streaksy recap — ${solvedThisWeek} problems solved`,
    html: `<!DOCTYPE html><html><head><style>${baseStyles}</style></head><body>
      <div class="container"><div class="card">
        <div class="logo">🔥 <span>Streaksy</span></div>
        <h1>Weekly Recap</h1>
        <p>Here's how your week went, ${displayName}:</p>
        <div style="text-align: center; margin: 24px 0;">
          <div class="stat"><div class="stat-value">${solvedThisWeek}</div><div class="stat-label">This Week</div></div>
          <div class="stat"><div class="stat-value">${totalSolved}</div><div class="stat-label">Total Solved</div></div>
          <div class="stat"><div class="stat-value">${currentStreak}</div><div class="stat-label">Day Streak</div></div>
        </div>
        ${goalMet
          ? '<p style="color: #10b981; font-weight: 600;">✅ You met your weekly goal! Awesome job.</p>'
          : `<p>Your weekly goal is <strong>${weeklyGoal}</strong> problems. ${weeklyGoal - solvedThisWeek > 0 ? `You're <strong>${weeklyGoal - solvedThisWeek}</strong> away.` : ''}</p>`
        }
        <a href="${env.frontendUrl}/insights" class="btn">View Full Insights</a>
      </div>
      <div class="footer">Streaksy — DSA Prep, Together<br/>Sent weekly. Manage in Settings.</div>
      </div></body></html>`,
  };
}

export function groupInviteEmail(
  displayName: string,
  groupName: string,
  inviterName: string,
  inviteCode: string
): { subject: string; html: string } {
  return {
    subject: `${inviterName} invited you to join "${groupName}" on Streaksy`,
    html: `<!DOCTYPE html><html><head><style>${baseStyles}</style></head><body>
      <div class="container"><div class="card">
        <div class="logo">🔥 <span>Streaksy</span></div>
        <h1>You're Invited!</h1>
        <p><strong>${inviterName}</strong> wants you to join the study group <strong>"${groupName}"</strong> on Streaksy.</p>
        <p>Use this invite code to join:</p>
        <div style="background: #27272a; border-radius: 8px; padding: 16px; text-align: center; margin: 16px 0;">
          <span style="font-size: 24px; font-weight: 700; color: #10b981; letter-spacing: 4px;">${inviteCode}</span>
        </div>
        <a href="${env.frontendUrl}/groups" class="btn">Join Group</a>
        <hr class="divider" />
        <p style="font-size: 13px; color: #71717a;">Don't have an account? Sign up first, then use the invite code.</p>
      </div>
      <div class="footer">Streaksy — DSA Prep, Together</div>
      </div></body></html>`,
  };
}

export function passwordResetEmail(displayName: string, resetUrl: string): { subject: string; html: string } {
  return {
    subject: 'Reset your Streaksy password',
    html: `<!DOCTYPE html><html><head><style>${baseStyles}</style></head><body>
      <div class="container"><div class="card">
        <div class="logo">🔥 <span>Streaksy</span></div>
        <h1>Password Reset</h1>
        <p>Hey ${displayName}, we received a request to reset your password. Click the button below to set a new one:</p>
        <a href="${resetUrl}" class="btn">Reset Password</a>
        <hr class="divider" />
        <p style="font-size: 13px; color: #71717a;">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
      </div>
      <div class="footer">Streaksy — DSA Prep, Together</div>
      </div></body></html>`,
  };
}

export function verificationEmail(displayName: string, verifyUrl: string): { subject: string; html: string } {
  return {
    subject: 'Verify your Streaksy email address',
    html: `<!DOCTYPE html><html><head><style>${baseStyles}</style></head><body>
      <div class="container"><div class="card">
        <div class="logo">🔥 <span>Streaksy</span></div>
        <h1>Verify Your Email</h1>
        <p>Hey ${displayName}, please verify your email address to unlock all features:</p>
        <a href="${verifyUrl}" class="btn">Verify Email</a>
        <hr class="divider" />
        <p style="font-size: 13px; color: #71717a;">This link expires in 24 hours.</p>
      </div>
      <div class="footer">Streaksy — DSA Prep, Together</div>
      </div></body></html>`,
  };
}

export function inactivityReminderEmail(displayName: string, daysMissed: number, longestStreak: number): { subject: string; html: string } {
  return {
    subject: `We miss you, ${displayName}! Your streak needs you 🔥`,
    html: `<!DOCTYPE html><html><head><style>${baseStyles}</style></head><body>
      <div class="container"><div class="card">
        <div class="logo">🔥 <span>Streaksy</span></div>
        <h1>Don't break the chain!</h1>
        <p>Hey ${displayName}, it's been <strong>${daysMissed} day${daysMissed > 1 ? 's' : ''}</strong> since your last solve. Your longest streak was <strong>${longestStreak} days</strong> — let's beat it!</p>
        <p>Even solving one easy problem keeps your streak alive and builds the habit.</p>
        <a href="${env.frontendUrl}/problems" class="btn">Solve a Problem Now</a>
        <hr class="divider" />
        <p style="font-size: 13px; color: #71717a;">You can turn off reminders in Settings.</p>
      </div>
      <div class="footer">Streaksy — DSA Prep, Together</div>
      </div></body></html>`,
  };
}
