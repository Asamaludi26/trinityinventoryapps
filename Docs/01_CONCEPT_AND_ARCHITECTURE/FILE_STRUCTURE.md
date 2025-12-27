# Struktur File & Direktori Aplikasi

Dokumen ini menjelaskan struktur lengkap file dan direktori aplikasi, baik untuk frontend maupun backend. Dokumentasi ini membantu developer memahami organisasi kode dan menemukan file yang diperlukan dengan cepat.

---

## 1. Struktur Root Project

```
trinityinventoryapps/
├── backend/                    # Backend API (NestJS)
│   ├── src/                    # Source code backend
│   ├── prisma/                 # Database schema & migrations
│   ├── Dockerfile              # Docker image untuk backend
│   ├── docker-compose.yml      # Docker Compose untuk development
│   └── package.json            # Dependencies backend
│
├── frontend/                   # Frontend Application (React)
│   ├── src/                    # Source code frontend
│   ├── public/                 # Static assets
│   ├── dist/                   # Build output (production)
│   ├── Dockerfile              # Docker image untuk frontend
│   ├── vite.config.ts          # Vite configuration
│   └── package.json            # Dependencies frontend
│
├── Docs/                       # Dokumentasi lengkap
│   ├── 01_CONCEPT_AND_ARCHITECTURE/
│   ├── 02_DEVELOPMENT_GUIDES/
│   ├── 03_STANDARDS_AND_PROCEDURES/
│   ├── 04_OPERATIONS/
│   └── 05_USER_DOCUMENTATION/
│
├── docker-compose.yml          # Docker Compose untuk production
├── nginx.conf                  # Nginx configuration untuk production
├── env.example                 # Template environment variables
├── deploy.sh                   # Script deployment otomatis
└── README.md                   # Dokumentasi utama
```

---

## 2. Struktur Frontend (`frontend/src/`)

### 2.1. Overview

Frontend menggunakan **Feature-Based Architecture** dengan pemisahan yang jelas antara komponen UI, logika bisnis, dan utilitas.

```
frontend/src/
├── App.tsx                     # Root component & routing logic
├── index.tsx                   # Entry point React
│
├── components/                 # Komponen UI yang dapat digunakan kembali
│   ├── ui/                     # Atomic Design: Komponen dasar
│   │   ├── ActionButton.tsx
│   │   ├── Modal.tsx
│   │   ├── CustomSelect.tsx
│   │   ├── DatePicker.tsx
│   │   ├── PaginationControls.tsx
│   │   └── ... (30+ komponen UI)
│   │
│   ├── layout/                 # Layout components
│   │   ├── MainLayout.tsx      # Layout utama dengan sidebar
│   │   ├── Sidebar.tsx         # Sidebar navigation
│   │   ├── FormPageLayout.tsx  # Layout untuk halaman form
│   │   └── DetailPageLayout.tsx # Layout untuk halaman detail
│   │
│   └── icons/                  # SVG icons sebagai React components
│       ├── DashboardIcon.tsx
│       ├── AssetIcon.tsx
│       └── ... (70+ icon components)
│
├── features/                    # Feature modules (Business Logic)
│   ├── auth/                   # Authentication & Authorization
│   │   ├── LoginPage.tsx
│   │   ├── PermissionDeniedPage.tsx
│   │   └── components/
│   │
│   ├── dashboard/              # Dashboard & Analytics
│   │   ├── DashboardPage.tsx
│   │   └── components/         # Widget components
│   │
│   ├── assetRegistration/     # Asset Registration Module
│   │   ├── RegistrationPage.tsx
│   │   ├── components/        # Form components untuk registrasi
│   │   └── utils.ts           # Utility functions
│   │
│   ├── requests/              # Request Management Module
│   │   ├── RequestHubPage.tsx
│   │   ├── loan/              # Loan request sub-module
│   │   └── ... (32 files)
│   │
│   ├── handover/              # Handover Module
│   │   └── HandoverPage.tsx
│   │
│   ├── customers/             # Customer Management Module
│   │   ├── CustomerManagementPage.tsx
│   │   ├── form/              # Customer form components
│   │   ├── detail/           # Customer detail view
│   │   ├── installation/     # Installation form
│   │   ├── dismantle/        # Dismantle workflow
│   │   └── maintenance/      # Maintenance management
│   │
│   ├── repair/                # Repair Management Module
│   │   └── RepairManagementPage.tsx
│   │
│   ├── stock/                 # Stock Overview Module
│   │   └── StockOverviewPage.tsx
│   │
│   ├── users/                 # User Management Module
│   │   ├── UsersHubPage.tsx
│   │   ├── UserFormPage.tsx
│   │   ├── UserDetailPage.tsx
│   │   ├── DivisionFormPage.tsx
│   │   └── ... (10 files)
│   │
│   └── categories/            # Category Management Module
│       └── CategoryManagementPage.tsx
│
├── stores/                    # State Management (Zustand)
│   ├── useAuthStore.ts        # Authentication state
│   ├── useAssetStore.ts      # Asset data state
│   ├── useRequestStore.ts    # Request data state
│   ├── useTransactionStore.ts # Transaction state
│   ├── useMasterDataStore.ts # Master data (divisions, categories)
│   ├── useNotificationStore.ts # Notification state
│   └── useUIStore.ts         # UI state (active page, loading)
│
├── services/                  # API Services & External Integrations
│   ├── api.ts                # Mock API (localStorage-based)
│   ├── api.real.ts           # Real API client (untuk production)
│   └── whatsappIntegration.ts # WhatsApp integration service
│
├── hooks/                     # Custom React Hooks
│   ├── useActionableItems.ts
│   ├── useLongPress.ts
│   ├── useSafeState.ts
│   └── useSortableData.ts
│
├── utils/                     # Utility Functions
│   ├── csvExporter.ts         # CSV export functionality
│   ├── dateFormatter.ts       # Date formatting utilities
│   ├── depreciation.ts        # Depreciation calculations
│   ├── documentNumberGenerator.ts # Document number generation
│   ├── permissions.ts         # Permission checking
│   ├── scanner.ts             # QR/Barcode scanner utilities
│   ├── uuid.ts                # UUID generation
│   └── validation.ts         # Form validation helpers
│
├── types/                     # TypeScript Type Definitions
│   └── index.ts               # All type definitions
│
├── constants/                 # Application Constants
│   └── labels.ts              # Label constants
│
├── data/                      # Mock Data (Development)
│   └── mockData.ts            # Initial mock data
│
└── providers/                 # React Context Providers
    └── NotificationProvider.tsx
```

