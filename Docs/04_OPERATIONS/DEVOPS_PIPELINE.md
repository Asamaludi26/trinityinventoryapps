# 🚀 DevOps Pipeline - Trinity Asset Flow

> **Last Updated:** January 18, 2026  
> **Status:** Production Ready

---

## 📊 Arsitektur Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DEVELOPMENT WORKFLOW                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐                │
│  │   VS Code    │────▶│    GitHub    │────▶│  VM Debian   │                │
│  │   (Lokal)    │     │   Actions    │     │     13       │                │
│  └──────────────┘     └──────────────┘     └──────────────┘                │
│         │                    │                    │                         │
│         │                    │                    │                         │
│         ▼                    ▼                    ▼                         │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐                │
│  │   develop    │────▶│    Build     │     │   Docker     │                │
│  │   branch     │     │   & Test     │     │  Containers  │                │
│  └──────────────┘     └──────────────┘     └──────────────┘                │
│         │                    │                    │                         │
│         │ PR + Review        │                    │                         │
│         ▼                    ▼                    ▼                         │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐                │
│  │    main      │────▶│   Deploy     │────▶│  PostgreSQL  │                │
│  │   branch     │     │  Production  │     │   Database   │                │
│  └──────────────┘     └──────────────┘     └──────────────┘                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Analisis Keamanan File Repository

### ✅ File yang BOLEH Ada di Repository

| File/Folder                        | Alasan                                                                       | Status  |
| ---------------------------------- | ---------------------------------------------------------------------------- | ------- |
| `.github/workflows/`               | CI/CD automation, **tidak ada secrets hardcoded** (pakai `${{ secrets.* }}`) | ✅ Aman |
| `.github/ISSUE_TEMPLATE/`          | Template issue untuk kontributor                                             | ✅ Aman |
| `.github/PULL_REQUEST_TEMPLATE.md` | Template PR untuk kontributor                                                | ✅ Aman |
| `docker-compose.yml`               | Konfigurasi deployment, **tidak ada secrets** (pakai `${VAR}`)               | ✅ Aman |
| `.env.example`                     | Template environment variables, **tanpa nilai sensitif**                     | ✅ Aman |
| `scripts/vm-setup.sh`              | Script setup VM, **tidak ada credentials**                                   | ✅ Aman |
| `.dockerignore`                    | Daftar file yang tidak di-copy ke Docker image                               | ✅ Aman |
| `.gitignore`                       | Daftar file yang tidak di-commit                                             | ✅ Aman |
| `frontend/Dockerfile`              | Build instructions untuk frontend                                            | ✅ Aman |
| `backend/Dockerfile`               | Build instructions untuk backend                                             | ✅ Aman |

### ❌ File yang TIDAK BOLEH Ada di Repository

| File/Folder      | Alasan                                           | Cara Mengamankan       |
| ---------------- | ------------------------------------------------ | ---------------------- |
| `.env`           | Berisi credentials (password, API keys, secrets) | Tambah ke `.gitignore` |
| `*.pem`, `*.key` | SSH/SSL private keys                             | Tambah ke `.gitignore` |
| `secrets/`       | Folder secrets                                   | Tambah ke `.gitignore` |
| `credentials/`   | Folder credentials                               | Tambah ke `.gitignore` |
| `*.log`          | Log files mungkin berisi data sensitif           | Tambah ke `.gitignore` |

### 🔍 Hasil Audit

**Kesimpulan:** Repository saat ini **AMAN**. Semua file sensitif sudah di-handle dengan benar:

1. **GitHub Workflows** menggunakan `${{ secrets.* }}` - secrets disimpan di GitHub Settings
2. **docker-compose.yml** menggunakan `${VAR}` - nilai diambil dari `.env` file
3. **Scripts** tidak berisi credentials
4. **.gitignore** sudah mengexclude `.env` dan file sensitif lainnya

---

## 🌿 Strategi Branch

### Branch Structure

```
main (production)
  │
  └── develop (development)
        │
        ├── feature/fitur-baru
        ├── fix/perbaikan-bug
        └── hotfix/perbaikan-urgent
```

### Branch Rules

| Branch      | Tujuan           | Protection                  | Deploy            |
| ----------- | ---------------- | --------------------------- | ----------------- |
| `main`      | Production       | ✅ Protected, require PR    | Auto deploy ke VM |
| `develop`   | Development      | ⚠️ Default branch untuk dev | Tidak deploy      |
| `feature/*` | Fitur baru       | Dibuat dari `develop`       | Tidak deploy      |
| `hotfix/*`  | Perbaikan urgent | Dibuat dari `main`          | Merge ke `main`   |

