import express from 'express';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import passport from 'passport';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { pool } from './config/database';
import { redis } from './config/redis';
import { errorHandler } from './middleware/errorHandler';
import { requestId } from './middleware/requestId';
import { configurePassport } from './config/passport';

// Route imports
import authRoutes from './modules/auth/routes/auth.routes';
import problemRoutes from './modules/problem/routes/problem.routes';
import groupRoutes from './modules/group/routes/group.routes';
import progressRoutes from './modules/progress/routes/progress.routes';
import syncRoutes from './modules/sync/routes/sync.routes';
import streakRoutes from './modules/streak/routes/streak.routes';
import leaderboardRoutes from './modules/leaderboard/routes/leaderboard.routes';
import notesRoutes from './modules/notes/routes/notes.routes';
import insightsRoutes from './modules/insights/routes/insights.routes';
import sheetsRoutes from './modules/sheets/routes/sheets.routes';
import preferencesRoutes from './modules/preferences/routes/preferences.routes';
import notificationRoutes from './modules/notification/routes/notification.routes';
import discussionRoutes, { commentRouter } from './modules/discussion/routes/discussion.routes';
import activityRoutes from './modules/activity/routes/activity.routes';
import revisionRoutes from './modules/revision/routes/revision.routes';
import contestRoutes from './modules/contest/routes/contest.routes';
import badgeRoutes from './modules/badge/routes/badge.routes';
import roomRoutes from './modules/room/routes/room.routes';
import pokeRoutes from './modules/poke/routes/poke.routes';
import feedRoutes from './modules/feed/routes/feed.routes';
import dailyRoutes from './modules/daily/routes/daily.routes';
import ratingRoutes from './modules/rating/routes/rating.routes';
import powerupRoutes from './modules/powerup/routes/powerup.routes';
import digestRoutes from './modules/digest/routes/digest.routes';
import inviteRoutes from './modules/invite/routes/invite.routes';
import prepRoutes from './modules/prep/routes/prep.routes';
import roadmapRoutes from './modules/roadmaps/routes/roadmaps.routes';
import friendsRoutes from './modules/friends/routes/friends.routes';

const app = express();

// Request ID (first middleware)
app.use(requestId);

// Global middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginOpenerPolicy: false,
  hsts: false,
}));
app.use(cors({
  origin: [env.frontendUrl, 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(passport.initialize());
configurePassport();
app.use(
  rateLimit({
    windowMs: env.rateLimit.windowMs,
    max: env.rateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.path === '/health',
  })
);

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Deep health check
app.get('/health', async (_req, res) => {
  const checks: Record<string, 'ok' | 'error'> = { db: 'error', redis: 'error' };

  try {
    await pool.query('SELECT 1');
    checks.db = 'ok';
  } catch {}

  try {
    await redis.ping();
    checks.redis = 'ok';
  } catch {}

  const healthy = checks.db === 'ok' && checks.redis === 'ok';
  res.status(healthy ? 200 : 503).json({
    status: healthy ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    checks,
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/streaks', streakRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/sheets', sheetsRoutes);
app.use('/api/preferences', preferencesRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/problems', discussionRoutes);
app.use('/api/comments', commentRouter);
app.use('/api/groups', activityRoutes);
app.use('/api/revisions', revisionRoutes);
app.use('/api/groups', contestRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/pokes', pokeRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/daily', dailyRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/powerups', powerupRoutes);
app.use('/api/digest', digestRoutes);
app.use('/api/invite', inviteRoutes);
app.use('/api/prep', prepRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/friends', friendsRoutes);

// Error handler (must be last)
app.use(errorHandler);

export default app;
