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
import learnRoutes from './modules/learn/routes/learn.routes';

const app = express();

// Trust first proxy (needed for rate-limiter + correct client IP behind reverse proxy)
app.set('trust proxy', 1);

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
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    const allowed = [...env.allowedOrigins, 'http://localhost:3000'];
    if (allowed.includes(origin)) return callback(null, true);
    callback(null, false);
  },
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
    skip: (req) => req.path === '/health' || req.path.startsWith('/api/auth/google') || req.path.startsWith('/api/auth/github') || req.path.startsWith('/api/v1/auth/google') || req.path.startsWith('/api/v1/auth/github'),
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

// ── API Routes ──
// Mount under both /api/ (backward compat) and /api/v1/ (versioned for mobile)
import { Router } from 'express';
const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/problems', problemRoutes);
apiRouter.use('/groups', groupRoutes);
apiRouter.use('/progress', progressRoutes);
apiRouter.use('/sync', syncRoutes);
apiRouter.use('/streaks', streakRoutes);
apiRouter.use('/leaderboard', leaderboardRoutes);
apiRouter.use('/notes', notesRoutes);
apiRouter.use('/insights', insightsRoutes);
apiRouter.use('/sheets', sheetsRoutes);
apiRouter.use('/preferences', preferencesRoutes);
apiRouter.use('/notifications', notificationRoutes);
apiRouter.use('/problems', discussionRoutes);
apiRouter.use('/comments', commentRouter);
apiRouter.use('/groups', activityRoutes);
apiRouter.use('/revisions', revisionRoutes);
apiRouter.use('/groups', contestRoutes);
apiRouter.use('/contests', contestRoutes);
apiRouter.use('/badges', badgeRoutes);
apiRouter.use('/rooms', roomRoutes);
apiRouter.use('/pokes', pokeRoutes);
apiRouter.use('/feed', feedRoutes);
apiRouter.use('/daily', dailyRoutes);
apiRouter.use('/ratings', ratingRoutes);
apiRouter.use('/powerups', powerupRoutes);
apiRouter.use('/digest', digestRoutes);
apiRouter.use('/invite', inviteRoutes);
apiRouter.use('/prep', prepRoutes);
apiRouter.use('/roadmaps', roadmapRoutes);
apiRouter.use('/friends', friendsRoutes);
apiRouter.use('/learn', learnRoutes);

// Mount on both /api and /api/v1 (v1 for mobile, /api for backward compat)
app.use('/api/v1', apiRouter);
app.use('/api', apiRouter);

// API info endpoint — mobile apps use this to check compatibility
app.get('/api/info', (_req, res) => {
  res.json({
    name: 'Streaksy API',
    version: '1.0.0',
    apiVersion: 'v1',
    minClientVersion: '1.0.0',
    endpoints: {
      rest: '/api/v1',
      websocket: '/',
      health: '/health',
    },
  });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
