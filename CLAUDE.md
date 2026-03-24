# Streaksy - Claude Code Context

"Why Alone? Crush Your Goals With Friends." — A social goal-tracking platform with curated roadmaps, streak points, learning content, and collaborative features. Primary focus on coding/tech prep, but supports any goal (fitness, reading, habits).

## Project Structure

```
streaksy/
  backend/        # Node.js + Express 5 + TypeScript API (port 3001)
  frontend/       # Next.js 14 + React 18 + Tailwind CSS (port 3000)
  extension/      # Chrome Manifest V3 extension for LeetCode sync
  deploy/         # Deployment scripts, nginx config, server setup
  .github/        # GitHub Actions CI/CD (deploy.yml)
```

## Tech Stack

- **Backend**: Express 5, TypeScript, PostgreSQL 16, Redis 7, Passport (Google + GitHub OAuth), JWT, Zod, Pino (logging), Multer, Socket.io, Nodemailer, Web Push (VAPID)
- **Frontend**: Next.js 14 (App Router), Zustand, Axios, Tailwind CSS, Lucide icons, date-fns, Socket.io client, react-grid-layout
- **Extension**: Chrome MV3 service worker + content scripts + injected network interceptor
- **AI**: NVIDIA NIM API (Llama 3.3 70B) for hints, explanations, code review, coaching, daily briefs

## Key Commands

```bash
# Backend
cd backend && npm run dev          # Start dev server (tsx watch)
cd backend && npm run build        # Compile TypeScript
cd backend && npm test             # Run Jest tests (needs NODE_OPTIONS="--max-old-space-size=4096" for full suite)

# Frontend
cd frontend && npm run dev         # Start Next.js dev server
cd frontend && npm run build       # Production build

# Database
cd backend && psql $DATABASE_URL -f scripts/schema.sql
cd backend && psql $DATABASE_URL -f scripts/027-roadmap-pivot.sql
cd backend && psql $DATABASE_URL -f scripts/028-roadmap-social.sql
cd backend && psql $DATABASE_URL -f scripts/029-friends.sql
cd backend && psql $DATABASE_URL -f scripts/030-google-calendar.sql
cd backend && psql $DATABASE_URL -f scripts/031-notification-channels.sql
cd backend && psql $DATABASE_URL -f scripts/032-room-links.sql
cd backend && psql $DATABASE_URL -f scripts/seed.sql
cd backend && psql $DATABASE_URL -f scripts/seed-users.sql
cd backend && psql $DATABASE_URL -f scripts/seed-roadmap-templates.sql
cd backend && psql $DATABASE_URL -f scripts/seed-sheet-roadmaps.sql

# Deploy
bash deploy/deploy.sh              # Full production deploy
pm2 reload ecosystem.config.js     # Zero-downtime reload
pm2 logs                           # Tail logs
```

## Backend Architecture

Modular structure: `backend/src/modules/{domain}/` with subdirectories:
- `controller/` - Request handling
- `service/` - Business logic
- `repository/` - Database queries
- `routes/` - Express route definitions
- `validation/` - Zod schemas

### Modules (31 total)
- **Core**: auth, problem, group, progress, sync, streak, leaderboard, notes, insights, sheets, preferences
- **Features**: notification, discussion, activity, revision, contest, badge, room, poke, feed, daily
- **Roadmaps**: roadmaps module — categories, templates, user roadmaps, day progress, streaks, participants, discussions
- **AI**: ai service — shared NVIDIA NIM API caller with revision notes, hints, explanations, code review, coaching
- **Prep**: prep module (legacy interview planner, being replaced by roadmaps)
- **Engagement**: rating, powerup, digest
- **Invite**: invite module — group and room invite code generation and joining
- **Friends**: friends module — friend requests, accept/reject, friend list, search, invite-friends to groups/roadmaps/rooms, invite-by-email for new users
- **Learn**: learn module — Ask AI endpoint (`/api/learn/ask-ai`) + frontend data-driven content (`frontend/src/data/*.ts`)
- **Calendar**: calendar module — Google Calendar OAuth integration for scheduling war rooms

