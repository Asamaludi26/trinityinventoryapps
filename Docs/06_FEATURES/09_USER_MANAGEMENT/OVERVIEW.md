# Modul Manajemen Pengguna

## Ringkasan

Modul ini mengelola akun pengguna dan divisi perusahaan, termasuk pengaturan role dan custom permissions.

## Fitur

### User Management

- CRUD user
- Assign role: Super Admin, Admin Logistik, Admin Purchase, Leader, Staff
- Assign divisi
- Custom permissions (add-on dari role default)
- Request password reset

### Division Management

- CRUD divisi
- Validasi: tidak dapat hapus divisi dengan anggota aktif

## Permission Assignment

```typescript
// Default permissions dari role
const basePermissions = ROLE_DEFAULT_PERMISSIONS[user.role];

// Custom permissions (hanya bisa menambah, tidak mengurangi)
const customPermissions = user.customPermissions || [];

// Final permissions
const finalPermissions = [
  ...new Set([...basePermissions, ...customPermissions]),
];
```

## Business Rules

### BR-USER-001: Email Unique

```
Email user harus unik di seluruh sistem
```

### BR-USER-002: Division Required

```
Setiap user (kecuali Super Admin) wajib memiliki divisi
```

### BR-USER-003: Delete Protection

```
User dengan transaksi aktif tidak dapat dihapus
(soft delete: set status inactive)
```

## File Terkait

- `features/users/AccountsPage.tsx`
- `features/users/ManageAccountPage.tsx`
- `features/users/UserFormPage.tsx`
- `features/users/DivisionFormPage.tsx`
- `features/users/UserDetailPage.tsx`
- `features/users/DivisionDetailPage.tsx`
