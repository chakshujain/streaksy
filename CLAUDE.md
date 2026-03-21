# Streaksy - Claude Code Context

"Why Alone? Crush Your Goals With Friends." — A social goal-tracking platform with curated roadmaps, streak points, learning content, and collaborative features. Primary focus on coding/tech prep, but supports any goal (fitness, reading, habits).

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
- **AI**: NVIDIA NIM API (Llama 3.3 70B) for hints, explanations, code review

## Key Commands

```bash
# Backend
cd backend && npm run dev          # Start dev server (tsx watch)
cd backend && npm run build        # Compile TypeScript
cd backend && npm test             # Run Jest tests

# Frontend
cd frontend && npm run dev         # Start Next.js dev server
cd frontend && npm run build       # Production build

# Database
cd backend && psql $DATABASE_URL -f scripts/schema.sql
cd backend && psql $DATABASE_URL -f scripts/027-roadmap-pivot.sql
cd backend && psql $DATABASE_URL -f scripts/028-roadmap-social.sql
cd backend && psql $DATABASE_URL -f scripts/seed.sql
cd backend && psql $DATABASE_URL -f scripts/seed-users.sql
cd backend && psql $DATABASE_URL -f scripts/seed-roadmap-templates.sql
cd backend && psql $DATABASE_URL -f scripts/seed-sheet-roadmaps.sql
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
- **Roadmaps**: roadmaps module — categories, templates, user roadmaps, day progress, streaks, participants, discussions
- **AI**: ai service — shared NVIDIA NIM API caller with revision notes, hints, explanations, code review
- **Prep**: prep module (legacy interview planner, being replaced by roadmaps)
- **Engagement**: rating, powerup, digest
- **Invite**: invite module — group and room invite code generation and joining
- **Learn**: learn module (skeleton — content is frontend data-driven via `frontend/src/data/*.ts`)

### Key Database Tables
- **Core**: users, problems, tags, sheets, groups, group_members, user_problem_status, user_streaks, notes
- **Roadmaps**: roadmap_categories, roadmap_templates, template_tasks, user_roadmaps, roadmap_day_progress, roadmap_streaks, roadmap_participants, roadmap_discussions
- **Features**: notifications, comments, group_activity, revision_notes, contests, badges, rooms, pokes
- **user_streaks.total_points**: Global streak points currency for leaderboards

## Frontend Pages

### Public
- `/` — Landing page: "Why Alone? Crush Your Goals With Friends."

### Auth
- `/auth/login`, `/auth/signup`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/verify-email`, `/auth/callback`

### Main App (all use AppShell)
- `/dashboard` — Command center: stats, today's tasks, active roadmaps, feed, groups, leaderboard peek, heatmap
- `/feed` — Social feed: what friends and group members are doing
- `/roadmaps` — Browse curated roadmaps by category (Coding, Fitness, Learning, Languages, Personal Growth)
- `/roadmaps/start/[slug]` — Start roadmap wizard (4-step for coding: overview → customize topics/hours → study mode/groups → review)
- `/roadmaps/create` — Custom roadmap creator
- `/roadmaps/[id]` — Roadmap detail: today's task, participants, poke, discussion, leaderboard, day-by-day timeline
- `/roadmaps/join/[code]` — Join shared roadmap
- `/learn` — Learning Hub (8 topics: DSA Patterns, Databases, System Design, OOPs, Multithreading, Frontend, Backend, Git)
- `/learn/[topic]` — Topic with lesson listing
- `/learn/[topic]/[lesson]` — Lesson with visual steps, analogies, code, practice
- `/patterns` — 19 DSA patterns with interactive simulations
- `/patterns/[slug]` — Pattern detail: 10-section framework (intuition → simulation → code → dry run → mistakes → tips → practice)
- `/problems` — Problem listing with sheets, filters, status toggle
- `/problems/[slug]` — Problem detail: notes, discussions, AI tools (hints/explain/review), status toggle
- `/groups` — Group listing, creation
- `/groups/[id]` — Group detail: roadmaps, activity, leaderboard, members, invite
- `/rooms` — War Rooms: live collaborative problem solving
- `/rooms/[id]` — Room detail: timer, participants, chat, problems
- `/leaderboard` — Global, Groups, My Groups tabs with streak points ranking
- `/insights` — Analytics: difficulty breakdown, weekly activity, topic progress
- `/revision` — Revision Hub: browse + quiz mode
- `/profile` — Avatar, bio, social links, badges
- `/settings` — User preferences
- `/prepare` — Legacy interview prep wizard (still functional)

### User
- `/user/[id]` — Public user profile: stats, badges, activity feed, social links

### Invite Pages (public, no auth required)
- `/invite/group/[code]` — Auto-joins logged-in users, redirects to group
- `/invite/room/[code]` — Room invite

## Roadmap System

### Template Categories
- **Coding & Tech**: Crack the Job Together (90d flagship), Solve Striver Sheet, Solve Love Babbar Sheet, LeetCode Top 150, DSA Patterns, Learn System Design, Learn Databases, Learn OOP, Learn Multithreading, Frontend Dev, Backend Dev, Git, 100 Days of Code
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

## Learning Content

### Content Files (`frontend/src/data/`)
- `databases-content.ts` (13 lessons)
- `system-design-content.ts` (17 lessons)
- `oops-content.ts` (14 lessons)
- `multithreading-content.ts` (12 lessons)
- `frontend-content.ts` (8 lessons)
- `backend-content.ts` (8 lessons)
- `git-content.ts` (5 lessons)
Total: 77 lessons + 19 DSA patterns = 96 learning units

### Background Jobs
- **Scheduled Room Auto-Start**: Checks every 30s to auto-start scheduled war rooms
- **Digest Scheduler**: Morning digest (8:00 UTC), evening reminder (21:00 UTC), weekly report (Monday 9:00 UTC)

### Lesson Visual Components
Each LessonStep supports: `bullets`, `comparison` (side-by-side table), `flow` (step diagram), `table`, `cards` (info grid), `diagram` (ASCII art), `analogy` (callout), `keyTakeaway`, `code` (multi-language tabs)

### DSA Pattern Visualizers (`frontend/src/components/patterns/visualizers/`)
Pure SVG: TreeVisualizer, LinkedListVisualizer, GraphVisualizer, StackVisualizer, QueueVisualizer, DPTableVisualizer, TrieVisualizer, ArrayVisualizer
SimulationPlayer with play/pause, speed control, audio narration (Web Speech API)

## AI Features (NVIDIA NIM)

- **Model**: `meta/llama-3.3-70b-instruct`
- **Config**: `AI_BASE_URL`, `NVIDIA_API_KEY`, `AI_MODEL` env vars
- **AI Service**: `backend/src/modules/ai/service/ai.service.ts`
- **Endpoints**: `/api/revisions/generate`, `/hints`, `/explain`, `/review`
- **Rate Limiting**: 20 AI generations per user per day (Redis)

## Sidebar Navigation

Dashboard, Feed, Roadmaps, Learn, Problems, Groups, War Rooms, Leaderboard, Insights, Profile, Settings

## Shared Data Files
- `frontend/src/lib/roadmap-templates.ts` — All roadmap template definitions (shared between browse + start pages)
- `frontend/src/lib/learn-data.ts` — Topic/Lesson definitions + content file imports
- `frontend/src/lib/patterns-data.ts` — 19 DSA patterns with simulation data
- `frontend/src/lib/interview-planner.ts` — Legacy prep roadmap generator

## Testing

- **Backend**: Jest with TypeScript (ts-jest), 29 test files in `backend/src/__tests__/` (unit + integration)
- **TestSprite MCP**: Configured as MCP server for autonomous AI-powered testing (UI, API, accessibility, security). Run via Claude Code from this directory.

## Domain & Server

- **Domain**: `streaksy.in` (GoDaddy)
- **Server IP**: `56.228.57.11`
- **Frontend**: `http://streaksy.in:3000`
- **Backend API**: `http://streaksy.in:3001`

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
- All pages use AppShell wrapper (except landing page)
