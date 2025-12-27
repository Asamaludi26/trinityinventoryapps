# Ringkasan Deployment - Aplikasi Inventori Aset

Dokumen ini memberikan ringkasan cepat tentang proses deployment aplikasi ke server Debian 13 di Proxmox VM.

---

## 📋 Checklist Cepat

### Prasyarat
- [ ] VM Debian 13 sudah tersedia
- [ ] Domain sudah diarahkan ke IP VM
- [ ] Akses SSH ke VM

### Setup Server
- [ ] Docker & Docker Compose terinstall
- [ ] QEMU Guest Agent aktif
- [ ] Firewall dikonfigurasi
- [ ] SSL certificate dibuat

### Deployment
- [ ] Source code di-upload ke `/opt/trinity-app`
- [ ] File `.env` dikonfigurasi
- [ ] `nginx.conf` di-edit dengan domain
- [ ] Containers build dan running
- [ ] Database migrations dijalankan

---

## 🚀 Quick Commands

```bash
# Deploy aplikasi
cd /opt/trinity-app
docker compose up -d --build

# Atau gunakan script
./deploy.sh deploy

# Check status
docker compose ps

# View logs
docker compose logs -f

# Backup database
docker compose exec db pg_dump -U trinity_admin trinity_asset | gzip > backup.sql.gz
```

---

## 📚 Dokumentasi Lengkap

- **Panduan Lengkap**: [DEPLOYMENT_DEBIAN13_PROXMOX.md](./DEPLOYMENT_DEBIAN13_PROXMOX.md)
- **Quick Start**: [QUICK_START_DEPLOYMENT.md](./QUICK_START_DEPLOYMENT.md)
- **Index Dokumentasi**: [README.md](./README.md)

---

## 🔧 File Penting

| File | Lokasi | Deskripsi |
|------|--------|-----------|
| `docker-compose.yml` | Root project | Konfigurasi Docker Compose |
| `nginx.conf` | Root project | Konfigurasi Nginx (perlu edit domain) |
| `env.example` | Root project | Template environment variables |
| `.env` | `/opt/trinity-app/` | Environment variables (buat dari template) |
| `deploy.sh` | Root project | Script deployment otomatis |

---

## ⚠️ Catatan Penting

1. **File `.env`** harus dibuat dari `env.example` dan diisi dengan nilai yang sesuai
2. **File `nginx.conf`** harus di-edit untuk mengganti `YOUR_DOMAIN` dengan domain Anda
3. **SSL Certificate** harus dibuat sebelum menjalankan aplikasi
4. **Database password** dan **JWT secret** harus digenerate dengan `openssl rand -base64`

---

**Untuk detail lengkap, baca [DEPLOYMENT_DEBIAN13_PROXMOX.md](./DEPLOYMENT_DEBIAN13_PROXMOX.md)**

