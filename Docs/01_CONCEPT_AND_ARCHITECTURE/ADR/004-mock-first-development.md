# ADR 004: Mock-First Development dengan Feature Flag

- **Status**: Diterima
- **Tanggal**: 2025-10-20

## Konteks

Tim pengembangan frontend dan backend bekerja secara paralel. Frontend memerlukan data untuk pengembangan UI dan testing, tetapi API backend belum selalu tersedia. Kami perlu strategi untuk:

1. Memungkinkan pengembangan frontend tanpa dependensi ke backend
2. Memudahkan transisi dari mock ke real API
3. Menyediakan data yang konsisten untuk testing

Alternatif yang dipertimbangkan:

1. **Mock Service Worker (MSW)**: Intercept network requests di level service worker
2. **JSON Server**: Fake REST API dari file JSON
3. **In-App Mock Layer**: Conditional logic dalam aplikasi untuk switch antara mock dan real API
4. **Hardcoded Data**: Data statis langsung di komponen (anti-pattern)

## Keputusan

Kami memutuskan untuk menggunakan **In-App Mock Layer dengan Feature Flag** (`VITE_USE_MOCK`).

## Implementasi

### Unified API Interface

```typescript
// services/api.ts
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export const api = {
  assets: {
    getAll: () => (USE_MOCK ? mockAssets.getAll() : realApi.get("/assets")),
    getById: (id) =>
      USE_MOCK ? mockAssets.getById(id) : realApi.get(`/assets/${id}`),
    create: (data) =>
      USE_MOCK ? mockAssets.create(data) : realApi.post("/assets", data),
    update: (id, data) =>
      USE_MOCK
        ? mockAssets.update(id, data)
        : realApi.put(`/assets/${id}`, data),
    delete: (id) =>
      USE_MOCK ? mockAssets.delete(id) : realApi.delete(`/assets/${id}`),
  },
  // ... other endpoints
};
```

### Mock Data Layer

```typescript
// data/mockData.ts
export const mockUsers: User[] = [
  {
    id: 1,
    email: "admin@trinity.id",
    name: "Administrator",
    role: "Admin Logistik",
    division: "IT",
    isActive: true,
  },
  // ... more mock data
];

// Mock API implementations with localStorage persistence
export const mockAssets = {
  getAll: async () => {
    const stored = localStorage.getItem("trinity_assets_v1.3");
    return stored ? JSON.parse(stored) : [...initialAssets];
  },

  create: async (data: CreateAssetDTO) => {
    const assets = await mockAssets.getAll();
    const newAsset = { ...data, id: generateId() };
    assets.push(newAsset);
    localStorage.setItem("trinity_assets_v1.3", JSON.stringify(assets));
    return newAsset;
  },
  // ...
};
```

### Environment Configuration

```bash
# .env.development
VITE_USE_MOCK=true
VITE_API_BASE_URL=http://localhost:3000/api

# .env.production
VITE_USE_MOCK=false
VITE_API_BASE_URL=https://api.trinity.id
```

## Konsekuensi

### Keuntungan (Positif)

- **Independence**: Frontend dapat dikembangkan tanpa backend yang running. Demo dan preview bisa dilakukan kapan saja.

- **Consistent Testing**: Mock data memberikan environment testing yang deterministic dan reproducible.

- **Rapid Prototyping**: Perubahan UI dapat dilakukan dan di-test segera tanpa menunggu API endpoints.

- **Simple Toggle**: Switching antara mock dan real API hanya dengan mengubah environment variable.

- **Type Safety**: Interface antara mock dan real API sama, sehingga type checking tetap berjalan.

- **Data Persistence**: Menggunakan localStorage untuk mock data memungkinkan persistensi antar session, memudahkan testing workflows yang kompleks.

### Kerugian (Negatif)

- **Drift Potential**: Mock data dan real API bisa "drift" jika tidak dijaga konsistensinya.

  **Mitigasi**:
  - Gunakan TypeScript interfaces yang sama
  - Review periodik untuk memastikan mock mengikuti contract API
  - Jalankan integration tests dengan real API di staging

- **Maintenance Overhead**: Mock layer memerlukan maintenance tersendiri.

  **Mitigasi**: Mock layer menggunakan struktur yang simple dan fokus pada happy path. Edge cases di-test dengan real API.

- **False Confidence**: Tests yang passing di mock mungkin gagal di real API.

  **Mitigasi**: CI/CD pipeline memiliki stage untuk integration testing dengan real backend.

- **localStorage Limitations**: Browser localStorage memiliki limit ~5MB.

  **Mitigasi**: Hanya simpan data yang necessary. Untuk dataset besar, gunakan pagination di mock.

## Data Versioning

Mock data menggunakan versioning untuk handle breaking changes:

```typescript
const STORAGE_KEY = "trinity_assets_v1.3";

// Ketika schema berubah, increment version
// Old data akan di-reset saat version tidak match
const migrateData = (storedVersion: string, currentVersion: string) => {
  if (storedVersion !== currentVersion) {
    console.log("Data version mismatch, resetting to defaults");
    return initialData;
  }
  return storedData;
};
```

## Transition Strategy

Ketika backend siap:

1. **Set `VITE_USE_MOCK=false`** di staging environment
2. **Run integration tests** untuk mengidentifikasi perbedaan
3. **Fix discrepancies** antara mock dan real API behavior
4. **Gradual rollout** per endpoint jika diperlukan:

```typescript
const api = {
  assets: {
    // Some endpoints use real API
    getAll: () => realApi.get("/assets"),

    // Others still use mock (not ready yet)
    getHistory: (id) =>
      USE_MOCK
        ? mockAssets.getHistory(id)
        : realApi.get(`/assets/${id}/history`),
  },
};
```

## Referensi

- [services/api.ts](../../../frontend/src/services/api.ts)
- [data/mockData.ts](../../../frontend/src/data/mockData.ts)
