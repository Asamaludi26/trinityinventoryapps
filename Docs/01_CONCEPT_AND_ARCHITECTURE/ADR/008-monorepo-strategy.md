# Repository Strategy Analysis: Monorepo vs Polyrepo vs Hybrid

> **Rekomendasi Strategi Manajemen Kode untuk Trinity Asset Flow**

Dokumen ini menganalisis opsi strategi repositori untuk proyek Trinity Asset Flow dan memberikan rekomendasi berdasarkan konteks, ukuran tim, dan kebutuhan pengembangan.

---

## 1. Executive Summary

### Rekomendasi: **Monorepo dengan Workspace**

Untuk proyek Trinity Asset Flow, kami merekomendasikan **Monorepo menggunakan pnpm workspaces** dengan alasan:

| Kriteria               | Skor Monorepo | Skor Polyrepo | Skor Hybrid |
| ---------------------- | :-----------: | :-----------: | :---------: |
| Tim kecil (1-5 dev)    |  ⭐⭐⭐⭐⭐   |     ⭐⭐      |   ⭐⭐⭐    |
| Shared Types/Contracts |  ⭐⭐⭐⭐⭐   |     ⭐⭐      |  ⭐⭐⭐⭐   |
| Deployment Simplicity  |   ⭐⭐⭐⭐    |    ⭐⭐⭐     |   ⭐⭐⭐    |
| Code Sharing           |  ⭐⭐⭐⭐⭐   |     ⭐⭐      |  ⭐⭐⭐⭐   |
| CI/CD Complexity       |   ⭐⭐⭐⭐    |  ⭐⭐⭐⭐⭐   |   ⭐⭐⭐    |
| **Total**              |   **23/25**   |   **14/25**   |  **17/25**  |

---

## 2. Analisis Opsi Repository

### 2.1. Monorepo

**Definisi**: Semua kode (frontend, backend, shared libraries, docs) dalam satu repositori.

```
trinity-asset-flow/
├── apps/
│   ├── frontend/          # React SPA
│   └── backend/           # NestJS API
├── packages/
│   ├── shared-types/      # TypeScript interfaces
│   ├── shared-utils/      # Common utilities
│   └── ui-components/     # Shared UI library
├── docs/                  # Documentation
├── scripts/               # Build & deploy scripts
├── package.json           # Root package.json
├── pnpm-workspace.yaml    # Workspace configuration
└── turbo.json             # Turborepo config (optional)
```

#### Keuntungan Monorepo

| Keuntungan                    | Penjelasan                                                                         |
| ----------------------------- | ---------------------------------------------------------------------------------- |
| **Atomic Changes**            | Perubahan frontend + backend dalam satu commit. Tidak ada version mismatch.        |
| **Shared Code**               | TypeScript types, utilities, validation rules dapat di-share tanpa publish ke npm. |
| **Unified Tooling**           | Satu konfigurasi ESLint, Prettier, TypeScript untuk semua package.                 |
| **Simplified Dependencies**   | Dependency versions konsisten di seluruh project.                                  |
| **Cross-project Refactoring** | Rename API endpoint? IDE dapat refactor di frontend dan backend sekaligus.         |
| **Single Source of Truth**    | Dokumentasi, CI/CD, dan kode dalam satu tempat.                                    |

#### Kerugian Monorepo

| Kerugian           | Mitigasi                                         |
| ------------------ | ------------------------------------------------ |
| **Build Time**     | Gunakan Turborepo/Nx untuk incremental builds    |
| **Git Complexity** | Git LFS untuk file besar, shallow clone untuk CI |
| **Access Control** | GitHub CODEOWNERS untuk per-folder ownership     |
| **Learning Curve** | Dokumentasi setup yang baik                      |

### 2.2. Polyrepo

**Definisi**: Setiap komponen dalam repositori terpisah.

```
Organisasi GitHub:
├── trinity-asset-flow-frontend/
├── trinity-asset-flow-backend/
├── trinity-asset-flow-shared-types/
├── trinity-asset-flow-docs/
└── trinity-asset-flow-infra/
```

#### Keuntungan Polyrepo

