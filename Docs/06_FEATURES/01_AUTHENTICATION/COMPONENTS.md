# Komponen: Autentikasi & Otorisasi

## Daftar Komponen

| Komponen             | Path                                     | Deskripsi             |
| -------------------- | ---------------------------------------- | --------------------- |
| LoginPage            | `features/auth/LoginPage.tsx`            | Halaman login utama   |
| PermissionDeniedPage | `features/auth/PermissionDeniedPage.tsx` | Halaman akses ditolak |

## Daftar Store

| Store        | Path                     | Deskripsi             |
| ------------ | ------------------------ | --------------------- |
| useAuthStore | `stores/useAuthStore.ts` | State management auth |

## Daftar Utility

| Utility     | Path                   | Deskripsi             |
| ----------- | ---------------------- | --------------------- |
| permissions | `utils/permissions.ts` | Helper functions RBAC |

---

## 1. LoginPage

### Deskripsi

Halaman login yang menangani autentikasi pengguna dengan email dan password.

### Props

Komponen ini tidak menerima props (standalone page).

### State Internal

```typescript
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [showPassword, setShowPassword] = useState(false);
```

### Fitur

- Form input email & password
- Toggle visibility password
- Validasi client-side
- Loading state saat proses login
- Error message display
- Link ke "Lupa Password"

### Contoh Penggunaan

```tsx
// Di App.tsx
if (!currentUser) {
  return <LoginPage />;
}
```

### Screenshot

```
┌─────────────────────────────────────┐
│       🏢 PT. Triniti Media          │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Email                       │   │
│  │ user@company.com            │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Password              👁    │   │
│  │ ••••••••                    │   │
│  └─────────────────────────────┘   │
│                                     │
│  [ Lupa Password? ]                 │
│                                     │
│  ┌─────────────────────────────┐   │
│  │         MASUK              │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## 2. PermissionDeniedPage

### Deskripsi

Halaman yang ditampilkan ketika user mencoba mengakses fitur yang tidak diizinkan.

### Props

```typescript
interface Props {
  onBack: () => void; // Callback untuk kembali ke halaman sebelumnya
}
```

### Fitur

- Pesan error yang informatif
- Tombol kembali ke halaman aman (Dashboard)
- Ikon visual peringatan

### Contoh Penggunaan

```tsx
// Di App.tsx - Page Rendering
if (currentUser.role === "Staff" && staffRestrictedPages.includes(activePage)) {
  return <PermissionDeniedPage onBack={() => setActivePage("dashboard")} />;
}
```

### Screenshot

```
┌─────────────────────────────────────┐
│                                     │
│            ⛔                       │
│                                     │
│    Akses Ditolak                    │
│                                     │
│    Anda tidak memiliki izin untuk   │
│    mengakses halaman ini.           │
│                                     │
│    [ Kembali ke Dashboard ]         │
│                                     │
└─────────────────────────────────────┘
```

---

## 3. useAuthStore

### Deskripsi

Zustand store untuk mengelola state autentikasi secara global.

### Interface

```typescript
interface AuthState {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;

  login: (email: string, pass: string) => Promise<User>;
  requestPasswordReset: (email: string) => Promise<void>;
  logout: () => void;
  updateCurrentUser: (user: User) => void;
  checkSession: () => void;
}
```

### Methods

#### `login(email, password)`

Melakukan autentikasi user.

```typescript
const login = useAuthStore((state) => state.login);

try {
  const user = await login("user@email.com", "password123");
  console.log("Login berhasil:", user.name);
} catch (error) {
  console.error("Login gagal:", error.message);
}
```

#### `logout()`

Menghapus sesi user dan redirect ke login.

```typescript
const logout = useAuthStore((state) => state.logout);
logout(); // Clears session and resets UI
```

#### `requestPasswordReset(email)`

Mengirim request reset password.

```typescript
const requestReset = useAuthStore((state) => state.requestPasswordReset);
await requestReset("user@email.com");
```

#### `checkSession()`

Memvalidasi dan memperbaiki session yang mungkin rusak/dimodifikasi.

```typescript
// Dipanggil otomatis saat hydration
onRehydrateStorage: () => (state) => {
  state?.checkSession();
};
```

### Persistence

Store menggunakan `zustand/middleware/persist` untuk menyimpan session di `localStorage` dengan key `auth-storage`.

---

## 4. Utility: permissions.ts

### Functions

#### `hasPermission(user, permission)`

Mengecek apakah user memiliki izin tertentu.

```typescript
import { hasPermission } from "../utils/permissions";

// Contoh penggunaan
const canEdit = hasPermission(currentUser, "assets:edit");
const canApprove = hasPermission(currentUser, "requests:approve:final");
```

#### `ROLE_DEFAULT_PERMISSIONS`

Constant yang mendefinisikan permission default per role.

```typescript
export const ROLE_DEFAULT_PERMISSIONS: Record<UserRole, Permission[]> = {
  "Super Admin": ["*"], // Semua izin
  "Admin Logistik": [
    "dashboard:view",
    "assets:view",
    "assets:create",
    "assets:edit",
    // ... lainnya
  ],
  // ... roles lainnya
};
```

#### `sanitizePermissions(permissions, role)`

Memastikan permissions sesuai dengan yang diizinkan untuk role tersebut.

```typescript
// Digunakan internal di AuthStore
const cleanPermissions = sanitizePermissions(
  userFromAPI.permissions,
  userFromAPI.role,
);
```

---

## Best Practices

### 1. Selalu Cek Permission di UI

```tsx
// ✅ Baik - Sembunyikan elemen yang tidak diizinkan
{
  hasPermission(user, "assets:delete") && (
    <Button onClick={handleDelete}>Hapus</Button>
  );
}

// ❌ Buruk - Tampilkan lalu disable
<Button onClick={handleDelete} disabled={!hasPermission(user, "assets:delete")}>
  Hapus
</Button>;
```

### 2. Double-Check di Backend

```typescript
// Backend WAJIB validasi ulang, jangan percaya frontend
@UseGuards(JwtAuthGuard, RolesGuard)
@RequirePermission('assets:delete')
@Delete(':id')
async deleteAsset(@Param('id') id: string) {
    // ...
}
```

### 3. Consistent Loading States

```tsx
const { isLoading, error } = useAuthStore();

if (isLoading) return <Spinner />;
if (error) return <ErrorMessage>{error}</ErrorMessage>;
```

### 4. Secure Logout

```typescript
// Pastikan bersihkan semua data sensitif
logout: () => {
  set({ currentUser: null });
  localStorage.removeItem("auth-storage");
  localStorage.removeItem("app_temp_data"); // Data sensitif lain
  useUIStore.getState().resetUIState();
};
```