### Mengapa `develop` Tidak Merusak Production?

```
┌─────────────────────────────────────────────────────────────────┐
│                    ISOLATION STRATEGY                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   develop branch                    main branch                  │
│   ─────────────                     ───────────                  │
│   • Untuk pengembangan              • Untuk production           │
│   • CI: Build + Test only           • CI: Build + Test + Deploy  │
│   • TIDAK auto deploy               • AUTO deploy ke VM          │
│   • Bebas eksperimen                • Stabil & tested            │
│                                                                  │
│              ┌──────────────────┐                                │
│   develop ──▶│  Pull Request    │──▶ main                       │
│              │  + Code Review   │                                │
│              │  + CI Tests Pass │                                │
│              └──────────────────┘                                │
│                                                                  │
│   ⚠️ Tidak ada cara langsung dari develop ke production!        │
│   Harus melalui PR dan approval                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Workflow Development

### 1. Memulai Fitur Baru

```bash
# Pastikan develop up-to-date
git checkout develop
git pull origin develop

# Buat branch fitur baru
git checkout -b feature/nama-fitur

# Kerjakan fitur...
# Commit perubahan
git add .
git commit -m "feat: deskripsi fitur"

# Push ke GitHub
git push -u origin feature/nama-fitur
```

### 2. Merge ke Develop

```bash
# Di GitHub: Buat Pull Request dari feature/* ke develop
# Setelah review & CI pass, merge PR

# Atau via command line:
git checkout develop
git merge feature/nama-fitur
git push origin develop

# Hapus branch fitur (opsional)
git branch -d feature/nama-fitur
git push origin --delete feature/nama-fitur
```

### 3. Deploy ke Production

```bash
# Di GitHub: Buat Pull Request dari develop ke main
# Review perubahan dengan teliti
# Setelah approval & CI pass, merge PR

# ✅ GitHub Actions otomatis:
# 1. Build Docker images
# 2. Push ke GitHub Container Registry
# 3. SSH ke VM
# 4. Pull images baru
# 5. Restart containers
# 6. Health check
```

### 4. Hotfix (Perbaikan Urgent)

```bash
# Jika ada bug critical di production
git checkout main
git pull origin main
git checkout -b hotfix/nama-hotfix

# Perbaiki bug...
git add .
git commit -m "fix: deskripsi perbaikan"
git push -u origin hotfix/nama-hotfix

# Buat PR ke main (urgent deploy)
# Setelah merge, jangan lupa sync ke develop!
git checkout develop
git merge main
git push origin develop
```

---

## ⚙️ GitHub Actions Workflow

### CI Pipeline (`ci.yml`)

Berjalan pada: `push` dan `pull_request` ke `main` atau `develop`

```
┌─────────────────────────────────────────────────────────────┐
│                    CI PIPELINE                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌─────────────┐                                           │
│   │  Checkout   │                                           │
│   └──────┬──────┘                                           │
│          │                                                   │
│          ▼                                                   │
│   ┌─────────────┐     ┌─────────────┐                       │
│   │  Frontend   │     │   Backend   │  (parallel)           │
│   │    CI       │     │     CI      │                       │
│   └──────┬──────┘     └──────┬──────┘                       │
│          │                   │                               │
│   ┌──────▼──────┐     ┌──────▼──────┐                       │
│   │   Install   │     │   Install   │                       │
│   │    deps     │     │    deps     │                       │
│   └──────┬──────┘     └──────┬──────┘                       │
│          │                   │                               │
│   ┌──────▼──────┐     ┌──────▼──────┐                       │
│   │    Lint     │     │    Lint     │                       │
│   └──────┬──────┘     └──────┬──────┘                       │
│          │                   │                               │
│   ┌──────▼──────┐     ┌──────▼──────┐                       │
│   │  TypeCheck  │     │  TypeCheck  │                       │
│   └──────┬──────┘     └──────┬──────┘                       │
│          │                   │                               │
│   ┌──────▼──────┐     ┌──────▼──────┐                       │
│   │    Test     │     │    Test     │                       │
│   └──────┬──────┘     └──────┬──────┘                       │
│          │                   │                               │
│   ┌──────▼──────┐     ┌──────▼──────┐                       │
│   │   Build     │     │   Build     │                       │
│   └─────────────┘     └─────────────┘                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Deploy Pipeline (`deploy-production.yml`)

Berjalan pada: `push` ke `main` only

