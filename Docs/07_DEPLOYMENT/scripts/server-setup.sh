#!/bin/bash
#
# =============================================================================
# Trinity Asset Flow - Server Setup Script for Debian 13 (Trixie)
# =============================================================================
#
# This script automates the initial server setup for deploying the
# Trinity Inventory App on a fresh Debian 13 installation.
#
# Usage:
#   chmod +x server-setup.sh
#   sudo ./server-setup.sh
#
# Author: Trinity Media Indonesia
# Version: 1.0.0
# Date: 2026-01-17
#
# =============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration - EDIT THESE
DOMAIN="aset.trinitimedia.com"
DB_NAME="assetflow"
DB_USER="assetflow_user"
DB_PASS="CHANGE_THIS_SECURE_PASSWORD"
DEPLOY_USER="deploy"
APP_DIR="/home/${DEPLOY_USER}/app"
WEB_DIR="/var/www/assetflow"

# =============================================================================
# Helper Functions
# =============================================================================

print_header() {
    echo ""
    echo -e "${BLUE}============================================================${NC}"
    echo -e "${BLUE} $1${NC}"
    echo -e "${BLUE}============================================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

check_root() {
    if [[ $EUID -ne 0 ]]; then
        print_error "This script must be run as root"
        exit 1
    fi
}

# =============================================================================
# Setup Functions
# =============================================================================

setup_system() {
    print_header "Step 1: System Update & Essential Packages"
    
    apt update && apt upgrade -y
    apt install -y curl wget git build-essential gnupg2 ca-certificates lsb-release
    
    # Set timezone
    timedatectl set-timezone Asia/Jakarta
    
    print_success "System updated and essential packages installed"
}

create_deploy_user() {
    print_header "Step 2: Creating Deploy User"
    
    if id "$DEPLOY_USER" &>/dev/null; then
        print_warning "User $DEPLOY_USER already exists, skipping..."
    else
        adduser --disabled-password --gecos "" $DEPLOY_USER
        usermod -aG sudo $DEPLOY_USER
        echo "$DEPLOY_USER ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/$DEPLOY_USER
        print_success "User $DEPLOY_USER created"
    fi
}

install_nodejs() {
    print_header "Step 3: Installing Node.js 20 LTS"
    
    if command -v node &> /dev/null; then
        print_warning "Node.js already installed: $(node --version)"
    else
        curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
        apt install -y nodejs
        print_success "Node.js $(node --version) installed"
    fi
    
    # Install global packages
    npm install -g pnpm pm2
    print_success "pnpm and pm2 installed globally"
}

install_postgresql() {
    print_header "Step 4: Installing PostgreSQL 16"
    
    if command -v psql &> /dev/null; then
        print_warning "PostgreSQL already installed"
    else
        # Add PostgreSQL repo
        sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
        wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
        apt update
        apt install -y postgresql-16 postgresql-contrib-16
        
        systemctl enable postgresql
        systemctl start postgresql
        print_success "PostgreSQL 16 installed"
    fi
    
    # Create database and user
    print_header "Step 4b: Creating Database"
    
    sudo -u postgres psql -c "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" | grep -q 1 || \
        sudo -u postgres psql -c "CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASS';"
    
    sudo -u postgres psql -c "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" | grep -q 1 || \
        sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"
    
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
    
    print_success "Database '$DB_NAME' and user '$DB_USER' created"
}

install_nginx() {
    print_header "Step 5: Installing Nginx"
    
    apt install -y nginx
    systemctl enable nginx
    systemctl start nginx
    
    # Create web directory
    mkdir -p $WEB_DIR/frontend
    mkdir -p $WEB_DIR/uploads
    chown -R www-data:www-data $WEB_DIR
    
    print_success "Nginx installed"
}

setup_firewall() {
    print_header "Step 6: Configuring Firewall (UFW)"
    
    apt install -y ufw
    
    ufw default deny incoming
    ufw default allow outgoing
    ufw allow ssh
    ufw allow 'Nginx Full'
    
    ufw --force enable
    
    print_success "Firewall configured"
}

install_certbot() {
    print_header "Step 7: Installing Certbot for SSL"
    
    apt install -y certbot python3-certbot-nginx
    
    print_success "Certbot installed"
    print_warning "Run 'sudo certbot --nginx -d $DOMAIN' after DNS is configured"
}

setup_fail2ban() {
    print_header "Step 8: Installing Fail2Ban"
    
    apt install -y fail2ban
    systemctl enable fail2ban
    systemctl start fail2ban
    
    print_success "Fail2Ban installed and started"
}

create_directories() {
    print_header "Step 9: Creating Application Directories"
    
    mkdir -p $APP_DIR
    mkdir -p /var/log/pm2
    mkdir -p /var/backups/assetflow
    mkdir -p /home/$DEPLOY_USER/scripts
    
    chown -R $DEPLOY_USER:$DEPLOY_USER /home/$DEPLOY_USER
    chown -R $DEPLOY_USER:$DEPLOY_USER /var/log/pm2
    
    print_success "Directories created"
}

create_nginx_config() {
    print_header "Step 10: Creating Nginx Configuration"
    
    cat > /etc/nginx/sites-available/assetflow << 'NGINX_CONFIG'
server {
    listen 80;
    server_name DOMAIN_PLACEHOLDER;
    
    root /var/www/assetflow/frontend;
    index index.html;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    gzip_min_length 256;
    
    # API Proxy
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Upload directory
    location /uploads {
        alias /var/www/assetflow/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
NGINX_CONFIG

    # Replace placeholder with actual domain
    sed -i "s/DOMAIN_PLACEHOLDER/$DOMAIN/g" /etc/nginx/sites-available/assetflow
    
    # Enable site
    ln -sf /etc/nginx/sites-available/assetflow /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    
    nginx -t && systemctl reload nginx
    
    print_success "Nginx configuration created and enabled"
}

create_backup_script() {
    print_header "Step 11: Creating Backup Script"
    
    cat > /home/$DEPLOY_USER/scripts/backup-db.sh << 'BACKUP_SCRIPT'
#!/bin/bash
BACKUP_DIR="/var/backups/assetflow"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="assetflow_${DATE}.sql.gz"

mkdir -p $BACKUP_DIR

# Backup
PGPASSWORD="DB_PASS_PLACEHOLDER" pg_dump -U DB_USER_PLACEHOLDER -h localhost DB_NAME_PLACEHOLDER | gzip > $BACKUP_DIR/$FILENAME

# Keep only last 7 days
find $BACKUP_DIR -type f -mtime +7 -delete

echo "$(date): Backup completed: $FILENAME" >> /var/log/backup.log
BACKUP_SCRIPT

    sed -i "s/DB_PASS_PLACEHOLDER/$DB_PASS/g" /home/$DEPLOY_USER/scripts/backup-db.sh
    sed -i "s/DB_USER_PLACEHOLDER/$DB_USER/g" /home/$DEPLOY_USER/scripts/backup-db.sh
    sed -i "s/DB_NAME_PLACEHOLDER/$DB_NAME/g" /home/$DEPLOY_USER/scripts/backup-db.sh
    
    chmod +x /home/$DEPLOY_USER/scripts/backup-db.sh
    chown $DEPLOY_USER:$DEPLOY_USER /home/$DEPLOY_USER/scripts/backup-db.sh
    
    # Add cron job
    (crontab -u $DEPLOY_USER -l 2>/dev/null; echo "0 2 * * * /home/$DEPLOY_USER/scripts/backup-db.sh") | crontab -u $DEPLOY_USER -
    
    print_success "Backup script created and scheduled"
}

create_env_template() {
    print_header "Step 12: Creating Environment Template"
    
    cat > /home/$DEPLOY_USER/.env.template << ENV_TEMPLATE
# =============================================================================
# Backend Environment Variables
# =============================================================================

# Application
NODE_ENV=production
PORT=3001

# Database
DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@localhost:5432/${DB_NAME}?schema=public"

# JWT (CHANGE THIS!)
JWT_SECRET=CHANGE_THIS_TO_A_VERY_LONG_RANDOM_STRING_AT_LEAST_32_CHARACTERS
JWT_EXPIRES_IN=24h

# Frontend URL (for CORS)
FRONTEND_URL=https://${DOMAIN}

# File Upload
UPLOAD_DIR=/var/www/assetflow/uploads
MAX_FILE_SIZE=10485760
ENV_TEMPLATE

    chown $DEPLOY_USER:$DEPLOY_USER /home/$DEPLOY_USER/.env.template
    
    print_success "Environment template created at /home/$DEPLOY_USER/.env.template"
}

print_summary() {
    print_header "Setup Complete!"
    
    echo -e "${GREEN}Server setup completed successfully!${NC}"
    echo ""
    echo "Summary:"
    echo "  - Debian system updated"
    echo "  - Deploy user: $DEPLOY_USER"
    echo "  - Node.js $(node --version) installed"
    echo "  - PostgreSQL 16 installed"
    echo "  - Database: $DB_NAME (User: $DB_USER)"
    echo "  - Nginx installed and configured"
    echo "  - UFW firewall enabled"
    echo "  - Fail2Ban installed"
    echo "  - Backup script scheduled (daily at 2 AM)"
    echo ""
    echo -e "${YELLOW}Next Steps:${NC}"
    echo "  1. Clone your repository to $APP_DIR"
    echo "  2. Copy .env.template to backend/.env and update values"
    echo "  3. Run database migrations: npx prisma migrate deploy"
    echo "  4. Build frontend: pnpm build"
    echo "  5. Copy frontend dist to $WEB_DIR/frontend"
    echo "  6. Start backend with PM2"
    echo "  7. Configure SSL: sudo certbot --nginx -d $DOMAIN"
    echo ""
    echo -e "${BLUE}Database Connection String:${NC}"
    echo "  postgresql://${DB_USER}:${DB_PASS}@localhost:5432/${DB_NAME}"
    echo ""
    echo -e "${RED}IMPORTANT: Change the database password and JWT secret!${NC}"
}

# =============================================================================
# Main Execution
# =============================================================================

main() {
    check_root
    
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║     Trinity Asset Flow - Server Setup Script               ║"
    echo "║     Target: Debian 13 (Trixie)                            ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    
    read -p "This will install and configure the server. Continue? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
    
    setup_system
    create_deploy_user
    install_nodejs
    install_postgresql
    install_nginx
    setup_firewall
    install_certbot
    setup_fail2ban
    create_directories
    create_nginx_config
    create_backup_script
    create_env_template
    print_summary
}

main "$@"
