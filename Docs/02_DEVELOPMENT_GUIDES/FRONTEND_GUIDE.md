
# Panduan Pengembangan Frontend (React & Vite)

Dokumen ini menjelaskan arsitektur teknis, struktur folder, dan praktik terbaik untuk pengembangan frontend Aplikasi Inventori Aset. Frontend dibangun menggunakan **React**, **TypeScript**, **Vite**, dan **Tailwind CSS**.

## 1. Arsitektur Aplikasi (Feature-Based)

Aplikasi ini menggunakan pendekatan **Feature-Based Architecture**. Artinya, kode diorganisir berdasarkan **fitur bisnis** untuk skalabilitas dan kemudahan pemeliharaan.

### Struktur Folder Aktual (`src/`)

```
src/
├── components/          # Komponen UI global
│   ├── ui/              # Komponen atomik (Button, Modal, Input, Badge)
│   ├── layout/          # Struktur halaman (Sidebar, MainLayout, DetailPageLayout)
│   └── icons/           # Ikon SVG sebagai komponen React
├── features/            # Modul fitur utama (Domain Bisnis)
│   ├── assetRegistration/ # Pencatatan aset baru & form input
│   ├── auth/            # Halaman Login & Permission Guard
│   ├── categories/      # Manajemen kategori, tipe, dan model aset
│   ├── customers/       # CRM Pelanggan & instalasi/maintenance history
│   ├── dashboard/       # Widget analitik dan ringkasan
│   ├── handover/        # Logika & form serah terima aset
│   ├── preview/         # Modal preview detail entitas (Asset, User, dll)
│   ├── repair/          # Manajemen perbaikan aset
│   ├── requests/        # Hub permintaan (Baru & Peminjaman)
│   ├── stock/           # Analisa stok & pelaporan kerusakan
│   └── users/           # Manajemen pengguna & divisi
├── hooks/               # Custom React Hooks (useSortable, useGenericFilter)
├── services/            # Layer komunikasi API & Integrasi (WhatsApp)
├── stores/              # Manajemen State Global (Zustand)
│   ├── useAssetStore.ts
│   ├── useAuthStore.ts
│   ├── useMasterDataStore.ts
│   ├── useRequestStore.ts
│   ├── useTransactionStore.ts
│   └── useUIStore.ts
├── types/               # Definisi Tipe TypeScript Global
└── utils/               # Fungsi utilitas (Formatter, Calculator, Generator ID)
```

## 2. Manajemen Konfigurasi (Environment Variables)

Dalam pengembangan modern, **jangan pernah** melakukan hardcode URL API atau kredensial. Vite menggunakan file `.env` untuk manajemen konfigurasi.

1.  **File `.env`**:
    Buat file `.env` di root folder `frontend/`.
    ```env
    # URL API Backend
    VITE_API_URL=http://localhost:3001/api
    
    # Mode Mock (True = Pakai localStorage, False = Pakai Backend)
    VITE_USE_MOCK=true
    ```

## 3. Manajemen State (Zustand)

Kami menggunakan **Zustand** dengan middleware `persist` untuk menyimpan state di `localStorage` (penting untuk mode Mock API).

### Pola Store
Setiap domain data memiliki store sendiri untuk memisahkan *concern*.
*   `useAssetStore`: Mengelola data aset, kategori, dan logika stok.
*   `useTransactionStore`: Mengelola transaksi (Handover, Instalasi, Dismantle).
*   `useRequestStore`: Mengelola siklus hidup permintaan (Request & Loan).

## 4. Standar Kode Kritis

### 4.1. Generasi ID
Gunakan `generateUUID()` dari `src/utils/uuid.ts` atau `generateDocumentNumber()` untuk nomor dokumen yang konsisten (e.g., `RO-251010-0001`).

### 4.2. Penanganan Aset "Measurement" vs "Unit"
Sistem membedakan antara aset unit (Laptop) dan aset terukur (Kabel).
*   **Unit**: Dilacak menggunakan `id` unik dan `serialNumber`.
*   **Measurement**: Dilacak menggunakan `initialBalance` dan `currentBalance`. Transaksi menggunakan logika pengurangan saldo, bukan pemindahan ID fisik jika unitnya *consumable*.

## 5. Optimasi Performa

### 5.1. Lazy Loading
Komponen halaman utama dimuat secara *lazy* di `App.tsx` untuk mempercepat *Initial Load Time*.

### 5.2. Debouncing Search
Pencarian di tabel menggunakan *local state* yang di-debounce atau filter sisi klien yang efisien (menggunakan `useGenericFilter`).

## 6. Migrasi ke Real API

Ubah konfigurasi `VITE_USE_MOCK=false`. Pastikan backend berjalan. Logika di `src/services/api.ts` secara otomatis akan beralih dari manipulasi `localStorage` ke pemanggilan `fetch` HTTP standar.
