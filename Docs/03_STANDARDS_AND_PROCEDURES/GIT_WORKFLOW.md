# Git Branching Strategy & CI/CD Pipeline

> **Standarisasi Pengembangan dengan GitHub untuk Trinity Asset Flow**

Dokumen ini mendefinisikan strategi branching, workflow pengembangan, dan pipeline CI/CD untuk deployment otomatis ke VM production.

---

## 1. Branching Strategy

### 1.1. Branch Utama

Kami menggunakan **Simplified Git Flow** dengan 2 branch utama:

| Branch    | Fungsi                | Protected |      Auto Deploy      |
| --------- | --------------------- | :-------: | :-------------------: |
| `main`    | Production-ready code |  ✅ Yes   |   ✅ VM Production    |
| `develop` | Development & staging |  ✅ Yes   | ⚠️ Optional (Staging) |

```
main ─────●─────────────●─────────────●───────── (Production)
          ↑             ↑             ↑
          │ merge       │ merge       │ merge
          │             │             │
develop ──●──●──●──●────●──●──●───────●──●──●─── (Development)
             ↑  ↑  ↑       ↑  ↑          ↑  ↑
             │  │  │       │  │          │  │
feature ─────●  │  │       ●  │          ●  │    (Feature branches)
fix ────────────●  │          │             │    (Bug fixes)
hotfix ────────────●──────────●─────────────●    (Emergency fixes)
```

### 1.2. Branch Pendukung

| Branch Type | Naming Convention  | Base      | Merge To           | Contoh                     |
| ----------- | ------------------ | --------- | ------------------ | -------------------------- |
| **Feature** | `feat/<nama>`      | `develop` | `develop`          | `feat/loan-approval`       |
| **Bug Fix** | `fix/<nama>`       | `develop` | `develop`          | `fix/asset-status-bug`     |
| **Hotfix**  | `hotfix/<nama>`    | `main`    | `main` & `develop` | `hotfix/critical-auth-fix` |
| **Release** | `release/v<x.y.z>` | `develop` | `main` & `develop` | `release/v1.2.0`           |

### 1.3. Branch Protection Rules

#### Branch: `main`

```yaml
# GitHub Settings > Branches > Branch protection rules
Branch name pattern: main

Rules:
  ✅ Require a pull request before merging
    ✅ Require approvals: 1
    ✅ Dismiss stale pull request approvals when new commits are pushed
  ✅ Require status checks to pass before merging
    ✅ Require branches to be up to date before merging
    Required checks:
      - build
      - test
      - lint
  ✅ Require conversation resolution before merging
  ✅ Do not allow bypassing the above settings
  ❌ Allow force pushes (DISABLED)
  ❌ Allow deletions (DISABLED)
```

#### Branch: `develop`

```yaml
Branch name pattern: develop

Rules:
  ✅ Require a pull request before merging
    ✅ Require approvals: 1
  ✅ Require status checks to pass before merging
    Required checks:
      - build
      - test
  ❌ Do not allow bypassing (allow for maintainers)
```

---

## 2. Development Workflow

### 2.1. Feature Development Flow

```bash
# 1. Pastikan develop up-to-date
git checkout develop
git pull origin develop

# 2. Buat feature branch
git checkout -b feat/nama-fitur

# 3. Lakukan development, commit secara berkala
git add .
git commit -m "feat(scope): deskripsi perubahan"

# 4. Push ke remote
git push -u origin feat/nama-fitur

# 5. Buat Pull Request ke develop (via GitHub)

# 6. Setelah approved & merged, hapus branch lokal
git checkout develop
git pull origin develop
git branch -d feat/nama-fitur
```

### 2.2. Bug Fix Flow

```bash
# 1. Buat fix branch dari develop
git checkout develop
git pull origin develop
git checkout -b fix/nama-bug

# 2. Fix the bug, commit
git add .
git commit -m "fix(scope): deskripsi perbaikan"

# 3. Push & create PR ke develop
git push -u origin fix/nama-bug
```