### Key Database Tables
- **Core**: users, problems, tags, sheets, groups, group_members, user_problem_status, user_streaks, notes
- **Roadmaps**: roadmap_categories, roadmap_templates, template_tasks, user_roadmaps, roadmap_day_progress, roadmap_streaks, roadmap_participants, roadmap_discussions
- **Features**: notifications, comments, group_activity, revision_notes, contests, badges, rooms, pokes, social_posts, social_likes, social_comments
- **Social**: friendships (requester_id, addressee_id, status, created_at)
- **Room Links**: rooms.group_id, rooms.roadmap_id (nullable FKs for cross-linking)
- **Engagement**: problem_ratings, company_tags, powerup_inventory, powerup_log, digest_preferences, digest_log
- **user_streaks.total_points**: Global streak points currency for leaderboards

### Database Migrations (32 scripts)
`backend/scripts/schema.sql` (base) + `002-preferences.sql` through `032-room-links.sql`

### Middleware
- `auth.ts` — JWT Bearer token + Redis token blacklist (fail-open if Redis down)
- `errorHandler.ts` — AppError handling, returns both `error` and `message` fields
- `requestId.ts` — UUID per request (or accepts X-Request-ID header)
- `validate.ts` — Zod schema validation middleware

### Common Utilities
- `asyncHandler` — Wraps async route handlers
- `cache.ts` — `cached(key, ttl, fn)` cache-aside with Redis + `invalidate(pattern)`
- `aiRateLimit.ts` — 30 AI generations per user per day (Redis-backed)
- `params.ts` — Safe param extraction + pagination helpers

### Background Jobs (in server.ts)
- **Room Auto-Start**: Every 30s, checks for scheduled war rooms to auto-start
- **Smart Notifications**: Every 30min at specific UTC hours (14:00, 16:00, 18:00, 20:00)
- **Digest Scheduler**: Every 5min — morning digest (8:00 UTC), evening reminder (21:00 UTC), weekly report (Monday 9:00 UTC)

### Socket.io (Real-time)
War room events: `room:join`, `room:leave`, `room:start`, `room:end`, `room:solved`, `room:message`, `room:typing`
Chat rate limiting: 10 messages per 10 seconds per user

## Frontend Pages (45+)

### Public
- `/` — Landing page: "Why Alone? Crush Your Goals With Friends."

