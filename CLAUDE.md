# Streaksy - Claude Code Context

Multiplayer DSA prep platform with LeetCode sync, groups, streaks, insights, revision hub, interactive learning content, and AI-powered tools.

## Project Structure

```
streaksy/
  backend/        # Node.js + Express 5 + TypeScript API (port 3001)
  frontend/       # Next.js 14 + React 18 + Tailwind CSS (port 3000)
  extension/      # Chrome Manifest V3 extension for LeetCode sync
```

## Tech Stack

- **Backend**: Express 5, TypeScript, PostgreSQL 16, Redis 7, Passport (OAuth), JWT, Zod, Pino (logging), Multer
- **Frontend**: Next.js 14 (App Router), Zustand, Axios, Tailwind CSS, Lucide icons, date-fns
- **Extension**: Chrome MV3 service worker + content scripts

## Key Commands

```bash
# Backend
cd backend && npm run dev          # Start dev server (tsx watch)
cd backend && npm run build        # Compile TypeScript
cd backend && npm test             # Run Jest tests (29 suites, 205 tests)

# Frontend
cd frontend && npm run dev         # Start Next.js dev server
cd frontend && npm run build       # Production build

# Database
cd backend && psql $DATABASE_URL -f scripts/schema.sql      # Init schema
cd backend && psql $DATABASE_URL -f scripts/002-preferences.sql
cd backend && psql $DATABASE_URL -f scripts/003-oauth.sql
cd backend && psql $DATABASE_URL -f scripts/004-password-reset.sql
cd backend && psql $DATABASE_URL -f scripts/005-email-verification.sql
cd backend && psql $DATABASE_URL -f scripts/006-notifications.sql
cd backend && psql $DATABASE_URL -f scripts/007-discussions.sql
cd backend && psql $DATABASE_URL -f scripts/008-activity-feed.sql
cd backend && psql $DATABASE_URL -f scripts/009-profile.sql
cd backend && psql $DATABASE_URL -f scripts/010-revisions.sql
cd backend && psql $DATABASE_URL -f scripts/011-contests.sql
cd backend && psql $DATABASE_URL -f scripts/012-badges.sql
cd backend && psql $DATABASE_URL -f scripts/013-search.sql
cd backend && psql $DATABASE_URL -f scripts/seed.sql         # Seed data

# Docker (PostgreSQL + Redis)
cd backend/docker && docker compose up -d postgres redis
```

## Backend Architecture

Modular structure: `backend/src/modules/{domain}/` with subdirectories:
- `controller/` - Request handling
- `service/` - Business logic
- `repository/` - Database queries
- `routes/` - Express route definitions
- `validation/` - Zod schemas

### Modules
- **Core**: auth, problem, group, progress, sync, streak, leaderboard, notes, insights, sheets, preferences
- **Features**: notification, discussion, activity, revision, contest, badge, room, poke, feed, daily
- **New**: rating (community difficulty ratings + company tags), powerup (streak freeze, double XP, shield, points), digest (morning/evening/weekly email digests)
- **AI**: ai service (`ai/service/ai.service.ts`) — shared NVIDIA NIM API caller with revision notes, hints, explanations, code review generation

### Infrastructure
- **Logging**: Pino structured logging (`backend/src/config/logger.ts`), JSON in prod, pretty in dev
- **Request ID**: `backend/src/middleware/requestId.ts` — X-Request-ID header, child logger on `req.log`
- **Caching**: Redis cache-aside via `backend/src/common/utils/cache.ts` (`cached<T>()`, `invalidate()`)
- **Health Check**: `GET /health` — deep check pinging DB + Redis, returns 200/503 with per-component status
- **Graceful Shutdown**: SIGTERM/SIGINT handlers in server.ts, 10s timeout

## Config Files

- `backend/.env` - Backend env vars (DB, Redis, JWT, OAuth credentials, SMTP)
- `frontend/.env.local` - Frontend env vars (NEXT_PUBLIC_API_URL)
- `extension/background.js` - API_BASE constant (hardcoded)
- `extension/manifest.json` - host_permissions for API access

## Domain & Server

- **Domain**: `streaksy.in` (GoDaddy)
- **Server IP**: `56.228.57.11`
- **Frontend**: `http://streaksy.in:3000`
- **Backend API**: `http://streaksy.in:3001`

## Auth

- JWT-based with Bearer tokens
- OAuth via Passport (Google + GitHub) — strategies in `backend/src/config/passport.ts`
- Password reset flow: token-based with 1hr expiry, email delivery
- Email verification: token on signup, non-blocking banner in AppShell
- Profile management: avatar upload (multer), bio, location, social links
- Frontend stores token in localStorage as `streaksy_token`

## Database

PostgreSQL database name: `streaksy`. Extensions: uuid-ossp, pgcrypto. All PKs are UUIDs.

### Key Tables
- **Core**: users, problems, tags, sheets, groups, group_members, user_problem_status, user_streaks, notes, user_preferences
- **Auth**: password_reset_tokens (004), email verification columns on users (005)
- **Features**: notifications (006), comments (007), group_activity (008), revision_notes (010)
- **Engagement**: contests + contest_problems + contest_submissions (011), badges + user_badges (012)
- **Search**: search_vector tsvector column + GIN index on problems (013)
- **Profile**: avatar_url, bio, location, github_url, linkedin_url columns on users (009)
- **Ratings**: problem_ratings, company_tags, problem_company_tags (022)
- **Powerups**: user_powerups, powerup_log, points/freeze columns on user_streaks (023)
- **Digest**: digest preferences columns on user_preferences, digest_log (024)