```
┌─────────────────────────────────────────────────────────────┐
│                 DEPLOY PIPELINE                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌─────────────────────────────────────┐                   │
│   │            BUILD JOB                 │                   │
│   ├─────────────────────────────────────┤                   │
│   │  1. Checkout repository              │                   │
│   │  2. Setup Docker Buildx              │                   │
│   │  3. Login to ghcr.io                 │                   │
│   │  4. Build Frontend image             │                   │
│   │  5. Build Backend image              │                   │
│   │  6. Push images to registry          │                   │
│   └──────────────┬──────────────────────┘                   │
│                  │                                           │
│                  ▼                                           │
│   ┌─────────────────────────────────────┐                   │
│   │           DEPLOY JOB                 │                   │
│   ├─────────────────────────────────────┤                   │
│   │  1. Setup SSH connection             │                   │
│   │  2. Copy docker-compose.yml to VM    │                   │
│   │  3. SSH into VM                      │                   │
│   │  4. Pull new images                  │                   │
│   │  5. docker compose down              │                   │
│   │  6. docker compose up -d             │                   │
│   │  7. Health check                     │                   │
│   │  8. Cleanup old images               │                   │
│   └─────────────────────────────────────┘                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔑 GitHub Secrets Configuration

Secrets yang perlu dikonfigurasi di **GitHub → Settings → Secrets and variables → Actions**:

| Secret Name          | Deskripsi                                 | Contoh                                     |
| -------------------- | ----------------------------------------- | ------------------------------------------ |
| `VM_HOST`            | IP address atau hostname VM               | `192.168.1.100` atau `trinity.example.com` |
| `VM_USER`            | Username untuk SSH ke VM                  | `deploy`                                   |
| `VM_SSH_PRIVATE_KEY` | Private key untuk SSH (isi file `id_rsa`) | `-----BEGIN OPENSSH PRIVATE KEY-----...`   |
| `DEPLOY_PATH`        | Path aplikasi di VM                       | `/opt/trinity-assetflow`                   |

### Cara Generate SSH Key

```bash
# Di komputer lokal
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/trinity-deploy

# Copy public key ke VM
ssh-copy-id -i ~/.ssh/trinity-deploy.pub deploy@VM_IP

# Isi private key ke GitHub Secret
cat ~/.ssh/trinity-deploy
# Copy seluruh output ke secret VM_SSH_PRIVATE_KEY
```

---

## 🖥️ Setup VM Debian 13

### 1. Jalankan Setup Script

```bash
# SSH ke VM
ssh root@VM_IP

# Download dan jalankan script
curl -fsSL https://raw.githubusercontent.com/Asamaludi26/TrinityInventoryApps/main/scripts/vm-setup.sh | sudo bash
```

### 2. Konfigurasi Environment

```bash
# Login sebagai deploy user
su - deploy
cd /opt/trinity-assetflow

# Buat file .env dari template
cp .env.example .env

# Edit dengan nilai production
nano .env
```

### 3. Setup GitHub Container Registry Auth

```bash
# Login ke ghcr.io (gunakan GitHub Personal Access Token)
echo "YOUR_GITHUB_TOKEN" | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```

---

## 📋 Checklist Deployment

### Pre-Deployment

- [ ] Semua tests pass di CI
- [ ] Code review completed
- [ ] PR approved
- [ ] No merge conflicts

### Post-Deployment

- [ ] Health check pass
- [ ] Application accessible
- [ ] Database migrations applied (if any)
- [ ] Logs show no errors

### Rollback (jika ada masalah)

```bash
# SSH ke VM
ssh deploy@VM_IP
cd /opt/trinity-assetflow

# Rollback ke versi sebelumnya
docker compose down
IMAGE_TAG=PREVIOUS_SHA docker compose up -d