### Auth
- `/auth/login`, `/auth/signup`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/verify-email`, `/auth/callback`

### Main App (all use AppShell)
- `/dashboard` — Command center: stats, today's tasks, active roadmaps, feed, groups, friends widget, leaderboard peek, extension banner, heatmap, powerups
- `/daily` — Daily problem recommendations + AI briefs
- `/feed` — Social feed: posts, likes, comments from friends and groups
- `/roadmaps` — Browse curated roadmaps by category (Coding, Fitness, Learning, Languages, Personal Growth)
- `/roadmaps/start/[slug]` — Start roadmap wizard (4-step for coding: overview → customize topics/hours → study mode/groups → review)
- `/roadmaps/create` — Custom roadmap creator
- `/roadmaps/[id]` — Roadmap detail: today's task, participants, poke, discussion, leaderboard, day-by-day timeline
- `/roadmaps/join/[code]` — Join shared roadmap
- `/roadmaps/history` — Roadmap history
- `/learn` — Learning Hub (9 topics: DSA Patterns, Databases, System Design, OOPs, Multithreading, Design Patterns, Frontend, Backend, Git)
- `/learn/[topic]` — Topic with lesson listing
- `/learn/[topic]/[lesson]` — Lesson with visual steps, analogies, code, practice
- `/patterns` — 19 DSA patterns with interactive simulations
- `/patterns/[slug]` — Pattern detail: 10-section framework (intuition → simulation → code → dry run → mistakes → tips → practice)
- `/problems` — Problem listing with sheets, filters, status toggle, extension install prompt
- `/problems/[slug]` — Problem detail: notes, discussions, AI tools (hints/explain/review), status toggle
- `/groups` — Group listing, creation
- `/groups/[id]` — Group detail: roadmaps, activity, leaderboard, members, invite link + invite friends modal
- `/friends` — Friends list, requests, find friends, invite-by-email
- `/rooms` — War Rooms: live collaborative problem solving
- `/rooms/[id]` — Room detail: timer, participants, chat, problems, invite friends
- `/leaderboard` — Global, Friends, Groups, My Groups tabs with streak points ranking
- `/achievements` — Badges and achievements
- `/bookmarks` — Bookmarked problems, lessons, patterns, roadmaps
- `/insights` — Analytics: difficulty breakdown, weekly activity, topic progress, AI coach
- `/revision` — Revision Hub: browse + quiz mode
- `/notifications` — Notification center
- `/timer` — Pomodoro-style study timer
- `/search` — Global search
- `/profile` — Avatar, bio, social links, badges
- `/settings` — User preferences, LeetCode extension section, Google Calendar, notifications, digest preferences
- `/extension` — Chrome extension page: download, features, installation guide
- `/prepare` — Legacy interview prep wizard (still functional)

### User
- `/user/[id]` — Public user profile: stats, badges, activity feed, social links

### Invite Pages (public, no auth required)
- `/invite/group/[code]` — Auto-joins logged-in users, redirects to group
- `/invite/room/[code]` — Room invite
- `/roadmaps/join/[code]` — Public roadmap share preview, join with auth
- `/roadmaps/share/:code` — Public API endpoint (no auth) for roadmap previews

## Frontend Architecture

### Components (79 files across 18 directories)
- `ai/` — 9 AI components (hints, explanations, code review, coaching, daily brief, lesson QA, discussion summary, note enhancer, roadmap coach)
- `dashboard/` — StatsCards, ContributionHeatmap, PowerupsWidget, PrepProgressWidget, RecentActivity, DashboardGrid
- `discussion/` — CommentForm, CommentItem, CommentThread
- `feed/` — FeedCard, SharePost
- `friends/` — InviteFriendsModal (portal)
- `groups/` — GroupCard, GroupLeaderboard, MemberList
- `layout/` — AppShell, Sidebar (16 nav items)
- `notes/` — NoteEditor, NotesList
- `notifications/` — NotificationBell
- `onboarding/` — HelpTooltip, WelcomeModal
- `patterns/` — SimulationPlayer, CodeTabs, WhatIsThis + 8 SVG visualizers (Tree, LinkedList, Graph, Stack, Queue, DPTable, Trie, Array)
- `poke/` — PokeButton, RecoveryChallenge, StreakRiskBanner
- `problems/` — ProblemTable, ProblemFilters, SheetSelector, SheetUpload, RatingSection, PeerSolutions, YouTubeModal, YouTubePlayer
- `revision/` — RevisionCard, RevisionForm, RevisionQuiz
- `search/` — ProblemPicker, SearchBar
- `settings/` — DigestSection
- `timer/` — StudyTimer
- `ui/` — 13 primitives (Badge, BookmarkButton, Button, Card, EmptyState, Input, PageTransition, Skeleton, Spinner, ThemeToggle, Toast, TopLoader)

### Hooks (5 custom hooks)
- `useAsync.ts` — Generic async data fetching
- `useFriends.ts` — `useFriends()` and `useEnrichedFriends()`
- `useBookmarks.ts` — localStorage bookmark manager
- `useLearnProgress.ts` — localStorage lesson completion tracker
- `usePushNotifications.ts` — Web Push subscription management

### State Management (Zustand)
- `useAuthStore` — user, token, login/signup/logout/hydrate
- `useDashboardStore` — streak, solvedCount, fetchStats
- `useFriendsStore` — friendIds cache on app mount

### API Client (`lib/api.ts`)
25 service modules with 150+ methods covering all backend endpoints. Axios with JWT interceptor and 401 redirect.

## Roadmap System

### Template Categories (31 templates)
- **Flagship**: Crack the Job Together (90d)
- **Coding & Tech**: Striver Sheet, Love Babbar Sheet, LeetCode Top 150, DSA Patterns, System Design, Databases, OOP, Multithreading, Frontend Dev, Backend Dev, DevOps, AI/ML, Cybersecurity, Mobile Dev, Git, Linux, 100 Days of Code
- **Fitness & Health**: Go to Gym Daily, 10K Steps, Quit Smoking, Meditation
- **Learning & Reading**: Read 1 Book/Month, Daily Journal
- **Languages**: French, German, Spanish, Japanese
- **Personal Growth**: Public Speaking, Financial Literacy, Productivity

### Streak Points System
- 10 points per completed task
- Streak bonus: 5 points × consecutive days
- 100 points for completing a roadmap
- Group bonus: +20% on all activities
- Points stored in user_streaks.total_points, ranked on /leaderboard

### Roadmap Start Wizard (coding templates)
1. Overview — start date, end date preview
2. Customize — hours/day, topic selection, time allocation sliders
3. Study Mode — solo/friends, group create/join, weekly war room scheduling, daily reminders
4. Review — summary before starting
- Auto-creates war rooms for entire roadmap duration based on chosen recurrence (daily, weekdays, weekends, weekly, monthly) with user-selected day and time, linked via `groupId`/`roadmapId`. Frontend passes `warRoomSchedule: { day, time, recurrence }` to backend.

## Learning Content

### Content Files (`frontend/src/data/`)
- `databases-content.ts` (13 lessons)
- `system-design-content.ts` (17 lessons)
- `oops-content.ts` (14 lessons)
- `multithreading-content.ts` (12 lessons)
- `design-patterns-content.ts` (10+ lessons)
- `frontend-content.ts` (8 lessons)
- `backend-content.ts` (8 lessons)
- `git-content.ts` (5 lessons)
Total: 87+ lessons + 19 DSA patterns = 106+ learning units across 9 topics

### Lesson Visual Components
Each LessonStep supports: `bullets`, `comparison` (side-by-side table), `flow` (step diagram), `table`, `cards` (info grid), `diagram` (ASCII art), `analogy` (callout), `keyTakeaway`, `code` (multi-language tabs: Python, JS, Java, C++)

### DSA Pattern Visualizers (`frontend/src/components/patterns/visualizers/`)
Pure SVG: TreeVisualizer, LinkedListVisualizer, GraphVisualizer, StackVisualizer, QueueVisualizer, DPTableVisualizer, TrieVisualizer, ArrayVisualizer
SimulationPlayer with play/pause, speed control, audio narration (Web Speech API)

## AI Features (NVIDIA NIM)

- **Model**: `meta/llama-3.3-70b-instruct`
- **Config**: `AI_BASE_URL`, `NVIDIA_API_KEY`, `AI_MODEL` env vars
- **AI Service**: `backend/src/modules/ai/service/ai.service.ts`
- **Endpoints**: `/api/revisions/generate`, `/hints`, `/explain`, `/review`, `/api/learn/ask-ai`, `/api/daily/ai-brief`, `/api/insights/ai-coach`, `/api/roadmaps/:id/ai-guidance`
- **Rate Limiting**: 30 AI generations per user per day (Redis key: `ai_gen:{userId}:{date}`)

## Sidebar Navigation

Dashboard, Daily, Feed, Roadmaps, Learn, Problems, Groups, Friends, War Rooms, Timer, Leaderboard, Achievements, Bookmarks, Insights, Extension, Profile, Settings

## Friends & Cross-Linking System

- **Hook**: `frontend/src/hooks/useFriends.ts` — `useFriends()` and `useEnrichedFriends()` hooks
- **Global Store**: `useFriendsStore` in `lib/store.ts` — caches friend IDs on app mount for instant friend detection
- **InviteFriendsModal**: `frontend/src/components/friends/InviteFriendsModal.tsx` — portal modal for inviting friends
- **Invite Endpoints**: `POST /api/groups/:id/invite-friends`, `POST /api/roadmaps/:id/invite-friends`, `POST /api/rooms/:id/invite-friends` (capped at 20), `POST /api/friends/invite-email` (email invite for non-users)
- **Enriched Endpoints**: `GET /api/friends/enriched` (shared groups, active roadmaps, active rooms per friend), `GET /api/friends/ids` (global cache)
- **Group Endpoints**: `GET /api/groups/:id/roadmaps` (all members' roadmaps), `GET /api/rooms/group/:groupId` (group war rooms)
- **Find Friends**: Shows all users by default (newest first, limit 50), no minimum search required, invite-by-email for non-users

### Cross-Linking Integration Points
| From | Feature | Links to |
|------|---------|----------|
| Friends page | Shared groups/roadmaps/rooms pills per friend | Groups, Roadmaps, Rooms |
| Groups detail | War Rooms section, friend badges on members, "Add Friend" for non-friends | Rooms, Friends |
| Groups detail | Group Roadmaps from API (all members'), "Start Roadmap Together" | Roadmaps |
| Roadmap detail | Group link pill, Invite Friends modal | Groups |
| Roadmap wizard | Friend picker in Step 3, auto-invite on creation | Friends |
| Room creation | Friend picker checklist, auto-invite on creation | Friends |
| Room detail | Group origin badge, friend badges on participants | Groups |
| Rooms listing | "Friends in Rooms" section with join CTAs | Friends |
| Dashboard | Friends widget (top 5 by streak) | Friends |
| Leaderboard | Friends tab | Friends |

## Chrome Extension

- **Page**: `/extension` — dedicated page with download, features, installation steps
- **Promoted on**: Dashboard (banner), Problems page (prompt bar), Settings (section), Sidebar nav
- **Files**: `extension/` directory with `manifest.json`, `background.js`, `content.js`, `injected.js`, `popup/`
- **Features**: Deduplication (30s cooldown), retry with exponential backoff, alarm-based retry, OAuth + email/password login, sync history (last 50), rich metadata (language, runtime, memory, percentiles)

## Shared Data Files
- `frontend/src/lib/roadmap-templates.ts` — 31 roadmap template definitions (shared between browse + start pages)
- `frontend/src/lib/roadmap-content-map.ts` — Dynamic content mapping for roadmap daily tasks
- `frontend/src/lib/learn-data.ts` — 9 Topic/Lesson definitions + content file imports
- `frontend/src/lib/patterns-data.ts` — 19 DSA patterns with simulation data
- `frontend/src/lib/interview-planner.ts` — Legacy prep roadmap generator

## Testing

- **Backend**: Jest with TypeScript (ts-jest), 83 test files in `backend/src/__tests__/`:
  - **Unit tests** (41 files): 30 services, 5 validation schemas, 3 common utilities, 3 middleware
  - **Integration tests** (26 files): API route tests for all modules
  - **E2E journey tests** (16 files): Full user workflow tests (onboarding, study sessions, roadmap lifecycle, collaboration, social, groups, LeetCode sync, invites, feed, ratings, powerups, AI learning, content engagement, contests, notifications, profile management)
- **TestSprite MCP**: Configured as MCP server for autonomous AI-powered testing (UI, API, accessibility, security). Run via Claude Code from this directory.
- **Running tests**: `cd backend && NODE_OPTIONS="--max-old-space-size=4096" npm test` (full suite needs extra memory)

## Domain & Server

- **Domain**: `streaksy.in` (GoDaddy)
- **Server IP**: `56.228.57.11`
- **Frontend**: `https://streaksy.in` (port 3000 behind proxy)
- **Backend API**: `https://streaksy.in/api` (port 3001 behind proxy)

