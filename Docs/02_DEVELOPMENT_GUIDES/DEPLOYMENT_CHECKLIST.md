# Deployment Checklist

Checklist lengkap untuk memastikan aplikasi siap untuk deployment ke production.

---

## 📋 Pre-Deployment Checklist

### 1. Code Quality

- [ ] Semua tests passing (unit, integration, e2e)
- [ ] Code review selesai dan approved
- [ ] Linter errors sudah diperbaiki
- [ ] TypeScript compilation tanpa error
- [ ] No console.log atau debug code di production
- [ ] Environment variables sudah dikonfigurasi dengan benar

### 2. Security

- [ ] JWT secret sudah digenerate dengan kuat (min 64 karakter)
- [ ] Database password sudah digenerate dengan kuat
- [ ] File `.env` tidak di-commit ke repository
- [ ] CORS sudah dikonfigurasi dengan domain production
- [ ] Rate limiting sudah diaktifkan
- [ ] Security headers sudah dikonfigurasi (Helmet)
- [ ] HTTPS/TLS sudah dikonfigurasi
- [ ] Firewall rules sudah dikonfigurasi
- [ ] SSH key authentication sudah setup (disable password auth)

### 3. Database

- [ ] Database migrations sudah dijalankan
- [ ] Database seed sudah dijalankan (master data)
- [ ] Database backup strategy sudah dikonfigurasi
- [ ] Database user memiliki permission yang tepat (bukan SUPERUSER)
- [ ] Connection pooling sudah dikonfigurasi

### 4. Environment Configuration

- [ ] File `.env` sudah dibuat dari `env.example`
- [ ] Semua environment variables sudah diisi
- [ ] `NODE_ENV=production` sudah diset
- [ ] `VITE_USE_MOCK=false` untuk frontend
- [ ] API URL sudah diarahkan ke production
- [ ] Domain sudah dikonfigurasi

### 5. SSL/TLS

- [ ] SSL certificate sudah dibuat (Let's Encrypt)
- [ ] Certificate auto-renewal sudah dikonfigurasi
- [ ] Nginx SSL configuration sudah benar
- [ ] HTTP to HTTPS redirect sudah aktif

### 6. Docker & Infrastructure

- [ ] Docker images sudah di-build
- [ ] Docker Compose configuration sudah benar
- [ ] Health checks sudah dikonfigurasi
- [ ] Resource limits sudah diset
- [ ] Persistent volumes sudah dikonfigurasi
- [ ] Network configuration sudah benar

### 7. Monitoring & Logging

- [ ] Health check endpoint sudah diimplementasikan
- [ ] Logging sudah dikonfigurasi
- [ ] Error tracking sudah setup (jika ada)
- [ ] Monitoring sudah dikonfigurasi (jika ada)

### 8. Backup & Recovery

- [ ] Backup script sudah dibuat
- [ ] Backup automation sudah dikonfigurasi (cron)
- [ ] Backup storage sudah dikonfigurasi
- [ ] Restore procedure sudah ditest
- [ ] Backup encryption sudah dikonfigurasi

### 9. Documentation

- [ ] Deployment documentation sudah lengkap
- [ ] Runbook sudah dibuat
- [ ] Troubleshooting guide sudah dibuat
- [ ] Contact information sudah tersedia

---

## 🚀 Deployment Steps

### Step 1: Pre-Deployment

- [ ] Notify team tentang deployment schedule
- [ ] Backup database existing (jika upgrade)
- [ ] Review deployment plan
- [ ] Prepare rollback plan

### Step 2: Server Preparation

- [ ] Server sudah siap (VM created, OS installed)
- [ ] Docker & Docker Compose sudah terinstall
- [ ] Firewall sudah dikonfigurasi
- [ ] SSL certificate sudah dibuat
- [ ] Domain sudah diarahkan ke server IP

### Step 3: Code Deployment

- [ ] Clone/upload source code ke server
- [ ] Copy `.env` file ke server
- [ ] Update `nginx.conf` dengan domain yang benar
- [ ] Build Docker images
- [ ] Run database migrations
- [ ] Seed master data

### Step 4: Start Services

- [ ] Start Docker containers
- [ ] Verify semua containers running
- [ ] Check health endpoints
- [ ] Verify database connection
- [ ] Test API endpoints

### Step 5: Verification

- [ ] Test login functionality
- [ ] Test critical user flows
- [ ] Verify SSL certificate
- [ ] Check error logs
- [ ] Verify notifications working

### Step 6: Post-Deployment

- [ ] Monitor application logs
- [ ] Monitor resource usage
- [ ] Verify backup running
- [ ] Update documentation
- [ ] Notify team deployment complete

---

## 🔄 Rollback Procedure

Jika deployment gagal:

1. **Stop new containers**
   ```bash
   docker compose down
   ```

2. **Restore database** (jika perlu)
   ```bash
   # Restore from backup
   gunzip -c backup.sql.gz | docker compose exec -T db psql -U user -d dbname
   ```

3. **Start previous version**
   ```bash
   # Checkout previous version
   git checkout <previous-commit>
   docker compose up -d --build
   ```

4. **Verify rollback**
   - Test critical functionality
   - Check logs for errors

---

## ✅ Post-Deployment Verification

### Functional Testing

- [ ] User bisa login
- [ ] User bisa membuat request
- [ ] Admin bisa approve request
- [ ] Asset registration berfungsi
- [ ] Handover berfungsi
- [ ] Dismantle berfungsi
- [ ] Maintenance reporting berfungsi
- [ ] Notifications terkirim

### Performance Testing

- [ ] Page load time < 3 detik
- [ ] API response time < 500ms (p95)
- [ ] Database query time acceptable
- [ ] No memory leaks
- [ ] No CPU spikes

### Security Testing

- [ ] HTTPS enforced
- [ ] Security headers present
- [ ] CORS working correctly
- [ ] Authentication required for protected routes
- [ ] Authorization working correctly

---

## 📊 Monitoring Checklist

### Immediate (First 24 Hours)

- [ ] Monitor error logs setiap 1 jam
- [ ] Monitor resource usage (CPU, RAM, disk)
- [ ] Monitor database performance
- [ ] Check user feedback
- [ ] Monitor API response times

### Daily (First Week)

- [ ] Review error logs daily
- [ ] Check backup success
- [ ] Monitor user activity
- [ ] Review performance metrics

### Weekly

- [ ] Review security logs
- [ ] Check for failed login attempts
- [ ] Review user access patterns
- [ ] Update documentation if needed

---

## 🆘 Emergency Contacts

- **DevOps Team**: [contact]
- **Development Team**: [contact]
- **Database Admin**: [contact]
- **Infrastructure Team**: [contact]

---

## 📝 Deployment Log Template

```
Deployment Date: [DATE]
Deployed By: [NAME]
Version: [VERSION/TAG]
Environment: Production

Pre-Deployment:
- [ ] Checklist completed
- [ ] Backup created
- [ ] Team notified

Deployment:
- [ ] Code deployed
- [ ] Migrations run
- [ ] Services started
- [ ] Health checks passed

Post-Deployment:
- [ ] Verification completed
- [ ] Monitoring active
- [ ] Issues: [LIST ANY ISSUES]

Rollback Plan: [DESCRIBE IF NEEDED]
```

---

**Last Updated**: 2025-01-XX

