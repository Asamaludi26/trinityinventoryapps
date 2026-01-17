# Deployment Scripts

Kumpulan script otomatis untuk deployment Trinity Asset Flow ke server Debian 13.

## 📁 File Scripts

| Script            | Deskripsi                                            |
| ----------------- | ---------------------------------------------------- |
| `server-setup.sh` | Setup awal server Debian 13 (instalasi dependencies) |
| `deploy-app.sh`   | Deployment aplikasi (backend + frontend)             |
| `health-check.sh` | Monitoring kesehatan sistem                          |

---

## 🚀 Quick Start

### 1. Setup Server Baru

```bash
# Upload script ke server
scp server-setup.sh root@your-server:/root/

# SSH ke server
ssh root@your-server

# Jalankan setup
chmod +x server-setup.sh
./server-setup.sh
```

### 2. Deploy Aplikasi

```bash
# Sebagai user deploy
su - deploy

# Clone repository
git clone https://github.com/your-org/trinity-inventory-app.git /home/deploy/app

# Jalankan deployment
chmod +x /home/deploy/app/Docs/07_DEPLOYMENT/scripts/deploy-app.sh
./deploy-app.sh
```

### 3. Health Check

```bash
# Manual check
./health-check.sh

# Setup cron untuk monitoring otomatis (setiap 5 menit)
(crontab -l 2>/dev/null; echo "*/5 * * * * /home/deploy/scripts/health-check.sh >> /var/log/health-check.log 2>&1") | crontab -
```

---

## 📋 server-setup.sh

Script ini akan menginstall dan mengkonfigurasi:

- ✅ System update & essential packages
- ✅ User deploy dengan sudo access
- ✅ Node.js 20 LTS + pnpm + PM2
- ✅ PostgreSQL 16 + database creation
- ✅ Nginx dengan konfigurasi optimized
- ✅ UFW Firewall
- ✅ Certbot untuk SSL
- ✅ Fail2Ban untuk keamanan
- ✅ Backup script dengan cron job
- ✅ Environment template

### Konfigurasi

Edit variabel di bagian atas script:

```bash
DOMAIN="aset.trinitimedia.com"
DB_NAME="assetflow"
DB_USER="assetflow_user"
DB_PASS="CHANGE_THIS_SECURE_PASSWORD"  # GANTI!
DEPLOY_USER="deploy"
```

---

## 📋 deploy-app.sh

Script untuk deployment aplikasi dengan opsi:

```bash
# Full deployment (backend + frontend)
./deploy-app.sh

# Backend only
./deploy-app.sh --backend-only

# Frontend only
./deploy-app.sh --frontend-only
```

### Apa yang Dilakukan

1. Pull latest code dari repository
2. Install dependencies dengan pnpm
3. Run Prisma migrations
4. Build aplikasi
5. Restart PM2 processes
6. Copy frontend ke web directory
7. Reload Nginx

---

## 📋 health-check.sh

Script monitoring yang memeriksa:

- ✅ Nginx status
- ✅ PostgreSQL status
- ✅ PM2 processes
- ✅ Backend API response
- ✅ Frontend files
- ✅ Disk space usage
- ✅ Memory usage
- ✅ SSL certificate expiry

### Output Example

```
╔════════════════════════════════════════════════════════════╗
║     Trinity Asset Flow - Health Check                      ║
╚════════════════════════════════════════════════════════════╝

[2026-01-17 10:30:00] Checking Nginx...
✓ Nginx is running
[2026-01-17 10:30:00] Checking PostgreSQL...
✓ PostgreSQL is running
[2026-01-17 10:30:00] Checking PM2 processes...
✓ Backend is running (PM2)
[2026-01-17 10:30:01] Checking Backend API...
✓ Backend API is responding (HTTP 200)
[2026-01-17 10:30:01] Checking Frontend...
✓ Frontend files exist
[2026-01-17 10:30:01] Checking Disk Space...
✓ Disk usage: 35%
[2026-01-17 10:30:01] Checking Memory...
✓ Memory usage: 42% (850MB / 2048MB)
[2026-01-17 10:30:01] Checking SSL Certificate...
✓ SSL certificate valid for 75 days

════════════════════════════════════════════════════════════
Health Check Summary - Thu Jan 17 10:30:01 WIB 2026
════════════════════════════════════════════════════════════
All systems operational!
```

---

## 🔐 Security Notes

1. **Ganti password default** di `server-setup.sh` sebelum menjalankan
2. **Update JWT_SECRET** di file `.env` dengan string random minimal 32 karakter
3. Script menyimpan password di file - pastikan permission file aman (600)
4. Jalankan `certbot` untuk mengaktifkan HTTPS setelah DNS dikonfigurasi

---

## 🔄 CI/CD Integration

Script-script ini dapat diintegrasikan dengan GitHub Actions:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: deploy
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /home/deploy/app
            ./Docs/07_DEPLOYMENT/scripts/deploy-app.sh
```

---

## 📞 Support

Jika mengalami masalah:

1. Cek log: `tail -f /var/log/pm2/assetflow-backend-*.log`
2. Cek nginx: `sudo nginx -t && sudo tail -f /var/log/nginx/error.log`
3. Cek PostgreSQL: `sudo -u postgres psql -c "\l"`
4. Jalankan health check: `./health-check.sh`
