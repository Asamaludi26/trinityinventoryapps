# Quick Start Deployment Guide

Panduan cepat untuk mendeploy aplikasi dalam waktu singkat. Untuk panduan lengkap, lihat [DEPLOYMENT_DEBIAN13_PROXMOX.md](./DEPLOYMENT_DEBIAN13_PROXMOX.md).

---

## Prasyarat

- VM Debian 13 sudah tersedia di Proxmox
- Domain sudah diarahkan ke IP VM
- Akses SSH ke VM

---

## Langkah Cepat (15-30 menit)

### 1. Setup Awal VM (5 menit)

```bash
# Login ke VM
ssh admin@<vm-ip>

# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y curl wget git ufw fail2ban qemu-guest-agent

# Setup firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Install QEMU Guest Agent
sudo systemctl start qemu-guest-agent
sudo systemctl enable qemu-guest-agent
```

### 2. Install Docker (5 menit)

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Verify
docker run hello-world
```

### 3. Setup Aplikasi (5 menit)

```bash
# Buat direktori
sudo mkdir -p /opt/trinity-app
sudo chown $USER:$USER /opt/trinity-app
cd /opt/trinity-app

# Clone atau upload source code
git clone <repository-url> .
# ATAU upload via SCP dari local machine

# Buat direktori untuk data
mkdir -p pgdata
sudo chown -R 999:999 pgdata
sudo chmod 700 pgdata
```

### 4. Konfigurasi Environment (5 menit)

```bash
cd /opt/trinity-app

# Copy template
cp env.example .env

# Edit .env
nano .env

# Generate passwords
openssl rand -base64 32  # Untuk DB_PASSWORD
openssl rand -base64 64  # Untuk JWT_SECRET

# Set permissions
chmod 600 .env
```

**Isi minimal di .env:**
```env
DB_USER=trinity_admin
DB_PASSWORD=<password-dari-openssl>
DB_NAME=trinity_asset
DATABASE_URL=postgresql://trinity_admin:<password>@db:5432/trinity_asset?schema=public
JWT_SECRET=<secret-dari-openssl>
VITE_API_URL=https://<domain-anda>/api
VITE_USE_MOCK=false
DOMAIN=<domain-anda>
```

### 5. Setup SSL (5 menit)

```bash
# Install Certbot
sudo apt install -y certbot

# Generate certificate (pastikan port 80 kosong)
sudo certbot certonly --standalone -d <domain-anda>

# Setup auto-renewal
sudo crontab -e
# Tambahkan: 0 3 * * * certbot renew --quiet --deploy-hook "cd /opt/trinity-app && docker compose restart web"
```

### 6. Update nginx.conf (2 menit)

```bash
cd /opt/trinity-app

# Edit nginx.conf, ganti placeholder dengan domain Anda
nano nginx.conf

# Ganti semua "_" dengan domain Anda di:
# - server_name
# - ssl_certificate path
# - ssl_certificate_key path
```

### 7. Deploy (3 menit)

```bash
cd /opt/trinity-app

# Build dan start
docker compose up -d --build

# Wait untuk database ready
sleep 15

# Run migrations
docker compose exec api npm run prisma:migrate deploy

# Check status
docker compose ps
```

### 8. Verify (2 menit)

```bash
# Check health
curl http://localhost:3001/api/health

# Check dari browser
# Buka: https://<domain-anda>
```

---

## Troubleshooting Cepat

### Container tidak start
```bash
docker compose logs <service-name>
docker compose restart <service-name>
```

### Database error
```bash
docker compose logs db
docker compose exec db psql -U trinity_admin -d trinity_asset -c "SELECT 1;"
```

### SSL error
```bash
sudo certbot certificates
sudo certbot renew
docker compose restart web
```

---

## Script Deployment Otomatis

Gunakan script `deploy.sh` untuk deployment otomatis:

```bash
cd /opt/trinity-app
chmod +x deploy.sh
./deploy.sh deploy
```

**Commands tersedia:**
- `./deploy.sh deploy` - Deploy/update aplikasi
- `./deploy.sh restart` - Restart services
- `./deploy.sh stop` - Stop services
- `./deploy.sh start` - Start services
- `./deploy.sh logs` - Show logs
- `./deploy.sh status` - Show status
- `./deploy.sh backup` - Backup database

---

## Next Steps

Setelah deployment berhasil:

1. **Setup Backup Otomatis** - Lihat [BACKUP_AND_RECOVERY.md](./BACKUP_AND_RECOVERY.md)
2. **Setup Monitoring** - Lihat [MONITORING_AND_LOGGING.md](./MONITORING_AND_LOGGING.md)
3. **Review Security** - Lihat [SECURITY_GUIDE.md](../03_STANDARDS_AND_PROCEDURES/SECURITY_GUIDE.md)

---

**Selamat! Aplikasi sudah siap digunakan.** 🎉

