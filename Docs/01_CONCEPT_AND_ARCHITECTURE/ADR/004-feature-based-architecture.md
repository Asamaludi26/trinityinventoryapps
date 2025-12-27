# ADR 004: Feature-Based Architecture untuk Frontend

- **Status**: Diterima
- **Tanggal**: 2025-01-15
- **Konteks**: Frontend memerlukan struktur folder yang scalable dan maintainable

## Konteks

Aplikasi React memerlukan struktur folder yang:
- Mudah di-navigate
- Memisahkan concerns dengan jelas
- Scalable untuk pertumbuhan fitur
- Memudahkan developer menemukan kode terkait

Alternatif yang dipertimbangkan:
1. **Feature-Based**: Organisasi berdasarkan fitur bisnis (features/assets, features/requests)
2. **Layer-Based**: Organisasi berdasarkan jenis file (components/, services/, pages/)
3. **Domain-Driven**: Organisasi berdasarkan domain bisnis (inventory/, procurement/)

## Keputusan

Kami memutuskan untuk menggunakan **Feature-Based Architecture** untuk frontend.

## Konsekuensi

### Keuntungan (Positif)

- **Co-location**: Semua kode terkait satu fitur berada dalam satu folder
- **Scalability**: Mudah menambah fitur baru tanpa mempengaruhi struktur existing
- **Team Collaboration**: Multiple developer bisa bekerja pada fitur berbeda tanpa conflict
- **Clear Boundaries**: Batas antar fitur jelas, mengurangi coupling
- **Easy Navigation**: Developer langsung tahu di mana mencari kode fitur tertentu

### Kerugian (Negatif)

- **Component Reusability**: Perlu disiplin untuk memisahkan komponen reusable ke `components/ui/`
- **Initial Setup**: Perlu planning yang baik di awal untuk struktur fitur

## Implementasi

### Folder Structure

```
src/
├── features/
│   ├── assets/
│   │   ├── AssetListPage.tsx
│   │   ├── AssetFormPage.tsx
│   │   └── components/
│   ├── requests/
│   │   ├── RequestHubPage.tsx
│   │   └── components/
│   └── ...
├── components/
│   ├── ui/          # Reusable UI components
│   └── layout/      # Layout components
└── ...
```

### Guidelines

1. **Feature Folder** berisi:
   - Page components
   - Feature-specific components
   - Feature-specific hooks
   - Feature-specific utils

2. **Shared Components** di `components/ui/`:
   - Button, Modal, Input, dll
   - Digunakan oleh multiple features

3. **Cross-Feature Logic** di root level:
   - Services, stores, types, utils

---

**Related ADRs**: None

