# Standar Penanganan Error (Error Handling Standards)

Dokumen ini mendefinisikan strategi, pola, dan praktik terbaik untuk penanganan error yang konsisten di seluruh aplikasi Trinity Asset Flow, baik di Frontend maupun Backend.

---

## 1. Filosofi Penanganan Error

### 1.1. Prinsip Utama

| Prinsip                     | Deskripsi                                            |
| --------------------------- | ---------------------------------------------------- |
| **Fail Fast**               | Deteksi error sedini mungkin dalam pipeline eksekusi |
| **Graceful Degradation**    | Aplikasi tetap berjalan meski sebagian fitur gagal   |
| **User-Friendly Messages**  | Pesan error harus dapat dipahami pengguna awam       |
| **Developer-Friendly Logs** | Log teknis detail untuk debugging                    |
| **No Silent Failures**      | Setiap error harus ditangani dan dilaporkan          |

### 1.2. Hierarki Penanganan

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERFACE                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Toast Notifications / Error Messages                │   │
│  │  (Pesan ramah pengguna)                             │   │
│  └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                    COMPONENT LAYER                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Error Boundaries / Try-Catch dalam Event Handlers  │   │
│  │  (Mencegah crash dan isolasi error)                 │   │
│  └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                    STATE/STORE LAYER                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Zustand Store Actions dengan Error State           │   │
│  │  (Menyimpan error state untuk UI)                   │   │
│  └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                    SERVICE/API LAYER                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ApiError Class / Interceptors                      │   │
│  │  (Normalisasi error dari backend)                   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Klasifikasi Error

### 2.1. Kategori Error

| Kategori                 | Kode Range | Contoh                          | Penanganan                          |
| ------------------------ | ---------- | ------------------------------- | ----------------------------------- |
| **Validation Error**     | 400        | Input tidak valid               | Tampilkan pesan di field terkait    |
| **Authentication Error** | 401        | Token expired                   | Redirect ke login                   |
| **Authorization Error**  | 403        | Akses ditolak                   | Tampilkan pesan akses ditolak       |
| **Not Found Error**      | 404        | Data tidak ditemukan            | Tampilkan pesan atau redirect       |
| **Conflict Error**       | 409        | Duplicate data / Race condition | Tampilkan pesan konflik             |
| **Business Logic Error** | 422        | Stok tidak cukup                | Tampilkan pesan bisnis              |
| **Server Error**         | 500        | Internal error                  | Tampilkan pesan generik, log detail |
| **Network Error**        | -          | Timeout, offline                | Tampilkan pesan koneksi             |

### 2.2. Error Severity Levels

```typescript
enum ErrorSeverity {
  INFO = "info", // Informational (tidak mengganggu alur)
  WARNING = "warning", // Peringatan (alur dapat dilanjutkan)
  ERROR = "error", // Error (alur terganggu, perlu aksi user)
  CRITICAL = "critical", // Kritis (aplikasi tidak dapat berjalan)
}
```

---

## 3. Implementasi Frontend

### 3.1. Custom Error Class

**Lokasi**: `src/services/api.ts`

```typescript
/**
 * Custom ApiError untuk normalisasi error dari backend
 * @example
 * throw new ApiError("Data tidak ditemukan", 404, "NOT_FOUND");
 */
class ApiError extends Error {
  status: number;
  code?: string;
  details?: Record<string, any>;

  constructor(
    message: string,
    status: number,
    code?: string,
    details?: Record<string, any>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }

  /**
   * Mengecek apakah error adalah network error (offline/timeout)
   */
  isNetworkError(): boolean {
    return this.status === 0 || this.code === "NETWORK_ERROR";
  }

  /**
   * Mengecek apakah error memerlukan re-authentication
   */
  requiresReauth(): boolean {
    return this.status === 401;
  }
}
```

### 3.2. Global Error Interceptor

**Lokasi**: `src/services/api.ts`

