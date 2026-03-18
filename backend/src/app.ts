import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';

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

const app = express();

// Global middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(
  rateLimit({
    windowMs: env.rateLimit.windowMs,
    max: env.rateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
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

// Error handler (must be last)
app.use(errorHandler);

export default app;
