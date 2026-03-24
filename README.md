# Streaksy

**Why Alone? Crush Your Goals With Friends.**

Streaksy is a social goal-tracking platform with curated roadmaps, streak points, learning content, and collaborative features. Originally built for coding/tech interview prep, it now supports any goal -- fitness, reading, languages, personal growth, and more.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Learning Content](#learning-content)
- [Browser Extension](#browser-extension)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Roadmaps
- **31 curated roadmap templates** across 5 categories: Coding & Tech, Fitness & Health, Learning & Reading, Languages, Personal Growth
- **Flagship 90-day "Crack the Job Together"** coding roadmap with topic customization, time allocation, and study mode selection
- **4-step start wizard** for coding roadmaps: Overview, Customize Topics/Hours, Study Mode (solo/friends/group), Review
- **Auto-scheduled War Rooms** based on chosen recurrence (daily, weekdays, weekends, weekly, monthly)
- **Day-by-day progress tracking**, participant leaderboards, discussions, AI guidance
- **Custom roadmap creation** for any goal

### Learning Hub
- **9 learning topics** with 87+ structured lessons: DSA Patterns, Databases, System Design, OOPs, Multithreading, Design Patterns, Frontend, Backend, Git
- **19 DSA pattern visualizers** with step-by-step algorithm simulations, play/pause, speed control, and audio narration
- **8 pure SVG interactive visualizers**: Tree, LinkedList, Graph, Stack, Queue, DPTable, Trie, Array
- **Rich lesson format**: bullets, comparison tables, flow diagrams, info cards, ASCII diagrams, analogies, key takeaways, multi-language code tabs (Python, JS, Java, C++)

### Problem Solving
- **LeetCode problem browser** with curated sheets (Striver, Love Babbar, LeetCode Top 150)
- **Chrome extension** auto-syncs accepted LeetCode submissions with rich metadata (language, runtime, memory, percentiles)
- **Problem status tracking** (not started, attempted, solved) across sheets
- **AI-powered tools**: hints, explanations, code review per problem
- **Community discussions** with AI summaries
- **Peer solutions** from group members
- **Daily problem recommendations** with AI briefs
- **Revision Hub** with flashcard browse and quiz mode

### Social & Collaboration
- **Study Groups** with invite codes, sheet assignments, activity feeds, and leaderboards
- **Friends system** with requests, enriched profiles (shared groups/roadmaps/rooms), and invite-by-email for non-users
- **Social Feed** with posts, likes, and comments
- **Poke system** to motivate inactive friends with escalating messages based on days inactive
- **War Rooms** for live collaborative problem solving with Socket.io real-time chat, timers, and solve tracking
- **Invite Friends modals** throughout -- groups, roadmaps, rooms all have friend pickers
- **Global and group leaderboards** ranked by streak points

### Gamification
- **Streak points**: 10 pts/task, 5 pts x consecutive days bonus, 100 pts for roadmap completion, +20% group bonus
- **Achievement badges** for milestones
- **Powerups**: streak freeze, double XP (purchasable with streak points)
- **Contests**: group-level competitive problem solving with standings
- **Contribution heatmap** on dashboard (GitHub-style)

### AI Features (NVIDIA NIM - Llama 3.3 70B)
- Problem hints, explanations, and code review
- AI coaching tips on insights page
- Roadmap AI guidance
- Daily AI briefs
- Lesson Q&A (Ask AI)
- Discussion summaries
- Note enhancement
- Revision note generation
- 30 AI generations per user per day (Redis rate-limited)

### Engagement
- **Email digests**: morning summary, evening streak-at-risk reminder, weekly report
- **Push notifications** (Web Push with VAPID)
- **Smart notification scheduling** at key UTC hours
- **Google Calendar integration** for war room scheduling
- **Pomodoro study timer**
- **Bookmarks** for problems, lessons, patterns, roadmaps

### Authentication
- Email/password signup with email verification
- Google OAuth 2.0
- GitHub OAuth
- Password reset via email
- JWT with Redis token blacklist for logout

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS |
| **State** | Zustand (auth, dashboard, friends stores) |
| **HTTP Client** | Axios with JWT interceptor |
| **Icons** | Lucide React (40+ icons) |
| **Backend** | Node.js, Express 5, TypeScript |
| **Validation** | Zod 4 |
| **Database** | PostgreSQL 16 (uuid-ossp, pgcrypto) |
| **Cache** | Redis 7 (caching, rate limiting, token blacklist, AI limits) |
| **Auth** | Passport.js (Google, GitHub OAuth), JWT, bcryptjs |
| **Real-time** | Socket.io 4 (war room chat, typing indicators, solve events) |
| **AI** | NVIDIA NIM API (Llama 3.3 70B Instruct) |
| **Email** | Nodemailer (SMTP) |
| **Push** | Web Push (VAPID keys) |
| **Logging** | Pino with request ID tracing |
| **File Upload** | Multer (avatars, sheet imports via xlsx library) |
| **Security** | Helmet, CORS, express-rate-limit |
| **Extension** | Chrome Manifest V3 (service worker, content script, network interceptor) |
| **Process Mgmt** | PM2 with zero-downtime reload |
| **CI/CD** | GitHub Actions (TypeScript check, tests, SSH deploy, health check) |
| **Reverse Proxy** | Nginx with WebSocket support, gzip, security headers |

---

## Architecture

```
+----------------------+       +-----------------------+       +------------------+
|                      |       |                       |       |                  |
|  Next.js Frontend    | <---> |   Express 5 API       | <---> |   PostgreSQL 16  |
|  (port 3000)         |  HTTP |   (port 3001)         |       |   (port 5432)    |
|                      |       |                       |       |                  |
+----------------------+       +-----------+-----------+       +------------------+
                                           |
       +--------------------+              |             +------------------+
       |                    |              +-----------> |                  |
       |  Chrome Extension  | -----HTTP---------------> |     Redis 7      |
       |  (LeetCode sync)   |                           |   (port 6379)    |
       |                    |              +-----------> |                  |
       +--------------------+              |             +------------------+
                                           |
                               +-----------+-----------+
                               |                       |
                               |   NVIDIA NIM API      |
                               |   (Llama 3.3 70B)     |
                               |                       |
                               +-----------------------+
```

### Backend Module Structure (31 modules)

```
backend/src/
  app.ts                    # Express app setup, middleware, route mounting
  server.ts                 # Server bootstrap, background jobs, Socket.io
  config/
    database.ts             # PostgreSQL pool, query helpers, transactions
    redis.ts                # Redis client
    env.ts                  # Environment variable configuration
    email.ts                # Nodemailer SMTP transport
    passport.ts             # Google + GitHub OAuth strategies
    logger.ts               # Pino structured logging
    socket.ts               # Socket.io setup + war room event handlers
  common/
    errors/AppError.ts      # HTTP error classes (400, 401, 403, 404, 409)
    types/index.ts          # AuthRequest, ProblemStatus, GroupRole, etc.
    utils/                  # asyncHandler, cache, aiRateLimit, params
  middleware/
    auth.ts                 # JWT + Redis blacklist authentication
    errorHandler.ts         # Global error handler (returns error + message)
    requestId.ts            # UUID per request for tracing
    validate.ts             # Zod schema validation
  modules/
    auth/                   # Signup, login, OAuth, password reset, email verify, profile, avatar, calendar
    problem/                # Problem listing, sheets, search, slug lookup
    group/                  # Group CRUD, join, sheets, roadmaps, invite friends, leaderboard
    progress/               # User problem status tracking
    sync/                   # LeetCode submission sync (extension endpoint)
    streak/                 # Streak calculation, multipliers
    leaderboard/            # Global and group leaderboards
    notes/                  # Personal/group notes, AI enhancement
    insights/               # Analytics: overview, weekly, tags, difficulty trends, AI coach
    sheets/                 # Excel/CSV sheet upload and parsing
    preferences/            # User preference management
    notification/           # Push notifications, Web Push, preferences
    discussion/             # Problem comments, AI summaries
    activity/               # Group activity feed
    revision/               # Revision notes, quiz mode, AI hints/explain/review
    contest/                # Group contests, standings
    badge/                  # Achievement badges
    room/                   # War rooms: create, join, schedule, chat, solve, leaderboard
    poke/                   # Poke friends, inactivity tracking, streak risk
    feed/                   # Social feed: posts, likes, comments
    daily/                  # Daily problems, AI briefs
    roadmaps/               # Templates, user roadmaps, progress, streaks, discussions, AI guidance
    ai/                     # Shared NVIDIA NIM API service
    prep/                   # Legacy interview prep wizard
    rating/                 # Problem ratings, company tags
    powerup/                # Streak freeze, inventory, purchase
    digest/                 # Morning/evening/weekly email digests
    invite/                 # Public invite code resolution + authenticated joining
    friends/                # Friend requests, list, search, enriched data, email invites
    learn/                  # Ask AI endpoint for learning
    calendar/               # Google Calendar OAuth integration
```

### Frontend Structure

```
frontend/src/
  app/                      # 45+ pages (Next.js App Router)
    auth/                   # Login, signup, callback, forgot/reset password, verify email
    dashboard/              # Main command center
    daily/                  # Daily problem recommendations
    feed/                   # Social feed
    roadmaps/               # Browse, start wizard, detail, create, join, history
    learn/                  # Learning hub, topic listing, lesson viewer
    patterns/               # DSA patterns with interactive simulations
    problems/               # Problem list, problem detail
    groups/                 # Group list, group detail
    friends/                # Friends list, requests, find friends
    rooms/                  # War room list, room detail
    leaderboard/            # Global/friends/groups leaderboards
    achievements/           # Badges
    bookmarks/              # Saved items
    insights/               # Analytics dashboard
    revision/               # Revision hub + quiz
    notifications/          # Notification center
    timer/                  # Pomodoro timer
    search/                 # Global search
    profile/                # User profile
    settings/               # Preferences, calendar, digest, extension
    extension/              # Chrome extension page
    invite/                 # Group and room invite pages
    user/[id]/              # Public user profiles
    prepare/                # Legacy prep wizard
  components/               # 79 components across 18 directories
    ai/                     # 9 AI-powered components
    dashboard/              # Stats, heatmap, powerups, activity
    discussion/             # Comment form, item, thread
    feed/                   # Feed card, share post
    friends/                # InviteFriendsModal (portal)
    groups/                 # Group card, leaderboard, members
    layout/                 # AppShell, Sidebar
    notes/                  # Note editor, list
    notifications/          # NotificationBell
    onboarding/             # Help tooltip, welcome modal
    patterns/               # SimulationPlayer, CodeTabs, 8 SVG visualizers
    poke/                   # Poke button, recovery challenge, streak risk banner
    problems/               # Table, filters, sheets, ratings, peer solutions, YouTube
    revision/               # Card, form, quiz
    search/                 # Problem picker, search bar
    settings/               # Digest section
    timer/                  # Study timer
    ui/                     # 13 primitives (Badge, Button, Card, Input, Skeleton, etc.)
  hooks/                    # 5 custom hooks
    useAsync.ts             # Generic async data fetching
    useFriends.ts           # Friends + enriched friends
    useBookmarks.ts         # localStorage bookmarks
    useLearnProgress.ts     # localStorage lesson progress
    usePushNotifications.ts # Web Push subscription
  lib/
    api.ts                  # Axios instance, 25 API service modules, 150+ methods
    store.ts                # Zustand stores (auth, dashboard, friends)
    types.ts                # 40+ TypeScript interfaces
    cn.ts                   # clsx + tailwind-merge utility
    socket.ts               # Socket.io client (lazy connection)
    roadmap-templates.ts    # 31 roadmap template definitions
    roadmap-content-map.ts  # Dynamic content mapping for roadmap tasks
    learn-data.ts           # 9 topic + lesson definitions
    patterns-data.ts        # 19 DSA patterns with simulation data
  data/                     # 8 learning content files (87+ lessons)
```

---

## Prerequisites

- **Node.js** >= 20.x
- **npm** >= 10.x
- **PostgreSQL** >= 16
- **Redis** >= 7
- **Google Chrome** (for the browser extension)

---

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/chakshujain/streaksy.git
cd streaksy
```

### 2. Start Infrastructure

**With Docker:**
```bash
cd backend/docker
docker compose up -d postgres redis
```

**Natively (Amazon Linux / Ubuntu):**
```bash
bash deploy/setup-server.sh  # One-time server setup (PostgreSQL 16, Redis, Node 20, PM2, Nginx)
```

### 3. Database Setup

```bash
cd backend
psql $DATABASE_URL -f scripts/schema.sql

# Run all migrations in order
for f in scripts/0*.sql; do psql $DATABASE_URL -f "$f"; done

# Seed data
psql $DATABASE_URL -f scripts/seed.sql
psql $DATABASE_URL -f scripts/seed-users.sql
psql $DATABASE_URL -f scripts/seed-roadmap-templates.sql
psql $DATABASE_URL -f scripts/seed-sheet-roadmaps.sql
```

### 4. Backend Setup

```bash
cd backend
npm install
cp .env.example .env  # Edit with your credentials
npm run dev            # Starts on http://localhost:3001
```

### 5. Frontend Setup

```bash
cd frontend
npm install
npm run dev            # Starts on http://localhost:3000
```

### 6. Browser Extension Setup

See the [Browser Extension](#browser-extension) section below.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|---|---|---|
| `PORT` | API server port | `3001` |
| `NODE_ENV` | Environment | `development` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/streaksy` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `JWT_SECRET` | JWT signing key | `dev-secret-change-me` |
| `JWT_EXPIRES_IN` | Token expiration | `7d` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (ms) | `900000` (15 min) |
| `RATE_LIMIT_MAX` | Max requests per window | `500` |
| `FRONTEND_URL` | Frontend URL (CORS, emails, redirects) | `http://localhost:3000` |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins | - |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | - |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | - |
| `GOOGLE_CALLBACK_URL` | Google OAuth callback | - |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | - |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth secret | - |
| `GITHUB_CALLBACK_URL` | GitHub OAuth callback | - |
| `SMTP_HOST` | Email SMTP host | - |
| `SMTP_PORT` | Email SMTP port | `587` |
| `SMTP_USER` | Email SMTP username | - |
| `SMTP_PASS` | Email SMTP password | - |
| `SMTP_FROM` | Email from address | - |
| `NVIDIA_API_KEY` | NVIDIA NIM API key | - |
| `AI_MODEL` | AI model ID | `meta/llama-3.3-70b-instruct` |
| `AI_BASE_URL` | AI API base URL | `https://integrate.api.nvidia.com/v1` |
| `VAPID_PUBLIC_KEY` | Web Push VAPID public key | - |
| `VAPID_PRIVATE_KEY` | Web Push VAPID private key | - |
| `VAPID_SUBJECT` | Web Push VAPID subject (mailto:) | - |
| `MOBILE_CALLBACK_URL` | Optional mobile deep link | - |

### Frontend (`frontend/.env.local`)

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:3001/api` |

---

## API Reference

All endpoints return JSON. Authenticated endpoints require `Authorization: Bearer <token>`. Routes are mounted on both `/api/` and `/api/v1/` for backward compatibility and mobile versioning.

### System

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/health` | No | Deep health check (DB + Redis status) |
| GET | `/api/info` | No | API info (name, version, endpoints) |

### Authentication (`/api/auth`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/signup` | No | Create account (email, password, displayName) |
| POST | `/login` | No | Login, receive JWT |
| POST | `/logout` | Yes | Blacklist JWT |
| POST | `/forgot-password` | No | Send reset email |
| POST | `/reset-password` | No | Reset with token |
| POST | `/verify-email` | No | Verify email code |
| POST | `/resend-verification` | No | Resend verification email |
| POST | `/change-password` | Yes | Change password |
| POST | `/connect-leetcode` | Yes | Link LeetCode username |
| POST | `/avatar` | Yes | Upload avatar (multipart) |
| GET | `/profile` | Yes | Get own profile |
| PUT | `/profile` | Yes | Update profile (bio, links) |
| GET | `/user/:userId` | Yes | Get public profile |
| GET | `/export` | Yes | Export all user data |
| GET | `/google` | No | Google OAuth initiation |
| GET | `/google/callback` | No | Google OAuth callback |
| GET | `/github` | No | GitHub OAuth initiation |
| GET | `/github/callback` | No | GitHub OAuth callback |
| GET | `/google/calendar` | Yes | Google Calendar consent URL |
| GET | `/google/calendar/callback` | No | Google Calendar callback |
| GET | `/calendar/status` | Yes | Check calendar connection |
| POST | `/calendar/disconnect` | Yes | Disconnect Google Calendar |

### Problems (`/api/problems`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | Yes | List problems (paginated, filtered by difficulty) |
| GET | `/sheets` | Yes | List all curated sheets |
| GET | `/sheets/:slug` | Yes | Get problems in a sheet |
| GET | `/search` | Yes | Search problems by query |
| GET | `/:slug` | Yes | Get problem by slug |

### Progress (`/api/progress`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | Yes | Get all problem progress |
| GET | `/sheet/:sheetSlug` | Yes | Progress filtered by sheet |
| PUT | `/status` | Yes | Update problem status (not_started/attempted/solved) |

### Groups (`/api/groups`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | Yes | Create group |
| POST | `/join` | Yes | Join via invite code |
| GET | `/` | Yes | List user's groups |
| GET | `/:id` | Yes | Group details + members |
| PUT | `/:id/plan` | Yes | Update group plan |
| POST | `/:id/sheets` | Yes | Assign sheet to group |
| GET | `/:id/sheets` | Yes | Get group sheets |
| GET | `/:id/sheets/:sheetId/progress` | Yes | Member sheet progress |
| DELETE | `/:id/sheets/:sheetId` | Yes | Remove sheet |
| GET | `/:id/roadmaps` | Yes | All members' roadmaps |
| POST | `/:id/invite-friends` | Yes | Invite friends to group |
| POST | `/:id/leave` | Yes | Leave group |
| DELETE | `/:id` | Yes | Delete group (admin) |

### Roadmaps (`/api/roadmaps`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/categories` | Yes | List roadmap categories |
| GET | `/templates` | Yes | All templates |
| GET | `/templates/featured` | Yes | Featured templates |
| GET | `/templates/:slug` | Yes | Template details |
| GET | `/templates/:slug/participants` | Yes | Template participants |
| GET | `/templates/:slug/discussions` | Yes | Template discussions |
| POST | `/templates/:slug/discussions` | Yes | Post discussion |
| POST | `/` | Yes | Create user roadmap |
| GET | `/active` | Yes | Active roadmaps |
| GET | `/all` | Yes | All roadmaps |
| GET | `/today` | Yes | Today's tasks across roadmaps |
| GET | `/:id` | Yes | Roadmap details |
| PATCH | `/:id` | Yes | Update roadmap |
| DELETE | `/:id` | Yes | Delete roadmap |
| PUT | `/:id/progress` | Yes | Update day progress |
| GET | `/:id/progress` | Yes | Get day progress |
| GET | `/:id/streak` | Yes | Roadmap streak |
| GET | `/:id/leaderboard` | Yes | Roadmap leaderboard |
| POST | `/:id/link-group` | Yes | Link to group |
| POST | `/:id/ai-guidance` | Yes | Get AI guidance |
| POST | `/:id/invite-friends` | Yes | Invite friends |
| POST | `/join/:code` | Yes | Join by share code |
| GET | `/share/:code` | No | Public roadmap preview |

### Friends (`/api/friends`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | Yes | List friends |
| GET | `/enriched` | Yes | Friends with shared groups/roadmaps/rooms |
| GET | `/ids` | Yes | Friend IDs (for caching) |
| GET | `/requests` | Yes | Pending friend requests |
| GET | `/search` | Yes | Search users (all by default) |
| POST | `/request` | Yes | Send friend request |
| PATCH | `/:id/accept` | Yes | Accept request |
| DELETE | `/:id` | Yes | Remove friend |
| POST | `/invite-email` | Yes | Invite non-user by email |

### War Rooms (`/api/rooms`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | Yes | Create room |
| POST | `/join` | Yes | Join room |
| GET | `/mine` | Yes | My rooms |
| GET | `/active` | Yes | Active rooms |
| GET | `/upcoming` | Yes | Upcoming scheduled rooms |
| GET | `/leaderboard` | Yes | Room leaderboard |
| GET | `/suggest` | Yes | Suggest problems |
| GET | `/group/:groupId` | Yes | Rooms for group |
| GET | `/:id` | Yes | Room details |
| GET | `/:id/problems` | Yes | Room problems |
| POST | `/:id/start` | Yes | Start room (host) |
| POST | `/:id/end` | Yes | End room (host) |
| POST | `/:id/solve` | Yes | Mark problem solved |
| POST | `/:id/invite-friends` | Yes | Invite friends |

### Social Feed (`/api/feed`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/post` | Yes | Create post |
| GET | `/` | Yes | Get feed |
| GET | `/user/:userId` | Yes | User's posts |
| POST | `/:id/like` | Yes | Toggle like |
| POST | `/:id/comments` | Yes | Add comment |
| GET | `/:id/comments` | Yes | Get comments |
| DELETE | `/comments/:id` | Yes | Delete comment |

### Revisions (`/api/revisions`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | Yes | List revisions |
| GET | `/quiz` | Yes | Quiz mode |
| GET | `/:problemId` | Yes | Revisions for problem |
| POST | `/` | Yes | Create/update revision |
| POST | `/generate` | Yes | AI-generate notes |
| POST | `/hints` | Yes | Get AI hints |
| POST | `/explain` | Yes | Get AI explanation |
| POST | `/review` | Yes | Get AI code review |
| PATCH | `/:id/revised` | Yes | Mark as revised |
| DELETE | `/:id` | Yes | Delete revision |

### Additional Endpoints

| Module | Base Path | Key Endpoints |
|---|---|---|
| **Streaks** | `/api/streaks` | GET `/` (current streak), GET `/multipliers` |
| **Leaderboard** | `/api/leaderboard` | GET `/global`, GET `/group/:groupId` |
| **Notes** | `/api/notes` | CRUD + GET `/personal/:problemId`, GET `/group/:groupId/:problemId`, POST `/:id/enhance` |
| **Insights** | `/api/insights` | GET `/overview`, `/weekly`, `/tags`, `/difficulty-trend`, POST `/ai-coach` |
| **Notifications** | `/api/notifications` | GET `/`, `/unread-count`, PATCH `/:id/read`, `/read-all`, push subscribe/unsubscribe, preferences |
| **Discussions** | `/api/problems/:slug` | GET/POST `/comments`, POST `/ai-summary`; `/api/comments/:id` for replies, update, delete |
| **Activity** | `/api/groups/:id/activity` | GET group activity feed |
| **Contests** | `/api/groups/:id/contests` | POST create, GET list; `/api/contests/:id` details + submit |
| **Badges** | `/api/badges` | GET `/` (all), GET `/mine` |
| **Pokes** | `/api/pokes` | POST `/`, GET `/received`, `/inactive/:groupId`, `/streak-risk`, `/challenge` |
| **Daily** | `/api/daily` | GET `/` (problems), POST `/ai-brief` |
| **Ratings** | `/api/ratings` | POST `/`, GET `/companies`, `/:problemId` stats/mine/companies, POST `/:problemId/companies` |
| **Powerups** | `/api/powerups` | GET `/`, `/log`, `/costs`, POST `/purchase`, `/freeze` |
| **Digest** | `/api/digest` | GET/PUT `/preferences`, POST `/preview`, trigger endpoints (admin) |
| **Invite** | `/api/invite` | GET `/group/:code`, `/room/:code` (public); POST `/group/:code/join`, `/room/:code/join` (auth) |
| **Sync** | `/api/sync` | POST `/leetcode`, GET `/submissions`, `/submissions/stats`, `/submissions/:problemId`, `/peer-solutions/:problemId` |
| **Sheets** | `/api/sheets` | POST `/upload` (multipart, admin secret) |
| **Preferences** | `/api/preferences` | GET `/`, PUT `/` |
| **Learn** | `/api/learn` | POST `/ask-ai` |
| **Prep** | `/api/prep` | POST `/`, GET `/active`, `/:id`, `/share/:code`, PUT `/:id/progress`, POST `/:id/link-group`, GET `/:id/leaderboard` |

---

## Database Schema

PostgreSQL 16 with `uuid-ossp` and `pgcrypto` extensions. All primary keys are UUIDs. 32 migration scripts.

### Core Tables

| Table | Description |
|---|---|
| `users` | Accounts (email, password, display name, LeetCode username, OAuth, avatar, bio, social links) |
| `problems` | LeetCode problems (title, slug, difficulty, URL) |
| `tags` | Problem tags (arrays, DP, trees, etc.) |
| `problem_tags` | Many-to-many: problems to tags |
| `sheets` | Curated problem lists |
| `sheet_problems` | Problems in a sheet with ordering |
| `groups` | Study groups with invite codes |
| `group_members` | Membership with role (admin/member) |
| `user_problem_status` | Per-user problem status (not_started/attempted/solved) |
| `user_streaks` | Current streak, longest streak, total_points, last solve date |
| `user_preferences` | Theme, accent color, layout, weekly goal, etc. |
| `notes` | Personal or group-visible notes on problems |

### Feature Tables

| Table | Description |
|---|---|
| `notifications` | Push notification records |
| `push_subscriptions` | Web Push subscription data |
| `notification_preferences` | Per-channel notification settings |
| `comments` | Problem discussion comments (threaded) |
| `group_activity` | Activity feed events |
| `revision_notes` | Revision flashcards with AI content |
| `contests` | Group contests |
| `contest_submissions` | Contest problem submissions |
| `badges` | Achievement definitions |
| `user_badges` | Earned badges |
| `rooms` | War rooms (name, code, status, schedule, group_id, roadmap_id) |
| `room_participants` | Room membership + solve status |
| `room_messages` | Real-time chat messages |
| `pokes` | Poke records between users |
| `social_posts` | Feed posts |
| `social_likes` | Post likes |
| `social_comments` | Post comments |
| `friendships` | Friend relationships (requester, addressee, status) |
| `submissions` | LeetCode submission history with metadata |

### Roadmap Tables

| Table | Description |
|---|---|
| `roadmap_categories` | Category groupings |
| `roadmap_templates` | 31 template definitions |
| `template_tasks` | Day-by-day tasks per template |
| `user_roadmaps` | Active user roadmap instances |
| `roadmap_day_progress` | Daily completion tracking |
| `roadmap_streaks` | Per-roadmap streak data |
| `roadmap_participants` | Shared roadmap members |
| `roadmap_discussions` | Roadmap discussion threads |

### Engagement Tables

| Table | Description |
|---|---|
| `problem_ratings` | User difficulty ratings |
| `company_tags` | Company-sourced problem tags |
| `powerup_inventory` | User powerup items |
| `powerup_log` | Powerup usage history |
| `digest_preferences` | Email digest settings |
| `digest_log` | Sent digest records |

---

## Learning Content

### 9 Topics, 87+ Lessons

All content is data-driven from TypeScript files in `frontend/src/data/`:

| Topic | Lessons | File |
|---|---|---|
| DSA Patterns | 19 interactive patterns | `lib/patterns-data.ts` |
| Databases | 13 | `databases-content.ts` |
| System Design | 17 | `system-design-content.ts` |
| OOPs | 14 | `oops-content.ts` |
| Multithreading | 12 | `multithreading-content.ts` |
| Design Patterns | 10+ | `design-patterns-content.ts` |
| Frontend Dev | 8 | `frontend-content.ts` |
| Backend Dev | 8 | `backend-content.ts` |
| Git & GitHub | 5 | `git-content.ts` |

Each lesson uses a rich step-by-step format with multi-language code tabs (Python, JS, Java, C++), comparison tables, flow diagrams, analogies, and key takeaways.

### DSA Pattern Visualizers

19 patterns with pure SVG interactive visualizers: Tree, LinkedList, Graph, Stack, Queue, DPTable, Trie, Array. Features play/pause simulation, speed control, and audio narration via Web Speech API.

---

## Browser Extension

The Chrome extension (Manifest V3) automatically detects and syncs accepted LeetCode submissions.

### How It Works

1. **Content Script** (`content.js`) -- Injected on `leetcode.com/problems/*`. Detects "Accepted" via DOM observation and network interception.
2. **Injected Script** (`injected.js`) -- Intercepts `fetch`/`XHR` in page context to capture submission details (code, language, runtime, memory, percentiles).
3. **Background Service Worker** (`background.js`) -- Receives submissions, authenticates with Streaksy API, syncs with deduplication (30s cooldown), retry with exponential backoff, and alarm-based retry.
4. **Popup UI** (`popup/`) -- Login (email/password + OAuth), sync status, rich history with language/runtime/memory metadata.

### Loading the Extension

1. Navigate to `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked** and select the `extension/` directory
4. Click the Streaksy icon to log in
5. Solve LeetCode problems -- submissions auto-sync

### Permissions

| Permission | Reason |
|---|---|
| `storage` | Auth tokens, sync status, history |
| `alarms` | Retry syncs after failures |
| `https://leetcode.com/*` | Content script injection |

---

## Testing

### Overview

83 test files using Jest with TypeScript (ts-jest):

| Type | Count | Location | Description |
|---|---|---|---|
| **Unit** | 41 | `__tests__/unit/` | 30 services, 5 validation schemas, 3 common utilities, 3 middleware |
| **Integration** | 26 | `__tests__/integration/` | API route tests for all modules |
| **E2E Journey** | 16 | `__tests__/e2e/` | Full user workflow tests |

### E2E Journey Tests

| Journey | What it Tests |
|---|---|
| User Onboarding | Signup, login, preferences, roadmap browsing, day completion, streaks |
| Study Session | Create room, join, solve, notes, revision, insights |
| Roadmap Lifecycle | Start, 30-day progression, badges, leave |
| Multi-User Collaboration | 3 users on same roadmap, leaderboard, discussions |
| Social Collaboration | Groups, friends, roadmaps, pokes, feed |
| Group Management & Sheets | Create group, join, sheets, progress, activity, leave |
| LeetCode Sync | Connect, sync, submissions, stats, peer solutions |
| Invite System | Public invite resolution, group/room joining |
| Feed & Social | Posts, likes, comments, friend search, pokes, streak risk |
| Ratings & Company Tags | Rate problems, aggregate stats, company tags |
| Powerups & Streak Protection | Purchase freeze/double XP, activate, usage log |
| AI-Assisted Learning | Hints, explain, code review, generate notes, quiz, delete |
| Content Engagement | Browse, filter, toggle, notes, discussions, daily, quiz |
| Contests | Create, view, submit, standings, access control |
| Notifications & Digest | View, mark read, pagination, digest preferences, preview |
| Profile & Account | View/update profile, connect LeetCode, change/reset password, export |

### Running Tests

```bash
cd backend

# Run all tests (needs extra memory for full suite)
NODE_OPTIONS="--max-old-space-size=4096" npm test

# Run specific test category
NODE_OPTIONS="--max-old-space-size=4096" npx jest src/__tests__/e2e/
npx jest src/__tests__/integration/
npx jest src/__tests__/unit/

# Run with coverage
NODE_OPTIONS="--max-old-space-size=4096" npm run test:coverage
```

### TestSprite MCP

Configured as MCP server for autonomous AI-powered testing (UI, API, accessibility, security). Run via Claude Code from the project root.

---

## Deployment

### Production Stack

- **Server**: Amazon Linux 2023 on EC2
- **Domain**: `streaksy.in` (GoDaddy)
- **Process Manager**: PM2 (`ecosystem.config.js`)
- **Reverse Proxy**: Nginx with WebSocket support, gzip, security headers
- **Database**: PostgreSQL 16 (local)
- **Cache**: Redis 7 (local)
- **CI/CD**: GitHub Actions (TypeScript check, tests, SSH deploy, health check)

### Deploy Script

```bash
bash deploy/deploy.sh
```

Steps: pull latest code, install deps, build backend (tsc), build frontend (next build), run migrations, reload PM2.

### PM2 Processes

| Process | Port | Script |
|---|---|---|
| `streaksy-backend` | 3001 | `dist/server.js` |
| `streaksy-frontend` | 3000 | `next start -p 3000` |

### Nginx Configuration

- `/api/` proxied to backend (port 3001)
- `/socket.io/` proxied with WebSocket upgrade
- `/_next/static/` cached 365 days (immutable)
- HTML pages served with `no-cache` to prevent stale JS chunk references
- Security headers: X-Frame-Options, X-Content-Type-Options, X-XSS-Protection
- Client body size: 10MB max
- Config at: `/etc/nginx/conf.d/streaksy.conf` (source: `deploy/nginx.conf`)

### GitHub Actions CI/CD

On push to main:
1. TypeScript compile check (`npx tsc --noEmit`)
2. Backend tests (`npm test`)
3. SSH deploy to EC2 (`bash deploy/deploy.sh`)
4. Health check (`/health` endpoint)

### Manual Commands

```bash
pm2 ls                          # List processes
pm2 logs                        # Tail logs
pm2 reload ecosystem.config.js  # Zero-downtime reload
pm2 restart ecosystem.config.js # Hard restart
curl http://localhost:3001/health  # Health check
```

### Production Checklist

- [ ] Set strong, unique `JWT_SECRET`
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS origins (`ALLOWED_ORIGINS`)
- [ ] Set `FRONTEND_URL` to production domain
- [ ] Configure SMTP for email digests
- [ ] Set NVIDIA API key for AI features
- [ ] Generate and set VAPID keys for push notifications
- [ ] Configure Google + GitHub OAuth credentials
- [ ] Set up database backups
- [ ] Use HTTPS everywhere
- [ ] Update extension `API_BASE` for production
- [ ] Always restart frontend PM2 after `next build`

---

## Contributing

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Install dependencies: `cd backend && npm install && cd ../frontend && npm install`
4. Start dev servers: backend (`npm run dev`) + frontend (`npm run dev`)
5. Make your changes
6. Run tests: `cd backend && npm test`
7. Commit and push
8. Open a pull request

### Project Conventions

- **Backend modules**: controller/service/repository/routes/validation per domain
- **Validation**: Zod schemas via `validate` middleware
- **Errors**: `AppError` class (badRequest, unauthorized, notFound, conflict, forbidden)
- **Async handlers**: Wrapped with `asyncHandler`
- **Frontend components**: Organized by feature domain, shared primitives in `ui/`
- **State**: Zustand stores in `lib/store.ts`
- **Styling**: Tailwind CSS with `cn()` utility (clsx + tailwind-merge)
- **TypeScript**: Strict mode enabled for both frontend and backend
- **API versioning**: Routes mounted on both `/api/` and `/api/v1/`

---

## License

ISC
