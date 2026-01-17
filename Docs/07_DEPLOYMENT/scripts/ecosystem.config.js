# PM2 Ecosystem Configuration for Trinity Asset Flow
# =============================================================================
#
# This file configures PM2 process manager for the backend service.
# 
# Usage:
#   pm2 start ecosystem.config.js
#   pm2 reload ecosystem.config.js
#
# For production:
#   pm2 start ecosystem.config.js --env production
#
# =============================================================================

module.exports = {
  apps: [
    {
      // Application Name
      name: 'assetflow-backend',
      
      // Entry point
      script: 'dist/main.js',
      
      // Working directory
      cwd: '/home/deploy/app/backend',
      
      // Cluster mode: 'fork' or 'cluster'
      // Use 'cluster' for multi-core utilization
      exec_mode: 'cluster',
      
      // Number of instances
      // 'max' = use all available CPU cores
      // For smaller servers, use specific number like 2
      instances: 'max',
      
      // Auto-restart on crash
      autorestart: true,
      
      // Watch for file changes (disable in production)
      watch: false,
      
      // Max memory before restart (MB)
      max_memory_restart: '500M',
      
      // Combine logs from all instances
      combine_logs: true,
      
      // Merge logs into single file
      merge_logs: true,
      
      // Log configuration
      log_file: '/var/log/pm2/assetflow-combined.log',
      error_file: '/var/log/pm2/assetflow-error.log',
      out_file: '/var/log/pm2/assetflow-out.log',
      
      // Log date format
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Environment variables for all environments
      env: {
        NODE_ENV: 'development',
        PORT: 3001,
      },
      
      // Production environment overrides
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      
      // Graceful shutdown timeout (ms)
      kill_timeout: 5000,
      
      // Wait time before forcing restart (ms)
      wait_ready: true,
      listen_timeout: 10000,
      
      // Restart delay (ms)
      restart_delay: 1000,
      
      // Exponential backoff restart delay
      exp_backoff_restart_delay: 100,
      
      // Max restarts within min_uptime
      max_restarts: 10,
      min_uptime: 5000,
    },
  ],
  
  // Deployment configuration (optional, for pm2 deploy)
  deploy: {
    production: {
      // SSH user
      user: 'deploy',
      
      // Target servers
      host: ['your-server-ip'],
      
      // Git reference to deploy
      ref: 'origin/main',
      
      // Git repository
      repo: 'git@github.com:your-org/trinity-inventory-app.git',
      
      // Deployment directory
      path: '/home/deploy/app',
      
      // Pre-deploy commands (on local machine)
      'pre-deploy-local': '',
      
      // Post-deploy commands (on remote server)
      'post-deploy': 'cd backend && pnpm install && npx prisma migrate deploy && pnpm build && pm2 reload ecosystem.config.js --env production',
      
      // Pre-setup commands
      'pre-setup': '',
      
      // SSH options
      ssh_options: 'StrictHostKeyChecking=no',
    },
    
    staging: {
      user: 'deploy',
      host: ['staging-server-ip'],
      ref: 'origin/develop',
      repo: 'git@github.com:your-org/trinity-inventory-app.git',
      path: '/home/deploy/app-staging',
      'post-deploy': 'cd backend && pnpm install && npx prisma migrate deploy && pnpm build && pm2 reload ecosystem.config.js --env staging',
      env: {
        NODE_ENV: 'staging',
      },
    },
  },
};