## Deployment

- **Platform**: Amazon Linux 2023 on EC2
- **Process Manager**: PM2 (`ecosystem.config.js`) — `streaksy-backend` (port 3001), `streaksy-frontend` (port 3000)
- **Database**: PostgreSQL 16 local, user `postgres`, database `streaksy` (`DATABASE_URL` in `backend/.env`)
- **Nginx**: Reverse proxy with cache headers — HTML pages: `no-cache`, static assets: `immutable`. Config at `/etc/nginx/conf.d/streaksy.conf`. WebSocket support for Socket.io at `/socket.io/`.
- **Deploy Script**: `bash deploy/deploy.sh` — pulls latest, installs deps, builds backend (tsc) + frontend (next build), runs migrations, reloads PM2
- **CI/CD**: GitHub Actions (`deploy.yml`) — TypeScript check → tests → SSH deploy → health check
- **Health Check**: `curl http://localhost:3001/health` (returns DB + Redis status)
- **IMPORTANT**: After `next build`, always restart the frontend PM2 process. Nginx sends `no-cache` on HTML to prevent stale JS chunk references

```bash
# Manual deploy
bash deploy/deploy.sh

# PM2 commands
pm2 ls                          # List processes
pm2 logs                        # Tail logs
pm2 reload ecosystem.config.js  # Zero-downtime reload
pm2 restart ecosystem.config.js # Hard restart
```

## Conventions

- Async route handlers wrapped with `asyncHandler`
- Errors use `AppError` class (badRequest, unauthorized, notFound, conflict, forbidden)
- Validation via Zod schemas + `validate` middleware
- Logging via Pino (`logger` from config, `req.log` per request)
- Caching via `cached(key, ttl, fn)` utility with Redis
- Frontend uses `cn()` utility (clsx + tailwind-merge) for conditional classes
- State management via Zustand stores in `lib/store.ts`
- Data fetching via `useAsync` hook in `hooks/useAsync.ts`
- Roadmap data stored in localStorage (`streaksy_active_roadmaps`) + backend API
- All pages use AppShell wrapper (except landing page, invite pages, roadmap join page)
- Room creation mode must be `'single'` or `'multi'` (Zod enum — never use `'practice'`)
- Rate limit: 500 requests per 15 minutes per IP (`RATE_LIMIT_MAX` in `.env`). OAuth routes (`/api/auth/google*`, `/api/auth/github*`) skip rate limiting.
- Error handler returns both `error` and `message` fields in JSON responses for frontend compatibility
- Poke messages use actual `days_inactive` from `user_streaks` table (not derived from escalation level)
- API routes mounted on both `/api/` and `/api/v1/` for backward compat + mobile versioning
