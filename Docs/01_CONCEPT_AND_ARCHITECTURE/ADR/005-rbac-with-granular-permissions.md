# ADR 005: Role-Based Access Control (RBAC) dengan Granular Permissions

- **Status**: Diterima
- **Tanggal**: 2025-10-25

## Konteks

Aplikasi Trinity Asset Flow memiliki beberapa jenis pengguna dengan kebutuhan akses yang berbeda:

- **Super Admin**: Akses penuh ke semua sistem
- **Admin Logistik**: Mengelola aset dan inventory
- **Kepala Logistik**: Approval requests dan oversight
- **Staff Logistik**: Input data dan operasional harian
- **Viewer**: Akses read-only untuk reporting

Kami perlu sistem yang:

1. Membatasi akses berdasarkan role user
2. Cukup fleksibel untuk handle permission granular
3. Mudah di-maintain dan di-extend
4. Dapat di-enforce di frontend DAN backend

Alternatif yang dipertimbangkan:

1. **Simple Role Check**: Hanya cek role (if role === 'Admin')
2. **Granular Permissions**: Setiap action memiliki permission string
3. **Attribute-Based Access Control (ABAC)**: Access berdasarkan attributes
4. **ACL (Access Control Lists)**: Permission per resource per user

## Keputusan

Kami memutuskan untuk menggunakan **Role-Based Access Control dengan Granular Permissions**, dimana:

- Setiap user memiliki satu Role
- Setiap Role memiliki set of Permissions
- Akses dicek berdasarkan Permission, bukan Role

## Implementasi

### Permission Definition

```typescript
// types/index.ts
export enum Permission {
  // Dashboard
  VIEW_DASHBOARD = "view_dashboard",
  VIEW_DASHBOARD_STATS = "view_dashboard_stats",

  // Asset Management
  VIEW_ASSETS = "view_assets",
  CREATE_ASSET = "create_asset",
  EDIT_ASSET = "edit_asset",
  DELETE_ASSET = "delete_asset",

  // Requests
  VIEW_REQUESTS = "view_requests",
  CREATE_REQUEST = "create_request",
  APPROVE_REQUEST = "approve_request",
  REJECT_REQUEST = "reject_request",

  // User Management
  VIEW_USERS = "view_users",
  CREATE_USER = "create_user",
  EDIT_USER = "edit_user",
  DELETE_USER = "delete_user",

  // ... 50+ permissions total
}
```

### Role-Permission Mapping

```typescript
// utils/permissions.ts
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  "Super Admin": Object.values(Permission), // All permissions

  "Admin Logistik": [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_ASSETS,
    Permission.CREATE_ASSET,
    Permission.EDIT_ASSET,
    Permission.VIEW_REQUESTS,
    Permission.APPROVE_REQUEST,
    // ... subset of permissions
  ],

  "Kepala Logistik": [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_ASSETS,
    Permission.APPROVE_REQUEST,
    Permission.VIEW_REPORTS,
    // ... mostly view + approve
  ],

  "Staff Logistik": [
    Permission.VIEW_ASSETS,
    Permission.CREATE_ASSET,
    Permission.EDIT_ASSET,
    Permission.CREATE_REQUEST,
    // ... operational permissions
  ],

  Viewer: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_ASSETS,
    Permission.VIEW_REPORTS,
    // ... read-only permissions
  ],
};
```

### Permission Check Utilities

```typescript
// utils/permissions.ts
export const hasPermission = (
  user: User | null,
  permission: Permission,
): boolean => {
  if (!user) return false;
  const userPermissions = ROLE_PERMISSIONS[user.role] || [];
  return userPermissions.includes(permission);
};

export const hasAnyPermission = (
  user: User | null,
  permissions: Permission[],
): boolean => {
  return permissions.some((p) => hasPermission(user, p));
};

export const hasAllPermissions = (
  user: User | null,
  permissions: Permission[],
): boolean => {
  return permissions.every((p) => hasPermission(user, p));
};
```

### Frontend Enforcement

