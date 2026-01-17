
# Panduan Pengguna Aplikasi Inventori Aset

Selamat datang di Panduan Pengguna Aplikasi Inventori Aset PT. Triniti Media Indonesia. Dokumen ini bertujuan untuk membantu Anda memahami dan menggunakan fitur-fitur aplikasi secara efektif sesuai dengan peran Anda.

## 1. Memulai

### 1.1. Login
- Buka aplikasi melalui browser Anda.
- Masukkan **alamat email** dan **kata sandi** yang telah terdaftar.
- **Akun Demo**: Jika dalam mode latihan, klik tombol "Lihat Akun Demo" untuk menyalin kredensial peran yang berbeda (Admin, Staff, dll).

## 2. Fitur Utama (Berdasarkan Peran)

### 2.1. Untuk Semua Pengguna (Staff & Leader)

#### Membuat Request Aset
1.  Buka menu **Request Aset > Request Baru**.
2.  Pilih Tipe Order: `Regular` (Stok Biasa) atau `Urgent/Project` (Khusus Leader).
3.  **Penting**: Jika Anda meminta barang habis pakai (seperti Kabel), pastikan memilih satuan yang benar (misal: Meter untuk eceran, atau Hasbal untuk utuh).

#### Peminjaman & Pengembalian
1.  Untuk meminjam alat kerja sementara, gunakan menu **Request Aset > Request Pinjam**.
2.  Setelah selesai menggunakan, buka request tersebut dan klik **"Ajukan Pengembalian"**. Pilih aset yang dikembalikan dan kondisinya.

### 2.2. Untuk Admin Logistik (Gudang)

#### Mencatat Aset Baru (Registrasi)
*   **Aset Unit (Device)**: Masukkan Serial Number dan MAC Address.
*   **Aset Terukur (Measurement)**: Untuk barang seperti Kabel FO:
    *   Pilih Tipe Aset yang memiliki mode *Bulk/Measurement*.
    *   Sistem akan menampilkan fitur **Generator Batch**.
    *   Masukkan jumlah fisik (misal: 5 Hasbal) dan panjang per unit (misal: 1000 Meter).
    *   Sistem otomatis membuat 5 ID aset unik dengan saldo masing-masing 1000 Meter.

#### Handover Aset Terukur (Kabel/Pipa)
Saat melakukan Handover aset tipe *Measurement*:
1.  **Mode Utuh**: Jika teknisi meminta 1 Hasbal penuh, pilih aset dan biarkan satuan "Hasbal". Aset akan berpindah kepemilikan sepenuhnya.
2.  **Mode Potongan (Eceran)**: Jika teknisi meminta 100 Meter:
    *   Pilih aset induk (Gudang).
    *   Ubah satuan menjadi "Meter" dan isi jumlah "100".
    *   Sistem akan otomatis **mengurangi saldo** aset induk di gudang, dan membuat **Aset Turunan (Potongan)** baru atas nama teknisi tersebut.

#### Manajemen Perbaikan (Repair)
1.  **Lapor Kerusakan**: Staff atau Admin dapat melaporkan kerusakan dari menu Stok atau Detail Aset. Status berubah menjadi `DAMAGED`.
2.  **Mulai Perbaikan**: Admin Logistik membuka menu **Perbaikan Aset**, klik "Mulai Perbaikan". Pilih tipe:
    *   *Internal*: Perbaikan oleh teknisi sendiri.
    *   *Eksternal*: Kirim ke vendor (status berubah menjadi `OUT_FOR_REPAIR`).
3.  **Penyelesaian**: Klik "Selesaikan" jika barang sudah baik, atau "Berhentikan (Decommission)" jika barang rusak total dan tidak bisa diperbaiki.

### 2.3. Untuk Admin Purchase

#### Proses Pengadaan
1.  Pantau Request dengan status `LOGISTIC_APPROVED`.
2.  Klik **"Review & Purchase"**.
3.  Isi detail harga, vendor, dan nomor PO.
4.  Jika nilai transaksi besar, sistem akan meminta persetujuan final CEO (`AWAITING_CEO_APPROVAL`).
5.  Setelah disetujui, ubah status menjadi `PURCHASING` -> `IN_DELIVERY` -> `ARRIVED` sesuai kondisi lapangan.

### 2.4. Tips Produktivitas

*   **Pindai QR**: Gunakan tombol QR di pojok kanan atas untuk mencari aset fisik secara instan menggunakan kamera HP/Laptop.
*   **Cetak Label**: Di halaman Detail Aset, Anda dapat mengunduh Label Aset yang berisi QR Code dan Barcode untuk ditempel pada fisik barang.
*   **Command Palette**: Tekan `Ctrl + K` (atau `Cmd + K` di Mac) untuk membuka pencarian cepat menu dan data.