### 2.3. Hotfix Flow (Emergency Production Fix)

```bash
# 1. Buat hotfix branch dari main
git checkout main
git pull origin main
git checkout -b hotfix/critical-fix

# 2. Fix the issue
git add .
git commit -m "hotfix(auth): fix critical security vulnerability"

# 3. Push & create PR ke MAIN
git push -u origin hotfix/critical-fix

# 4. Setelah merged ke main, JUGA merge ke develop
git checkout develop
git pull origin develop
git merge main
git push origin develop
```

### 2.4. Release Flow

```bash
# 1. Buat release branch dari develop
git checkout develop
git pull origin develop
git checkout -b release/v1.2.0

# 2. Update version numbers, changelog, final testing
# Edit package.json, CHANGELOG.md, dll

git add .
git commit -m "chore(release): prepare v1.2.0"

# 3. Create PR ke main
git push -u origin release/v1.2.0

# 4. Setelah merged ke main, tag the release
git checkout main
git pull origin main
git tag -a v1.2.0 -m "Release v1.2.0"
git push origin v1.2.0

# 5. Merge back ke develop
git checkout develop
git merge main
git push origin develop
```

---

## 3. Commit Convention

### 3.1. Format Commit Message

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### 3.2. Types

| Type       | Deskripsi                    | Contoh                                      |
| ---------- | ---------------------------- | ------------------------------------------- |
| `feat`     | Fitur baru                   | `feat(auth): add two-factor authentication` |
| `fix`      | Bug fix                      | `fix(asset): correct stock calculation`     |
| `docs`     | Dokumentasi                  | `docs(api): update endpoint reference`      |
| `style`    | Formatting (no logic change) | `style(ui): fix button alignment`           |
| `refactor` | Code refactoring             | `refactor(store): simplify asset store`     |
| `perf`     | Performance improvement      | `perf(query): optimize asset list query`    |
| `test`     | Adding/fixing tests          | `test(auth): add login unit tests`          |
| `chore`    | Maintenance tasks            | `chore(deps): update dependencies`          |
| `ci`       | CI/CD changes                | `ci(deploy): add docker build step`         |
| `hotfix`   | Emergency production fix     | `hotfix(auth): fix critical login bug`      |

### 3.3. Scopes (Optional)

| Scope      | Area             |
| ---------- | ---------------- |
| `auth`     | Authentication   |
| `asset`    | Asset management |
| `request`  | Request system   |
| `handover` | Handover module  |
| `user`     | User management  |
| `ui`       | UI components    |
| `api`      | API layer        |
| `store`    | State management |
| `db`       | Database         |
| `deploy`   | Deployment       |

---

## 4. Pull Request Guidelines

### 4.1. PR Title Format

```
<type>(<scope>): <short description>

Examples:
feat(asset): add bulk import functionality
fix(request): resolve approval workflow bug
docs(api): update authentication endpoints
```

### 4.2. PR Description Template

```markdown
## Deskripsi

<!-- Jelaskan perubahan yang dilakukan -->

## Jenis Perubahan

- [ ] 🚀 Feature baru
- [ ] 🐛 Bug fix
- [ ] 📝 Dokumentasi
- [ ] 🔧 Refactoring
- [ ] ⚡ Performance improvement
- [ ] 🔥 Hotfix

## Related Issues

<!-- Link ke issue terkait -->

Closes #123

## Screenshots (jika ada perubahan UI)

<!-- Tambahkan screenshot -->

## Checklist

- [ ] Code mengikuti coding standards
- [ ] Self-review sudah dilakukan
- [ ] Dokumentasi diupdate (jika perlu)
- [ ] Tests ditambahkan/diupdate
- [ ] Tidak ada console.log/debug code
- [ ] Tidak ada breaking changes (atau sudah didokumentasikan)

## Testing Steps

1. Checkout branch ini
2. Jalankan `pnpm install`
3. Jalankan `pnpm dev`
4. Buka halaman X dan lakukan Y
5. Hasil yang diharapkan: Z
```

