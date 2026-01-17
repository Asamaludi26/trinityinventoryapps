# ADR 002: Penggunaan Zustand untuk State Management

- **Status**: Diterima
- **Tanggal**: 2025-10-15

## Konteks

Aplikasi Trinity Asset Flow membutuhkan solusi state management yang dapat menangani state global yang kompleks, termasuk:

- Autentikasi dan informasi user
- Data master (kategori, divisi, customer)
- Data transaksi (asset, request, handover)
- UI state (navigasi, modal, notifikasi)

Alternatif yang dipertimbangkan:

1. **Redux + Redux Toolkit**: Standar industri, sangat mature, tetapi memiliki boilerplate yang signifikan.
2. **Zustand**: Solusi minimalis dengan API sederhana, performa baik, dan bundle size kecil.
3. **Jotai/Recoil**: Atomic state management, cocok untuk state yang sangat granular.
4. **React Context + useReducer**: Solusi bawaan React, tidak memerlukan library eksternal.

## Keputusan

Kami memutuskan untuk menggunakan **Zustand** sebagai solusi state management utama.

## Konsekuensi

### Keuntungan (Positif)

- **API Sederhana**: Zustand memiliki API yang sangat sederhana dan intuitif. Membuat store hanya membutuhkan beberapa baris kode tanpa boilerplate yang berlebihan.

```typescript
const useAssetStore = create<AssetStore>((set, get) => ({
  assets: [],
  addAsset: (asset) =>
    set((state) => ({
      assets: [...state.assets, asset],
    })),
}));
```

- **Bundle Size Kecil**: Zustand hanya ~1KB (gzipped), jauh lebih kecil dari Redux (~7KB) + RTK (~13KB).

- **Tidak Memerlukan Provider**: Berbeda dengan Redux atau Context, Zustand tidak memerlukan wrapper Provider di root aplikasi.

- **Performa yang Baik**: Zustand menggunakan subscription model yang efisien. Component hanya re-render ketika state yang di-subscribe berubah.

```typescript
// Hanya re-render ketika assets berubah
const assets = useAssetStore((state) => state.assets);
```

- **Persist Middleware**: Integrasi mudah dengan localStorage/sessionStorage untuk persisting state.

```typescript
const useAuthStore = create(
  persist((set) => ({ user: null }), { name: "auth-storage" }),
);
```

- **DevTools Support**: Mendukung Redux DevTools untuk debugging.

- **TypeScript First**: Dukungan TypeScript yang sangat baik dengan type inference.

### Kerugian (Negatif)

- **Kurang Struktur**: Zustand tidak memiliki struktur baku seperti Redux (actions, reducers, middleware). Developer harus disiplin dalam mengorganisasi kode.

  **Mitigasi**: Kami mendefinisikan konvensi dan pattern yang jelas di dokumentasi STATE_MANAGEMENT_GUIDE.md.

- **Ekosistem Lebih Kecil**: Redux memiliki ekosistem middleware dan tooling yang lebih besar.

  **Mitigasi**: Untuk kebutuhan saat ini, fitur bawaan Zustand sudah mencukupi.

- **Kurang Populer untuk Enterprise**: Beberapa perusahaan besar lebih familiar dengan Redux.

  **Mitigasi**: Dokumentasi yang baik dan pattern yang konsisten akan memudahkan onboarding developer baru.

## Store Architecture

Kami mengorganisasi stores berdasarkan domain:

```
stores/
├── useAuthStore.ts        # Autentikasi & session
├── useUIStore.ts          # UI state (navigasi, modal)
├── useAssetStore.ts       # Asset & kategori
├── useRequestStore.ts     # Procurement & loan requests
├── useTransactionStore.ts # Handover, installation, repair
├── useMasterDataStore.ts  # Users, divisions, customers
└── useNotificationStore.ts # Toast & system notifications
```

## Referensi

- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [STATE_MANAGEMENT_GUIDE.md](../../02_DEVELOPMENT_GUIDES/STATE_MANAGEMENT_GUIDE.md)
