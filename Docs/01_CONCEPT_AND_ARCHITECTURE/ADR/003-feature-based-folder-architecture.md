# ADR 003: Feature-Based Folder Architecture

- **Status**: Diterima
- **Tanggal**: 2025-10-15

## Konteks

Struktur folder dalam aplikasi frontend sangat memengaruhi:

- Kemudahan navigasi codebase
- Discoverability komponen dan logic
- Skalabilitas saat fitur bertambah
- Kemudahan code review dan maintenance

Alternatif yang dipertimbangkan:

1. **Type-Based Structure**: Mengelompokkan file berdasarkan tipe (components/, hooks/, services/, pages/)
2. **Feature-Based Structure**: Mengelompokkan file berdasarkan fitur/domain (assetRegistration/, requests/, handover/)
3. **Hybrid Approach**: Kombinasi keduanya dengan shared code di level atas dan feature-specific di dalam features/

## Keputusan

Kami memutuskan untuk menggunakan **Feature-Based Folder Architecture** dengan Hybrid Approach.

## Struktur yang Diimplementasikan

```
src/
├── components/           # Shared components
│   ├── ui/              # Base UI components (Button, Input, etc.)
│   ├── layout/          # Layout components (Sidebar, Header)
│   └── icons/           # Icon components
│
├── features/            # Feature modules
│   ├── auth/            # Authentication
│   │   ├── components/  # Feature-specific components
│   │   ├── hooks/       # Feature-specific hooks
│   │   └── index.ts     # Public exports
│   │
│   ├── assetRegistration/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── index.ts
│   │
│   ├── requests/        # Procurement & Loan Requests
│   ├── handover/        # Asset Handover
│   ├── stock/           # Stock Management
│   └── ...
│
├── stores/              # Global state (Zustand)
├── services/            # API layer
├── hooks/               # Shared hooks
├── utils/               # Utility functions
├── types/               # TypeScript types
└── constants/           # Constants & configurations
```

## Konsekuensi

### Keuntungan (Positif)

- **Colocation**: Semua file yang berhubungan dengan satu fitur berada di satu tempat. Ini memudahkan developer untuk menemukan dan memahami semua aspek dari sebuah fitur.

```
features/assetRegistration/
├── components/
│   ├── AssetForm.tsx
│   ├── AssetTable.tsx
│   └── AssetDetailCard.tsx
├── hooks/
│   └── useAssetForm.ts
└── index.ts
```

- **Scalability**: Menambah fitur baru tidak memengaruhi struktur fitur yang sudah ada. Setiap fitur adalah modul yang independen.

- **Code Ownership**: Tim dapat dengan mudah menentukan ownership per fitur. Developer yang bertanggung jawab untuk "Handover" cukup fokus pada folder `features/handover/`.

- **Lazy Loading**: Mudah mengimplementasikan code splitting per fitur:

```typescript
const AssetRegistration = lazy(() => import("./features/assetRegistration"));
const Handover = lazy(() => import("./features/handover"));
```

- **Reduced Coupling**: Fitur yang terisolasi dalam folder sendiri cenderung lebih loosely coupled.

### Kerugian (Negatif)

- **Duplikasi Potential**: Komponen yang mirip mungkin dibuat di beberapa fitur berbeda.

  **Mitigasi**: Komponen yang digunakan di lebih dari satu fitur dipindahkan ke `components/ui/` atau `components/shared/`.

- **Import Paths Lebih Panjang**: `import { AssetTable } from '@/features/assetRegistration/components/AssetTable'`

  **Mitigasi**: Gunakan barrel exports via `index.ts` dan path aliases di tsconfig.

- **Keputusan Boundaries**: Menentukan boundary antara fitur tidak selalu jelas.

  **Mitigasi**: Dokumentasi yang jelas tentang apa yang termasuk dalam setiap fitur di folder `Docs/06_FEATURES/`.

## Guidelines

### Kapan Membuat Feature Baru

- Fitur memiliki route/page tersendiri
- Fitur memiliki komponen yang spesifik dan tidak reusable
- Fitur cukup besar (lebih dari 3-4 komponen)

### Kapan Menggunakan Shared

- Komponen digunakan di 2+ fitur
- Hook bersifat generic dan reusable
- Utility function bersifat umum

### Export Convention

Setiap feature folder harus memiliki `index.ts` yang meng-export public API:

```typescript
// features/assetRegistration/index.ts
export { AssetRegistrationPage } from "./components/AssetRegistrationPage";
export { AssetTable } from "./components/AssetTable";
export { useAssetForm } from "./hooks/useAssetForm";
```

## Referensi

- [Feature-Sliced Design](https://feature-sliced.design/)
- [Bulletproof React - Project Structure](https://github.com/alan2207/bulletproof-react)
