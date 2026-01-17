# Modul Dashboard

## Ringkasan

Dashboard adalah halaman utama setelah login yang memberikan gambaran menyeluruh tentang status inventori, metrik kunci, dan tugas-tugas yang memerlukan tindakan.

## Tujuan Bisnis

1. **Visibility**: Memberikan gambaran cepat kondisi inventori
2. **Actionable Insights**: Menampilkan tugas yang perlu ditindaklanjuti
3. **Monitoring**: Memantau tren dan anomali (stok rendah, garansi habis)
4. **Decision Support**: Data untuk pengambilan keputusan manajemen

## Jenis Dashboard

### 1. Dashboard Admin/Super Admin

Dashboard komprehensif dengan analitik lengkap:

- Metrik makro (total nilai, jumlah aset)
- Grafik dan visualisasi
- Alert & warning widgets
- Actionable items

### 2. Dashboard Staff/Leader

Dashboard sederhana fokus pada:

- Aset yang sedang dipegang
- Status request pribadi
- Tugas pending

## Struktur Visual

```
┌────────────────────────────────────────────────────────────────────┐
│ Dashboard Admin                                                     │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│ │Total Nilai│ │Total Aset│ │ Request  │ │ Rusak    │ ← Macro Stats │
│ │ Rp 500 Jt │ │   450    │ │ Pending  │ │   12     │               │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘               │
│                                                                     │
│ ⚠️ STOCK ALERT: 3 item di bawah threshold minimum                  │
│                                                                     │
│ ┌───────────────────┐ ┌───────────────────┐                        │
│ │ Status Aset       │ │ Tren Pengeluaran  │ ← Charts               │
│ │ [Donut Chart]     │ │ [Line Chart]      │                        │
│ └───────────────────┘ └───────────────────┘                        │
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────┐    │
│ │ TUGAS PENDING                                                │    │
│ │ • 5 Request menunggu persetujuan                            │    │
│ │ • 3 Handover belum selesai                                  │    │
│ │ • 2 Perbaikan dalam proses                                  │    │
│ └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│ ┌──────────────────────────────────────┐                           │
│ │ Matrix Aset per Kategori              │ ← Asset Matrix           │
│ │ Kategori      | Gudang | Pakai | Total│                           │
│ │ Router        |   25   |  120  |  145 │                           │
│ │ Switch        |   30   |   85  |  115 │                           │
│ └──────────────────────────────────────┘                           │
└────────────────────────────────────────────────────────────────────┘
```

## Komponen Widget

| Widget                | Deskripsi                                 | Role Access |
| --------------------- | ----------------------------------------- | ----------- |
| MacroStat             | Metrik tingkat tinggi (nilai, jumlah)     | Admin+      |
| UrgencyCard           | Indikator urgent (request pending, rusak) | Admin+      |
| StockAlertWidget      | Alert item di bawah threshold             | Admin+      |
| WarrantyAlertWidget   | Alert garansi akan habis                  | Admin+      |
| AssetStatusDonutChart | Distribusi status aset                    | Admin+      |
| SpendingTrendChart    | Tren pengeluaran 6 bulan                  | Admin+      |
| TechnicianLeaderboard | Top 5 teknisi instalasi                   | Admin+      |
| ActionableItemsList   | Daftar tugas pending                      | Semua       |
| CategorySummaryWidget | Ringkasan per kategori                    | Admin+      |
| AssetMatrix           | Tabel stok per kategori                   | Admin+      |

## Metrik yang Ditampilkan

### Metrik Makro

| Metrik           | Deskripsi                           | Sumber Data |
| ---------------- | ----------------------------------- | ----------- |
| Total Nilai Aset | Sum(purchasePrice) semua aset aktif | assets[]    |
| Total Aset Fisik | Count aset dengan status aktif      | assets[]    |
| Aset Digunakan   | Count aset status IN_USE            | assets[]    |
| Request Pending  | Count request status PENDING        | requests[]  |
| Perbaikan Aktif  | Count aset status UNDER_REPAIR      | assets[]    |

### Metrik Urgency

| Metrik             | Threshold   | Aksi                          |
| ------------------ | ----------- | ----------------------------- |
| Request Menunggu   | > 0         | Klik untuk ke halaman Request |
| Peminjaman Overdue | > 0         | Klik untuk ke detail Loan     |
| Stok Kritis        | < threshold | Klik untuk ke halaman Stok    |
| Aset Rusak         | > 0         | Klik untuk ke halaman Repair  |

## Ketergantungan Modul

```
Dashboard
    ├── useAssetStore (aset, kategori, threshold)
    ├── useRequestStore (requests, loanRequests)
    ├── useTransactionStore (handovers, installations)
    └── useMasterDataStore (divisions, users)
```

## File Terkait

### Pages

- `features/dashboard/DashboardPage.tsx`

### Components

- `features/dashboard/components/ActionableItemsList.tsx`
- `features/dashboard/components/AssetMatrix.tsx`
- `features/dashboard/components/DashboardCharts.tsx`
- `features/dashboard/components/StockAlertWidget.tsx`
- `features/dashboard/components/WarrantyAlertWidget.tsx`
- `features/dashboard/components/CategorySummaryWidget.tsx`
- `features/dashboard/components/SummaryCard.tsx`

### Hooks

- `features/dashboard/hooks/useDashboardData.ts`

## Referensi Lanjutan

- [PRD - Dashboard Requirements](../../01_CONCEPT_AND_ARCHITECTURE/PRODUCT_REQUIREMENTS.md#user-story-13)
- [Design System - Charts](../../03_STANDARDS_AND_PROCEDURES/DESIGN_SYSTEM.md#charts)