| Keuntungan          | Penjelasan                                    |
| ------------------- | --------------------------------------------- |
| **Independence**    | Tim dapat bekerja tanpa memengaruhi repo lain |
| **Clear Ownership** | Setiap repo memiliki maintainer jelas         |
| **Simpler CI**      | Pipeline per repo lebih sederhana             |
| **Granular Access** | Permission control per repositori             |

#### Kerugian Polyrepo

| Kerugian                  | Impact pada Trinity                                   |
| ------------------------- | ----------------------------------------------------- |
| **Dependency Hell**       | Version mismatch antara shared-types dan consumer     |
| **Cross-repo Changes**    | Butuh 3 PR untuk 1 fitur (types → backend → frontend) |
| **Code Duplication**      | Utilities sering di-copy paste                        |
| **Coordination Overhead** | Standar berbeda antar repo                            |

### 2.3. Hybrid

**Definisi**: Kombinasi monorepo dan polyrepo berdasarkan kebutuhan.

```
Contoh Hybrid:
├── trinity-asset-flow/           # Monorepo (frontend + backend + shared)
├── trinity-mobile-app/           # Separate repo (jika ada)
└── trinity-infrastructure/       # Separate repo (IaC)
```

#### Kapan Hybrid Cocok

- Ketika ada tim mobile yang benar-benar independen
- Ketika infrastructure-as-code di-manage oleh tim DevOps terpisah
- Ketika ada legacy systems yang sulit di-migrate

---

## 3. Rekomendasi untuk Trinity Asset Flow

### 3.1. Struktur Monorepo yang Direkomendasikan

```
trinity-asset-flow/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml              # Unified CI
│   │   ├── deploy-frontend.yml
│   │   └── deploy-backend.yml
│   └── CODEOWNERS
│
├── apps/
│   ├── frontend/
│   │   ├── src/
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   └── tsconfig.json
│   │
│   └── backend/
│       ├── src/
│       ├── prisma/
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── shared-types/           # TypeScript interfaces
│   │   ├── src/
│   │   │   ├── entities/       # Asset, User, Request, etc.
│   │   │   ├── enums/          # Status enums
│   │   │   ├── dto/            # Request/Response DTOs
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── shared-utils/           # Common utilities
│   │   ├── src/
│   │   │   ├── dateFormatter.ts
│   │   │   ├── documentNumberGenerator.ts
│   │   │   └── validators.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── eslint-config/          # Shared ESLint config
│       ├── base.js
│       ├── react.js
│       └── nestjs.js
│
├── docs/                       # Documentation (current structure)
│   ├── 01_CONCEPT_AND_ARCHITECTURE/
│   ├── 02_DEVELOPMENT_GUIDES/
│   └── ...
│
├── scripts/
│   ├── setup.sh
│   └── deploy.sh
│
├── package.json                # Root package.json
├── pnpm-workspace.yaml
├── turbo.json                  # Turborepo configuration
├── tsconfig.base.json          # Base TypeScript config
└── README.md
```

### 3.2. Konfigurasi pnpm Workspace

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
```

### 3.3. Root package.json

```json
{
  "name": "trinity-asset-flow",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "dev:frontend": "pnpm --filter frontend dev",
    "dev:backend": "pnpm --filter backend dev",
    "build:frontend": "pnpm --filter frontend build",
    "build:backend": "pnpm --filter backend build"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.3.0"
  },
  "packageManager": "pnpm@8.15.0"
}
```

### 3.4. Turborepo Configuration

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "test": {
      "dependsOn": ["build"]
    },
    "typecheck": {
      "dependsOn": ["^build"]
    }
  }
}
```

### 3.5. Shared Types Package

```typescript
// packages/shared-types/src/entities/asset.ts
export interface Asset {
  id: string;
  name: string;
  category: string;
  type: string;
  status: AssetStatus;
  serialNumber?: string;
  // ... sesuai dengan types/index.ts yang sudah ada
}

export enum AssetStatus {
  IN_STORAGE = "IN_STORAGE",
  IN_USE = "IN_USE",
  DAMAGED = "DAMAGED",
  DISPOSED = "DISPOSED",
}
```

```json
// packages/shared-types/package.json
{
  "name": "@trinity/shared-types",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  }
}
```

### 3.6. Penggunaan di Frontend & Backend

```typescript
// apps/frontend/src/stores/useAssetStore.ts
import { Asset, AssetStatus } from "@trinity/shared-types";

// apps/backend/src/assets/dto/create-asset.dto.ts
import { Asset } from "@trinity/shared-types";
```

