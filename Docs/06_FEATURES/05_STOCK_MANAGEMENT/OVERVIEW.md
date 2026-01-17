# Modul Stok & Gudang

## Ringkasan

Modul ini menyediakan overview stok aset secara agregat dan personal, dengan fitur tracking threshold, riwayat pergerakan, dan alert stok rendah.

## Jenis Tampilan

### 1. Stok Global (Admin View)

- Agregasi stok per nama & brand
- Kolom: Di Gudang, Digunakan, Rusak, Total
- Threshold minimum yang dapat dikonfigurasi
- Riwayat pergerakan (stock movement)

### 2. Stok Personal (All Users)

- Aset yang sedang dipegang user
- Status custody vs in-use
- Riwayat pemakaian personal

## Status Stok

| Status | Warna  | Kondisi                      |
| ------ | ------ | ---------------------------- |
| Aman   | Hijau  | currentStock ≥ threshold     |
| Rendah | Kuning | 0 < currentStock < threshold |
| Habis  | Merah  | currentStock = 0             |

## Stock Movement Types

| Type             | Deskripsi                  | Effect |
| ---------------- | -------------------------- | ------ |
| IN_PURCHASE      | Barang baru dari pembelian | +      |
| IN_RETURN        | Pengembalian dari user     | +      |
| OUT_INSTALLATION | Instalasi ke pelanggan     | -      |
| OUT_HANDOVER     | Serah terima ke user       | -      |
| OUT_BROKEN       | Barang rusak               | -      |
| OUT_ADJUSTMENT   | Penyesuaian manual         | +/-    |

## File Terkait

- `features/stock/StockOverviewPage.tsx`
- `features/stock/components/StockTable.tsx`
- `features/stock/components/StockHistoryModal.tsx`
- `features/stock/components/ReportDamageModal.tsx`
- `features/stock/components/AssetCard.tsx`

## Referensi

- [Stock Logic Details](./LOGIC.md)
- [Stock Components](./COMPONENTS.md)
