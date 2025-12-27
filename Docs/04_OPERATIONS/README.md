# Dokumentasi Operasional (Operations Documentation)

Dokumentasi ini mencakup semua aspek operasional untuk menjalankan Aplikasi Inventori Aset di lingkungan produksi.

---

## 📚 Daftar Dokumen

### Deployment (Deployment)

| Dokumen | Deskripsi | Kapan Digunakan |
|---------|-----------|-----------------|
| **[DEPLOYMENT_DEBIAN13_PROXMOX.md](./DEPLOYMENT_DEBIAN13_PROXMOX.md)** | **Panduan lengkap step-by-step** untuk deploy ke Debian 13 di Proxmox VM. Mencakup semua langkah dari setup VM hingga aplikasi siap produksi. | **WAJIB DIBACA** untuk deployment pertama kali atau jika Anda belum familiar dengan proses deployment. |
| **[QUICK_START_DEPLOYMENT.md](./QUICK_START_DEPLOYMENT.md)** | Panduan cepat untuk deployment dalam 15-30 menit. Ringkasan langkah-langkah penting. | Gunakan jika Anda sudah familiar dengan Docker dan hanya perlu referensi cepat. |
| **[DEPLOYMENT.md](./DEPLOYMENT.md)** | Panduan deployment umum dengan konsep Docker dan Proxmox. | Referensi umum untuk konsep deployment. |
| **[INFRASTRUCTURE_AND_DEPLOYMENT.md](./INFRASTRUCTURE_AND_DEPLOYMENT.md)** | Dokumentasi topologi jaringan, runbook operasional, dan blueprint variabel lingkungan. | Referensi untuk arsitektur infrastruktur dan konfigurasi lanjutan. |

### Backup & Recovery

| Dokumen | Deskripsi |
|---------|-----------|
| **[BACKUP_AND_RECOVERY.md](./BACKUP_AND_RECOVERY.md)** | Strategi backup database, skrip otomatisasi, dan prosedur disaster recovery. |

### Monitoring & Logging

| Dokumen | Deskripsi |
|---------|-----------|
| **[MONITORING_AND_LOGGING.md](./MONITORING_AND_LOGGING.md)** | Strategi monitoring kesehatan aplikasi, logging, dan alerting. |

### Integrations

| Dokumen | Deskripsi |
|---------|-----------|
| **[INTEGRATIONS.md](./INTEGRATIONS.md)** | Dokumentasi integrasi dengan sistem eksternal (WhatsApp, Email, dll). |

---

## 🚀 Quick Start untuk Deployment

### Untuk Deployment Pertama Kali

1. **Baca panduan lengkap**: [DEPLOYMENT_DEBIAN13_PROXMOX.md](./DEPLOYMENT_DEBIAN13_PROXMOX.md)
2. **Ikuti langkah-langkah** dari awal hingga akhir
3. **Verifikasi** aplikasi berjalan dengan baik

### Untuk Deployment Cepat (Sudah Familiar)

1. **Gunakan quick start**: [QUICK_START_DEPLOYMENT.md](./QUICK_START_DEPLOYMENT.md)
2. **Atau gunakan script**: `./deploy.sh deploy`

---

## 📁 File-File Penting untuk Deployment

### Di Root Project

- **`docker-compose.yml`** - Konfigurasi Docker Compose untuk production
- **`nginx.conf`** - Konfigurasi Nginx untuk frontend (perlu edit domain)
- **`env.example`** - Template environment variables
- **`deploy.sh`** - Script deployment otomatis

### Di Backend

- **`backend/Dockerfile`** - Dockerfile untuk build backend image
- **`backend/docker-compose.yml`** - Docker Compose untuk development (opsional)

### Di Frontend

- **`frontend/Dockerfile`** - Dockerfile untuk build frontend image
- **`frontend/nginx.conf`** - Nginx config untuk build stage

---

## 🔧 Setup Awal yang Diperlukan

### 1. Prasyarat Server

- VM Debian 13 (Bookworm) di Proxmox
- Minimal 2 CPU, 4GB RAM, 40GB Disk
- Domain sudah diarahkan ke IP VM (A Record)
- Akses SSH ke VM

### 2. Software yang Diperlukan

- Docker Engine 20.10+
- Docker Compose v2.0+
- Certbot (untuk SSL)
- Git (untuk clone repository)

### 3. Konfigurasi yang Diperlukan

- File `.env` dengan semua variabel environment
- SSL certificate dari Let's Encrypt
- Firewall (UFW) dikonfigurasi
- QEMU Guest Agent aktif

---

## 📋 Checklist Deployment

Sebelum aplikasi siap produksi, pastikan:

### Setup Server
- [ ] VM Debian 13 sudah terinstall
- [ ] QEMU Guest Agent sudah aktif
- [ ] Firewall (UFW) sudah dikonfigurasi
- [ ] Fail2ban sudah aktif
- [ ] SSH key authentication sudah setup

### Install Software
- [ ] Docker sudah terinstall
- [ ] Docker Compose sudah terinstall
- [ ] User sudah ditambahkan ke docker group
- [ ] Certbot sudah terinstall

### Konfigurasi Aplikasi
- [ ] Source code sudah di-upload/clone ke server
- [ ] File `.env` sudah dibuat dari `env.example`
- [ ] Password database dan JWT secret sudah digenerate
- [ ] Domain sudah dikonfigurasi di `.env` dan `nginx.conf`
- [ ] SSL certificate sudah dibuat

### Deployment
- [ ] Docker containers sudah build dan running
- [ ] Database migrations sudah dijalankan
- [ ] Health check endpoint merespons dengan benar
- [ ] Frontend bisa diakses via HTTPS
- [ ] API bisa diakses dari frontend

### Post-Deployment
- [ ] Backup otomatis sudah dikonfigurasi
- [ ] Monitoring sudah setup (opsional)
- [ ] SSL auto-renewal sudah dikonfigurasi
- [ ] Dokumentasi sudah direview

---

## 🆘 Troubleshooting

Jika mengalami masalah saat deployment:

1. **Cek logs**: `docker compose logs -f <service-name>`
2. **Cek status**: `docker compose ps`
3. **Cek dokumentasi troubleshooting**: [TROUBLESHOOTING.md](../02_DEVELOPMENT_GUIDES/TROUBLESHOOTING.md)
4. **Cek section troubleshooting** di [DEPLOYMENT_DEBIAN13_PROXMOX.md](./DEPLOYMENT_DEBIAN13_PROXMOX.md#10-troubleshooting)

---

## 📞 Support

Untuk pertanyaan atau masalah:

1. **Cek dokumentasi** yang relevan di folder ini
2. **Cek troubleshooting guide** di dokumentasi development
3. **Review logs** aplikasi dan sistem

---

**Selamat menggunakan Aplikasi Inventori Aset!** 🎉

