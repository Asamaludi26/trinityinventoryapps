# 🚀 Panduan Deployment: Debian 13 (Trixie)

Panduan lengkap untuk men-deploy Aplikasi Inventori Aset ke server VM Debian 13.

## Daftar Isi

1. [Persyaratan Server](#1-persyaratan-server)
2. [Setup Awal Server](#2-setup-awal-server)
3. [Instalasi Dependencies](#3-instalasi-dependencies)
4. [Setup Database PostgreSQL](#4-setup-database-postgresql)
5. [Deploy Backend NestJS](#5-deploy-backend-nestjs)
6. [Deploy Frontend React](#6-deploy-frontend-react)
7. [Konfigurasi Nginx](#7-konfigurasi-nginx)
8. [SSL dengan Let's Encrypt](#8-ssl-dengan-lets-encrypt)
9. [Process Manager (PM2)](#9-process-manager-pm2)
10. [Firewall & Security](#10-firewall--security)
11. [Monitoring & Logging](#11-monitoring--logging)
12. [Backup Strategy](#12-backup-strategy)
13. [Troubleshooting](#13-troubleshooting)

---

## 1. Persyaratan Server

### Minimum Hardware

| Resource | Minimum   | Recommended |
| -------- | --------- | ----------- |
| CPU      | 2 vCPU    | 4 vCPU      |
| RAM      | 2 GB      | 4 GB        |
| Storage  | 20 GB SSD | 50 GB SSD   |
| Network  | 100 Mbps  | 1 Gbps      |

### Software Requirements

- Debian 13 (Trixie) Fresh Install
- Root access atau sudo privileges
- Domain name yang sudah di-pointing ke IP server

### Ports yang Dibutuhkan

| Port | Service                        |
| ---- | ------------------------------ |
| 22   | SSH                            |
| 80   | HTTP (redirect to HTTPS)       |
| 443  | HTTPS                          |
| 5432 | PostgreSQL (internal only)     |
| 3001 | Backend NestJS (internal only) |

---

## 2. Setup Awal Server

### 2.1 Update Sistem

```bash
sudo apt update && sudo apt upgrade -y
```

### 2.2 Set Timezone

```bash
sudo timedatectl set-timezone Asia/Jakarta
```

### 2.3 Buat User Deploy

```bash
# Buat user khusus untuk aplikasi
sudo adduser deploy
sudo usermod -aG sudo deploy

# Login sebagai deploy user
su - deploy
```

### 2.4 Setup SSH Key (Opsional tapi Disarankan)

```bash
# Di local machine
ssh-keygen -t ed25519 -C "deploy@server"
ssh-copy-id deploy@your-server-ip
```

---

## 3. Instalasi Dependencies

### 3.1 Install Essential Packages

```bash
sudo apt install -y curl wget git build-essential
```

### 3.2 Install Node.js 20 LTS

```bash
# Install Node.js via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node --version  # Should be v20.x.x
npm --version
```

### 3.3 Install pnpm (Package Manager)

```bash
sudo npm install -g pnpm
pnpm --version
```

### 3.4 Install PM2 (Process Manager)

```bash
sudo npm install -g pm2
pm2 --version
```

### 3.5 Install Nginx

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

---

## 4. Setup Database PostgreSQL

### 4.1 Install PostgreSQL 16

```bash
# Add PostgreSQL official repo
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt update

# Install
sudo apt install -y postgresql-16 postgresql-contrib-16

# Start service
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

### 4.2 Konfigurasi Database

```bash
# Login sebagai postgres
sudo -u postgres psql

# Di dalam psql shell:
CREATE DATABASE assetflow;
CREATE USER assetflow_user WITH ENCRYPTED PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE assetflow TO assetflow_user;
ALTER DATABASE assetflow OWNER TO assetflow_user;
\q
```

### 4.3 Edit pg_hba.conf (jika perlu)

```bash
sudo nano /etc/postgresql/16/main/pg_hba.conf

# Tambahkan atau modifikasi:
# local   assetflow   assetflow_user   md5
```

### 4.4 Restart PostgreSQL

```bash
sudo systemctl restart postgresql
```

---

## 5. Deploy Backend NestJS

### 5.1 Clone Repository

```bash
cd /home/deploy
git clone https://github.com/your-org/trinity-inventory-app.git app
cd app/backend
```

### 5.2 Install Dependencies

```bash
pnpm install
```

### 5.3 Environment Variables

```bash
cp .env.example .env
nano .env
```

**File .env:**

```env
# Application
NODE_ENV=production
PORT=3001

# Database
DATABASE_URL="postgresql://assetflow_user:your_secure_password_here@localhost:5432/assetflow?schema=public"

# JWT
JWT_SECRET=your_very_long_random_secret_key_min_32_chars
JWT_EXPIRES_IN=24h

# Frontend URL (for CORS)
FRONTEND_URL=https://aset.trinitimedia.com

# File Upload
UPLOAD_DIR=/var/www/assetflow/uploads
MAX_FILE_SIZE=10485760
```

### 5.4 Run Database Migrations

```bash
npx prisma migrate deploy
npx prisma generate
```

### 5.5 Seed Initial Data (Opsional)

```bash
npx prisma db seed
```

### 5.6 Build untuk Production

```bash
pnpm build
```

### 5.7 Test Run

```bash
node dist/main.js
# Ctrl+C untuk stop
```

---

## 6. Deploy Frontend React

### 6.1 Pindah ke Direktori Frontend

```bash
cd /home/deploy/app/frontend
```

### 6.2 Install Dependencies

```bash
pnpm install
```

### 6.3 Environment Variables

```bash
nano .env.production
```

**File .env.production:**

```env
VITE_API_URL=https://aset.trinitimedia.com/api
VITE_USE_MOCK=false
```

### 6.4 Build untuk Production

```bash
pnpm build
```

### 6.5 Deploy Static Files

```bash
sudo mkdir -p /var/www/assetflow/frontend
sudo cp -r dist/* /var/www/assetflow/frontend/
sudo chown -R www-data:www-data /var/www/assetflow
```

---

## 7. Konfigurasi Nginx

### 7.1 Buat Konfigurasi Site

```bash
sudo nano /etc/nginx/sites-available/assetflow
```

**Isi file:**

```nginx
server {
    listen 80;
    server_name aset.trinitimedia.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name aset.trinitimedia.com;

    # SSL certificates (will be configured by certbot)
    ssl_certificate /etc/letsencrypt/live/aset.trinitimedia.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aset.trinitimedia.com/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Frontend static files
    root /var/www/assetflow/frontend;
    index index.html;

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

        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Upload directory (if serving files)
    location /uploads {
        alias /var/www/assetflow/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback - semua route ke index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 7.2 Enable Site

```bash
sudo ln -s /etc/nginx/sites-available/assetflow /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # Hapus default
sudo nginx -t  # Test config
sudo systemctl reload nginx
```

---

## 8. SSL dengan Let's Encrypt

### 8.1 Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 8.2 Generate Certificate

```bash
sudo certbot --nginx -d aset.trinitimedia.com
```

### 8.3 Auto-Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Cron job sudah ditambahkan otomatis oleh certbot
```

---

## 9. Process Manager (PM2)

### 9.1 Buat Ecosystem File

```bash
cd /home/deploy/app/backend
nano ecosystem.config.js
```

**Isi file:**

```javascript
module.exports = {
  apps: [
    {
      name: "assetflow-backend",
      script: "dist/main.js",
      cwd: "/home/deploy/app/backend",
      instances: "max",
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env_production: {
        NODE_ENV: "production",
        PORT: 3001,
      },
      error_file: "/var/log/pm2/assetflow-error.log",
      out_file: "/var/log/pm2/assetflow-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
  ],
};
```

### 9.2 Start Aplikasi

```bash
pm2 start ecosystem.config.js --env production
```

### 9.3 Save dan Startup

```bash
pm2 save
pm2 startup systemd
# Jalankan command yang ditampilkan
```

### 9.4 PM2 Commands

```bash
pm2 list                    # Lihat semua proses
pm2 logs assetflow-backend  # Lihat logs
pm2 monit                   # Monitor real-time
pm2 restart assetflow-backend  # Restart
pm2 stop assetflow-backend     # Stop
```

---

## 10. Firewall & Security

### 10.1 Setup UFW

```bash
sudo apt install -y ufw

sudo ufw default deny incoming
sudo ufw default allow outgoing

sudo ufw allow ssh
sudo ufw allow 'Nginx Full'

# Jangan expose PostgreSQL ke publik!
# sudo ufw allow 5432/tcp  # JANGAN lakukan ini!

sudo ufw enable
sudo ufw status
```

### 10.2 Fail2Ban (Anti Brute-Force)

```bash
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 10.3 Disable Root Login via SSH

```bash
sudo nano /etc/ssh/sshd_config

# Ubah:
PermitRootLogin no
PasswordAuthentication no  # Jika sudah setup SSH key

sudo systemctl restart sshd
```

---

## 11. Monitoring & Logging

### 11.1 Log Locations

| Service      | Log Path                                     |
| ------------ | -------------------------------------------- |
| Nginx Access | `/var/log/nginx/access.log`                  |
| Nginx Error  | `/var/log/nginx/error.log`                   |
| PM2 App      | `/var/log/pm2/assetflow-*.log`               |
| PostgreSQL   | `/var/log/postgresql/postgresql-16-main.log` |

### 11.2 Setup Log Rotation

```bash
sudo nano /etc/logrotate.d/assetflow
```

```
/var/log/pm2/*.log {
    daily
    missingok
    rotate 14
    compress
    notifempty
    create 0640 deploy deploy
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
```

### 11.3 Simple Monitoring dengan htop

```bash
sudo apt install -y htop
htop
```

---

## 12. Backup Strategy

### 12.1 Database Backup Script

```bash
sudo nano /home/deploy/scripts/backup-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/assetflow"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="assetflow_${DATE}.sql.gz"

mkdir -p $BACKUP_DIR

# Backup
pg_dump -U assetflow_user -h localhost assetflow | gzip > $BACKUP_DIR/$FILENAME

# Keep only last 7 days
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $FILENAME"
```

```bash
chmod +x /home/deploy/scripts/backup-db.sh
```

### 12.2 Setup Cron Job

```bash
crontab -e
```

```cron
# Database backup setiap hari jam 2 pagi
0 2 * * * /home/deploy/scripts/backup-db.sh >> /var/log/backup.log 2>&1
```

### 12.3 Restore Database

```bash
gunzip -c /var/backups/assetflow/assetflow_20260117_020000.sql.gz | psql -U assetflow_user -h localhost assetflow
```

---

## 13. Troubleshooting

### Backend tidak jalan

```bash
# Cek logs
pm2 logs assetflow-backend --lines 50

# Cek port
sudo netstat -tlnp | grep 3001

# Restart
pm2 restart assetflow-backend
```

### Nginx 502 Bad Gateway

```bash
# Cek apakah backend running
pm2 list

# Cek nginx config
sudo nginx -t

# Cek logs
sudo tail -f /var/log/nginx/error.log
```

### Database Connection Error

```bash
# Test koneksi
psql -U assetflow_user -h localhost -d assetflow

# Cek PostgreSQL status
sudo systemctl status postgresql
```

### Permission Issues

```bash
# Fix ownership
sudo chown -R www-data:www-data /var/www/assetflow
sudo chown -R deploy:deploy /home/deploy/app
```

---

## Quick Reference Commands

```bash
# Restart semua services
sudo systemctl restart nginx
pm2 restart all

# Update aplikasi
cd /home/deploy/app
git pull
cd backend && pnpm install && pnpm build
pm2 restart assetflow-backend
cd ../frontend && pnpm install && pnpm build
sudo cp -r dist/* /var/www/assetflow/frontend/

# Lihat status
pm2 status
sudo systemctl status nginx postgresql

# Cek disk usage
df -h

# Cek memory
free -m
```