## Frontend Pages

- `/` — Landing page
- `/auth/login`, `/auth/signup` — Auth with OAuth (Google/GitHub)
- `/auth/forgot-password`, `/auth/reset-password` — Password reset flow
- `/auth/verify-email` — Email verification
- `/auth/callback` — OAuth callback (handles pending invites)
- `/dashboard` — Stats, streak, heatmap, recent activity
- `/problems` — Problem listing with sheets, filters
- `/problems/[slug]` — Problem detail with notes, discussions, revision notes
- `/revision` — Revision Hub (browse + quiz mode)
- `/insights` — Charts and analytics
- `/groups` — Group listing, creation, detail with activity feed
- `/invite/group/[code]` — Shareable group invite (works for unauthenticated users)
- `/invite/room/[code]` — Shareable room invite (works for unauthenticated users)
- `/patterns` — DSA Patterns hub (19 patterns with interactive simulations)
- `/patterns/[slug]` — Pattern detail (10-section learning: intuition, simulation, code, dry run, mistakes, tips)
- `/learn` — Learning Hub (5 topics: DSA Patterns, Databases, System Design, OOPs, Multithreading)
- `/learn/[topic]` — Topic page with lesson listing
- `/learn/[topic]/[lesson]` — Lesson page with steps, visuals, code, analogies
- `/prepare` — Interview prep wizard (role, days, hours, level, topics)
- `/prepare/roadmap` — Personalized day-by-day study plan with progress tracking
- `/profile` — Avatar upload, bio, social links, badges
- `/settings` — User preferences

## AI Features (NVIDIA NIM)

- **Model**: `meta/llama-3.3-70b-instruct` via NVIDIA NIM API (`AI_BASE_URL`, `NVIDIA_API_KEY`, `AI_MODEL` env vars)
- **AI Service**: `backend/src/modules/ai/service/ai.service.ts` — shared `callAI()` helper + JSON extraction
- **Endpoints**: `POST /api/revisions/generate` (revision notes), `/hints` (progressive hints), `/explain` (problem explanation), `/review` (code review)
- **Rate Limiting**: 20 AI generations per user per day (Redis counter)
- **Frontend**: AI tools section on problem detail page with Hints, Explanation, Code Review panels

## Learning Hub

- **Patterns** (`frontend/src/lib/patterns-data.ts`): 19 DSA patterns with 10-section framework, SVG visualizers, multi-language code, audio narration
- **Visualizers** (`frontend/src/components/patterns/visualizers/`): TreeVisualizer, LinkedListVisualizer, GraphVisualizer, StackVisualizer, QueueVisualizer, DPTableVisualizer, TrieVisualizer, ArrayVisualizer — all pure SVG
- **Learn Data** (`frontend/src/lib/learn-data.ts`): Topic/Lesson/Step interfaces, populated from content files in `frontend/src/data/`
- **Content Files**: `databases-content.ts` (13 lessons), `system-design-content.ts` (17 lessons), `oops-content.ts` (14 lessons), `multithreading-content.ts` (12 lessons)
- **Interview Planner** (`frontend/src/lib/interview-planner.ts`): Role-based topic allocation, phase-based day generation, localStorage persistence
- **Lesson Visuals**: Comparison tables, flow diagrams, info cards, ASCII diagrams, bullet lists, code tabs

## Problem Status Toggle

- `PUT /api/progress/status` — Toggle problem status (not_started/attempted/solved) without extension
- Frontend: three-state toggle on problem detail page header

## Security

- **CORS**: Restricted to `frontendUrl` + localhost (not wide open)
- **Rate Limiting**: Applied globally including sync endpoints; only `/health` is skipped
- **Sync Endpoint**: Uses `req.user.userId` from JWT (never body userId) — prevents auth bypass
- **Digest Triggers**: Admin-only via `X-Admin-Secret` header (set `ADMIN_SECRET` env var)
- **Email Templates**: All user-controlled strings are HTML-escaped via `escapeHtml()` / `esc()`
- **OAuth Callback**: Only exposes user `id` and `displayName` in redirect URL (no email)
- **Socket Auth**: `room:join` verifies the user is a participant before joining
- **Group Endpoints**: Activity, sheets, progress, and contest endpoints enforce group membership
- **Contest Creation**: Requires group admin role + validates `startsAt < endsAt`

## Conventions

- Async route handlers wrapped with `asyncHandler`
- Errors use `AppError` class (badRequest, unauthorized, notFound, conflict, forbidden)
- Global error handler middleware catches AppError and returns structured JSON
- Validation via Zod schemas + `validate` middleware
- Logging via Pino (`logger` from config, `req.log` child logger per request)
- Caching via `cached(key, ttl, fn)` utility with Redis
- Discussion routes split into `problemDiscussionRouter` (at `/api/problems`) and `commentRouter` (at `/api/comments`)
- Frontend uses `cn()` utility (clsx + tailwind-merge) for conditional classes
- State management via Zustand stores in `lib/store.ts`
- Data fetching via `useAsync` hook in `hooks/useAsync.ts`
- Logout disconnects WebSocket and clears localStorage
- All delete operations require user confirmation (`confirm()`)
- Room page does NOT call `disconnectSocket()` on cleanup — only removes its own listeners