### 2.2. Penjelasan Kategori File

#### Components (`components/`)

- **`ui/`**: Komponen UI dasar yang dapat digunakan kembali (Button, Modal, Input, dll). Mengikuti prinsip Atomic Design.
- **`layout/`**: Komponen layout untuk struktur halaman (Sidebar, Header, Footer).
- **`icons/`**: Ikon SVG yang di-convert menjadi React components untuk konsistensi dan performa.

#### Features (`features/`)

Setiap folder feature mewakili satu modul bisnis lengkap yang berisi:

- Halaman utama (Page component)
- Komponen khusus feature
- Logika bisnis terkait feature tersebut
- Utilitas khusus feature

**Prinsip**: Semua kode terkait satu fitur bisnis berada dalam satu folder feature.

#### Stores (`stores/`)

Menggunakan Zustand untuk state management. Setiap store mengelola state untuk satu domain:

- `useAuthStore`: User authentication, session, permissions
- `useAssetStore`: Asset data, CRUD operations
- `useRequestStore`: Request data dan workflow
- `useTransactionStore`: Transaction history
- `useMasterDataStore`: Master data (divisions, categories, customers)
- `useNotificationStore`: Notifications dan alerts
- `useUIStore`: UI state (active page, loading states, modals)

#### Services (`services/`)

- **`api.ts`**: Mock API layer yang menggunakan localStorage (untuk development/prototype)
- **`api.real.ts`**: Real API client yang akan digunakan saat backend siap
- **`whatsappIntegration.ts`**: Service untuk integrasi WhatsApp notifications

#### Utils (`utils/`)

Fungsi utilitas murni (pure functions) yang tidak memiliki side effects dan dapat digunakan di mana saja.

---

## 3. Struktur Backend (`backend/src/`)

### 3.1. Struktur Target (Recommended)

Backend menggunakan **NestJS** dengan arsitektur modular. Struktur berikut adalah blueprint untuk implementasi:

```
backend/src/
├── main.ts                     # Application entry point
├── app.module.ts              # Root module
│
├── common/                    # Shared utilities & decorators
│   ├── decorators/
│   ├── filters/              # Exception filters
│   ├── guards/               # Auth guards
│   ├── interceptors/        # Request/Response interceptors
│   ├── pipes/                # Validation pipes
│   └── utils/                # Shared utilities
│
├── config/                    # Configuration modules
│   ├── database.config.ts
│   ├── jwt.config.ts
│   └── app.config.ts
│
├── auth/                      # Authentication Module
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── strategies/           # Passport strategies
│   │   └── jwt.strategy.ts
│   └── dto/                  # Data Transfer Objects
│       ├── login.dto.ts
│       └── register.dto.ts
│
├── users/                     # User Management Module
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── dto/
│
├── assets/                    # Asset Management Module
│   ├── assets.module.ts
│   ├── assets.controller.ts
│   ├── assets.service.ts
│   └── dto/
│
├── requests/                  # Request Management Module
│   ├── requests.module.ts
│   ├── requests.controller.ts
│   ├── requests.service.ts
│   └── dto/
│
├── transactions/              # Transaction Module
│   ├── transactions.module.ts
│   ├── transactions.controller.ts
│   ├── transactions.service.ts
│   │   ├── handover.service.ts
│   │   ├── dismantle.service.ts
│   │   └── loan.service.ts
│   └── dto/
│
├── customers/                 # Customer Management Module
│   ├── customers.module.ts
│   ├── customers.controller.ts
│   ├── customers.service.ts
│   └── dto/
│
├── maintenance/               # Maintenance Module
│   ├── maintenance.module.ts
│   ├── maintenance.controller.ts
│   ├── maintenance.service.ts
│   └── dto/
│
├── categories/                # Category Management Module
│   ├── categories.module.ts
│   ├── categories.controller.ts
│   ├── categories.service.ts
│   └── dto/
│
├── divisions/                 # Division Management Module
│   ├── divisions.module.ts
│   ├── divisions.controller.ts
│   ├── divisions.service.ts
│   └── dto/
│
├── notifications/             # Notification Module
│   ├── notifications.module.ts
│   ├── notifications.service.ts
│   └── whatsapp.service.ts
│
└── health/                    # Health Check Module
    ├── health.controller.ts
    └── health.service.ts
```