```typescript
/**
 * Menangani response dari fetch dan menormalisasi error
 */
const handleResponse = async (response: Response): Promise<any> => {
  if (!response.ok) {
    // 1. Handle 401 - Session expired
    if (response.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/";
      throw new ApiError(
        "Sesi berakhir. Silakan login kembali.",
        401,
        "SESSION_EXPIRED",
      );
    }

    // 2. Handle 403 - Forbidden
    if (response.status === 403) {
      throw new ApiError(
        "Anda tidak memiliki izin untuk akses ini.",
        403,
        "FORBIDDEN",
      );
    }

    // 3. Handle 409 - Conflict (Race Condition)
    if (response.status === 409) {
      throw new ApiError(
        "Data telah diubah oleh pengguna lain. Silakan refresh.",
        409,
        "CONFLICT",
      );
    }

    // 4. Parse error body untuk pesan detail
    const errorData = await response.json().catch(() => ({}));
    const message =
      errorData.message ||
      response.statusText ||
      "Terjadi kesalahan pada server.";
    const code = errorData.code || `HTTP_${response.status}`;

    throw new ApiError(message, response.status, code, errorData.details);
  }

  // 5. Handle empty responses (204 No Content)
  if (response.status === 204) return null;

  return response.json();
};

/**
 * Global error handler - menampilkan toast dan log
 */
const handleError = (error: any): never => {
  // 1. Determine message
  let message: string;
  let type: "error" | "warning" = "error";

  if (error instanceof ApiError) {
    message = error.message;
    // Network errors get warning style
    if (error.isNetworkError()) {
      message = "Gagal terhubung ke server. Periksa koneksi internet Anda.";
      type = "warning";
    }
  } else if (error.name === "TypeError" && error.message.includes("fetch")) {
    message = "Gagal terhubung ke server. Periksa koneksi internet Anda.";
    type = "warning";
  } else {
    message = error.message || "Terjadi kesalahan yang tidak terduga.";
  }

  // 2. Show toast notification
  useNotificationStore.getState().addToast(message, type);

  // 3. Log for debugging
  console.error("[API Error]", {
    message: error.message,
    status: error.status,
    code: error.code,
    stack: error.stack,
  });

  // 4. Re-throw for caller handling
  throw error;
};
```

### 3.3. Zustand Store Error Pattern

**Pola standar untuk action di Zustand store:**

```typescript
// src/stores/useAuthStore.ts

interface AuthState {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null; // ← Error state untuk UI

  login: (email: string, pass: string) => Promise<User>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  currentUser: null,
  isLoading: false,
  error: null,

  login: async (email, pass) => {
    // 1. Reset error dan set loading
    set({ isLoading: true, error: null });

    try {
      const user = await api.loginUser(email, pass);
      set({ currentUser: user, isLoading: false });
      return user;
    } catch (err: any) {
      // 2. Simpan error message ke state
      set({
        error: err.message || "Login gagal",
        isLoading: false,
      });
      // 3. Re-throw agar komponen bisa handle juga
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));
```

### 3.4. Component Error Handling

**Pola untuk menangani error di komponen:**

```tsx
// Pattern 1: Menggunakan error state dari store
const LoginPage = () => {
  const { login, isLoading, error, clearError } = useAuthStore();

  useEffect(() => {
    // Clear error saat component mount atau unmount
    return () => clearError();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      // Success - redirect handled by store
    } catch {
      // Error sudah di-handle oleh store dan toast
      // Bisa tambahkan logic tambahan di sini jika perlu
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="bg-danger-light text-danger-text p-3 rounded">
          {error}
        </div>
      )}
      {/* ... form fields */}
    </form>
  );
};

// Pattern 2: Try-Catch dalam event handler
const handleDelete = async () => {
  try {
    await deleteAsset(assetId);
    addToast("Aset berhasil dihapus", "success");
    navigate("/assets");
  } catch (error) {
    // Error sudah ditampilkan via global handler
    // Tambahkan recovery logic jika perlu
    console.log("Delete failed, keeping user on page");
  }
};
```

### 3.5. Error Boundary (React)

**Lokasi**: `src/components/ErrorBoundary.tsx`

```tsx
import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log ke monitoring service (Sentry, dll)
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-8 text-center">
            <h2 className="text-xl font-bold text-danger-text">
              Terjadi Kesalahan
            </h2>
            <p className="text-gray-600 mt-2">
              Silakan refresh halaman atau hubungi administrator.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-tm-primary text-white rounded"
            >
              Refresh Halaman
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

**Penggunaan di App.tsx:**

```tsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

---

## 4. Implementasi Backend (NestJS)

### 4.1. Custom Exception Classes

**Lokasi**: `src/common/exceptions/`