---

## 4. Migration Plan

### Fase 1: Restructure (Week 1-2)

1. **Create new folder structure**

   ```bash
   mkdir -p apps packages
   mv frontend apps/
   mv backend apps/
   ```

2. **Initialize workspace**

   ```bash
   pnpm init
   # Add pnpm-workspace.yaml
   ```

3. **Create shared-types package**
   - Extract types from `frontend/src/types/index.ts`
   - Create proper package with build step

### Fase 2: Update Imports (Week 2-3)

1. **Update frontend imports**

   ```typescript
   // Before
   import { Asset } from "@/types";

   // After
   import { Asset } from "@trinity/shared-types";
   ```

2. **Update backend imports**
   - Same pattern for backend

3. **Verify builds**
   ```bash
   pnpm build
   pnpm test
   ```

### Fase 3: CI/CD Updates (Week 3-4)

1. **Update GitHub Actions**
   - Use Turborepo for caching
   - Only build changed packages

2. **Update deployment scripts**
   - Deploy frontend and backend from monorepo

---

## 5. Perbandingan dengan Alternatif

### Jika Menggunakan Polyrepo

| Aspek           | Effort                                         | Masalah Potensial                |
| --------------- | ---------------------------------------------- | -------------------------------- |
| **Type Sync**   | Publish @trinity/types ke npm setiap perubahan | Version drift, breaking changes  |
| **CI/CD**       | 3 pipeline terpisah                            | Koordinasi deployment sulit      |
| **Development** | Clone 3 repo, npm link untuk dev               | Developer experience buruk       |
| **Code Review** | 3 PR untuk 1 fitur                             | Context switching untuk reviewer |

### Jika Menggunakan Hybrid

| Aspek                      | Kapan Cocok                                        |
| -------------------------- | -------------------------------------------------- |
| **Separate Mobile App**    | Jika menggunakan React Native dengan tim dedicated |
| **Separate Infra Repo**    | Jika Terraform/Pulumi di-manage oleh tim DevOps    |
| **Separate Legacy System** | Jika ada sistem lama yang tidak bisa di-migrate    |

---

## 6. Tooling Recommendations

### 6.1. Build System

| Tool          | Rekomendasi     | Alasan                                   |
| ------------- | --------------- | ---------------------------------------- |
| **Turborepo** | ⭐ Recommended  | Simple, fast, great caching              |
| **Nx**        | Alternative     | More features, steeper learning curve    |
| **Lerna**     | Not recommended | Deprecated in favor of native workspaces |

### 6.2. Package Manager

| Tool     | Rekomendasi     | Alasan                                        |
| -------- | --------------- | --------------------------------------------- |
| **pnpm** | ⭐ Recommended  | Fast, disk efficient, great workspace support |
| **yarn** | Alternative     | Good workspace support                        |
| **npm**  | Not recommended | Slower, workspaces less mature                |

### 6.3. Versioning Strategy

| Strategy         | Best For                             |
| ---------------- | ------------------------------------ |
| **Fixed/Locked** | Internal packages (semua versi sama) |
| **Independent**  | Published packages                   |

**Recommendation**: Fixed versioning untuk Trinity karena semua packages internal.

---

## 7. Kesimpulan

### Untuk Trinity Asset Flow, Monorepo adalah pilihan terbaik karena:

1. ✅ **Tim Kecil**: Tidak perlu overhead koordinasi antar repo
2. ✅ **Shared Types**: TypeScript types harus sync antara frontend & backend
3. ✅ **Single Deploy Target**: Satu server untuk keduanya (saat ini)
4. ✅ **Development Speed**: Perubahan atomic, testing terintegrasi
5. ✅ **Documentation**: Docs sudah terintegrasi dalam satu tempat

### Action Items

1. [ ] Setup pnpm workspace di root
2. [ ] Migrate folder structure ke apps/ dan packages/
3. [ ] Extract shared types ke packages/shared-types
4. [ ] Setup Turborepo untuk build caching
5. [ ] Update CI/CD pipelines
6. [ ] Update developer onboarding docs

---

## 8. References

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Monorepo.tools](https://monorepo.tools/)
- [Nx Documentation](https://nx.dev/getting-started/intro)
