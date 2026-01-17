# Modul Autentikasi & Otorisasi

## Ringkasan

Modul ini menangani seluruh aspek keamanan akses aplikasi, termasuk proses login, manajemen sesi, dan sistem izin berbasis peran (RBAC).

## Tujuan Bisnis

1. **Keamanan**: Memastikan hanya pengguna yang berwenang dapat mengakses sistem
2. **Akuntabilitas**: Melacak siapa yang melakukan apa di dalam sistem
3. **Segregasi Tugas**: Memisahkan tanggung jawab berdasarkan peran

## User Stories Terkait

| ID     | Sebagai     | Saya Ingin                    | Agar                             |
| ------ | ----------- | ----------------------------- | -------------------------------- |
| AUTH-1 | Pengguna    | Login dengan email & password | Dapat mengakses sistem           |
| AUTH-2 | Admin       | Mengelola akun pengguna       | Dapat menambah/edit/hapus user   |
| AUTH-3 | Super Admin | Mengatur izin khusus per user | Kontrol akses lebih granular     |
| AUTH-4 | Pengguna    | Request reset password        | Dapat memulihkan akses jika lupa |

## Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                        │
├─────────────────────────────────────────────────────────────┤
│  LoginPage.tsx                                              │
│       │                                                     │
│       ▼                                                     │
│  useAuthStore.ts ──────► api.loginUser()                   │
│       │                                                     │
│       ▼                                                     │
│  [Session Storage: auth-storage]                            │
│       │                                                     │
│       ▼                                                     │
│  App.tsx ──► hasPermission() ──► Render Page/Deny          │
└─────────────────────────────────────────────────────────────┘
```

## Hierarki Peran (Role Hierarchy)

```
Super Admin
    │
    ├── Admin Logistik
    │       └── Operasional gudang, handover, dismantle
    │
    ├── Admin Purchase
    │       └── Persetujuan request, pengadaan
    │
    └── Leader
            │
            └── Staff
                    └── Request basic, penggunaan aset
```

## Daftar Permission

### Dashboard & Reports

| Permission       | Super Admin | Admin Logistik | Admin Purchase | Leader | Staff |
| ---------------- | :---------: | :------------: | :------------: | :----: | :---: |
| dashboard:view   |     ✅      |       ✅       |       ✅       |   ✅   |  ✅   |
| reports:view     |     ✅      |       ✅       |       ✅       |   ❌   |  ❌   |
| data:export      |     ✅      |       ✅       |       ✅       |   ❌   |  ❌   |
| system:audit-log |     ✅      |       ❌       |       ❌       |   ❌   |  ❌   |

### Request Management

| Permission                | Super Admin | Admin Logistik | Admin Purchase | Leader | Staff |
| ------------------------- | :---------: | :------------: | :------------: | :----: | :---: |
| requests:view:own         |     ✅      |       ✅       |       ✅       |   ✅   |  ✅   |
| requests:view:all         |     ✅      |       ✅       |       ✅       |   ❌   |  ❌   |
| requests:create           |     ✅      |       ✅       |       ✅       |   ✅   |  ✅   |
| requests:create:urgent    |     ✅      |       ✅       |       ✅       |   ✅   |  ❌   |
| requests:approve:logistic |     ✅      |       ✅       |       ❌       |   ❌   |  ❌   |
| requests:approve:purchase |     ✅      |       ❌       |       ✅       |   ❌   |  ❌   |
| requests:approve:final    |     ✅      |       ❌       |       ❌       |   ❌   |  ❌   |

### Asset Management

| Permission           | Super Admin | Admin Logistik | Admin Purchase | Leader | Staff |
| -------------------- | :---------: | :------------: | :------------: | :----: | :---: |
| assets:view          |     ✅      |       ✅       |       ✅       |   ✅   |  ✅   |
| assets:view-price    |     ✅      |       ✅       |       ✅       |   ❌   |  ❌   |
| assets:create        |     ✅      |       ✅       |       ❌       |   ❌   |  ❌   |
| assets:edit          |     ✅      |       ✅       |       ❌       |   ❌   |  ❌   |
| assets:delete        |     ✅      |       ❌       |       ❌       |   ❌   |  ❌   |
| assets:handover      |     ✅      |       ✅       |       ❌       |   ❌   |  ❌   |
| assets:dismantle     |     ✅      |       ✅       |       ❌       |   ❌   |  ❌   |
| assets:install       |     ✅      |       ✅       |       ❌       |   ❌   |  ❌   |
| assets:repair:report |     ✅      |       ✅       |       ✅       |   ✅   |  ✅   |
| assets:repair:manage |     ✅      |       ✅       |       ❌       |   ❌   |  ❌   |

### User & System Management

| Permission        | Super Admin | Admin Logistik | Admin Purchase | Leader | Staff |
| ----------------- | :---------: | :------------: | :------------: | :----: | :---: |
| users:view        |     ✅      |       ❌       |       ❌       |   ❌   |  ❌   |
| users:create      |     ✅      |       ❌       |       ❌       |   ❌   |  ❌   |
| users:edit        |     ✅      |       ❌       |       ❌       |   ❌   |  ❌   |
| users:delete      |     ✅      |       ❌       |       ❌       |   ❌   |  ❌   |
| divisions:manage  |     ✅      |       ❌       |       ❌       |   ❌   |  ❌   |
| categories:manage |     ✅      |       ✅       |       ✅       |   ❌   |  ❌   |

## Keamanan

### Password Hashing

- Algoritma: bcrypt (pada backend)
- Salt rounds: 10+
- Tidak pernah menyimpan password plain text

### Session Management

- Token JWT (target produksi)
- Expired: 24 jam
- Refresh token: 7 hari
- Auto-logout saat token expired

### Anti-Tampering (Frontend Prototype)

```typescript
// useAuthStore.ts
checkSession: () => {
  const { currentUser } = get();
  if (currentUser) {
    // Re-apply permission standar berdasarkan role
    const sanitizedUser = {
      ...currentUser,
      permissions: sanitizePermissions(
        currentUser.permissions,
        currentUser.role,
      ),
    };
    set({ currentUser: sanitizedUser });
  }
};
```

## File Terkait

### Frontend

- `src/features/auth/LoginPage.tsx` - Halaman login
- `src/features/auth/PermissionDeniedPage.tsx` - Halaman akses ditolak
- `src/stores/useAuthStore.ts` - State management autentikasi
- `src/utils/permissions.ts` - Utility function permission

### Backend (Target)

- `src/auth/auth.module.ts`
- `src/auth/auth.controller.ts`
- `src/auth/auth.service.ts`
- `src/auth/guards/jwt-auth.guard.ts`
- `src/auth/guards/roles.guard.ts`

## Referensi Lanjutan

- [RBAC Matrix](../../03_STANDARDS_AND_PROCEDURES/RBAC_MATRIX.md)
- [Security Guide](../../03_STANDARDS_AND_PROCEDURES/SECURITY_GUIDE.md)
- [API Reference - Auth](../../02_DEVELOPMENT_GUIDES/API_REFERENCE.md#auth)
