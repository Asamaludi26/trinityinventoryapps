# Modul Kategori & Master Data

## Ringkasan

Modul ini mengelola hierarki kategori aset dan konfigurasi tracking untuk setiap tipe aset.

## Hierarki

```
Kategori (e.g., Perangkat Jaringan)
├── Tipe (e.g., Router)
│   ├── Model/Brand (e.g., Mikrotik RB750Gr3)
│   ├── Model/Brand (e.g., Mikrotik RB951)
│   └── Model/Brand (e.g., Cisco RV320)
└── Tipe (e.g., Switch)
    ├── Model/Brand (e.g., HP 1820-24G)
    └── Model/Brand (e.g., Cisco SG350)
```

## Konfigurasi per Tipe

| Config          | Values                | Deskripsi                             |
| --------------- | --------------------- | ------------------------------------- |
| Classification  | asset, material       | Aset bernilai vs material habis pakai |
| Tracking Method | individual, bulk      | Per unit vs agregat                   |
| Bulk Type       | count, measurement    | Jumlah vs saldo (meter)               |
| Unit of Measure | Unit, Pcs, Meter, dll | Satuan pengukuran                     |

## Contoh Konfigurasi

### Router (Individual Asset)

```json
{
  "name": "Router",
  "classification": "asset",
  "trackingMethod": "individual",
  "unitOfMeasure": "Unit"
}
```

### Connector RJ45 (Bulk Count)

```json
{
  "name": "Connector RJ45",
  "classification": "material",
  "trackingMethod": "bulk",
  "bulkType": "count",
  "unitOfMeasure": "Pcs"
}
```

### Kabel Fiber (Bulk Measurement)

```json
{
  "name": "Kabel Fiber Dropcore",
  "classification": "material",
  "trackingMethod": "bulk",
  "bulkType": "measurement",
  "unitOfMeasure": "Hasbal",
  "baseUnitOfMeasure": "Meter",
  "quantityPerUnit": 1000
}
```

## Division Association

Kategori dapat diasosiasikan dengan divisi tertentu:

- Perangkat Jaringan → IT, NOC
- Peralatan Kantor → GA, HR
- Kendaraan → GA

Ini membantu filter saat request sesuai divisi user.

## File Terkait

- `features/categories/CategoryManagementPage.tsx`
- `stores/useMasterDataStore.ts`
