# Modul Request

## Ringkasan

Modul Request adalah jantung dari sistem manajemen aset yang menangani dua jenis permintaan:

1. **Request Pengadaan (Procurement)** - Permintaan barang baru
2. **Request Peminjaman (Loan)** - Peminjaman aset dari gudang

## Tujuan Bisnis

1. **Standardisasi**: Menyediakan alur kerja standar untuk permintaan aset
2. **Approval Chain**: Memastikan persetujuan berjenjang sesuai kebijakan
3. **Tracking**: Melacak status permintaan dari awal hingga selesai
4. **Akuntabilitas**: Mencatat siapa yang menyetujui/menolak dan kapan
5. **Budget Control**: Kontrol anggaran dengan approval CEO untuk nilai tinggi

## Jenis Request

### 1. Request Pengadaan (Procurement)

#### Tipe Order

| Tipe          | Deskripsi                  | Who Can Create | Approval Path                          |
| ------------- | -------------------------- | -------------- | -------------------------------------- |
| Regular Stock | Pengadaan rutin untuk stok | Staff+         | Logistik → Purchase                    |
| Urgent        | Kebutuhan mendesak         | Leader+        | Logistik → Purchase (prioritas)        |
| Project Based | Untuk proyek tertentu      | Leader+        | Logistik → Purchase → CEO (jika >10jt) |

#### Status Flow

```
PENDING → LOGISTIC_APPROVED → AWAITING_CEO (jika >10jt) → APPROVED
       → PURCHASING → IN_DELIVERY → ARRIVED → COMPLETED
```

### 2. Request Peminjaman (Loan)

#### Status Flow

```
PENDING → APPROVED (dengan assignment aset) → ON_LOAN → RETURNED
```

## Struktur Visual

### Request Pengadaan Page

```
┌────────────────────────────────────────────────────────────────────┐
│ Request Pengadaan                                    [+ Buat Request]│
├────────────────────────────────────────────────────────────────────┤
│ [Search...] [Filter ▼] [Status ▼] [Periode ▼] [Export CSV]         │
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐│
│ │ Tab: Semua | Pending | Proses Beli | Selesai | Ditolak         ││
│ └─────────────────────────────────────────────────────────────────┘│
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐│
│ │ RO-2026-001                           Status: Menunggu Logistik ││
│ │ Pemohon: John Doe (IT)                                          ││
│ │ Tanggal: 15 Jan 2026                  Tipe: Regular Stock       ││
│ │ Items: 3 | Total: -                                             ││
│ │                                                    [Detail]     ││
│ └─────────────────────────────────────────────────────────────────┘│
│                                                                     │
│ [< 1 2 3 ... 10 >]                                                 │
└────────────────────────────────────────────────────────────────────┘
```

### Request Peminjaman Page

```
┌────────────────────────────────────────────────────────────────────┐
│ Request Peminjaman                               [+ Request Pinjam] │
├────────────────────────────────────────────────────────────────────┤
│ Tab: Menunggu | Dipinjam | Dikembalikan | Ditolak                  │
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐│
│ │ LR-2026-005                           Status: Menunggu          ││
│ │ Pemohon: Jane Smith (NOC)                                       ││
│ │ Items: Router Mikrotik x2                                       ││
│ │                                               [Proses] [Detail] ││
│ └─────────────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────────────┘
```

## Ketergantungan Modul

```
Request Module
    ├── Auth Module (permission checks)
    ├── Asset Module (stok tersedia untuk loan)
    ├── Master Data (kategori, item standar)
    ├── Handover Module (serah terima setelah approve)
    └── Registration Module (registrasi setelah barang tiba)
```

## File Terkait

### Pages

- `features/requests/RequestHubPage.tsx` - Router untuk sub-pages
- `features/requests/new/NewRequestPage.tsx` - Request pengadaan
- `features/requests/loan/LoanRequestPage.tsx` - Request peminjaman

### Components

- `features/requests/new/components/*` - Komponen request pengadaan
- `features/requests/loan/components/*` - Komponen request peminjaman

## Referensi Lanjutan

- [Detail Logika Request Pengadaan](./REQUEST_PROCUREMENT.md)
- [Detail Logika Request Peminjaman](./REQUEST_LOAN.md)
- [Komponen Request](./COMPONENTS.md)
- [PRD - Request Requirements](../../01_CONCEPT_AND_ARCHITECTURE/PRODUCT_REQUIREMENTS.md#request)
