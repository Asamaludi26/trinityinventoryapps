# Panduan Pengguna: Super Admin

Panduan lengkap untuk pengguna dengan peran **Super Admin** dalam menggunakan Aplikasi Inventori Aset. Super Admin memiliki akses penuh ke semua fitur aplikasi.

---

## 📋 Daftar Isi

1. [Memulai](#1-memulai)
2. [Dashboard Super Admin](#2-dashboard-super-admin)
3. [Manajemen Pengguna](#3-manajemen-pengguna)
4. [Manajemen Divisi](#4-manajemen-divisi)
5. [CEO Approval](#5-ceo-approval)
6. [Laporan & Analitik](#6-laporan--analitik)
7. [Pengaturan Sistem](#7-pengaturan-sistem)
8. [FAQ](#8-faq)

---

## 1. Memulai

### 1.1. Login

1. Buka aplikasi melalui browser
2. Masukkan **email** dan **password** Super Admin
3. Setelah login, Anda akan melihat **Dashboard Super Admin** dengan akses penuh

### 1.2. Hak Akses Super Admin

Super Admin memiliki akses ke **SEMUA** fitur aplikasi:
- ✅ Semua fitur Admin Logistik
- ✅ Semua fitur Admin Purchase
- ✅ Manajemen Pengguna & Divisi
- ✅ CEO Approval untuk request bernilai tinggi
- ✅ Laporan & Analitik lengkap
- ✅ Pengaturan sistem
- ✅ Disposisi & Update Progress

---

## 2. Dashboard Super Admin

Dashboard Super Admin menampilkan:

### 2.1. Executive Summary
- **Total Aset**: Jumlah total aset di sistem
- **Total Nilai Aset**: Total nilai finansial semua aset
- **Aset di Stok**: Jumlah aset tersedia
- **Aset Sedang Digunakan**: Jumlah aset aktif
- **Aset Rusak**: Jumlah aset yang perlu perbaikan

### 2.2. Financial Overview
- **Total Pengeluaran**: Total pengeluaran untuk pembelian aset
- **Pengeluaran Bulan Ini**: Pengeluaran bulan berjalan
- **Trend Pengeluaran**: Grafik trend pengeluaran

### 2.3. Operational Metrics
- **Pending Requests**: Request yang menunggu approval
- **Low Stock Alerts**: Aset dengan stok rendah
- **Warranty Expiring**: Aset dengan warranty akan habis
- **Maintenance Pending**: Perbaikan yang perlu ditindaklanjuti

### 2.4. Action Items
- **Perlu Persetujuan CEO**: Request dengan nilai > Rp 10M
- **Disposisi**: Request yang perlu disposisi
- **Update Progress**: Request yang perlu update progress

---

## 3. Manajemen Pengguna

### 3.1. Menambah Pengguna Baru

1. **Buka halaman Manajemen Pengguna**
   - Klik menu **"Pengaturan"** > **"Pengguna"** di sidebar

2. **Klik "Tambah Pengguna"**

3. **Isi Form**:
   - **Email**: (Wajib) Email unik untuk login
   - **Password**: (Wajib) Password minimal 8 karakter
   - **Nama Lengkap**: (Wajib)
   - **Role**: Pilih role (Staff, Leader, Admin Logistik, Admin Purchase, Super Admin)
   - **Divisi**: Pilih divisi pengguna

4. **Simpan**
   - User baru akan dibuat
   - Email dan password akan dikirim ke user (jika fitur email aktif)

### 3.2. Mengedit Pengguna

1. **Buka Detail Pengguna**
   - Klik pada user di daftar

2. **Klik "Edit"**

3. **Update Data**:
   - Bisa mengubah nama, role, divisi
   - Bisa reset password
   - Bisa mengaktifkan/nonaktifkan user

4. **Simpan**

### 3.3. Menghapus Pengguna

1. **Buka Detail Pengguna**
2. **Klik "Hapus"**
3. **Konfirmasi Penghapusan**
   - User akan di-soft delete
   - Data user tetap tersimpan untuk audit
   - User tidak bisa login lagi

### 3.4. Reset Password

1. **Buka Detail Pengguna**
2. **Klik "Reset Password"**
3. **Generate Password Baru** atau **Set Password Manual**
4. **Kirim Password ke User** (jika fitur email aktif)

---

## 4. Manajemen Divisi

### 4.1. Menambah Divisi Baru

1. **Buka halaman Manajemen Divisi**
   - Klik menu **"Pengaturan"** > **"Divisi"** di sidebar

2. **Klik "Tambah Divisi"**

3. **Isi Form**:
   - **Nama Divisi**: (Wajib) Contoh: "Network Engineering", "HR & GA"

4. **Simpan**

### 4.2. Mengedit Divisi

1. **Buka Detail Divisi**
   - Klik pada divisi di daftar

2. **Klik "Edit"**

3. **Update Nama Divisi**

4. **Simpan**

### 4.3. Menghapus Divisi

1. **Buka Detail Divisi**
2. **Klik "Hapus"**
3. **Konfirmasi**
   - **PENTING**: Divisi tidak bisa dihapus jika masih memiliki anggota
   - Pindahkan semua anggota ke divisi lain terlebih dahulu

---

## 5. CEO Approval

**Fitur ini khusus untuk Super Admin untuk memberikan persetujuan final pada request dengan nilai tinggi.**

### 5.1. Request yang Memerlukan CEO Approval

Request dengan **Total Value > Rp 10.000.000** akan otomatis masuk ke status **"AWAITING_CEO_APPROVAL"** setelah disetujui Admin Purchase.

### 5.2. Proses Approval

1. **Notifikasi akan muncul** di Dashboard
2. **Buka Detail Request**
   - Dari notifikasi atau halaman Request Aset
   - Filter status: **"AWAITING_CEO_APPROVAL"**

3. **Review Request**:
   - Cek total value
   - Review semua items
   - Cek justifikasi/project (jika ada)
   - Review approval history

4. **Decision**:
   - **Approve**: Klik **"Setujui Final"**
     - Request akan berubah status menjadi **"APPROVED"**
     - Admin Purchase bisa lanjut proses pengadaan
   - **Reject**: Klik **"Tolak"**
     - Isi alasan penolakan
     - Request akan berubah status menjadi **"REJECTED"**
     - Requester akan menerima notifikasi

### 5.3. Disposisi Request

Jika request memerlukan informasi tambahan atau revisi:

1. **Buka Detail Request**
2. **Klik "Disposisi"**
3. **Isi Form**:
   - **Pilih Tujuan**: Admin Logistik, Admin Purchase, atau Requester
   - **Pesan**: Instruksi atau permintaan informasi
4. **Kirim Disposisi**
   - User yang dituju akan menerima notifikasi
   - Request tetap dalam status **"AWAITING_CEO_APPROVAL"** hingga CEO approve/reject

---

## 6. Laporan & Analitik

### 6.1. Laporan Aset

1. **Buka halaman Laporan**
   - Klik menu **"Laporan"** di sidebar (jika tersedia)
   - Atau dari Dashboard, klik widget laporan

2. **Pilih Jenis Laporan**:
   - **Laporan Aset per Status**: Distribusi aset berdasarkan status
   - **Laporan Aset per Kategori**: Distribusi aset berdasarkan kategori
   - **Laporan Nilai Aset**: Total nilai aset per kategori/divisi
   - **Laporan Aset per Divisi**: Aset yang digunakan per divisi

3. **Filter & Export**:
   - Pilih periode (bulan/tahun)
   - Filter berdasarkan kategori, divisi, status
   - Klik **"Export"** untuk download CSV/PDF

### 6.2. Laporan Pengeluaran

1. **Buka Laporan Pengeluaran**
2. **Pilih Periode**: Bulan, Quarter, atau Tahun
3. **View Grafik**: Trend pengeluaran, breakdown per kategori
4. **Export**: Download laporan detail

### 6.3. Laporan Request

1. **Laporan Request per Status**: Jumlah request per status
2. **Laporan Approval Time**: Rata-rata waktu approval
3. **Laporan Request per Divisi**: Request yang dibuat per divisi

### 6.4. Analitik Dashboard

Dashboard Super Admin menampilkan:
- **Asset Matrix**: Grid view aset per kategori dan status
- **Category Bar Chart**: Distribusi aset per kategori
- **Spending Trend**: Grafik trend pengeluaran
- **Technician Leaderboard**: Ranking teknisi berdasarkan aktivitas

---

## 7. Pengaturan Sistem

### 7.1. Pengaturan Approval Limits

1. **Buka Pengaturan Sistem**
   - Menu **"Pengaturan"** > **"Sistem"** (jika tersedia)

2. **CEO Approval Threshold**:
   - Set nilai minimum untuk CEO approval (default: Rp 10.000.000)
   - Bisa diubah sesuai kebijakan perusahaan

### 7.2. Pengaturan Notifikasi

1. **WhatsApp Notifications**:
   - Enable/disable notifikasi WhatsApp
   - Konfigurasi grup WhatsApp

2. **Email Notifications**:
   - Enable/disable notifikasi email
   - Konfigurasi SMTP

### 7.3. Backup & Maintenance

1. **Manual Backup**:
   - Klik **"Backup Database"** (jika fitur tersedia)
   - Download file backup

2. **System Maintenance**:
   - Schedule maintenance window
   - Notifikasi user sebelum maintenance

---

## 8. FAQ

### Q: Bagaimana cara melihat semua aktivitas user?

**A**: 
1. Buka detail user
2. Tab **"Aktivitas"** menampilkan semua aktivitas user:
   - Request yang dibuat
   - Aset yang dipinjam
   - Approval yang diberikan
   - Perubahan data

### Q: Bisakah saya mengubah role user?

**A**: 
Ya, sebagai Super Admin Anda bisa mengubah role user:
1. Buka detail user
2. Klik "Edit"
3. Pilih role baru
4. Simpan

**PENTING**: Pastikan user yang diubah role memahami perubahan akses mereka.

### Q: Apa yang harus saya lakukan jika ada request yang stuck di status tertentu?

**A**: 
1. Buka detail request
2. Cek history approval
3. Identifikasi di mana proses terhenti
4. Gunakan fitur **"Disposisi"** untuk meminta update
5. Atau **"Force Update Status"** (jika fitur tersedia) untuk manual update

### Q: Bagaimana cara melihat laporan keuangan lengkap?

**A**: 
1. Buka halaman **"Laporan"** > **"Pengeluaran"**
2. Pilih periode yang diinginkan
3. Filter sesuai kebutuhan
4. Export ke Excel/PDF untuk analisis lebih lanjut

### Q: Bisakah saya melihat audit trail lengkap?

**A**: 
Ya, semua aktivitas penting tercatat di ActivityLog:
1. Buka detail aset/request/user
2. Tab **"History"** atau **"Activity Log"** menampilkan semua perubahan
3. Atau gunakan fitur **"Audit Trail"** di menu (jika tersedia)

---

## 📞 Bantuan

Jika Anda mengalami kesulitan:

1. **Cek FAQ** di atas
2. **Review dokumentasi** di folder Docs
3. **Hubungi Development Team** untuk masalah teknis atau fitur baru

---

**Last Updated**: 2025-01-XX

