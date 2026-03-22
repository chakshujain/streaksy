#!/usr/bin/env bash
#
# One-time EC2 server setup for Streaksy.
# Run this once on a fresh Ubuntu 22.04/24.04 EC2 instance.
#
# Usage:
#   chmod +x deploy/setup-server.sh
#   sudo ./deploy/setup-server.sh
#
set -euo pipefail

APP_DIR="/home/ubuntu/streaksy"
NODE_VERSION="20"

echo "=== Streaksy Server Setup ==="

# ── 1. System packages ──────────────────────────────────────────────
echo "[1/7] Updating system packages..."
apt-get update -y
apt-get upgrade -y
apt-get install -y curl git build-essential nginx certbot python3-certbot-nginx

# ── 2. Node.js (via NodeSource) ─────────────────────────────────────
echo "[2/7] Installing Node.js ${NODE_VERSION}..."
if ! command -v node &>/dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
    apt-get install -y nodejs
fi
echo "  Node $(node -v), npm $(npm -v)"

# ── 3. PM2 ──────────────────────────────────────────────────────────
echo "[3/7] Installing PM2..."
npm install -g pm2
pm2 install pm2-logrotate
# Auto-start PM2 on boot
pm2 startup systemd -u ubuntu --hp /home/ubuntu
echo "  PM2 $(pm2 -v)"

# ── 4. PostgreSQL 16 ────────────────────────────────────────────────
echo "[4/7] Setting up PostgreSQL..."
if ! command -v psql &>/dev/null; then
    sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
    curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor -o /etc/apt/trusted.gpg.d/postgresql.gpg
    apt-get update -y
    apt-get install -y postgresql-16
fi
# Create database if not exists
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='streaksy'" | grep -q 1 || \
    sudo -u postgres createdb streaksy
echo "  PostgreSQL $(psql --version | head -1)"

# ── 5. Redis 7 ──────────────────────────────────────────────────────
echo "[5/7] Setting up Redis..."
if ! command -v redis-server &>/dev/null; then
    apt-get install -y redis-server
fi
systemctl enable redis-server
systemctl start redis-server
echo "  Redis $(redis-server --version | head -1)"

# ── 6. Log directory ────────────────────────────────────────────────
echo "[6/7] Creating log directory..."
mkdir -p /var/log/streaksy
chown ubuntu:ubuntu /var/log/streaksy

# ── 7. Nginx ────────────────────────────────────────────────────────
echo "[7/7] Configuring Nginx..."
if [ -f "${APP_DIR}/deploy/nginx.conf" ]; then
    cp "${APP_DIR}/deploy/nginx.conf" /etc/nginx/sites-available/streaksy
    ln -sf /etc/nginx/sites-available/streaksy /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    nginx -t && systemctl reload nginx
    echo "  Nginx configured and reloaded"
else
    echo "  Skipping Nginx config (deploy/nginx.conf not found). Run after first deploy."
fi

# ── Firewall ─────────────────────────────────────────────────────────
echo "Opening firewall ports..."
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw --force enable

echo ""
echo "=== Setup complete! ==="
echo ""
echo "Next steps:"
echo "  1. Clone the repo:  git clone <repo-url> ${APP_DIR}"
echo "  2. Create env file: cp ${APP_DIR}/backend/.env.example ${APP_DIR}/backend/.env"
echo "  3. Edit .env with production values"
echo "  4. Run first deploy: cd ${APP_DIR} && bash deploy/deploy.sh"
echo "  5. (Optional) SSL:  sudo certbot --nginx -d streaksy.in -d www.streaksy.in"
echo ""