### 4.3. PR Merge Strategy

| Target Branch | Merge Method         | Alasan                              |
| ------------- | -------------------- | ----------------------------------- |
| `develop`     | **Squash and merge** | Clean history, 1 commit per feature |
| `main`        | **Merge commit**     | Preserve full history for audit     |

---

## 5. CI/CD Pipeline

### 5.1. GitHub Actions Workflow Structure

```
.github/
└── workflows/
    ├── ci.yml              # Continuous Integration (all branches)
    ├── deploy-staging.yml  # Deploy to staging (develop branch)
    └── deploy-production.yml # Deploy to production (main branch)
```

### 5.2. CI Workflow (ci.yml)

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  # ============================================
  # Build & Test Frontend
  # ============================================
  frontend:
    name: Frontend CI
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./frontend

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "pnpm"
          cache-dependency-path: ./frontend/pnpm-lock.yaml

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Type check
        run: pnpm typecheck

      - name: Run tests
        run: pnpm test --coverage

      - name: Build
        run: pnpm build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: frontend-dist
          path: ./frontend/dist
          retention-days: 7

  # ============================================
  # Build & Test Backend
  # ============================================
  backend:
    name: Backend CI
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./backend

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "pnpm"
          cache-dependency-path: ./backend/pnpm-lock.yaml

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Run tests
        run: pnpm test

      - name: Build
        run: pnpm build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: backend-dist
          path: ./backend/dist
          retention-days: 7
```

### 5.3. Production Deployment (deploy-production.yml)

```yaml
# .github/workflows/deploy-production.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch: # Manual trigger

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # ============================================
  # Build Docker Images
  # ============================================
  build-and-push:
    name: Build & Push Docker Images
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    outputs:
      frontend-image: ${{ steps.meta-frontend.outputs.tags }}
      backend-image: ${{ steps.meta-backend.outputs.tags }}

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      # Frontend Image
      - name: Extract metadata (Frontend)
        id: meta-frontend
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}/frontend
          tags: |
            type=sha,prefix=
            type=raw,value=latest

      - name: Build and push Frontend
        uses: docker/build-push-action@v5
        with:
          context: ./frontend
          file: ./frontend/Dockerfile
          push: true
          tags: ${{ steps.meta-frontend.outputs.tags }}
          labels: ${{ steps.meta-frontend.outputs.labels }}

      # Backend Image
      - name: Extract metadata (Backend)
        id: meta-backend
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}/backend
          tags: |
            type=sha,prefix=
            type=raw,value=latest

      - name: Build and push Backend
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          file: ./backend/Dockerfile
          push: true
          tags: ${{ steps.meta-backend.outputs.tags }}
          labels: ${{ steps.meta-backend.outputs.labels }}

  # ============================================
  # Deploy to Production VM
  # ============================================
  deploy:
    name: Deploy to Production
    needs: build-and-push
    runs-on: ubuntu-latest
    environment: production

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup SSH Key
        uses: webfactory/ssh-agent@v0.8.0
        with:
          ssh-private-key: ${{ secrets.VM_SSH_PRIVATE_KEY }}

      - name: Add VM to known hosts
        run: |
          mkdir -p ~/.ssh
          ssh-keyscan -H ${{ secrets.VM_HOST }} >> ~/.ssh/known_hosts

      - name: Deploy to VM
        env:
          VM_HOST: ${{ secrets.VM_HOST }}
          VM_USER: ${{ secrets.VM_USER }}
          DEPLOY_PATH: ${{ secrets.DEPLOY_PATH }}
        run: |
          ssh $VM_USER@$VM_HOST << 'ENDSSH'
            cd $DEPLOY_PATH
            
            # Pull latest images
            docker compose pull
            
            # Stop and recreate containers
            docker compose down
            docker compose up -d
            
            # Cleanup old images
            docker image prune -af --filter "until=168h"
            
            # Health check
            sleep 10
            curl -f http://localhost:3000/health || exit 1
            
            echo "✅ Deployment successful!"
          ENDSSH

      - name: Notify on success
        if: success()
        run: |
          echo "🚀 Production deployment completed successfully!"
          # Add Slack/Discord/Email notification here

      - name: Notify on failure
        if: failure()
        run: |
          echo "❌ Production deployment failed!"
          # Add alert notification here
