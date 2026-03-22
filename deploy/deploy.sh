#!/usr/bin/env bash
#
# Deploy Streaksy to production.
# Called by GitHub Actions or manually on the EC2 instance.
#
# Usage:
#   cd /home/ubuntu/streaksy && bash deploy/deploy.sh
#
# What it does:
#   1. Pulls latest code from the current branch
#   2. Installs dependencies (backend + frontend)
#   3. Builds backend (TypeScript) and frontend (Next.js)
#   4. Runs database migrations
#   5. Reloads PM2 processes (zero-downtime)
#
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BRANCH="${DEPLOY_BRANCH:-main}"

cd "$APP_DIR"

echo "=== Deploying Streaksy ($(date '+%Y-%m-%d %H:%M:%S')) ==="
echo "  Branch: $BRANCH"
echo "  Directory: $APP_DIR"

# ── 1. Pull latest code ─────────────────────────────────────────────
echo ""
echo "[1/6] Pulling latest code..."
git fetch origin "$BRANCH"
git reset --hard "origin/$BRANCH"

# ── 2. Backend dependencies ─────────────────────────────────────────
echo ""
echo "[2/6] Installing backend dependencies..."
cd "$APP_DIR/backend"
npm ci

# ── 3. Backend build ────────────────────────────────────────────────
echo ""
echo "[3/6] Building backend..."
npx tsc

# Remove devDependencies after build
npm prune --omit=dev

# ── 4. Frontend dependencies + build ────────────────────────────────
echo ""
echo "[4/6] Installing frontend dependencies..."
cd "$APP_DIR/frontend"
npm ci

echo ""
echo "[5/6] Building frontend..."
npm run build

# ── 5. Database migrations ──────────────────────────────────────────
echo ""
echo "[6/6] Running database migrations..."
cd "$APP_DIR/backend"
if [ -f ".env" ]; then
    # Source DATABASE_URL from .env
    export DATABASE_URL=$(grep -E '^DATABASE_URL=' .env | cut -d '=' -f 2-)
fi

if [ -n "${DATABASE_URL:-}" ]; then
    # Run schema (idempotent – uses IF NOT EXISTS)
    psql "$DATABASE_URL" -f scripts/schema.sql 2>&1 | tail -5
    echo "  Migrations applied"
else
    echo "  WARNING: DATABASE_URL not set, skipping migrations"
fi

# ── 6. Reload PM2 ───────────────────────────────────────────────────
echo ""
echo "Reloading PM2 processes..."
cd "$APP_DIR"

if pm2 describe streaksy-backend &>/dev/null; then
    # Processes exist – graceful reload
    pm2 reload ecosystem.config.js
else
    # First deploy – start fresh
    pm2 start ecosystem.config.js
fi

pm2 save

echo ""
echo "=== Deploy complete! ==="
pm2 ls
echo ""
echo "Health check: curl -s http://localhost:3001/health | head -1"