```typescript
// business.exception.ts
import { HttpException, HttpStatus } from "@nestjs/common";

export class BusinessException extends HttpException {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: Record<string, any>,
  ) {
    super(
      { message, code, details, statusCode: HttpStatus.UNPROCESSABLE_ENTITY },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}

// Contoh exceptions spesifik
export class InsufficientStockException extends BusinessException {
  constructor(itemName: string, available: number, requested: number) {
    super(`Stok ${itemName} tidak mencukupi`, "INSUFFICIENT_STOCK", {
      itemName,
      available,
      requested,
    });
  }
}

export class AssetAlreadyAssignedException extends BusinessException {
  constructor(assetId: string, currentUser: string) {
    super(
      `Aset sudah digunakan oleh ${currentUser}`,
      "ASSET_ALREADY_ASSIGNED",
      { assetId, currentUser },
    );
  }
}

export class RaceConditionException extends BusinessException {
  constructor(resource: string) {
    super(`${resource} telah diubah oleh pengguna lain`, "RACE_CONDITION", {
      resource,
    });
  }
}
```

### 4.2. Global Exception Filter

**Lokasi**: `src/common/filters/http-exception.filter.ts`

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger("ExceptionFilter");

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Terjadi kesalahan internal pada server";
    let code = "INTERNAL_ERROR";
    let details: any = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseBody = exception.getResponse();

      if (typeof responseBody === "object") {
        message = (responseBody as any).message || message;
        code = (responseBody as any).code || `HTTP_${status}`;
        details = (responseBody as any).details;
      } else {
        message = responseBody;
      }
    }

    // Log error dengan detail
    this.logger.error({
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      statusCode: status,
      code,
      message,
      userId: (request as any).user?.id,
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    // Response format yang konsisten
    response.status(status).json({
      success: false,
      statusCode: status,
      code,
      message,
      details,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

### 4.3. Validation Pipe dengan Error Formatting

```typescript
// main.ts
import { ValidationPipe } from "@nestjs/common";

app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (errors) => {
      const formattedErrors = errors.reduce(
        (acc, error) => {
          const field = error.property;
          const constraints = Object.values(error.constraints || {});
          acc[field] = constraints[0]; // Ambil pesan pertama
          return acc;
        },
        {} as Record<string, string>,
      );

      return new HttpException(
        {
          message: "Validasi gagal",
          code: "VALIDATION_ERROR",
          details: formattedErrors,
        },
        HttpStatus.BAD_REQUEST,
      );
    },
  }),
);
```

---

## 5. Peta Error Messages (Bahasa Indonesia)

### 5.1. Authentication & Authorization

| Kode                      | Pesan (User)                                    | Pesan (Log)                                     |
| ------------------------- | ----------------------------------------------- | ----------------------------------------------- |
| `INVALID_CREDENTIALS`     | Email atau password salah                       | Login attempt failed for email: {email}         |
| `SESSION_EXPIRED`         | Sesi Anda telah berakhir. Silakan login kembali | Token expired for user: {userId}                |
| `FORBIDDEN`               | Anda tidak memiliki izin untuk akses ini        | Access denied: {permission} for user: {userId}  |
| `ACCOUNT_LOCKED`          | Akun terkunci. Hubungi administrator            | Account locked after {attempts} failed attempts |
| `PASSWORD_RESET_REQUIRED` | Password perlu direset oleh administrator       | Password reset flag active for user: {userId}   |

### 5.2. Asset Management

| Kode                        | Pesan (User)                                               | Pesan (Log)                                    |
| --------------------------- | ---------------------------------------------------------- | ---------------------------------------------- |
| `ASSET_NOT_FOUND`           | Aset tidak ditemukan                                       | Asset query returned null: {assetId}           |
| `ASSET_ALREADY_ASSIGNED`    | Aset sudah digunakan oleh pengguna lain                    | Concurrent assignment attempt: {assetId}       |
| `DUPLICATE_SERIAL_NUMBER`   | Nomor seri sudah terdaftar dalam sistem                    | Unique constraint violation: serialNumber={sn} |
| `INVALID_STATUS_TRANSITION` | Perubahan status tidak diizinkan                           | Invalid transition: {from} → {to}              |
| `ASSET_HAS_DEPENDENCIES`    | Aset tidak dapat dihapus karena memiliki riwayat transaksi | Delete blocked: asset has {count} transactions |

### 5.3. Stock Management

| Kode                 | Pesan (User)                                       | Pesan (Log)                                       |
| -------------------- | -------------------------------------------------- | ------------------------------------------------- |
| `INSUFFICIENT_STOCK` | Stok {item} tidak mencukupi. Tersedia: {available} | Stock validation failed: need {need}, have {have} |
| `NEGATIVE_BALANCE`   | Saldo tidak boleh negatif                          | Balance would go negative: {current} - {deduct}   |
| `THRESHOLD_EXCEEDED` | Pengambilan melebihi batas harian                  | Daily threshold exceeded for {item}               |

### 5.4. Request Flow

| Kode                        | Pesan (User)                                          | Pesan (Log)                                        |
| --------------------------- | ----------------------------------------------------- | -------------------------------------------------- |
| `REQUEST_ALREADY_PROCESSED` | Request sudah diproses sebelumnya                     | Duplicate processing attempt: {requestId}          |
| `INVALID_APPROVAL_ORDER`    | Request harus disetujui oleh Logistik terlebih dahulu | Approval order violation: {step} before {required} |
| `CANNOT_CANCEL`             | Request tidak dapat dibatalkan pada status ini        | Cancel blocked: status={status}                    |

### 5.5. Network & System

| Kode                  | Pesan (User)                                           | Pesan (Log)                    |
| --------------------- | ------------------------------------------------------ | ------------------------------ |
| `NETWORK_ERROR`       | Gagal terhubung ke server. Periksa koneksi internet    | Fetch failed: {url}            |
| `TIMEOUT`             | Server tidak merespons. Silakan coba lagi              | Request timeout after {ms}ms   |
| `SERVICE_UNAVAILABLE` | Layanan sedang tidak tersedia. Silakan coba lagi nanti | Service unavailable: {service} |

---

## 6. Best Practices

### 6.1. DO's ✅

```typescript
// ✅ Gunakan custom error class
throw new ApiError("Stok tidak cukup", 422, "INSUFFICIENT_STOCK");

// ✅ Handle error spesifik
try {
  await assignAsset(assetId);
} catch (error) {
  if (error.code === "ASSET_ALREADY_ASSIGNED") {
    // Handle race condition
    refreshAssetList();
  }
  throw error;
}

// ✅ Berikan konteks pada error
throw new BusinessException(
  `Aset ${asset.name} tidak dapat dihapus`,
  "ASSET_HAS_DEPENDENCIES",
  { assetId: asset.id, transactionCount: 5 },
);

// ✅ Log dengan struktur yang konsisten
logger.error({
  context: "AssetService.delete",
  assetId,
  userId: currentUser.id,
  error: error.message,
});
```

### 6.2. DON'Ts ❌

```typescript
// ❌ Jangan throw string
throw "Something went wrong";

// ❌ Jangan silent fail
try {
  await saveData();
} catch (e) {
  // Silent! User tidak tahu ada error
}

// ❌ Jangan expose detail teknis ke user
throw new Error("SQLSTATE[23000]: Integrity constraint violation");

// ❌ Jangan generic message tanpa kode
throw new ApiError("Error", 500); // Sulit di-track

// ❌ Jangan log tanpa konteks
console.error(error); // Tidak ada info berguna
```

---

## 7. Monitoring & Alerting

### 7.1. Error Tracking Integration

Untuk production, integrasikan dengan layanan seperti **Sentry** atau **LogRocket**:

```typescript
// src/utils/errorTracking.ts
import * as Sentry from "@sentry/react";

export const initErrorTracking = () => {
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.VITE_ENV,
      tracesSampleRate: 0.1,
    });
  }
};

export const captureError = (error: Error, context?: Record<string, any>) => {
  if (import.meta.env.PROD) {
    Sentry.captureException(error, { extra: context });
  }
  console.error("[Tracked Error]", error, context);
};
```

### 7.2. Alert Thresholds

| Metrik        | Warning       | Critical      |
| ------------- | ------------- | ------------- |
| Error Rate    | > 1% requests | > 5% requests |
| 5xx Errors    | > 10/minute   | > 50/minute   |
| 401 Errors    | > 20/minute   | > 100/minute  |
| Response Time | > 2 seconds   | > 5 seconds   |

---

## 8. Checklist Review Error Handling

Gunakan checklist ini saat code review:

- [ ] Error menggunakan `ApiError` atau custom exception class
- [ ] Error memiliki kode yang unik dan dapat di-track
- [ ] Pesan error ramah pengguna (Bahasa Indonesia)
- [ ] Error di-log dengan konteks yang cukup
- [ ] Sensitive data tidak terexpose dalam error message
- [ ] Network error di-handle dengan graceful degradation
- [ ] Loading state di-reset saat error terjadi
- [ ] User diberikan opsi recovery (retry, refresh, dll)