### 3.2. Prisma Schema (`backend/prisma/`)

```
backend/prisma/
├── schema.prisma              # Database schema definition
├── seed.ts                    # Database seeding script
└── migrations/                # Migration files (auto-generated)
    └── ...
```

---

## 4. Konvensi Penamaan File

### 4.1. Frontend

- **Components**: PascalCase (e.g., `RegistrationPage.tsx`, `CustomSelect.tsx`)
- **Hooks**: camelCase dengan prefix `use` (e.g., `useAuthStore.ts`, `useSortableData.ts`)
- **Utils**: camelCase (e.g., `dateFormatter.ts`, `csvExporter.ts`)
- **Types**: camelCase (e.g., `index.ts` dalam folder `types/`)
- **Constants**: camelCase (e.g., `labels.ts`)

### 4.2. Backend

- **Modules**: kebab-case dengan suffix `.module.ts` (e.g., `users.module.ts`)
- **Controllers**: kebab-case dengan suffix `.controller.ts` (e.g., `assets.controller.ts`)
- **Services**: kebab-case dengan suffix `.service.ts` (e.g., `requests.service.ts`)
- **DTOs**: kebab-case dengan suffix `.dto.ts` (e.g., `create-asset.dto.ts`)
- **Entities**: kebab-case dengan suffix `.entity.ts` (e.g., `asset.entity.ts`)

---

## 5. Dependency Management

### 5.1. Frontend Dependencies

File: `frontend/package.json`

**Core Dependencies:**

- `react`, `react-dom`: UI framework
- `react-router-dom`: Routing
- `zustand`: State management
- `typescript`: Type safety

**UI Libraries:**

- `tailwindcss`: CSS framework
- `lucide-react`: Icon library
- `html2canvas`, `jspdf`: PDF generation

**Development:**

- `vite`: Build tool
- `@vitejs/plugin-react`: React plugin untuk Vite
- `eslint`: Linting

### 5.2. Backend Dependencies

File: `backend/package.json`

**Core Dependencies:**

- `@nestjs/core`, `@nestjs/common`: NestJS framework
- `@prisma/client`: Prisma ORM client
- `prisma`: Prisma CLI
- `@nestjs/jwt`, `passport-jwt`: JWT authentication
- `bcrypt`: Password hashing

**Database:**

- `postgresql`: Database (via Docker)

---

## 6. Environment Variables

### 6.1. Frontend (`.env`)

```env
VITE_API_URL=http://localhost:3001/api
VITE_USE_MOCK=true
```

### 6.2. Backend (`.env`)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/trinity_asset
JWT_SECRET=your-secret-key
PORT=3001
NODE_ENV=development
```

---

## 7. Build Output

### 7.1. Frontend Build

Setelah `pnpm run build`, output akan berada di:

```
frontend/dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── ...
```

### 7.2. Backend Build

Setelah `npm run build`, output akan berada di:

```
backend/dist/
├── main.js
├── app.module.js
└── ...
```

---

## 8. Best Practices Struktur File

1. **Feature-Based Organization**: Kode diorganisir berdasarkan fitur bisnis, bukan jenis file
2. **Co-location**: File terkait berada dalam folder yang sama
3. **Barrel Exports**: Gunakan `index.ts` untuk export yang bersih
4. **Separation of Concerns**: UI, logic, dan data terpisah dengan jelas
5. **Reusability**: Komponen UI dasar di `components/ui/`, komponen khusus feature di `features/[feature]/components/`

---

## 9. Referensi

- [Frontend Guide](../02_DEVELOPMENT_GUIDES/FRONTEND_GUIDE.md) - Panduan detail pengembangan frontend
- [Backend Guide](../02_DEVELOPMENT_GUIDES/BACKEND_GUIDE.md) - Panduan detail pengembangan backend
- [Architecture](./ARCHITECTURE.md) - Arsitektur sistem secara keseluruhan
