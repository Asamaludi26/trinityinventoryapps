# Panduan Pengguna: Staff

Panduan lengkap untuk pengguna dengan peran **Staff** dalam menggunakan Aplikasi Inventori Aset.

---

## 📋 Daftar Isi

1. [Memulai](#1-memulai)
2. [Dashboard](#2-dashboard)
3. [Membuat Request Aset](#3-membuat-request-aset)
4. [Membuat Request Pinjam](#4-membuat-request-pinjam)
5. [Melihat Aset yang Dipinjam](#5-melihat-aset-yang-dipinjam)
6. [Melaporkan Kerusakan Aset](#6-melaporkan-kerusakan-aset)
7. [Mengembalikan Aset](#7-mengembalikan-aset)
8. [FAQ](#8-faq)

---

## 1. Memulai

### 1.1. Login

1. Buka aplikasi melalui browser Anda
2. Masukkan **email** dan **password** yang telah diberikan
3. Klik tombol **"Masuk"**
4. Setelah berhasil login, Anda akan diarahkan ke **Dashboard**

### 1.2. Navigasi

- **Sidebar (Menu Kiri)**: Menu navigasi utama
  - Dashboard
  - Request Aset
  - Request Pinjam
  - Stok Aset (hanya aset yang Anda pinjam)
- **Header**: 
  - Notifikasi (ikon lonceng)
  - Scan QR Code
  - Menu Profil (nama Anda)

---

## 2. Dashboard

Dashboard menampilkan:
- **Ringkasan**: Total aset yang Anda pinjam
- **Item Perlu Tindakan**: Request yang perlu Anda follow-up
- **Aktivitas Terbaru**: Riwayat aktivitas Anda

---

## 3. Membuat Request Aset

**Fitur ini untuk mengajukan permintaan pengadaan barang/aset baru.**

### Langkah-langkah:

1. **Buka halaman Request Aset**
   - Klik menu **"Pusat Aset"** > **"Request Aset"** di sidebar
   - Atau klik **"Buat Request Baru"** dari dashboard

2. **Isi Form Request**
   - **Tanggal Request**: Otomatis terisi (hari ini)
   - **Tipe Order**: Hanya bisa memilih **"Regular Stock"** (Staff tidak bisa memilih Urgent atau Project Based)
   - **Divisi**: Otomatis terisi sesuai divisi Anda

3. **Tambah Item yang Diminta**
   - Klik tombol **"Tambah Item"**
   - Pilih **Kategori Aset** (hanya kategori yang sesuai divisi Anda)
   - Pilih **Tipe Aset**
   - Pilih **Model/Item** dari daftar standar
   - Masukkan **Quantity** (jumlah)
   - **Stok Tersedia** akan muncul otomatis
   - Klik **"Simpan Item"**
   - Ulangi untuk menambah item lain

4. **Submit Request**
   - Review semua item yang sudah ditambahkan
   - Klik tombol **"Ajukan Permintaan"**
   - Notifikasi sukses akan muncul

### Catatan Penting:

- ✅ Staff hanya bisa membuat request tipe **"Regular Stock"**
- ✅ Request akan masuk ke status **"PENDING"** dan menunggu approval dari Admin
- ✅ Anda akan menerima notifikasi saat request disetujui atau ditolak
- ✅ Anda bisa melakukan **Follow-up** jika request belum diproses dalam 3 hari

---

## 4. Membuat Request Pinjam

**Fitur ini untuk meminjam aset yang sudah ada di gudang untuk keperluan sementara.**

### Langkah-langkah:

1. **Buka halaman Request Pinjam**
   - Klik menu **"Request Pinjam"** di sidebar
   - Atau klik tab **"Request Pinjam"** di halaman Request Aset

2. **Klik "Buat Request Pinjam"**

3. **Isi Form**
   - **Tujuan Peminjaman**: Isi alasan meminjam aset
   - **Tanggal Mulai**: Tanggal mulai peminjaman
   - **Tanggal Pengembalian**: (Opsional) Tanggal rencana pengembalian

4. **Pilih Aset yang Ingin Dipinjam**
   - Klik **"Tambah Aset"**
   - Pilih dari daftar aset yang tersedia di gudang (status: IN_STORAGE)
   - Atau gunakan **Scan QR Code** untuk memilih aset
   - Masukkan **Quantity** jika aset bisa dipinjam lebih dari 1
   - Klik **"Simpan"**

5. **Submit Request**
   - Review semua aset yang dipilih
   - Klik **"Ajukan Permintaan Pinjam"**

### Setelah Request Disetujui:

- Admin akan meng-assign aset ke Anda
- Anda akan menerima notifikasi
- Aset akan muncul di halaman **"Stok Aset"** Anda
- Status aset akan berubah menjadi **"IN_USE"**

---

## 5. Melihat Aset yang Dipinjam

1. **Buka halaman Stok Aset**
   - Klik menu **"Pusat Aset"** > **"Stok Aset"** di sidebar
   - Halaman ini menampilkan semua aset yang sedang Anda pinjam

2. **Detail Aset**
   - Klik pada salah satu aset untuk melihat detail lengkap
   - Informasi yang ditampilkan:
     - ID Aset
     - Nama & Brand
     - Serial Number & MAC Address
     - Status & Kondisi
     - Tanggal Pinjam
     - History penggunaan

3. **Filter & Search**
   - Gunakan search box untuk mencari aset
   - Filter berdasarkan kategori atau status

---

## 6. Melaporkan Kerusakan Aset

**Jika aset yang Anda pinjam mengalami kerusakan, laporkan segera.**

### Langkah-langkah:

1. **Buka Detail Aset**
   - Dari halaman **"Stok Aset"**, klik pada aset yang rusak
   - Atau gunakan **Scan QR Code** untuk membuka detail aset

2. **Klik "Laporkan Kerusakan"**
   - Tombol dengan ikon kunci pas (🔧)

3. **Isi Form Laporan**
   - **Jenis Kerusakan**: Pilih jenis kerusakan
   - **Deskripsi**: Jelaskan detail kerusakan secara lengkap
   - **Foto**: (Opsional) Upload foto kerusakan untuk bukti
   - **Prioritas**: Pilih tingkat prioritas (Rendah/Sedang/Tinggi)

4. **Submit Laporan**
   - Klik **"Kirim Laporan"**
   - Notifikasi sukses akan muncul
   - Admin akan menerima notifikasi dan menindaklanjuti

### Setelah Laporan Dikirim:

- Status aset akan berubah menjadi **"DAMAGED"**
- Admin akan memproses perbaikan
- Anda akan menerima update melalui notifikasi

---

## 7. Mengembalikan Aset

**Mengembalikan aset yang sudah selesai digunakan.**

### Langkah-langkah:

1. **Buka halaman Request Pinjam**
   - Klik menu **"Request Pinjam"** di sidebar
   - Pilih tab **"Pengembalian"**

2. **Pilih Loan Request**
   - Klik pada loan request yang ingin dikembalikan
   - Atau gunakan **Scan QR Code** aset untuk langsung ke form return

3. **Isi Form Pengembalian**
   - **Kondisi Aset**: Pilih kondisi saat dikembalikan (Baik/Rusak Ringan/Rusak Berat)
   - **Catatan**: (Opsional) Tambahkan catatan jika ada
   - **Foto**: (Opsional) Upload foto kondisi aset

4. **Submit Pengembalian**
   - Klik **"Kembalikan Aset"**
   - Konfirmasi pengembalian
   - Notifikasi sukses akan muncul

### Setelah Dikembalikan:

- Status aset akan berubah menjadi **"IN_STORAGE"**
- Aset akan hilang dari daftar **"Stok Aset"** Anda
- Loan request akan berubah status menjadi **"RETURNED"**

---

## 8. FAQ

### Q: Bagaimana cara melihat status request saya?

**A**: Buka halaman **"Request Aset"** atau **"Request Pinjam"**. Status akan ditampilkan dengan badge warna:
- 🟡 **PENDING**: Menunggu approval
- 🔵 **APPROVED**: Disetujui
- 🟢 **COMPLETED**: Selesai
- 🔴 **REJECTED**: Ditolak

### Q: Apa yang harus saya lakukan jika request saya ditolak?

**A**: 
1. Buka detail request yang ditolak
2. Baca alasan penolakan dari admin
3. Jika perlu, buat request baru dengan penyesuaian sesuai feedback admin

### Q: Bisakah saya membatalkan request yang sudah diajukan?

**A**: Ya, selama request masih dalam status **"PENDING"** dan belum di-review oleh admin. Klik tombol **"Batal"** di detail request.

### Q: Bagaimana cara melakukan follow-up request?

**A**: 
1. Buka detail request yang ingin di-follow-up
2. Klik tombol **"Follow Up"**
3. (Opsional) Tambahkan pesan
4. Admin akan menerima notifikasi
5. **Catatan**: Follow-up hanya bisa dilakukan sekali dalam 24 jam per request

### Q: Apa perbedaan Request Aset dan Request Pinjam?

**A**: 
- **Request Aset**: Untuk meminta pengadaan barang/aset **baru** yang belum ada di gudang
- **Request Pinjam**: Untuk meminjam aset yang **sudah ada** di gudang untuk keperluan sementara

### Q: Bagaimana cara scan QR Code aset?

**A**: 
1. Klik ikon **"Scan QR"** di header
2. Izinkan akses kamera browser
3. Arahkan kamera ke QR code aset
4. Sistem akan otomatis membaca dan membuka detail aset

### Q: Apa yang harus saya lakukan jika aset yang saya pinjam hilang?

**A**: 
1. Segera laporkan ke Admin Logistik
2. Gunakan fitur **"Laporkan Kerusakan"** dan pilih jenis "Hilang"
3. Isi detail lengkap tentang kehilangan
4. Admin akan menindaklanjuti

### Q: Bisakah saya meminjam aset lebih dari 1?

**A**: Ya, Anda bisa meminjam multiple aset dalam satu loan request. Tambahkan semua aset yang ingin dipinjam sebelum submit.

---

## 📞 Bantuan

Jika Anda mengalami kesulitan atau memiliki pertanyaan:

1. **Cek FAQ** di atas
2. **Hubungi Admin Logistik** melalui aplikasi (fitur chat/notifikasi)
3. **Hubungi IT Support** jika ada masalah teknis

---

**Last Updated**: 2025-01-XX