# Atau gunakan specific image tag
docker compose pull ghcr.io/asamaludi26/trinityinventoryapps/frontend:PREVIOUS_TAG
docker compose up -d
```

---

## 🔄 Diagram Alur Lengkap

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              COMPLETE DEVOPS FLOW                                    │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│   DEVELOPER (VS Code)                                                               │
│   ─────────────────                                                                 │
│        │                                                                            │
│        │ 1. git checkout develop                                                    │
│        │ 2. git checkout -b feature/xxx                                             │
│        │ 3. Develop & commit                                                        │
│        │ 4. git push origin feature/xxx                                             │
│        ▼                                                                            │
│   ┌─────────────┐                                                                   │
│   │   GitHub    │                                                                   │
│   │ Repository  │                                                                   │
│   └──────┬──────┘                                                                   │
│          │                                                                          │
│          │ Pull Request: feature/xxx → develop                                      │
│          ▼                                                                          │
│   ┌─────────────┐     ┌─────────────┐                                              │
│   │  CI Tests   │────▶│   Review    │                                              │
│   │   (auto)    │     │  (manual)   │                                              │
│   └──────┬──────┘     └──────┬──────┘                                              │
│          │                   │                                                      │
│          └─────────┬─────────┘                                                      │
│                    │                                                                │
│                    │ Merge to develop                                               │
│                    ▼                                                                │
│            ┌─────────────┐                                                          │
│            │   develop   │                                                          │
│            │   branch    │ ◄── Staging/Testing (tidak deploy)                      │
│            └──────┬──────┘                                                          │
│                   │                                                                 │
│                   │ Pull Request: develop → main                                    │
│                   ▼                                                                 │
│   ┌─────────────┐     ┌─────────────┐                                              │
│   │  CI Tests   │────▶│  Approval   │                                              │
│   │   (auto)    │     │  (manual)   │                                              │
│   └──────┬──────┘     └──────┬──────┘                                              │
│          │                   │                                                      │
│          └─────────┬─────────┘                                                      │
│                    │                                                                │
│                    │ Merge to main                                                  │
│                    ▼                                                                │
│            ┌─────────────┐                                                          │
│            │    main     │ ◄── Production branch                                   │
│            │   branch    │                                                          │
│            └──────┬──────┘                                                          │
│                   │                                                                 │
│                   │ Trigger: deploy-production.yml                                  │
│                   ▼                                                                 │
│   ┌─────────────────────────────────────────────────────────────────┐              │
│   │                    GITHUB ACTIONS                                │              │
│   │                                                                  │              │
│   │   ┌──────────┐     ┌──────────┐     ┌──────────┐               │              │
│   │   │  Build   │────▶│   Push   │────▶│  Deploy  │               │              │
│   │   │  Docker  │     │ to GHCR  │     │   SSH    │               │              │
│   │   └──────────┘     └──────────┘     └────┬─────┘               │              │
│   │                                          │                      │              │
│   └──────────────────────────────────────────┼──────────────────────┘              │
│                                              │                                      │
│                                              │ SSH + docker compose                 │
│                                              ▼                                      │
│   ┌─────────────────────────────────────────────────────────────────┐              │
│   │                    VM DEBIAN 13 (Proxmox)                        │              │
│   │                                                                  │              │
│   │   ┌──────────────────────────────────────────────────────────┐  │              │
│   │   │                    Docker Compose                         │  │              │
│   │   │                                                           │  │              │
│   │   │   ┌───────────┐   ┌───────────┐   ┌───────────┐         │  │              │
│   │   │   │  Frontend │   │  Backend  │   │ PostgreSQL│         │  │              │
│   │   │   │  (Nginx)  │◄─▶│ (NestJS)  │◄─▶│ (Database)│         │  │              │
│   │   │   │  :80/:443 │   │   :3001   │   │   :5432   │         │  │              │
│   │   │   └───────────┘   └───────────┘   └───────────┘         │  │              │
│   │   │                                                           │  │              │
│   │   └──────────────────────────────────────────────────────────┘  │              │
│   │                                                                  │              │
│   └─────────────────────────────────────────────────────────────────┘              │
│                                                                                      │
│   PENGGUNA AKHIR                                                                    │
│   ──────────────                                                                    │
│        │                                                                            │
│        │ https://trinity.example.com                                                │
│        ▼                                                                            │
│   ┌─────────────┐                                                                   │
│   │   Browser   │                                                                   │
│   │   (User)    │                                                                   │
│   └─────────────┘                                                                   │
│                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## ❓ FAQ

### Q: Mengapa `.github/workflows/` boleh ada di repository?

**A:** Workflows menggunakan **GitHub Secrets** untuk credentials, bukan hardcoded values. Semua referensi seperti `${{ secrets.VM_SSH_PRIVATE_KEY }}` diambil dari GitHub Settings → Secrets, yang terenkripsi dan tidak pernah terexpose.

### Q: Mengapa `docker-compose.yml` boleh ada?

**A:** File ini hanya berisi **template** konfigurasi. Nilai sensitif menggunakan placeholder seperti `${POSTGRES_PASSWORD}` yang diambil dari file `.env` yang **tidak** di-commit.

### Q: Bagaimana jika saya push langsung ke main?

**A:** Jangan lakukan ini! Sebaiknya protect branch `main` di GitHub:

1. Settings → Branches → Add rule
2. Branch name pattern: `main`
3. ✅ Require a pull request before merging
4. ✅ Require status checks to pass

### Q: Bagaimana jika deployment gagal?

**A:**

1. Cek logs di GitHub Actions
2. SSH ke VM dan cek `docker compose logs`
3. Rollback dengan `IMAGE_TAG=PREVIOUS docker compose up -d`

---

## 📚 Referensi

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
