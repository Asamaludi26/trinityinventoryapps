# Standar Koding & Kontribusi

Dokumen ini mendefinisikan standar dan praktik terbaik yang harus diikuti oleh semua kontributor proyek untuk memastikan kode yang bersih, konsisten, dan mudah dikelola.

## Filosofi Kualitas

Standar yang dijabarkan dalam dokumen ini bukan sekadar aturan, melainkan manifestasi dari komitmen kami terhadap **keunggulan rekayasa perangkat lunak**. Setiap standar—mulai dari struktur Git hingga gaya penulisan kode—diterapkan untuk mencapai tujuan utama: menghasilkan *codebase* yang **bersih, terstruktur, efisien, dan efektif**.

---

## 1. Tata Kelola Kode (Code Governance)

### 1.1. Konvensi Penamaan (Naming Conventions)
Standar penamaan wajib diikuti untuk memudahkan pencarian, pembacaan, dan pemeliharaan kode.

| Tipe | Format | Contoh | Aturan Tambahan |
| :--- | :--- | :--- | :--- |
| **Components** | PascalCase | `RegistrationForm.tsx` | Nama file harus sama dengan nama fungsi komponen export. |
| **Hooks** | camelCase | `useAssetCalculations.ts` | Wajib diawali dengan prefix `use`. |
| **Utilities** | camelCase | `dateFormatter.ts` | Nama harus deskriptif sesuai fungsinya (verb/noun). |
| **Constants** | UPPER_SNAKE_CASE | `MAX_UPLOAD_SIZE` | Disimpan di folder `src/constants/` jika bersifat global. |
| **Interfaces/Types** | PascalCase | `AssetTransaction` | **Dilarang** menggunakan prefix `I` (contoh: `IAsset` ❌). Gunakan nama yang jelas. |
| **Boolean Variables** | camelCase | `isVisible`, `hasError` | Wajib diawali `is`, `has`, `should`, atau `can`. |

### 1.2. Struktur Direktori & Kolokasi (Colocation)
Kami menerapkan **Feature-First Architecture**. Kode yang berkaitan dengan satu fitur bisnis harus berkumpul dalam satu folder (*colocation*) untuk memudahkan modularitas dan penghapusan fitur jika tidak lagi diperlukan.

```text
src/
├── features/
│   ├── assetRegistration/       # Fitur Spesifik
│   │   ├── components/          # Komponen UI HANYA untuk fitur ini
│   │   ├── hooks/               # Logic hooks HANYA untuk fitur ini
│   │   ├── types.ts             # Definisi tipe lokal fitur
│   │   └── RegistrationPage.tsx # Entry point halaman
│   └── ...
├── components/
│   └── ui/                      # Komponen Global (Atomic) yang reusable (Button, Input)
├── stores/                      # Global State (Zustand) yang diakses lintas fitur
└── services/                    # Integrasi API & External Service
```

---

## 2. Version Control (Git)

Kami menggunakan alur kerja **Git Flow** yang disederhanakan.

### Cabang (Branches)
-   `main`: Kode produksi. **Protected**.
-   `develop`: Cabang utama pengembangan.
-   **Cabang Fitur**: `feat/<nama-fitur>`
-   **Perbaikan Bug**: `fix/<deskripsi-bug>`
-   **Refactor**: `refactor/<area>`

### Pesan Commit
Gunakan standar **Conventional Commits**: `<type>(<scope>): <subject>`
*   `feat(auth): implement login rate limiting`
*   `fix(ui): correct z-index on modal`

---

## 3. Praktik Terbaik React & TypeScript

-   **Functional Components**: Selalu gunakan komponen fungsional dengan Hooks.
-   **TypeScript Strictness**:
    -   Hindari `any`. Gunakan `unknown` jika tipe benar-benar tidak diketahui, lalu lakukan narrowing.
    -   Definisikan return type untuk fungsi yang kompleks.
-   **Immutability**: Jangan memutasi state secara langsung. Gunakan spread operator `...` atau method array yang immutable (`map`, `filter`, `reduce`).
-   **Keys dalam List**: Gunakan ID unik dari data (misal `user.id`), jangan gunakan index array sebagai key kecuali list tersebut statis dan tidak pernah berubah urutannya.

## 4. Aksesibilitas (A11y)

-   **HTML Semantik**: Gunakan elemen yang tepat (`<button>`, `<nav>`, `<main>`).
-   **Atribut ARIA**: Gunakan `aria-label` untuk tombol yang hanya berisi ikon.
-   **Kontras**: Pastikan teks terbaca jelas di atas background.
