/**
 * PM2 Ecosystem Configuration
 * Manages backend (Express API) and frontend (Next.js) processes.
 *
 * Usage:
 *   pm2 start ecosystem.config.js          # Start all
 *   pm2 reload ecosystem.config.js         # Zero-downtime reload
 *   pm2 stop all                           # Stop all
 *   pm2 logs                               # View logs
 *   pm2 monit                              # Live monitoring
 */
module.exports = {
  apps: [
    {
      name: 'streaksy-backend',
      cwd: './backend',
      script: 'dist/server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      // Restart policies
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 5000,
      // Logging
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: '/var/log/streaksy/backend-error.log',
      out_file: '/var/log/streaksy/backend-out.log',
      merge_logs: true,
      // Graceful shutdown
      kill_timeout: 10000,
      listen_timeout: 10000,
      // Watch (disabled in prod – use deploy script for restarts)
      watch: false,
    },
    {
      name: 'streaksy-frontend',
      cwd: './frontend',
      script: 'node_modules/.bin/next',
      args: 'start -p 3000',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 5000,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: '/var/log/streaksy/frontend-error.log',
      out_file: '/var/log/streaksy/frontend-out.log',
      merge_logs: true,
      kill_timeout: 10000,
      listen_timeout: 10000,
      watch: false,
    },
  ],
};
