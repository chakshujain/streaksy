# Streaksy

**Multiplayer DSA prep platform with LeetCode sync, groups, streaks, and insights.**

Streaksy helps developers prepare for coding interviews together. Solve LeetCode problems, automatically sync your progress via a browser extension, form study groups, maintain daily streaks, and gain insights into your preparation patterns -- all in one place.

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
- [Browser Extension](#browser-extension)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **LeetCode Sync** -- Chrome extension automatically detects accepted submissions on LeetCode and syncs them to your Streaksy account in real time.
- **Problem Sheets** -- Browse curated problem lists (Striver Sheet, LeetCode Top 150, Love Babbar 450) or upload your own via Excel/CSV.
- **Study Groups** -- Create or join groups with invite codes. Collaborate with friends or classmates.
- **Group Leaderboards** -- Ranked leaderboards within each group based on problems solved and streak scores.
- **Streaks** -- Daily solve streaks with current and longest streak tracking.
- **Insights Dashboard** -- Solve-rate breakdowns by difficulty, weekly activity charts, tag-level progress, and monthly difficulty trends.
- **Notes** -- Personal or group-visible notes on any problem for documenting approaches and solutions.
- **Contribution Heatmap** -- GitHub-style activity heatmap on the dashboard.
- **User Preferences** -- Configurable theme, accent color, dashboard layout, streak animations, heatmap visibility, and weekly goals.

---

## Tech Stack

| Layer              | Technology                                                       |
| ------------------ | ---------------------------------------------------------------- |
| **Frontend**       | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS     |
| **State Mgmt**     | Zustand                                                          |
| **HTTP Client**    | Axios                                                            |
| **Backend**        | Node.js, Express 5, TypeScript                                   |
| **Validation**     | Zod                                                              |
| **Database**       | PostgreSQL 16 with uuid-ossp and pgcrypto extensions             |
| **Cache**          | Redis 7                                                          |
| **Auth**           | JWT (jsonwebtoken) + bcryptjs password hashing                   |
| **Security**       | Helmet, CORS, express-rate-limit                                 |
| **File Uploads**   | Multer (xlsx/xls/csv sheet imports via the `xlsx` library)       |
| **Extension**      | Chrome Manifest V3 (service worker, content script, injected.js) |
| **Containerization** | Docker, Docker Compose                                         |

---

## Architecture

```
+---------------------+       +---------------------+       +------------------+
|                     |       |                     |       |                  |
|   Next.js Frontend  | <---> |   Express API       | <---> |   PostgreSQL     |
|   (port 3000)       |  HTTP |   (port 3001*)      |       |   (port 5432)    |
|                     |       |                     |       |                  |
+---------------------+       +----------+----------+       +------------------+
                                         |
        +-------------------+            |            +------------------+
        |                   |            +----------> |                  |
        | Chrome Extension  | -----HTTP-------------> |     Redis        |
        | (LeetCode pages)  |                         |   (port 6379)    |
        |                   |                         |                  |
        +-------------------+                         +------------------+

* Default backend port is 3000; adjust if running frontend on the same port.
```

### Backend Module Structure

The backend follows a modular architecture with each domain organized into controller, service, repository, routes, and validation layers:

```
backend/src/
  app.ts                  # Express app setup, middleware, route mounting
  server.ts               # Server bootstrap (DB + Redis connect, listen)
  config/
    database.ts           # PostgreSQL pool, query helpers, transaction wrapper
    env.ts                # Environment variable configuration
    redis.ts              # Redis client setup
  common/
    errors/AppError.ts    # Structured HTTP error classes
    types/index.ts        # Shared TypeScript types (AuthRequest, etc.)
    utils/                # asyncHandler, param helpers
  middleware/
    auth.ts               # JWT Bearer token authentication
    errorHandler.ts       # Global error handler
    validate.ts           # Zod schema validation middleware
  modules/
    auth/                 # Signup, login, LeetCode account linking
    problem/              # Problem listing, sheets, slug lookup
    group/                # Group CRUD, join via invite code
    progress/             # User problem status tracking
    sync/                 # LeetCode submission sync (extension endpoint)
    streak/               # Daily streak calculation
    leaderboard/          # Group leaderboard scoring
    notes/                # Personal and group notes on problems
    insights/             # Analytics: overview, weekly, tags, trends
    sheets/               # Excel/CSV sheet upload and parsing
    preferences/          # User preference management
```

### Frontend Structure

```
frontend/src/
  app/                    # Next.js App Router pages
    auth/login/           # Login page
    auth/signup/          # Signup page
    dashboard/            # Main dashboard with stats, heatmap, activity
    groups/               # Group list and group detail ([id])
    insights/             # Analytics and charts
    problems/             # Problem list and problem detail ([slug])
    settings/             # User preferences
  components/
    dashboard/            # StatsCards, ContributionHeatmap, RecentActivity
    groups/               # GroupCard, GroupLeaderboard, MemberList
    layout/               # AppShell, Sidebar
    notes/                # NoteEditor, NotesList
    problems/             # ProblemTable, ProblemFilters, SheetSelector, SheetUpload
    ui/                   # Badge, Button, Card, EmptyState, Input, Skeleton
  hooks/
    useAsync.ts           # Async data fetching hook
  lib/
    api.ts                # Axios instance with auth interceptors, all API methods
    cn.ts                 # clsx + tailwind-merge utility
    store.ts              # Zustand stores (auth, dashboard)
    types.ts              # TypeScript interfaces
```

---

## Prerequisites

- **Node.js** >= 20.x
- **npm** >= 10.x
- **PostgreSQL** >= 16
- **Redis** >= 7
- **Docker** and **Docker Compose** (optional, for containerized setup)
- **Google Chrome** (for the browser extension)

---

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/streaksy.git
cd streaksy
```

### 2. Start Infrastructure (Docker)

The easiest way to get PostgreSQL and Redis running:

```bash
cd backend/docker
docker compose up -d postgres redis
```

This starts PostgreSQL on port 5432 and Redis on port 6379. The database schema and seed data are automatically applied on first run via Docker entrypoint scripts.

If you prefer running PostgreSQL and Redis natively, make sure they are running and accessible, then initialize the database manually:

```bash
cd backend
psql $DATABASE_URL -f scripts/schema.sql
psql $DATABASE_URL -f scripts/002-preferences.sql
psql $DATABASE_URL -f scripts/seed.sql
```

### 3. Backend Setup

```bash
cd backend
npm install
cp .env.example .env  # Create from the template below if .env.example doesn't exist
npm run dev
```

The API server starts at `http://localhost:3000` by default.

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend starts at `http://localhost:3000` by default (Next.js). If the backend is also on port 3000, set a different port for one of them (e.g., `PORT=3001 npm run dev` for the backend) and update `NEXT_PUBLIC_API_URL` accordingly.

### 5. Browser Extension Setup

See the [Browser Extension](#browser-extension) section below.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable               | Description                              | Default                                              |
| ---------------------- | ---------------------------------------- | ---------------------------------------------------- |
| `PORT`                 | API server port                          | `3000`                                               |
| `NODE_ENV`             | Environment (`development`/`production`) | `development`                                        |
| `DATABASE_URL`         | PostgreSQL connection string             | `postgresql://postgres:postgres@localhost:5432/streaksy` |
| `REDIS_URL`            | Redis connection string                  | `redis://localhost:6379`                              |
| `JWT_SECRET`           | Secret key for signing JWTs              | `dev-secret-change-me` (change in production!)       |
| `JWT_EXPIRES_IN`       | JWT token expiration duration            | `7d`                                                 |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in milliseconds       | `900000` (15 minutes)                                |
| `RATE_LIMIT_MAX`       | Max requests per window                  | `100`                                                |

### Frontend (`frontend/.env.local`)

| Variable              | Description          | Default                       |
| --------------------- | -------------------- | ----------------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:3000/api`   |

### Extension

The API base URL is hardcoded in `extension/background.js` as `http://localhost:3000/api`. Update this constant when deploying to production.

---

## API Reference

All endpoints return JSON. Authenticated endpoints require an `Authorization: Bearer <token>` header.

### Health Check

| Method | Endpoint  | Auth | Description         |
| ------ | --------- | ---- | ------------------- |
| GET    | `/health` | No   | Returns `{ status: "ok", timestamp }` |

### Authentication (`/api/auth`)

| Method | Endpoint                   | Auth | Description                    | Request Body                                           |
| ------ | -------------------------- | ---- | ------------------------------ | ------------------------------------------------------ |
| POST   | `/api/auth/signup`         | No   | Create a new account           | `{ email, password (min 8 chars), displayName }`       |
| POST   | `/api/auth/login`          | No   | Login and receive JWT          | `{ email, password }`                                  |
| POST   | `/api/auth/connect-leetcode` | Yes | Link a LeetCode username     | `{ leetcodeUsername }`                                 |

### Problems (`/api/problems`)

| Method | Endpoint                        | Auth | Description                              | Query Params                     |
| ------ | ------------------------------- | ---- | ---------------------------------------- | -------------------------------- |
| GET    | `/api/problems`                 | Yes  | List problems (paginated)                | `difficulty`, `limit`, `offset`  |
| GET    | `/api/problems/sheets`          | Yes  | List all curated problem sheets          | --                               |
| GET    | `/api/problems/sheets/:slug`    | Yes  | Get problems in a specific sheet         | --                               |
| GET    | `/api/problems/:slug`           | Yes  | Get a single problem by slug             | --                               |

### Groups (`/api/groups`)

| Method | Endpoint              | Auth | Description                              | Request Body                     |
| ------ | --------------------- | ---- | ---------------------------------------- | -------------------------------- |
| POST   | `/api/groups`         | Yes  | Create a new group                       | `{ name, description? }`        |
| POST   | `/api/groups/join`    | Yes  | Join a group via invite code             | `{ inviteCode }`                 |
| GET    | `/api/groups`         | Yes  | List groups the user belongs to          | --                               |
| GET    | `/api/groups/:id`     | Yes  | Get group details including members      | --                               |

### Progress (`/api/progress`)

| Method | Endpoint                        | Auth | Description                              |
| ------ | ------------------------------- | ---- | ---------------------------------------- |
| GET    | `/api/progress`                 | Yes  | Get all problem progress for the user    |
| GET    | `/api/progress/sheet/:sheetSlug` | Yes | Get progress filtered by a sheet         |

### Sync (`/api/sync`)

| Method | Endpoint              | Auth | Description                              | Request Body                             |
| ------ | --------------------- | ---- | ---------------------------------------- | ---------------------------------------- |
| POST   | `/api/sync/leetcode`  | Yes  | Sync a LeetCode submission               | `{ userId (UUID), problemSlug, status ("solved" \| "attempted") }` |

This is the primary endpoint used by the browser extension. On sync, the server:
1. Validates the user and problem exist
2. Upserts the user's problem status
3. Updates the daily streak (if status is `solved`)
4. Recalculates leaderboard scores for all the user's groups

### Streaks (`/api/streaks`)

| Method | Endpoint        | Auth | Description                                   |
| ------ | --------------- | ---- | --------------------------------------------- |
| GET    | `/api/streaks`  | Yes  | Get current and longest streak for the user   |

### Leaderboard (`/api/leaderboard`)

| Method | Endpoint                          | Auth | Description                              |
| ------ | --------------------------------- | ---- | ---------------------------------------- |
| GET    | `/api/leaderboard/group/:groupId` | Yes  | Get ranked leaderboard for a group       |

### Notes (`/api/notes`)

| Method | Endpoint                                | Auth | Description                           | Request Body                                                |
| ------ | --------------------------------------- | ---- | ------------------------------------- | ----------------------------------------------------------- |
| POST   | `/api/notes`                            | Yes  | Create a note                         | `{ problemId (UUID), content (max 10000), visibility ("personal" \| "group"), groupId? }` |
| PUT    | `/api/notes/:id`                        | Yes  | Update a note's content               | `{ content }`                                               |
| DELETE | `/api/notes/:id`                        | Yes  | Delete a note                         | --                                                          |
| GET    | `/api/notes/personal/:problemId`        | Yes  | Get personal notes for a problem      | --                                                          |
| GET    | `/api/notes/group/:groupId/:problemId`  | Yes  | Get group notes for a problem         | --                                                          |

### Insights (`/api/insights`)

| Method | Endpoint                         | Auth | Description                                              |
| ------ | -------------------------------- | ---- | -------------------------------------------------------- |
| GET    | `/api/insights/overview`         | Yes  | Total solved, difficulty breakdown, streak, active days  |
| GET    | `/api/insights/weekly`           | Yes  | Weekly solve counts (last 12 weeks)                      |
| GET    | `/api/insights/tags`             | Yes  | Solved vs. total problems per tag                        |
| GET    | `/api/insights/difficulty-trend` | Yes  | Monthly solve counts grouped by difficulty               |

### Sheets (`/api/sheets`)

| Method | Endpoint              | Auth | Description                                       | Request Body                        |
| ------ | --------------------- | ---- | ------------------------------------------------- | ----------------------------------- |
| POST   | `/api/sheets/upload`  | Yes  | Upload an Excel/CSV file to create a problem sheet | `multipart/form-data` with `file` (xlsx/xls/csv, max 10MB) and `name` field |

### Preferences (`/api/preferences`)

| Method | Endpoint             | Auth | Description                 | Request Body                                                                           |
| ------ | -------------------- | ---- | --------------------------- | -------------------------------------------------------------------------------------- |
| GET    | `/api/preferences`   | Yes  | Get user preferences        | --                                                                                     |
| PUT    | `/api/preferences`   | Yes  | Update user preferences     | `{ theme?, accent_color? (hex), dashboard_layout?, show_streak_animation?, show_heatmap?, weekly_goal? (1-100) }` |

---

## Database Schema

The database uses PostgreSQL with `uuid-ossp` and `pgcrypto` extensions. All primary keys are UUIDs. Timestamps use `TIMESTAMPTZ`.

### Entity Relationship Overview

```
users ──────────┬─────────── user_streaks          (1:1)
                ├─────────── user_preferences       (1:1)
                ├─────────── user_problem_status     (M:N with problems)
                ├─────────── group_members           (M:N with groups)
                └─────────── notes

problems ───────┬─────────── problem_tags           (M:N with tags)
                ├─────────── sheet_problems          (M:N with sheets)
                ├─────────── user_problem_status
                └─────────── notes

groups ─────────┬─────────── group_members
                └─────────── notes

sheets ─────────── sheet_problems
tags ───────────── problem_tags
```

### Tables

| Table                  | Description                                                                 |
| ---------------------- | --------------------------------------------------------------------------- |
| `users`                | User accounts with email, password hash, display name, optional LeetCode username |
| `problems`             | LeetCode problems with title, slug, difficulty (easy/medium/hard), URL      |
| `tags`                 | Problem tags (array, dynamic-programming, tree, etc.)                       |
| `problem_tags`         | Many-to-many join between problems and tags                                 |
| `sheets`               | Curated problem lists (e.g., Striver Sheet, LeetCode Top 150)              |
| `sheet_problems`       | Problems in a sheet with ordering (position)                                |
| `groups`               | Study groups with name, description, and unique invite code                 |
| `group_members`        | Group membership with role (admin/member)                                   |
| `user_problem_status`  | Tracks each user's status per problem (not_started/attempted/solved)        |
| `user_streaks`         | Current streak, longest streak, and last solve date per user                |
| `notes`                | User notes on problems, either personal or group-visible                    |
| `user_preferences`     | Dashboard preferences (theme, accent color, layout, weekly goal, etc.)      |

### Automatic Timestamps

An `update_updated_at()` trigger function automatically sets `updated_at` to `NOW()` on updates for `users`, `user_problem_status`, `user_streaks`, `notes`, and `user_preferences`.

---

## Browser Extension

The Chrome extension (Manifest V3) automatically detects and syncs accepted LeetCode submissions to your Streaksy account.

### How It Works

1. **Content Script** (`content.js`) -- Injected on `https://leetcode.com/problems/*` pages. Uses two detection strategies:
   - **Network interception** via `injected.js` (intercepts `fetch` and `XMLHttpRequest` calls to the LeetCode submission check endpoint)
   - **DOM observation** via `MutationObserver` watching for "Accepted" result elements
2. **Injected Script** (`injected.js`) -- Runs in the page context to intercept network calls and communicates results back to the content script via `window.postMessage`.
3. **Background Service Worker** (`background.js`) -- Receives `SUBMISSION_ACCEPTED` messages, authenticates with the Streaksy API, and calls `POST /api/sync/leetcode`. Features:
   - Deduplication (30-second cooldown per problem slug)
   - Retry with exponential backoff (up to 3 attempts: 1s, 2s, 4s)
   - Alarm-based retry after 1 minute if all attempts fail
   - Sync history tracking (last 20 syncs)
4. **Popup UI** (`popup/`) -- Login form and sync status dashboard showing recent syncs.

### Loading the Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked**
4. Select the `extension/` directory from this repository
5. The Streaksy icon appears in your toolbar -- click it to log in with your Streaksy credentials
6. Navigate to any LeetCode problem, solve it, and the submission will automatically sync

### Extension Permissions

| Permission    | Reason                                           |
| ------------- | ------------------------------------------------ |
| `storage`     | Store auth tokens, sync status, and sync history |
| `alarms`      | Schedule retry syncs after failures              |
| `https://leetcode.com/*` | Content script injection and network interception |

---

## Deployment

### Docker Compose (Full Stack)

The `backend/docker/` directory contains a production-ready Docker Compose configuration:

```bash
cd backend/docker
docker compose up -d
```

This starts three services:
- **postgres** -- PostgreSQL 16 Alpine with auto-initialized schema and seed data
- **redis** -- Redis 7 Alpine
- **api** -- Node.js API built via multi-stage Dockerfile

The API Dockerfile uses a multi-stage build:
1. **Builder stage** -- Installs all dependencies, compiles TypeScript
2. **Production stage** -- Copies only compiled JS and production dependencies

### Frontend Deployment

Build the Next.js frontend for production:

```bash
cd frontend
npm run build
npm start
```

Deploy to any platform that supports Next.js: Vercel, AWS Amplify, Docker, or a custom Node.js server.

### Production Checklist

- [ ] Set a strong, unique `JWT_SECRET` (do not use the default)
- [ ] Set `NODE_ENV=production`
- [ ] Use a managed PostgreSQL instance with SSL
- [ ] Use a managed Redis instance (e.g., AWS ElastiCache, Upstash)
- [ ] Configure `CORS` origins to restrict to your frontend domain
- [ ] Set `NEXT_PUBLIC_API_URL` to your production API URL
- [ ] Update `API_BASE` in `extension/background.js` to point to production
- [ ] Adjust rate limiting values for production traffic
- [ ] Set up database backups
- [ ] Use HTTPS everywhere
- [ ] Publish the extension to the Chrome Web Store (or distribute privately)

---

## Contributing

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Run the backend in dev mode to verify: `cd backend && npm run dev`
5. Run the frontend in dev mode to verify: `cd frontend && npm run dev`
6. Commit your changes: `git commit -m "Add my feature"`
7. Push to your fork: `git push origin feature/my-feature`
8. Open a pull request

### Project Conventions

- **Backend modules** follow a consistent structure: `controller/`, `service/`, `repository/`, `routes/`, and `validation/` subdirectories per domain.
- **Validation** is handled by Zod schemas applied via the `validate` middleware.
- **Error handling** uses the `AppError` class with static factory methods (`badRequest`, `unauthorized`, `notFound`, `conflict`, `forbidden`). The global `errorHandler` middleware catches these and returns structured JSON responses.
- **Async route handlers** are wrapped with `asyncHandler` to forward rejected promises to the error handler.
- **Frontend components** are organized by feature domain under `components/`, with shared UI primitives in `components/ui/`.
- **State management** uses Zustand stores in `lib/store.ts`.
- **Styling** uses Tailwind CSS with a `cn()` utility (clsx + tailwind-merge) for conditional class composition.

### Code Style

- TypeScript strict mode is enabled for both frontend and backend
- Backend uses CommonJS module format with ES2022 target
- Frontend uses ESLint with the Next.js configuration

---

## License

ISC