```

---

## 6. Docker Configuration

### 6.1. Frontend Dockerfile

```dockerfile
# frontend/Dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8 --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm build

# Stage 2: Production
FROM nginx:alpine AS production

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

### 6.2. Frontend Nginx Config

```nginx
# frontend/nginx.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript
               application/javascript application/json application/xml;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing - redirect all to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

### 6.3. Backend Dockerfile

```dockerfile
# backend/Dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8 --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client
RUN pnpm prisma generate

# Build application
RUN pnpm build

# Prune dev dependencies
RUN pnpm prune --prod

# Stage 2: Production
FROM node:20-alpine AS production

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Copy built application
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Start with dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]
```

### 6.4. Docker Compose (Production)

```yaml
# docker-compose.yml
version: "3.8"

services:
  # ============================================
  # Frontend (Nginx + React SPA)
  # ============================================
  frontend:
    image: ghcr.io/your-org/trinity-asset-flow/frontend:latest
    container_name: trinity-frontend
    restart: unless-stopped
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - trinity-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s

  # ============================================
  # Backend (NestJS API)
  # ============================================
  backend:
    image: ghcr.io/your-org/trinity-asset-flow/backend:latest
    container_name: trinity-backend
    restart: unless-stopped
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
      - JWT_EXPIRATION=${JWT_EXPIRATION:-7d}
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - trinity-network
    healthcheck:
      test:
        [
          "CMD",
          "node",
          "-e",
          "require('http').get('http://localhost:3001/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))",
        ]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 30s

  # ============================================
  # PostgreSQL Database
  # ============================================
  postgres:
    image: postgres:16-alpine
    container_name: trinity-db
    restart: unless-stopped
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-scripts:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"
    networks:
      - trinity-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s

  # ============================================
  # Nginx Reverse Proxy (Optional - untuk HTTPS)
  # ============================================
  nginx-proxy:
    image: nginx:alpine
    container_name: trinity-proxy
    restart: unless-stopped
    ports:
      - "443:443"
    volumes:
      - ./nginx/proxy.conf:/etc/nginx/conf.d/default.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
      - backend
    networks:
      - trinity-network

networks:
  trinity-network:
    driver: bridge

volumes:
  postgres_data:
```

### 6.5. Environment File Template

```bash
# .env.production.example
# Copy to .env and fill in values

# Database
POSTGRES_USER=trinity_admin
POSTGRES_PASSWORD=<STRONG_PASSWORD_HERE>
POSTGRES_DB=trinity_assetflow
DATABASE_URL=postgresql://trinity_admin:<PASSWORD>@postgres:5432/trinity_assetflow

# JWT
JWT_SECRET=<GENERATE_SECURE_SECRET>
JWT_EXPIRATION=7d

# Application
NODE_ENV=production
API_URL=https://api.yourdomain.com

# Optional: External Services
# SMTP_HOST=smtp.example.com
# SMTP_PORT=587
# SMTP_USER=noreply@example.com
# SMTP_PASS=<PASSWORD>
```

---

## 7. VM Deployment Setup

### 7.1. Initial VM Setup Script

```bash
#!/bin/bash
# scripts/vm-setup.sh
# Run once on fresh VM

set -e

echo "🚀 Setting up Trinity Asset Flow Production Server..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Create deployment directory
sudo mkdir -p /opt/trinity-assetflow
sudo chown $USER:$USER /opt/trinity-assetflow

# Setup firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Create systemd service for auto-start
sudo tee /etc/systemd/system/trinity-assetflow.service << EOF
[Unit]
Description=Trinity Asset Flow Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/trinity-assetflow
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable trinity-assetflow

