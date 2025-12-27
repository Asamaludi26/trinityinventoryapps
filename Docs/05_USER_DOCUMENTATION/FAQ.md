# Frequently Asked Questions (FAQ)

Dokumen ini berisi pertanyaan yang sering diajukan beserta jawabannya untuk membantu pengguna memahami dan menggunakan aplikasi dengan lebih baik.

---

## 📋 Kategori

1. [Umum](#1-umum)
2. [Request & Procurement](#2-request--procurement)
3. [Peminjaman Aset](#3-peminjaman-aset)
4. [Registrasi & Stok](#4-registrasi--stok)
5. [Instalasi & Dismantle](#5-instalasi--dismantle)
6. [Perbaikan](#6-perbaikan)
7. [Teknis](#7-teknis)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Umum

### Q: Bagaimana cara login ke aplikasi?

**A**: 
1. Buka aplikasi melalui browser
2. Masukkan **email** dan **password** yang telah diberikan
3. Klik tombol **"Masuk"**
4. Jika lupa password, hubungi Super Admin untuk reset

### Q: Saya tidak bisa login, apa yang harus saya lakukan?

**A**: 
1. Pastikan email dan password yang dimasukkan benar (case-sensitive)
2. Cek koneksi internet
3. Clear cache browser dan coba lagi
4. Jika masih tidak bisa, hubungi IT Support

### Q: Bagaimana cara melihat role dan divisi saya?

**A**: 
1. Klik pada **nama Anda** di header (pojok kanan atas)
2. Menu dropdown akan muncul menampilkan:
   - Nama lengkap
   - Email
   - Role
   - Divisi

### Q: Bagaimana cara logout?

**A**: 
1. Klik pada **nama Anda** di header
2. Klik tombol **"Logout"**
3. Anda akan diarahkan ke halaman login

### Q: Apakah aplikasi bisa digunakan di mobile?

**A**: Ya, aplikasi responsive dan bisa digunakan di browser mobile. Namun, untuk pengalaman terbaik, disarankan menggunakan desktop/laptop.

---

## 2. Request & Procurement

### Q: Apa perbedaan Request Aset dan Request Pinjam?

**A**: 
- **Request Aset**: Untuk meminta pengadaan barang/aset **baru** yang belum ada di gudang. Akan melalui proses pembelian jika stok tidak mencukupi.
- **Request Pinjam**: Untuk meminjam aset yang **sudah ada** di gudang untuk keperluan sementara.

### Q: Kapan saya bisa membuat request tipe "Urgent" atau "Project Based"?

**A**: Hanya **Leader** dan **Admin** yang bisa membuat request tipe "Urgent" atau "Project Based". **Staff** hanya bisa membuat request tipe "Regular Stock".

### Q: Bagaimana cara melihat status request saya?

**A**: 
1. Buka halaman **"Request Aset"**
2. Status ditampilkan dengan badge warna:
   - 🟡 **PENDING**: Menunggu approval
   - 🔵 **LOGISTIC_APPROVED**: Disetujui logistik
   - 🟢 **APPROVED**: Disetujui final
   - 🟠 **PURCHASING**: Sedang proses pembelian
   - 🔵 **IN_DELIVERY**: Barang dalam pengiriman
   - 🟢 **ARRIVED**: Barang sudah tiba
   - ✅ **COMPLETED**: Selesai
   - 🔴 **REJECTED**: Ditolak

### Q: Bisakah saya membatalkan request yang sudah diajukan?

**A**: Ya, selama request masih dalam status **"PENDING"** dan belum di-review oleh admin. Klik tombol **"Batal"** di detail request.

### Q: Bagaimana cara melakukan follow-up request?

**A**: 
1. Buka detail request yang ingin di-follow-up
2. Klik tombol **"Follow Up"**
3. (Opsional) Tambahkan pesan
4. Admin akan menerima notifikasi
5. **Catatan**: Follow-up hanya bisa dilakukan sekali dalam 24 jam per request

### Q: Mengapa request saya ditolak?

**A**: 
1. Buka detail request yang ditolak
2. Baca **"Alasan Penolakan"** yang diberikan admin
3. Jika perlu, buat request baru dengan penyesuaian sesuai feedback

### Q: Berapa lama proses approval request?

**A**: 
- **Level 1 (Admin Logistik)**: Biasanya 1-2 hari kerja
- **Level 2 (Admin Purchase)**: Biasanya 1-2 hari kerja setelah level 1
- **CEO Approval** (jika > Rp 10M): Tergantung jadwal CEO, bisa 3-5 hari kerja

---

## 3. Peminjaman Aset

### Q: Berapa lama saya bisa meminjam aset?

**A**: 
- Default: Tidak ada batas waktu (hingga dikembalikan)
- Anda bisa menentukan **Tanggal Pengembalian** saat membuat request pinjam
- Admin bisa menetapkan batas waktu jika diperlukan

### Q: Bisakah saya memperpanjang masa pinjam?

**A**: 
1. Buka detail loan request
2. Klik **"Perpanjang Pinjaman"** (jika fitur tersedia)
3. Atau hubungi Admin Logistik untuk perpanjangan manual

### Q: Apa yang terjadi jika saya tidak mengembalikan aset tepat waktu?

**A**: 
- Admin akan mengirim notifikasi pengingat
- Jika terlambat terlalu lama, Admin akan menghubungi Anda
- Status aset tetap **"IN_USE"** hingga dikembalikan

### Q: Bisakah saya meminjam aset yang sama lebih dari 1 kali?

**A**: Ya, setelah mengembalikan aset pertama kali, Anda bisa meminjam lagi dengan membuat loan request baru.

### Q: Bagaimana cara mengembalikan aset?

**A**: 
1. Buka halaman **"Request Pinjam"** > tab **"Pengembalian"**
2. Pilih loan request yang ingin dikembalikan
3. Isi form pengembalian:
   - Pilih kondisi aset
   - Tambahkan catatan (opsional)
4. Klik **"Kembalikan Aset"**

---

## 4. Registrasi & Stok

### Q: Bagaimana cara melihat stok aset yang tersedia?

**A**: 
1. Buka halaman **"Pusat Aset"** > **"Stok Aset"**
2. Filter berdasarkan status: **"IN_STORAGE"**
3. Atau gunakan search untuk mencari aset tertentu

### Q: Apa itu QR Code aset dan untuk apa?

**A**: 
- QR Code adalah kode unik untuk setiap aset
- Digunakan untuk:
  - Tracking aset dengan cepat
  - Scan untuk melihat detail aset
  - Print label untuk ditempel di aset fisik

### Q: Bagaimana cara print label QR Code?

**A**: 
1. Buka detail aset
2. Klik **"Generate QR Code"**
3. Klik **"Print Label"**
4. PDF akan terbuka untuk dicetak

### Q: Bisakah saya registrasi aset tanpa request?

**A**: Ya, **Admin Logistik** bisa melakukan registrasi manual:
1. Buka halaman **"Catat Aset"**
2. Klik **"Tambah Aset Baru"**
3. Isi form lengkap
4. Simpan

---

## 5. Instalasi & Dismantle

### Q: Apa itu instalasi ke pelanggan?

**A**: Instalasi adalah proses memasang aset di lokasi pelanggan. Aset yang diinstall akan terhubung dengan customer dan statusnya menjadi **"IN_USE"** dengan currentUser = Customer ID.

### Q: Siapa yang bisa membuat instalasi?

**A**: **Admin Logistik** dan **Super Admin** bisa membuat instalasi. Teknisi di lapangan bisa konfirmasi instalasi selesai.

### Q: Apa itu dismantle?

**A**: Dismantle adalah proses penarikan aset dari pelanggan kembali ke gudang. Biasanya dilakukan saat:
- Kontrak pelanggan berakhir
- Aset perlu diganti
- Pelanggan meminta penarikan

### Q: Bagaimana proses dismantle?

**A**: 
1. **Teknisi** di lapangan membuat dismantle record:
   - Scan QR code aset
   - Input kondisi aset
   - Submit
2. **Admin Gudang** menerima notifikasi
3. Setelah aset tiba di gudang, Admin konfirmasi penerimaan
4. Status aset kembali menjadi **"IN_STORAGE"**

---

## 6. Perbaikan

### Q: Bagaimana cara melaporkan kerusakan aset?

**A**: 
1. Buka detail aset yang rusak (dari **"Stok Aset"**)
2. Klik tombol **"Laporkan Kerusakan"** (ikon kunci pas)
3. Isi form:
   - Jenis kerusakan
   - Deskripsi lengkap
   - Upload foto (opsional)
4. Klik **"Kirim Laporan"**

### Q: Apa yang terjadi setelah saya melaporkan kerusakan?

**A**: 
1. Status aset berubah menjadi **"DAMAGED"**
2. Admin Logistik menerima notifikasi
3. Admin akan menindaklanjuti:
   - Perbaikan internal
   - Atau kirim ke vendor
4. Anda akan menerima update melalui notifikasi

### Q: Berapa lama proses perbaikan?

**A**: 
- **Perbaikan Internal**: 3-7 hari kerja (tergantung kompleksitas)
- **Kirim ke Vendor**: 1-4 minggu (tergantung vendor)

### Q: Apakah saya bisa menggunakan aset yang sedang diperbaiki?

**A**: Tidak, aset yang statusnya **"UNDER_REPAIR"** atau **"OUT_FOR_REPAIR"** tidak bisa digunakan hingga perbaikan selesai.

---

## 7. Teknis

### Q: Browser apa yang didukung?

**A**: 
- Chrome (versi terbaru) - **Recommended**
- Firefox (versi terbaru)
- Edge (versi terbaru)
- Safari (versi terbaru)

### Q: Apakah aplikasi memerlukan koneksi internet?

**A**: Ya, aplikasi memerlukan koneksi internet untuk berfungsi. Tidak ada mode offline saat ini.

### Q: Bagaimana cara scan QR Code?

**A**: 
1. Klik ikon **"Scan QR"** di header
2. Izinkan akses kamera browser
3. Arahkan kamera ke QR code aset
4. Sistem akan otomatis membaca dan membuka detail aset

**Catatan**: 
- Pastikan kamera memiliki cahaya yang cukup
- QR code harus jelas dan tidak rusak
- Jika scan gagal, coba input ID aset secara manual

### Q: Apakah data saya aman?

**A**: 
- Ya, aplikasi menggunakan HTTPS untuk enkripsi data
- Password di-hash dengan algoritma yang aman
- Akses data dibatasi berdasarkan role
- Audit trail mencatat semua aktivitas penting

---

## 8. Troubleshooting

### Q: Halaman tidak loading atau blank

**A**: 
1. Refresh halaman (F5 atau Ctrl+R)
2. Clear cache browser:
   - Chrome: Settings > Privacy > Clear browsing data
   - Pilih "Cached images and files"
3. Cek koneksi internet
4. Coba browser lain
5. Jika masih tidak bisa, hubungi IT Support

### Q: Form tidak bisa disubmit

**A**: 
1. Cek apakah semua field wajib sudah diisi
2. Cek pesan error di bawah field (biasanya berwarna merah)
3. Pastikan format data benar (email, tanggal, dll)
4. Coba refresh halaman dan isi ulang

### Q: Notifikasi tidak muncul

**A**: 
1. Cek ikon lonceng di header (ada badge merah jika ada notifikasi baru)
2. Klik ikon untuk melihat semua notifikasi
3. Pastikan browser mengizinkan notifikasi
4. Refresh halaman

### Q: Data tidak ter-update

**A**: 
1. Refresh halaman untuk mengambil data terbaru
2. Cek apakah ada error di console browser (F12 > Console)
3. Pastikan Anda memiliki permission untuk update data
4. Coba logout dan login kembali

### Q: QR Code tidak bisa di-scan

**A**: 
1. Pastikan kamera memiliki izin akses
2. Pastikan QR code jelas dan tidak rusak
3. Pastikan cahaya cukup
4. Coba input ID aset secara manual sebagai alternatif

### Q: Print tidak berfungsi

**A**: 
1. Pastikan pop-up blocker tidak memblokir window print
2. Cek apakah printer terhubung
3. Coba print ke PDF dulu, lalu print dari PDF
4. Coba browser lain

---

## 📞 Masih Ada Pertanyaan?

Jika pertanyaan Anda tidak terjawab di FAQ ini:

1. **Cek User Guide** sesuai role Anda:
   - [Panduan Staff](./USER_GUIDE_STAFF.md)
   - [Panduan Admin](./USER_GUIDE_ADMIN.md)
   - [Panduan Umum](./USER_GUIDE.md)

2. **Hubungi Support**:
   - **Admin Logistik**: Untuk pertanyaan tentang aset dan stok
   - **Admin Purchase**: Untuk pertanyaan tentang request dan pengadaan
   - **IT Support**: Untuk masalah teknis aplikasi
   - **Super Admin**: Untuk pertanyaan tentang akses dan permission

---

**Last Updated**: 2025-01-XX
**Maintained By**: Development Team

