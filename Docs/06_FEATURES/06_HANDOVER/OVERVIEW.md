# Modul Serah Terima (Handover)

## Ringkasan

Modul ini menangani proses serah terima aset dari gudang ke pengguna, menghasilkan dokumen Berita Acara Serah Terima (BAST) digital.

## Tipe Handover

1. **Manual** - Pilih aset langsung dari gudang
2. **Dari Request** - Aset yang disetujui dari request pengadaan
3. **Dari Loan** - Aset yang disetujui dari peminjaman

## Format Nomor Dokumen

```
HO-[TAHUN]-[NOMOR URUT]
Contoh: HO-2026-001
```

## Status Flow

```
DRAFT → PENDING → COMPLETED
```

## Data Dokumen BAST

| Field         | Deskripsi                   |
| ------------- | --------------------------- |
| docNumber     | Nomor dokumen               |
| handoverDate  | Tanggal serah terima        |
| menyerahkan   | Nama yang menyerahkan       |
| penerima      | Nama penerima               |
| mengetahui    | Nama yang mengetahui        |
| woRoIntNumber | Referensi WO/RO/INT         |
| items         | Daftar item yang diserahkan |

## Effect pada Asset

```
WHEN handover completed
THEN:
  - asset.status = 'Digunakan' atau 'Dipegang (Custody)'
  - asset.currentUser = penerima.name
  - asset.location = null (atau lokasi penerima)
  - Create activity log entry
```

## File Terkait

- `features/handover/HandoverPage.tsx`
- `features/handover/HandoverForm.tsx`
- `features/handover/HandoverDetailPage.tsx`
- `features/handover/components/*`
- `features/handover/logic/*`
