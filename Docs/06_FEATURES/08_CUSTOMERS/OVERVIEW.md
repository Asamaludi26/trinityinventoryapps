# Modul Pelanggan & Instalasi

## Ringkasan

Modul ini mengelola data pelanggan dan transaksi terkait: instalasi aset, maintenance/pemeliharaan, dan dismantle (penarikan aset).

## Fitur Utama

### 1. Manajemen Pelanggan

- CRUD data pelanggan
- Status: Active, Inactive, Suspended
- Riwayat aktivitas per pelanggan
- Aset yang terpasang

### 2. Instalasi

- Pencatatan pemasangan aset di lokasi pelanggan
- Material yang digunakan (dengan pengurangan stok)
- Foto dokumentasi
- Teknisi yang menangani

### 3. Maintenance

- Pencatatan pemeliharaan berkala
- Deskripsi masalah & tindakan
- Penggantian aset (replacement)
- Material tambahan

### 4. Dismantle

- Penarikan aset dari pelanggan
- Kondisi aset saat ditarik
- Update status aset otomatis

## Format Nomor Dokumen

```
INST-[TAHUN]-[NOMOR] - Instalasi
MAINT-[TAHUN]-[NOMOR] - Maintenance
DIS-[TAHUN]-[NOMOR] - Dismantle
```

## Effect pada Asset

### Instalasi

```
asset.status = 'Digunakan'
asset.currentUser = customer.name
asset.location = customer.address
```

### Dismantle

```
asset.status = mapConditionToStatus(retrievedCondition)
asset.currentUser = null
asset.location = 'Gudang'
asset.isDismantled = true
```

## File Terkait

- `features/customers/CustomerManagementPage.tsx`
- `features/customers/components/*`
- `stores/useTransactionStore.ts`
