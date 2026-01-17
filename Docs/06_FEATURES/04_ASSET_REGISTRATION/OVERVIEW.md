# Modul Registrasi Aset

## Ringkasan

Modul ini menangani pencatatan aset baru ke dalam sistem inventory, baik secara individual maupun bulk (massal). Setiap aset yang dicatat akan mendapatkan ID unik dan dapat dicetak label QR Code.

## Tujuan Bisnis

1. **Inventarisasi**: Mencatat semua aset perusahaan secara digital
2. **Pelacakan**: Setiap aset dapat dilacak dengan ID unik
3. **Identifikasi**: QR Code untuk identifikasi cepat di lapangan
4. **Riwayat**: Menyimpan riwayat perubahan setiap aset

## Jenis Pencatatan

### 1. Aset Individual

- Aset dengan nilai tinggi yang perlu dilacak per unit
- Contoh: Router, Switch, Server, Laptop
- Memiliki Serial Number, MAC Address
- Setiap unit memiliki ID unik (AST-YYYY-XXX)

### 2. Aset Bulk - Count

- Item dengan kuantitas banyak, tidak perlu tracking per unit
- Contoh: Connector RJ45 (50 pcs), Patch Cord (20 pcs)
- Dilacak berdasarkan jumlah total

### 3. Aset Bulk - Measurement

- Item yang diukur berdasarkan panjang/volume
- Contoh: Kabel Fiber (1000 meter/Hasbal)
- Dilacak berdasarkan saldo (balance)

## Format ID Aset

```
AST-[TAHUN]-[NOMOR URUT]
Contoh: AST-2026-001, AST-2026-002, ...
```

## Struktur Visual

```
┌────────────────────────────────────────────────────────────────────┐
│ Registrasi Aset                              [+ Catat Aset Baru]   │
├────────────────────────────────────────────────────────────────────┤
│ [Search...] [Kategori ▼] [Status ▼] [Print Labels]                 │
│                                                                     │
│ Tab: Semua | Individual | Bulk                                     │
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐│
│ │ AST-2026-001        Router Mikrotik RB750Gr3      ✓ Di Gudang  ││
│ │ SN: ABC123456       Kategori: Perangkat Jaringan                ││
│ │ Dicatat: 15 Jan 2026 oleh Admin                  [Detail] [QR] ││
│ └─────────────────────────────────────────────────────────────────┘│
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐│
│ │ AST-2026-005        Kabel Fiber Dropcore 1 Core   📦 Bulk      ││
│ │ Saldo: 850/1000 Meter                                           ││
│ │ Dicatat: 16 Jan 2026 oleh Admin                  [Detail] [QR] ││
│ └─────────────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────────────┘
```

## Form Registrasi

### Tab 1: Informasi Dasar

- Nama Aset (auto-complete dari master data)
- Kategori → Tipe → Model/Brand
- Kondisi (Baru/Baik/dll)
- Lokasi Penyimpanan
- Catatan

### Tab 2: Detail Teknis (Individual)

- Serial Number
- MAC Address
- Barcode/QR existing

### Tab 3: Informasi Pembelian

- Tanggal Pembelian
- Harga Beli
- Vendor
- Nomor PO
- Nomor Invoice
- Tanggal Garansi Berakhir

### Tab 4: Lampiran

- Foto aset
- Dokumen pendukung (invoice, warranty card)

## Business Rules

### BR-REG-001: ID Unik

```
Setiap aset WAJIB memiliki ID unik
ID di-generate otomatis oleh sistem
```

### BR-REG-002: Mandatory Fields

```
Fields wajib: name, category, type, brand, condition
Fields opsional: serialNumber, macAddress, purchasePrice, dll
```

### BR-REG-003: Bulk Balance Tracking

```
Untuk aset measurement:
- initialBalance = kapasitas awal (1000 Meter)
- currentBalance = sisa saat ini (mulai sama dengan initial)
- currentBalance berkurang saat instalasi/pemakaian
```

### BR-REG-004: Import dari Request

```
Ketika request status = ARRIVED:
- Data item sudah pre-filled
- Purchase details sudah terisi
- Admin tinggal verifikasi dan tambah SN/MAC
```

## File Terkait

- `features/assetRegistration/RegistrationPage.tsx`
- `features/assetRegistration/components/*`
- `features/assetRegistration/hooks/*`
- `stores/useAssetStore.ts`

## Referensi Lanjutan

- [Logika Registrasi](./LOGIC.md)
- [Komponen](./COMPONENTS.md)
- [Database Schema - Asset](../../01_CONCEPT_AND_ARCHITECTURE/DATABASE_SCHEMA.md#asset)
