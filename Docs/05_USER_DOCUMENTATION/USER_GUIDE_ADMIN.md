# Panduan Pengguna: Admin Logistik & Admin Purchase

Panduan lengkap untuk pengguna dengan peran **Admin Logistik** dan **Admin Purchase** dalam menggunakan Aplikasi Inventori Aset.

---

## 📋 Daftar Isi

1. [Memulai](#1-memulai)
2. [Dashboard Admin](#2-dashboard-admin)
3. [Mengelola Request Aset](#3-mengelola-request-aset)
4. [Registrasi Aset](#4-registrasi-aset)
5. [Mengelola Peminjaman](#5-mengelola-peminjaman)
6. [Mengelola Pelanggan](#6-mengelola-pelanggan)
7. [Mengelola Perbaikan](#7-mengelola-perbaikan)
8. [Mengelola Kategori & Tipe Aset](#8-mengelola-kategori--tipe-aset)
9. [FAQ](#9-faq)

---

## 1. Memulai

### 1.1. Login

1. Buka aplikasi melalui browser Anda
2. Masukkan **email** dan **password** admin
3. Setelah login, Anda akan melihat **Dashboard Admin** dengan lebih banyak fitur

### 1.2. Perbedaan Admin Logistik & Admin Purchase

| Fitur | Admin Logistik | Admin Purchase |
|-------|----------------|----------------|
| Review & Approve Request | ✅ Level 1 | ✅ Level 2 |
| Registrasi Aset | ✅ | ❌ |
| Handover Aset | ✅ | ❌ |
| Dismantle | ✅ | ❌ |
| Input PO & Vendor | ❌ | ✅ |
| Mulai Pengadaan | ❌ | ✅ |
| Manajemen Perbaikan | ✅ | ❌ |
| Manajemen Kategori | ✅ | ✅ |

---

## 2. Dashboard Admin

Dashboard Admin menampilkan:

### 2.1. Statistik Utama
- Total Aset
- Total Nilai Aset
- Aset di Stok
- Aset Sedang Digunakan
- Aset Rusak

### 2.2. Item Perlu Tindakan
- **Perlu Persetujuan**: Request yang menunggu approval Anda
- **Siap Dicatat**: Request dengan status ARRIVED yang perlu diregistrasi
- **Aset Rusak**: Aset yang dilaporkan rusak dan perlu ditindaklanjuti
- **Dismantle Pending**: Dismantle yang menunggu konfirmasi gudang

### 2.3. Grafik & Analitik
- Distribusi Aset per Status
- Distribusi Aset per Kategori
- Trend Pengeluaran
- Leaderboard Teknisi

---

## 3. Mengelola Request Aset

### 3.1. Review & Approve Request

**Untuk Admin Logistik (Level 1 Approval):**

1. **Buka halaman Request Aset**
   - Klik menu **"Pusat Aset"** > **"Request Aset"**
   - Request dengan status **"PENDING"** akan muncul di bagian atas

2. **Buka Detail Request**
   - Klik pada request yang ingin di-review
   - Review semua item yang diminta

3. **Approve dengan Revisi (Opsional)**
   - Jika perlu mengurangi quantity, klik **"Edit Quantity"**
   - Masukkan **Approved Quantity** untuk setiap item
   - Tambahkan **Alasan** jika ada revisi
   - Klik **"Setujui (Logistik)"**

4. **Approve Tanpa Revisi**
   - Langsung klik **"Setujui (Logistik)"**
   - Request akan berubah status menjadi **"LOGISTIC_APPROVED"**

5. **Reject Request**
   - Klik **"Tolak"**
   - Isi **Alasan Penolakan**
   - Klik **"Konfirmasi Tolak"**

**Untuk Admin Purchase (Level 2 Approval):**

1. Request dengan status **"LOGISTIC_APPROVED"** akan muncul
2. **Cek Total Value**:
   - Jika > Rp 10.000.000 → Butuh approval Super Admin dulu
   - Jika < Rp 10.000.000 → Langsung bisa approve

3. **Input Data Pembelian**:
   - Klik **"Mulai Pengadaan"**
   - Untuk setiap item, isi:
     - **PO Number**
     - **Vendor**
     - **Price**
     - **Estimated Arrival Date**
   - Klik **"Simpan"**

4. **Update Status Pengiriman**:
   - Setelah vendor kirim, klik **"Barang Dikirim"**
   - Update **"Tanggal Pengiriman"**

### 3.2. Menandai Barang Tiba

**Hanya Admin Logistik:**

1. Buka detail request dengan status **"IN_DELIVERY"**
2. Klik **"Barang Tiba"**
3. Isi:
   - **Tanggal Tiba**
   - **Kondisi Barang** (Baik/Rusak)
   - **Catatan**
4. Klik **"Konfirmasi Tiba"**
5. Status berubah menjadi **"ARRIVED"**
6. Request siap untuk **Registrasi Aset**

---

## 4. Registrasi Aset

**Hanya Admin Logistik**

### 4.1. Registrasi dari Request

1. **Buka Request dengan Status ARRIVED**
   - Dari halaman Request Aset, klik request dengan status **"ARRIVED"**
   - Atau dari Dashboard, klik **"Siap Dicatat"**

2. **Klik "Registrasi Aset"**
   - Data dari request akan otomatis terisi (pre-fill)

3. **Isi Form Registrasi**
   - **Serial Number**: (Wajib untuk aset individual)
   - **MAC Address**: (Opsional, untuk perangkat jaringan)
   - **Brand & Model**: Sudah terisi dari request
   - **Lokasi**: Pilih lokasi penyimpanan (Gudang A/B, Rak 1/2, dll)
   - **Purchase Info**: Sudah terisi dari request
   - **Warranty End Date**: (Opsional)

4. **Generate QR Code**
   - Setelah simpan, sistem akan generate QR code
   - Klik **"Print Label"** untuk mencetak label QR code

5. **Bulk Registration** (Jika banyak aset sejenis):
   - Gunakan fitur **"Registrasi Massal"**
   - Upload CSV atau input multiple items sekaligus

### 4.2. Registrasi Manual (Tanpa Request)

1. **Buka halaman Registrasi Aset**
   - Klik menu **"Pusat Aset"** > **"Catat Aset"**

2. **Isi Form Lengkap**
   - Semua field harus diisi manual
   - Pilih Kategori, Tipe, dan Model
   - Input semua informasi aset

3. **Simpan & Generate QR Code**

---

## 5. Mengelola Peminjaman

**Hanya Admin Logistik**

### 5.1. Approve Loan Request

1. **Buka halaman Request Pinjam**
   - Klik menu **"Request Pinjam"**
   - Loan request dengan status **"PENDING"** akan muncul

2. **Review Loan Request**
   - Buka detail loan request
   - Cek tujuan peminjaman dan durasi

3. **Assign Aset**
   - Klik **"Setujui & Assign Aset"**
   - Pilih aset dari stok yang tersedia
   - Atau gunakan **Scan QR Code** untuk memilih aset
   - **PENTING**: Pastikan aset dalam status **"IN_STORAGE"**
   - Jika aset tidak tersedia, sistem akan menampilkan error

4. **Konfirmasi Assignment**
   - Review semua aset yang di-assign
   - Klik **"Konfirmasi"**
   - Sistem akan:
     - Update status aset menjadi **"IN_USE"**
     - Update status loan menjadi **"APPROVED"**
     - Create Handover document

### 5.2. Membuat Handover

1. **Setelah Approve Loan**
   - Handover document otomatis dibuat dengan status **"DRAFT"**

2. **Print Berita Acara Serah Terima (BAST)**
   - Buka detail handover
   - Klik **"Print BAST"**
   - BAST akan mencakup:
     - Detail aset yang diserahkan
     - Tanda tangan digital
     - QR code untuk tracking

3. **Konfirmasi Handover**
   - Setelah user menerima aset dan konfirmasi di sistem
   - Status handover berubah menjadi **"CONFIRMED"**

### 5.3. Menerima Pengembalian Aset

1. **Buka halaman Request Pinjam**
   - Pilih tab **"Pengembalian"**
   - Loan request dengan status **"ON_LOAN"** akan muncul

2. **Review Pengembalian**
   - Buka detail loan request
   - Cek kondisi aset yang dikembalikan
   - Review catatan dari user

3. **Konfirmasi Penerimaan**
   - Klik **"Terima Pengembalian"**
   - Verifikasi kondisi fisik aset
   - Update lokasi aset kembali ke gudang
   - Status aset berubah menjadi **"IN_STORAGE"**

---

## 6. Mengelola Pelanggan

**Admin Logistik & Admin Purchase**

### 6.1. Menambah Pelanggan Baru

1. **Buka halaman Pelanggan**
   - Klik menu **"Pelanggan"** di sidebar

2. **Klik "Tambah Pelanggan"**

3. **Isi Form**
   - **Nama Pelanggan**: (Wajib)
   - **Alamat**: (Wajib)
   - **No. Telepon**: (Wajib)
   - **Email**: (Opsional)
   - **Status**: Aktif/Non-Aktif/Suspend

4. **Simpan**

### 6.2. Mengelola Instalasi ke Pelanggan

1. **Buka Detail Pelanggan**
   - Klik pada pelanggan di daftar

2. **Klik "Tambah Instalasi"**

3. **Isi Form Instalasi**
   - **Tanggal Instalasi**
   - **Alamat Instalasi** (jika berbeda dengan alamat pelanggan)
   - **Teknisi**: Pilih teknisi yang bertugas
   - **Pilih Aset**: Pilih aset yang akan diinstall
   - **Serial Number & MAC Address**: Input jika belum terisi

4. **Simpan Instalasi**
   - Status instalasi: **"PENDING"**
   - Setelah teknisi selesai install dan konfirmasi, status berubah menjadi **"COMPLETED"**
   - Status aset berubah menjadi **"IN_USE"** dengan currentUser = Customer ID

### 6.3. Mengelola Dismantle

1. **Teknisi membuat Dismantle di lapangan**
   - Scan QR code aset
   - Input kondisi aset
   - Submit dismantle

2. **Admin Logistik menerima notifikasi**

3. **Konfirmasi Penerimaan di Gudang**
   - Buka halaman **"Dismantle"** atau dari notifikasi
   - Buka detail dismantle dengan status **"PENDING_WAREHOUSE"**
   - Verifikasi kondisi fisik aset
   - Klik **"Konfirmasi Diterima"**
   - Update lokasi aset
   - Status aset berubah menjadi **"IN_STORAGE"**

---

## 7. Mengelola Perbaikan

**Hanya Admin Logistik**

### 7.1. Menerima Laporan Kerusakan

1. **Notifikasi akan muncul** saat ada laporan kerusakan
2. **Buka detail Maintenance**
   - Dari notifikasi atau halaman **"Perbaikan"**

3. **Review Laporan**
   - Baca deskripsi kerusakan
   - Lihat foto (jika ada)
   - Cek prioritas

### 7.2. Memulai Perbaikan

1. **Pilih Tipe Perbaikan**:
   - **Perbaikan Internal**: Jika bisa diperbaiki oleh teknisi internal
   - **Kirim ke Vendor**: Jika perlu dikirim ke vendor/service center

2. **Untuk Perbaikan Internal**:
   - Klik **"Mulai Perbaikan Internal"**
   - Pilih **Teknisi** yang akan menangani
   - Input **Estimasi Biaya**
   - Input **Estimasi Waktu Selesai**
   - Status aset: **"UNDER_REPAIR"**

3. **Untuk Kirim ke Vendor**:
   - Klik **"Kirim ke Vendor"**
   - Input **Nama Vendor**
   - Input **Estimasi Biaya**
   - Input **Tanggal Estimasi Kembali**
   - Status aset: **"OUT_FOR_REPAIR"**

### 7.3. Menandai Perbaikan Selesai

1. **Buka detail Maintenance**

2. **Input Hasil Perbaikan**:
   - **Tanggal Selesai**
   - **Biaya Aktual**
   - **Catatan**: Hasil perbaikan, komponen yang diganti, dll
   - **Status Final Aset**: 
     - **IN_STORAGE**: Jika aset kembali ke gudang
     - **IN_USE**: Jika aset langsung dikembalikan ke user
     - **DECOMMISSIONED**: Jika aset tidak bisa diperbaiki

3. **Simpan**
   - Status maintenance: **"COMPLETED"**
   - Status aset akan update sesuai pilihan

---

## 8. Mengelola Kategori & Tipe Aset

**Admin Logistik & Admin Purchase**

### 8.1. Menambah Kategori Baru

1. **Buka halaman Kategori**
   - Klik menu **"Pengaturan"** > **"Kategori Aset"**

2. **Klik "Tambah Kategori"**

3. **Isi Form**:
   - **Nama Kategori**: Contoh: "Perangkat Jaringan", "Alat Kerja Lapangan"
   - **Customer Installable**: Centang jika kategori ini bisa diinstall ke customer

4. **Simpan**

### 8.2. Menambah Tipe Aset

1. **Buka Detail Kategori**
   - Klik pada kategori yang ingin ditambah tipe

2. **Klik "Tambah Tipe"**

3. **Isi Form**:
   - **Nama Tipe**: Contoh: "Router", "Switch", "Kabel UTP"
   - **Classification**: 
     - **Asset**: Untuk aset yang dilacak individual (ada serial number)
     - **Material**: Untuk material yang dilacak secara bulk (tidak ada serial number)
   - **Tracking Method**:
     - **Individual**: Setiap unit dilacak terpisah
     - **Bulk**: Dilacak berdasarkan quantity
   - **Unit of Measure**: Unit, Meter, Kg, dll

4. **Simpan**

### 8.3. Menambah Model/Item Standar

1. **Buka Detail Tipe**
   - Klik pada tipe yang ingin ditambah model

2. **Klik "Tambah Model"**

3. **Isi Form**:
   - **Nama Model**: Contoh: "MikroTik RB750", "Belden Cat6"
   - **Brand**: Merek produk
   - **Default Price**: (Opsional) Harga standar
   - **Default Vendor**: (Opsional) Vendor standar

4. **Simpan**

---

## 9. FAQ

### Q: Bagaimana cara melihat semua request yang perlu saya approve?

**A**: 
- Buka halaman **"Request Aset"**
- Filter berdasarkan status:
  - Admin Logistik: Filter **"PENDING"**
  - Admin Purchase: Filter **"LOGISTIC_APPROVED"**
- Atau gunakan widget **"Perlu Persetujuan"** di Dashboard

### Q: Apa yang harus saya lakukan jika aset tidak tersedia saat assign?

**A**: 
- Sistem akan menampilkan error **"Aset tidak tersedia"**
- Cek status aset di halaman **"Stok Aset"**
- Jika aset sedang digunakan, tunggu sampai dikembalikan
- Atau pilih aset alternatif yang tersedia

### Q: Bagaimana cara bulk registration untuk banyak aset sekaligus?

**A**: 
1. Buka halaman **"Catat Aset"**
2. Klik **"Registrasi Massal"**
3. Pilih opsi:
   - **Upload CSV**: Upload file CSV dengan format yang ditentukan
   - **Input Form Massal**: Input multiple items dalam satu form
4. Review data
5. Submit

### Q: Bisakah saya edit request yang sudah di-approve?

**A**: 
- Request yang sudah di-approve tidak bisa di-edit
- Jika perlu perubahan, reject request dan minta requester buat request baru
- Atau buat request baru dengan catatan "Revisi dari REQ-XXX"

### Q: Bagaimana cara print label QR code untuk banyak aset?

**A**: 
1. Setelah registrasi aset (bulk atau individual)
2. Klik **"Generate QR Codes"**
3. Pilih aset yang ingin di-print
4. Klik **"Print Labels"**
5. Sistem akan generate PDF dengan semua label QR code

### Q: Apa yang harus saya lakukan jika ada aset yang hilang?

**A**: 
1. Buka detail aset
2. Update status menjadi **"DECOMMISSIONED"**
3. Tambahkan catatan: "Aset hilang"
4. Create ActivityLog dengan action: "ASSET_LOST"
5. Laporkan ke Super Admin untuk approval final

---

## 📞 Bantuan

Jika Anda mengalami kesulitan:

1. **Cek FAQ** di atas
2. **Hubungi Super Admin** untuk masalah yang memerlukan otoritas lebih tinggi
3. **Hubungi IT Support** untuk masalah teknis

---

**Last Updated**: 2025-01-XX