```tsx
// ProtectedRoute component
const ProtectedRoute = ({
  children,
  requiredPermission,
}: {
  children: ReactNode;
  requiredPermission: Permission;
}) => {
  const user = useAuthStore((state) => state.currentUser);

  if (!hasPermission(user, requiredPermission)) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
};

// Conditional UI rendering
const AssetActions = ({ asset }: { asset: Asset }) => {
  const user = useAuthStore((state) => state.currentUser);

  return (
    <div>
      {hasPermission(user, Permission.EDIT_ASSET) && (
        <Button onClick={() => handleEdit(asset)}>Edit</Button>
      )}
      {hasPermission(user, Permission.DELETE_ASSET) && (
        <Button variant="danger" onClick={() => handleDelete(asset)}>
          Delete
        </Button>
      )}
    </div>
  );
};
```

### Backend Enforcement (NestJS)

```typescript
// auth/guards/permissions.guard.ts
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<Permission[]>(
      "permissions",
      context.getHandler(),
    );

    if (!requiredPermissions) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return hasAnyPermission(user, requiredPermissions);
  }
}

// Decorator
export const RequirePermissions = (...permissions: Permission[]) =>
  SetMetadata("permissions", permissions);

// Usage in controller
@Controller("assets")
export class AssetsController {
  @Post()
  @RequirePermissions(Permission.CREATE_ASSET)
  create(@Body() dto: CreateAssetDto) {
    return this.assetsService.create(dto);
  }

  @Delete(":id")
  @RequirePermissions(Permission.DELETE_ASSET)
  remove(@Param("id") id: string) {
    return this.assetsService.remove(id);
  }
}
```

## Konsekuensi

### Keuntungan (Positif)

- **Granularity**: Setiap action dapat dikontrol secara independen. Role baru dapat dibuat dengan kombinasi permission yang berbeda.

- **Maintainability**: Menambah permission baru tidak memerlukan perubahan di banyak tempat. Cukup tambah enum dan assign ke roles yang relevan.

- **Consistency**: Logic permission yang sama digunakan di frontend dan backend.

- **Audit-Friendly**: Mudah untuk audit siapa memiliki akses ke apa berdasarkan role-permission matrix.

- **Flexibility**: Jika suatu saat butuh permission per-user (bukan per-role), arsitektur sudah mendukung.

### Kerugian (Negatif)

- **Complexity**: Lebih kompleks dari simple role check.

  **Mitigasi**: Abstraksi helper functions (`hasPermission`, `hasAnyPermission`) menyederhanakan usage.

- **Permission Explosion**: Terlalu banyak granular permissions bisa jadi overwhelming.

  **Mitigasi**: Grouping permissions logis (VIEW*\*, EDIT*_, ADMIN\__) dan dokumentasi yang jelas.

- **Sync Risk**: Frontend dan backend permission definitions harus sync.

  **Mitigasi**: Single source of truth di shared types atau code generation.

## RBAC Matrix Reference

| Permission      | Super Admin | Admin Logistik | Kepala Logistik | Staff Logistik | Viewer |
| --------------- | :---------: | :------------: | :-------------: | :------------: | :----: |
| VIEW_DASHBOARD  |     ✅      |       ✅       |       ✅        |       ✅       |   ✅   |
| VIEW_ASSETS     |     ✅      |       ✅       |       ✅        |       ✅       |   ✅   |
| CREATE_ASSET    |     ✅      |       ✅       |       ❌        |       ✅       |   ❌   |
| EDIT_ASSET      |     ✅      |       ✅       |       ❌        |       ✅       |   ❌   |
| DELETE_ASSET    |     ✅      |       ✅       |       ❌        |       ❌       |   ❌   |
| APPROVE_REQUEST |     ✅      |       ✅       |       ✅        |       ❌       |   ❌   |
| MANAGE_USERS    |     ✅      |       ❌       |       ❌        |       ❌       |   ❌   |

Lihat [RBAC_MATRIX.md](../../03_STANDARDS_AND_PROCEDURES/RBAC_MATRIX.md) untuk matrix lengkap.

## Referensi

- [utils/permissions.ts](../../../frontend/src/utils/permissions.ts)
- [RBAC_MATRIX.md](../../03_STANDARDS_AND_PROCEDURES/RBAC_MATRIX.md)
