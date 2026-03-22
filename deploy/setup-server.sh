#!/usr/bin/env bash
#
# One-time EC2 server setup for Streaksy.
# Run this once on a fresh Amazon Linux 2023 EC2 instance.
#
# Usage:
#   chmod +x deploy/setup-server.sh
#   sudo ./deploy/setup-server.sh
#
set -euo pipefail

APP_DIR="/home/ec2-user/streaksy"
APP_USER="ec2-user"
NODE_VERSION="20"

echo "=== Streaksy Server Setup (Amazon Linux 2023) ==="

# ── 1. System packages ──────────────────────────────────────────────
echo "[1/7] Updating system packages..."
dnf update -y
dnf install -y git gcc-c++ make nginx

# ── 2. Node.js (via NodeSource) ─────────────────────────────────────
echo "[2/7] Installing Node.js ${NODE_VERSION}..."
if ! command -v node &>/dev/null; then
    curl -fsSL https://rpm.nodesource.com/setup_${NODE_VERSION}.x | bash -
    dnf install -y nodejs
fi
echo "  Node $(node -v), npm $(npm -v)"

# ── 3. PM2 ──────────────────────────────────────────────────────────
echo "[3/7] Installing PM2..."
npm install -g pm2
pm2 install pm2-logrotate
# Auto-start PM2 on boot
pm2 startup systemd -u ${APP_USER} --hp /home/${APP_USER}
echo "  PM2 $(pm2 -v)"

# ── 4. PostgreSQL 16 ────────────────────────────────────────────────
echo "[4/7] Setting up PostgreSQL..."
if ! command -v psql &>/dev/null; then
    dnf install -y postgresql16-server postgresql16
    postgresql-setup --initdb
    systemctl enable postgresql
    systemctl start postgresql
fi
# Create database if not exists
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='streaksy'" | grep -q 1 || \
    sudo -u postgres createdb streaksy
echo "  PostgreSQL $(psql --version | head -1)"

# ── 5. Redis 7 ──────────────────────────────────────────────────────
echo "[5/7] Setting up Redis..."
if ! command -v redis-server &>/dev/null; then
    dnf install -y redis6
fi
systemctl enable redis6
systemctl start redis6
echo "  Redis $(redis-server --version | head -1)"

# ── 6. Log directory ────────────────────────────────────────────────
echo "[6/7] Creating log directory..."
mkdir -p /var/log/streaksy
chown ${APP_USER}:${APP_USER} /var/log/streaksy

# ── 7. Nginx ────────────────────────────────────────────────────────
echo "[7/7] Configuring Nginx..."
systemctl enable nginx
systemctl start nginx
if [ -f "${APP_DIR}/deploy/nginx.conf" ]; then
    cp "${APP_DIR}/deploy/nginx.conf" /etc/nginx/conf.d/streaksy.conf
    nginx -t && systemctl reload nginx
    echo "  Nginx configured and reloaded"
else
    echo "  Skipping Nginx config (deploy/nginx.conf not found). Run after first deploy."
fi

# ── Firewall (use iptables — AL2023 has no ufw/firewalld by default) ─
echo "Note: Configure Security Group in AWS Console for ports 22, 80, 443"

echo ""
echo "=== Setup complete! ==="
echo ""
echo "Next steps:"
echo "  1. Clone the repo:  git clone <repo-url> ${APP_DIR}"
echo "  2. Create env file: cp ${APP_DIR}/backend/.env.example ${APP_DIR}/backend/.env"
echo "  3. Edit .env with production values"
echo "  4. Run first deploy: cd ${APP_DIR} && bash deploy/deploy.sh"
echo "  5. (Optional) SSL:  sudo dnf install -y certbot python3-certbot-nginx"
echo "     sudo certbot --nginx -d streaksy.in -d www.streaksy.in"
echo ""