echo "✅ VM setup complete!"
echo "📝 Next steps:"
echo "   1. Copy docker-compose.yml to /opt/trinity-assetflow/"
echo "   2. Create .env file with production secrets"
echo "   3. Run: docker compose up -d"
```

### 7.2. GitHub Secrets Required

| Secret Name          | Description                | Example                  |
| -------------------- | -------------------------- | ------------------------ |
| `VM_HOST`            | Production VM IP/hostname  | `192.168.1.100`          |
| `VM_USER`            | SSH user                   | `deploy`                 |
| `VM_SSH_PRIVATE_KEY` | SSH private key            | `-----BEGIN OPENSSH...`  |
| `DEPLOY_PATH`        | Deployment directory       | `/opt/trinity-assetflow` |
| `DATABASE_URL`       | Database connection string | `postgresql://...`       |
| `JWT_SECRET`         | JWT signing secret         | `your-256-bit-secret`    |

### 7.3. Setting Up Deploy User on VM

```bash
# On VM, create deploy user
sudo adduser deploy
sudo usermod -aG docker deploy

# Setup SSH key authentication
sudo mkdir -p /home/deploy/.ssh
sudo chmod 700 /home/deploy/.ssh

# Add GitHub Actions public key
echo "ssh-rsa AAAA..." | sudo tee /home/deploy/.ssh/authorized_keys
sudo chmod 600 /home/deploy/.ssh/authorized_keys
sudo chown -R deploy:deploy /home/deploy/.ssh

# Give deploy user access to deployment directory
sudo chown -R deploy:deploy /opt/trinity-assetflow
```

---

## 8. Deployment Checklist

### 8.1. Pre-Deployment

- [ ] All tests passing on CI
- [ ] Code reviewed and approved
- [ ] CHANGELOG updated
- [ ] Version bumped in package.json
- [ ] Database migrations ready
- [ ] Environment variables configured
- [ ] Backup database (if production)

### 8.2. Deployment

- [ ] PR merged to `main`
- [ ] CI/CD pipeline triggered
- [ ] Docker images built successfully
- [ ] Images pushed to registry
- [ ] VM deployment successful
- [ ] Health checks passing

### 8.3. Post-Deployment

- [ ] Smoke test on production
- [ ] Monitor logs for errors
- [ ] Check application metrics
- [ ] Verify critical user flows
- [ ] Tag release in Git
- [ ] Update release notes

---

## 9. Rollback Procedure

### 9.1. Quick Rollback

```bash
# SSH to VM
ssh deploy@your-vm

# Navigate to deployment directory
cd /opt/trinity-assetflow

# Rollback to previous image
docker compose down
docker compose pull ghcr.io/your-org/trinity-asset-flow/frontend:<previous-sha>
docker compose pull ghcr.io/your-org/trinity-asset-flow/backend:<previous-sha>
docker compose up -d

# Verify health
docker compose ps
docker compose logs -f
```

### 9.2. Database Rollback (if needed)

```bash
# Restore from backup
docker exec trinity-db psql -U trinity_admin -d trinity_assetflow < backup.sql

# Or run Prisma migration rollback
docker exec trinity-backend npx prisma migrate reset
```

---

## 10. Quick Reference

### Git Commands Cheatsheet

```bash
# Start new feature
git checkout develop && git pull
git checkout -b feat/my-feature

# Push feature
git push -u origin feat/my-feature

# Update feature branch with latest develop
git checkout feat/my-feature
git rebase origin/develop

# Create hotfix
git checkout main && git pull
git checkout -b hotfix/critical-fix

# After hotfix merged to main, sync develop
git checkout develop
git merge main
git push origin develop
```

### Docker Commands Cheatsheet

```bash
# View running containers
docker compose ps

# View logs
docker compose logs -f [service]

# Restart service
docker compose restart [service]

# Full rebuild
docker compose down
docker compose build --no-cache
docker compose up -d

# Cleanup
docker system prune -af
```
