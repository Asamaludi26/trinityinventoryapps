# Panduan Deployment Lengkap: Debian 13 di Proxmox VM

Dokumen ini adalah panduan **step-by-step lengkap** untuk mendeploy Aplikasi Inventori Aset ke server VM Debian 13 yang berjalan di Proxmox. Panduan ini dirancang agar aplikasi dapat segera digunakan dengan sangat matang dan siap produksi.

---

## 📋 Daftar Isi

1. [Persiapan VM di Proxmox](#1-persiapan-vm-di-proxmox)
2. [Setup Awal Debian 13](#2-setup-awal-debian-13)
3. [Instalasi Docker & Docker Compose](#3-instalasi-docker--docker-compose)
4. [Persiapan Aplikasi](#4-persiapan-aplikasi)
5. [Konfigurasi Environment](#5-konfigurasi-environment)
6. [Setup SSL dengan Let's Encrypt](#6-setup-ssl-dengan-lets-encrypt)
7. [Deployment Aplikasi](#7-deployment-aplikasi)
8. [Verifikasi & Testing](#8-verifikasi--testing)
9. [Maintenance & Monitoring](#9-maintenance--monitoring)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Persiapan VM di Proxmox

### 1.1. Spesifikasi VM Minimum

Sebelum membuat VM, pastikan spesifikasi berikut tersedia:

| Komponen | Spesifikasi Minimum | Rekomendasi |
|----------|---------------------|-------------|
| **OS** | Debian 13 (Bookworm) | Debian 13 (Bookworm) |
| **CPU** | 2 Core | 4 Core |
| **RAM** | 4 GB | 8 GB |
| **Disk** | 40 GB | 80 GB (SSD preferred) |
| **Network** | 1 NIC (Bridge) | 1 NIC dengan IP Static |

### 1.2. Membuat VM di Proxmox

1. **Login ke Proxmox Web UI** (biasanya `https://<proxmox-ip>:8006`)

2. **Klik "Create VM"** di pojok kanan atas

3. **General Tab**:
   - VM ID: Auto atau pilih ID unik
   - Name: `trinity-inventory-app`
   - Resource Pool: (opsional)

4. **OS Tab**:
   - Use CD/DVD disc image file (iso)
   - Storage: Pilih storage yang tersedia
   - ISO image: Upload atau pilih Debian 13 ISO

5. **System Tab**:
   - Graphic Card: Default (VGA)
   - QEMU Guest Agent: **✅ Enabled** (PENTING!)
   - SCSI Controller: VirtIO SCSI single
   - Machine: Default (i440fx)

6. **Hard Disk Tab**:
   - Bus/Device: SCSI
   - Storage: Pilih storage (prefer SSD)
   - Disk size: **40 GB minimum** (80 GB recommended)
   - Cache: Write back (safe)
   - Discard: ✅ Enabled (untuk thin provisioning)

7. **CPU Tab**:
   - Sockets: 1
   - Cores: **2 minimum** (4 recommended)
   - Type: `host` (untuk performa terbaik)

8. **Memory Tab**:
   - Memory: **4096 MB minimum** (8192 MB recommended)
   - Ballooning Device: ✅ Enabled

9. **Network Tab**:
   - Bridge: Pilih bridge yang terhubung ke jaringan
   - Model: VirtIO (paravirtualized)
   - Firewall: Sesuaikan kebutuhan

10. **Konfirmasi** dan klik "Finish"

### 1.3. Install Debian 13

1. **Start VM** dan buka Console
2. **Ikuti installer Debian**:
   - Language: English (atau sesuai kebutuhan)
   - Location: Sesuaikan
   - Keyboard: Sesuaikan
   - Hostname: `trinity-inventory-app` (atau sesuai kebutuhan)
   - Domain name: (kosongkan atau isi sesuai)
   - Root password: **Buat password kuat!**
   - Full name: (isi sesuai)
   - Username: `admin` (atau sesuai)
   - User password: **Buat password kuat!**
   - Partitioning: **Guided - use entire disk**
   - Software selection: **✅ SSH server** (WAJIB!)
   - Install GRUB: ✅ Yes

3. **Setelah instalasi selesai**, reboot VM

---

## 2. Setup Awal Debian 13

### 2.1. Login & Update System

```bash
# Login sebagai user yang dibuat saat instalasi
ssh admin@<vm-ip-address>

# Update package list dan upgrade system
sudo apt update
sudo apt upgrade -y

# Install paket dasar yang diperlukan
sudo apt install -y \
    curl \
    wget \
    git \
    vim \
    ufw \
    fail2ban \
    htop \
    net-tools \
    ca-certificates \
    gnupg \
    lsb-release
```

### 2.2. Setup Firewall (UFW)

```bash
# Enable UFW
sudo ufw --force enable

# Allow SSH (WAJIB sebelum enable firewall!)
sudo ufw allow 22/tcp

# Allow HTTP & HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check status
sudo ufw status verbose
```

### 2.3. Setup Fail2Ban (Security)

```bash
# Fail2ban sudah terinstall, konfigurasi default sudah cukup
# Cek status
sudo systemctl status fail2ban

# Enable dan start
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 2.4. Install & Setup QEMU Guest Agent

**PENTING**: QEMU Guest Agent memungkinkan Proxmox memantau VM dengan benar.

```bash
# Install QEMU Guest Agent
sudo apt install -y qemu-guest-agent

# Start dan enable service
sudo systemctl start qemu-guest-agent
sudo systemctl enable qemu-guest-agent

# Reboot VM untuk memastikan agent aktif
sudo reboot
```

**Setelah reboot**, verifikasi di Proxmox Web UI:
- VM > Summary > IP Address harus muncul
- VM > Monitor > QEMU Guest Agent harus "OK"

### 2.5. Setup User untuk Deployment

```bash
# Buat user khusus untuk deployment (opsional, bisa pakai user existing)
sudo useradd -m -s /bin/bash deploy
sudo usermod -aG sudo deploy

# Setup SSH key untuk user deploy (recommended)
# Di local machine, generate SSH key:
# ssh-keygen -t ed25519 -C "deploy@trinity-inventory"

# Copy public key ke server
# ssh-copy-id deploy@<vm-ip-address>
```

---

## 3. Instalasi Docker & Docker Compose

### 3.1. Install Docker

```bash
# Hapus versi lama jika ada
sudo apt remove -y docker docker-engine docker.io containerd runc

# Install dependencies
sudo apt update
sudo apt install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker's official GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Setup repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verify installation
sudo docker run hello-world
```

### 3.2. Setup Docker untuk User Non-Root

```bash
# Add user ke docker group (ganti 'admin' dengan username Anda)
sudo usermod -aG docker $USER

# Logout dan login kembali, atau:
newgrp docker

# Verify
docker run hello-world
```

### 3.3. Konfigurasi Docker (Opsional tapi Recommended)

```bash
# Buat file konfigurasi Docker daemon
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json > /dev/null <<EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2"
}
EOF

# Restart Docker
sudo systemctl restart docker
sudo systemctl enable docker
```

### 3.4. Verify Docker Compose

```bash
# Check Docker Compose version
docker compose version

# Should output: Docker Compose version v2.x.x
```

---

## 4. Persiapan Aplikasi

### 4.1. Clone atau Upload Source Code

**Opsi A: Clone dari Git Repository**

```bash
# Buat direktori aplikasi
sudo mkdir -p /opt/trinity-app
sudo chown $USER:$USER /opt/trinity-app
cd /opt/trinity-app

# Clone repository (ganti URL dengan repository Anda)
git clone <repository-url> .

# Atau jika sudah ada, pull latest
git pull origin main
```

**Opsi B: Upload via SCP/SFTP**

```bash
# Di local machine
scp -r /path/to/trinityinventoryapps/* deploy@<vm-ip>:/opt/trinity-app/
```

### 4.2. Struktur Direktori yang Diperlukan

Pastikan struktur berikut ada:

```
/opt/trinity-app/
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── prisma/
│   └── src/
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
├── docker-compose.yml
├── nginx.conf
└── .env
```

### 4.3. Buat Direktori untuk Data Persistent

```bash
cd /opt/trinity-app

# Buat direktori untuk database volume
mkdir -p pgdata

# Set permissions
sudo chown -R 999:999 pgdata  # PostgreSQL user ID
sudo chmod 700 pgdata

# Buat direktori untuk backup
sudo mkdir -p /var/backups/trinity-app
sudo chown $USER:$USER /var/backups/trinity-app
```

---

## 5. Konfigurasi Environment

### 5.1. Buat File .env

```bash
cd /opt/trinity-app

# Copy dari template
cp .env.example .env

# Edit file .env
nano .env
```

### 5.2. Isi File .env

Lihat file `.env.example` untuk template lengkap. Minimal yang harus diisi:

```env
# Database Configuration
DB_USER=trinity_admin
DB_PASSWORD=<GENERATE_PASSWORD_KUAT_MIN_16_KARAKTER>
DB_NAME=trinity_asset
DATABASE_URL=postgresql://trinity_admin:<PASSWORD>@db:5432/trinity_asset?schema=public

# Application Security
JWT_SECRET=<GENERATE_DENGAN: openssl rand -base64 64>
JWT_EXPIRATION=12h
JWT_REFRESH_EXPIRATION=7d
PORT=3001

# Frontend Configuration
VITE_API_URL=https://aset.trinitymedia.co.id/api
VITE_USE_MOCK=false

# WhatsApp Integration (Opsional)
WA_API_URL=https://api.watzap.id/v1
WA_API_KEY=<your-wa-api-key>
WA_GROUP_LOGISTIC_ID=1203630239482@g.us
WA_GROUP_PURCHASE_ID=1203630291823@g.us
WA_GROUP_MANAGEMENT_ID=1203630239123@g.us

# Domain Configuration
DOMAIN=aset.trinitymedia.co.id
```

### 5.3. Generate Password & Secret

```bash
# Generate database password
openssl rand -base64 32

# Generate JWT secret
openssl rand -base64 64

# Copy output ke file .env
```

### 5.4. Set Permission File .env

```bash
# File .env harus hanya bisa dibaca oleh owner
chmod 600 .env
```

---

## 6. Setup SSL dengan Let's Encrypt

### 6.1. Prasyarat

- Domain sudah diarahkan ke IP VM (A Record)
- Port 80 dan 443 terbuka di firewall
- Aplikasi belum berjalan (port 80 harus kosong)

### 6.2. Install Certbot

```bash
sudo apt update
sudo apt install -y certbot
```

### 6.3. Generate SSL Certificate

```bash
# Stop aplikasi jika sudah berjalan
cd /opt/trinity-app
docker compose down

# Generate certificate (ganti domain dengan domain Anda)
sudo certbot certonly --standalone -d aset.trinitymedia.co.id

# Atau untuk multiple domain:
# sudo certbot certonly --standalone -d aset.trinitymedia.co.id -d www.aset.trinitymedia.co.id
```

**Catatan**: Certbot akan meminta email untuk notifikasi. Isi dengan email yang valid.

### 6.4. Setup Auto-Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Setup cron job untuk auto-renewal
sudo crontab -e

# Tambahkan baris berikut (renew setiap hari jam 3 pagi)
0 3 * * * certbot renew --quiet --deploy-hook "cd /opt/trinity-app && docker compose restart web"
```

### 6.5. Verify Certificate

```bash
# Check certificate location
sudo ls -la /etc/letsencrypt/live/aset.trinitymedia.co.id/

# Should show:
# - cert.pem
# - chain.pem
# - fullchain.pem
# - privkey.pem
```

---

## 7. Deployment Aplikasi

### 7.1. Build & Start Services

```bash
cd /opt/trinity-app

# Build dan start semua services
docker compose up -d --build

# Check status
docker compose ps

# Check logs
docker compose logs -f
```

### 7.2. Run Database Migrations

```bash
# Wait for database to be ready (sekitar 10-15 detik)
sleep 15

# Run Prisma migrations
docker compose exec api npm run prisma:migrate deploy

# Seed database (jika ada)
docker compose exec api npm run prisma:seed
```

### 7.3. Verify Services

```bash
# Check all containers are running
docker compose ps

# Should show:
# - trinity_asset_db (Up)
# - triniti_asset_api (Up)
# - trinity_asset_web (Up)

# Check logs for errors
docker compose logs api
docker compose logs web
docker compose logs db
```

---

## 8. Verifikasi & Testing

### 8.1. Health Check

```bash
# Check API health
curl http://localhost:3001/api/health

# Should return: {"status":"ok","timestamp":"..."}

# Check frontend
curl -I http://localhost

# Should return: HTTP/1.1 200 OK
```

### 8.2. Test dari Browser

1. **Buka browser** dan akses: `https://aset.trinitymedia.co.id`
2. **Verify SSL**: Pastikan ada icon gembok di address bar
3. **Test Login**: Coba login dengan kredensial default
4. **Test API**: Buka Developer Tools > Network, cek request ke `/api/*`

### 8.3. Test Database Connection

```bash
# Connect ke database
docker compose exec db psql -U trinity_admin -d trinity_asset

# Run test query
SELECT version();

# Exit
\q
```

---

## 9. Maintenance & Monitoring

### 9.1. Backup Database

Lihat dokumentasi lengkap di: `Docs/04_OPERATIONS/BACKUP_AND_RECOVERY.md`

**Quick Backup Command:**

```bash
# Manual backup
docker compose exec db pg_dump -U trinity_admin trinity_asset | gzip > /var/backups/trinity-app/backup_$(date +%Y%m%d_%H%M%S).sql.gz

# Setup automated backup (cron)
crontab -e

# Add line (backup setiap hari jam 2 pagi):
0 2 * * * docker compose -f /opt/trinity-app/docker-compose.yml exec -T db pg_dump -U trinity_admin trinity_asset | gzip > /var/backups/trinity-app/backup_$(date +\%Y\%m\%d_\%H\%M\%S).sql.gz
```

### 9.2. Monitor Logs

```bash
# Real-time logs semua services
docker compose logs -f

# Logs specific service
docker compose logs -f api
docker compose logs -f web
docker compose logs -f db

# Last 100 lines
docker compose logs --tail=100 api
```

### 9.3. Monitor Resource Usage

```bash
# Check container resource usage
docker stats

# Check disk usage
df -h

# Check Docker disk usage
docker system df
```

### 9.4. Update Aplikasi

```bash
cd /opt/trinity-app

# Backup database dulu!
docker compose exec db pg_dump -U trinity_admin trinity_asset | gzip > /var/backups/trinity-app/backup_before_update_$(date +%Y%m%d_%H%M%S).sql.gz

# Pull latest code
git pull origin main

# Rebuild dan restart
docker compose up -d --build

# Run migrations jika ada
docker compose exec api npm run prisma:migrate deploy
```

### 9.5. Cleanup Docker

```bash
# Remove unused images, containers, networks
docker system prune -a

# Remove old logs (keep last 3 days)
docker system prune --volumes --filter "until=72h"
```

---

## 10. Troubleshooting

### 10.1. Container Tidak Start

```bash
# Check logs
docker compose logs <service-name>

# Check status
docker compose ps

# Restart service
docker compose restart <service-name>

# Rebuild service
docker compose up -d --build <service-name>
```

### 10.2. Database Connection Error

```bash
# Check database container
docker compose ps db

# Check database logs
docker compose logs db

# Test connection
docker compose exec db psql -U trinity_admin -d trinity_asset -c "SELECT 1;"

# Check .env file
cat .env | grep DATABASE
```

### 10.3. SSL Certificate Error

```bash
# Check certificate
sudo certbot certificates

# Renew certificate manually
sudo certbot renew

# Restart web container
docker compose restart web
```

### 10.4. Port Already in Use

```bash
# Check what's using port 80
sudo lsof -i :80

# Check what's using port 443
sudo lsof -i :443

# Kill process if needed
sudo kill -9 <PID>
```

### 10.5. Disk Space Full

```bash
# Check disk usage
df -h

# Clean Docker
docker system prune -a --volumes

# Remove old backups (keep last 7 days)
find /var/backups/trinity-app -name "*.sql.gz" -mtime +7 -delete
```

### 10.6. Permission Denied

```bash
# Fix pgdata permissions
sudo chown -R 999:999 /opt/trinity-app/pgdata
sudo chmod 700 /opt/trinity-app/pgdata

# Fix .env permissions
chmod 600 /opt/trinity-app/.env
```

---

## 11. Security Checklist

Sebelum aplikasi siap produksi, pastikan:

- [ ] Firewall (UFW) sudah dikonfigurasi
- [ ] Fail2ban sudah aktif
- [ ] SSH key authentication sudah setup (disable password auth)
- [ ] File `.env` permission sudah benar (600)
- [ ] Password database dan JWT secret sudah kuat
- [ ] SSL certificate sudah valid dan auto-renewal aktif
- [ ] Backup otomatis sudah dikonfigurasi
- [ ] Monitoring sudah setup (opsional tapi recommended)
- [ ] QEMU Guest Agent sudah aktif

---

## 12. Quick Reference Commands

```bash
# Start aplikasi
cd /opt/trinity-app && docker compose up -d

# Stop aplikasi
docker compose down

# Restart aplikasi
docker compose restart

# View logs
docker compose logs -f

# Backup database
docker compose exec db pg_dump -U trinity_admin trinity_asset | gzip > backup.sql.gz

# Restore database
gunzip -c backup.sql.gz | docker compose exec -T db psql -U trinity_admin trinity_asset

# Update aplikasi
git pull && docker compose up -d --build

# Check status
docker compose ps
```

---

## 📞 Support & Dokumentasi Tambahan

- **Dokumentasi Deployment Umum**: `Docs/04_OPERATIONS/DEPLOYMENT.md`
- **Infrastruktur & Deployment**: `Docs/04_OPERATIONS/INFRASTRUCTURE_AND_DEPLOYMENT.md`
- **Backup & Recovery**: `Docs/04_OPERATIONS/BACKUP_AND_RECOVERY.md`
- **Monitoring & Logging**: `Docs/04_OPERATIONS/MONITORING_AND_LOGGING.md`
- **Troubleshooting**: `Docs/02_DEVELOPMENT_GUIDES/TROUBLESHOOTING.md`

---

**Selamat!** Aplikasi Inventori Aset Anda sekarang sudah siap digunakan di server produksi. 🎉

