#!/bin/bash
# =============================================================================
# VM Setup Script for Trinity Asset Flow
# =============================================================================
# Run this script on a fresh Debian/Ubuntu VM to prepare it for deployment
# 
# Usage: sudo bash vm-setup.sh
# =============================================================================

set -e

echo "=============================================="
echo "Trinity Asset Flow - VM Setup"
echo "=============================================="

# -----------------------------------------------------------------------------
# Update System
# -----------------------------------------------------------------------------
echo ">>> Updating system packages..."
apt-get update
apt-get upgrade -y

# -----------------------------------------------------------------------------
# Install Required Packages
# -----------------------------------------------------------------------------
echo ">>> Installing required packages..."
apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git \
    ufw \
    fail2ban

# -----------------------------------------------------------------------------
# Install Docker
# -----------------------------------------------------------------------------
echo ">>> Installing Docker..."

# Add Docker's official GPG key
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Add Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Enable Docker service
systemctl enable docker
systemctl start docker

echo "Docker version: $(docker --version)"

# -----------------------------------------------------------------------------
# Create Deploy User
# -----------------------------------------------------------------------------
echo ">>> Creating deploy user..."

if ! id "deploy" &>/dev/null; then
    useradd -m -s /bin/bash -G docker deploy
    mkdir -p /home/deploy/.ssh
    chmod 700 /home/deploy/.ssh
    touch /home/deploy/.ssh/authorized_keys
    chmod 600 /home/deploy/.ssh/authorized_keys
    chown -R deploy:deploy /home/deploy/.ssh
    echo "Created 'deploy' user. Add your SSH public key to /home/deploy/.ssh/authorized_keys"
else
    echo "User 'deploy' already exists, adding to docker group..."
    usermod -aG docker deploy
fi

# -----------------------------------------------------------------------------
# Create Application Directory
# -----------------------------------------------------------------------------
echo ">>> Creating application directory..."
mkdir -p /opt/trinity-assetflow
chown -R deploy:deploy /opt/trinity-assetflow

# -----------------------------------------------------------------------------
# Configure Firewall
# -----------------------------------------------------------------------------
echo ">>> Configuring firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
echo "y" | ufw enable

# -----------------------------------------------------------------------------
# Configure Fail2Ban
# -----------------------------------------------------------------------------
echo ">>> Configuring fail2ban..."
cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
EOF

systemctl enable fail2ban
systemctl restart fail2ban

# -----------------------------------------------------------------------------
# Setup Log Rotation for Docker
# -----------------------------------------------------------------------------
echo ">>> Configuring Docker log rotation..."
cat > /etc/docker/daemon.json << 'EOF'
{
    "log-driver": "json-file",
    "log-opts": {
        "max-size": "10m",
        "max-file": "3"
    }
}
EOF

systemctl restart docker

# -----------------------------------------------------------------------------
# Create Deployment Script
# -----------------------------------------------------------------------------
echo ">>> Creating deployment script..."
cat > /opt/trinity-assetflow/deploy.sh << 'EOF'
#!/bin/bash
# Deployment script for Trinity Asset Flow

set -e

cd /opt/trinity-assetflow

echo ">>> Pulling latest images..."
docker compose pull

echo ">>> Stopping current containers..."
docker compose down

echo ">>> Starting new containers..."
docker compose up -d

echo ">>> Cleaning up old images..."
docker image prune -f

echo ">>> Deployment complete!"
docker compose ps
EOF

chmod +x /opt/trinity-assetflow/deploy.sh
chown deploy:deploy /opt/trinity-assetflow/deploy.sh

# -----------------------------------------------------------------------------
# Create Backup Script
# -----------------------------------------------------------------------------
echo ">>> Creating backup script..."
mkdir -p /var/backups/trinity
chown deploy:deploy /var/backups/trinity

cat > /opt/trinity-assetflow/backup-db.sh << 'EOF'
#!/bin/bash
# Database backup script

BACKUP_DIR="/var/backups/trinity"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/trinity_db_${TIMESTAMP}.sql.gz"

# Create backup
docker exec trinity-db pg_dump -U trinity_admin trinity_assetflow | gzip > "$BACKUP_FILE"

# Keep only last 7 days of backups
find "$BACKUP_DIR" -name "trinity_db_*.sql.gz" -mtime +7 -delete

echo "Backup created: $BACKUP_FILE"
EOF

chmod +x /opt/trinity-assetflow/backup-db.sh
chown deploy:deploy /opt/trinity-assetflow/backup-db.sh

# Add to crontab for daily backups at 2 AM
(crontab -l -u deploy 2>/dev/null; echo "0 2 * * * /opt/trinity-assetflow/backup-db.sh") | crontab -u deploy -

# -----------------------------------------------------------------------------
# Summary
# -----------------------------------------------------------------------------
echo ""
echo "=============================================="
echo "VM Setup Complete!"
echo "=============================================="
echo ""
echo "Next steps:"
echo "1. Add your SSH public key to /home/deploy/.ssh/authorized_keys"
echo "2. Copy docker-compose.yml to /opt/trinity-assetflow/"
echo "3. Create .env file in /opt/trinity-assetflow/"
echo "4. Configure GitHub repository secrets"
echo ""
echo "Firewall status:"
ufw status

echo ""
echo "Docker status:"
docker --version
docker compose version
