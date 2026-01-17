# Katalog Kode Error API (API Error Codes Reference)

Dokumen ini berisi katalog lengkap kode error yang digunakan dalam komunikasi antara Frontend dan Backend Trinity Asset Flow. Setiap error memiliki kode unik, HTTP status, dan pesan standar.

---

## 1. Format Response Error

### 1.1. Struktur Response Error

Semua error dari API harus mengikuti format berikut:

```json
{
  "success": false,
  "statusCode": 400,
  "code": "VALIDATION_ERROR",
  "message": "Validasi gagal. Periksa kembali input Anda.",
  "details": {
    "email": "Format email tidak valid",
    "quantity": "Quantity harus lebih dari 0"
  },
  "timestamp": "2026-01-17T10:30:00.000Z",
  "path": "/api/requests"
}
```

### 1.2. Field Definitions

| Field        | Type      | Required | Description                                   |
| ------------ | --------- | -------- | --------------------------------------------- |
| `success`    | `boolean` | ✅       | Selalu `false` untuk error                    |
| `statusCode` | `number`  | ✅       | HTTP status code                              |
| `code`       | `string`  | ✅       | Kode error unik (UPPER_SNAKE_CASE)            |
| `message`    | `string`  | ✅       | Pesan error (Bahasa Indonesia)                |
| `details`    | `object`  | ❌       | Detail tambahan (field-level errors, context) |
| `timestamp`  | `string`  | ✅       | ISO 8601 timestamp                            |
| `path`       | `string`  | ✅       | Endpoint yang dipanggil                       |

---

## 2. HTTP Status Code Mapping

| Status  | Category       | Meaning                                  | Aksi User                |
| ------- | -------------- | ---------------------------------------- | ------------------------ |
| **400** | Client Error   | Bad Request / Validation Error           | Perbaiki input           |
| **401** | Authentication | Unauthorized (Token invalid/expired)     | Login ulang              |
| **403** | Authorization  | Forbidden (Tidak punya izin)             | Hubungi admin            |
| **404** | Not Found      | Resource tidak ditemukan                 | Refresh / navigasi ulang |
| **409** | Conflict       | Konflik data (race condition, duplicate) | Refresh dan coba lagi    |
| **422** | Business Error | Unprocessable Entity (Logic error)       | Sesuaikan aksi           |
| **429** | Rate Limit     | Too Many Requests                        | Tunggu sebentar          |
| **500** | Server Error   | Internal Server Error                    | Hubungi support          |
| **503** | Server Error   | Service Unavailable                      | Coba lagi nanti          |

---

## 3. Error Code Registry

### 3.1. Authentication Errors (AUTH\_\*)

| Code                            | Status | Message                                                                    | Details                                     |
| ------------------------------- | ------ | -------------------------------------------------------------------------- | ------------------------------------------- |
| `AUTH_INVALID_CREDENTIALS`      | 401    | Email atau password salah                                                  | -                                           |
| `AUTH_SESSION_EXPIRED`          | 401    | Sesi Anda telah berakhir. Silakan login kembali                            | `{ expiredAt: string }`                     |
| `AUTH_TOKEN_INVALID`            | 401    | Token tidak valid                                                          | -                                           |
| `AUTH_TOKEN_MISSING`            | 401    | Token autentikasi diperlukan                                               | -                                           |
| `AUTH_ACCOUNT_LOCKED`           | 403    | Akun terkunci karena terlalu banyak percobaan gagal. Hubungi administrator | `{ lockedUntil: string, attempts: number }` |
| `AUTH_PASSWORD_RESET_REQUIRED`  | 403    | Password perlu direset. Hubungi administrator                              | `{ requestedAt: string }`                   |
| `AUTH_INSUFFICIENT_PERMISSIONS` | 403    | Anda tidak memiliki izin untuk aksi ini                                    | `{ required: string[], current: string[] }` |

**Frontend Handling:**

```typescript
if (
  error.code === "AUTH_SESSION_EXPIRED" ||
  error.code === "AUTH_TOKEN_INVALID"
) {
  useAuthStore.getState().logout();
  window.location.href = "/";
}
```

---

### 3.2. Validation Errors (VALIDATION\_\*)

| Code                              | Status | Message                                    | Details                               |
| --------------------------------- | ------ | ------------------------------------------ | ------------------------------------- |
| `VALIDATION_ERROR`                | 400    | Validasi gagal. Periksa kembali input Anda | `{ [field]: string }`                 |
| `VALIDATION_REQUIRED_FIELD`       | 400    | Field {field} wajib diisi                  | `{ field: string }`                   |
| `VALIDATION_INVALID_FORMAT`       | 400    | Format {field} tidak valid                 | `{ field: string, expected: string }` |
| `VALIDATION_MIN_LENGTH`           | 400    | {field} minimal {min} karakter             | `{ field: string, min: number }`      |
| `VALIDATION_MAX_LENGTH`           | 400    | {field} maksimal {max} karakter            | `{ field: string, max: number }`      |
| `VALIDATION_MIN_VALUE`            | 400    | {field} minimal {min}                      | `{ field: string, min: number }`      |
| `VALIDATION_MAX_VALUE`            | 400    | {field} maksimal {max}                     | `{ field: string, max: number }`      |
| `VALIDATION_INVALID_EMAIL`        | 400    | Format email tidak valid                   | -                                     |
| `VALIDATION_INVALID_DATE`         | 400    | Format tanggal tidak valid                 | `{ expected: 'YYYY-MM-DD' }`          |
| `VALIDATION_FUTURE_DATE_REQUIRED` | 400    | Tanggal harus di masa depan                | -                                     |
| `VALIDATION_PAST_DATE_REQUIRED`   | 400    | Tanggal harus di masa lalu                 | -                                     |

**Details Format Example:**

```json
{
  "code": "VALIDATION_ERROR",
  "details": {
    "email": "Format email tidak valid",
    "items[0].quantity": "Quantity harus lebih dari 0",
    "items[1].itemName": "Nama item wajib diisi"
  }
}
```

---

### 3.3. Asset Errors (ASSET\_\*)

| Code                              | Status | Message                                                    | Details                                             |
| --------------------------------- | ------ | ---------------------------------------------------------- | --------------------------------------------------- |
| `ASSET_NOT_FOUND`                 | 404    | Aset dengan ID {id} tidak ditemukan                        | `{ assetId: string }`                               |
| `ASSET_ALREADY_ASSIGNED`          | 409    | Aset sudah digunakan oleh {currentUser}                    | `{ assetId: string, currentUser: string }`          |
| `ASSET_NOT_AVAILABLE`             | 409    | Aset tidak tersedia untuk operasi ini                      | `{ assetId: string, currentStatus: string }`        |
| `ASSET_DUPLICATE_SERIAL`          | 409    | Nomor seri {serialNumber} sudah terdaftar                  | `{ serialNumber: string, existingAssetId: string }` |
| `ASSET_DUPLICATE_MAC`             | 409    | MAC Address {macAddress} sudah terdaftar                   | `{ macAddress: string, existingAssetId: string }`   |
| `ASSET_INVALID_STATUS_TRANSITION` | 422    | Perubahan status dari {from} ke {to} tidak diizinkan       | `{ from: string, to: string, allowed: string[] }`   |
| `ASSET_HAS_DEPENDENCIES`          | 422    | Aset tidak dapat dihapus karena memiliki riwayat transaksi | `{ transactionCount: number, types: string[] }`     |
| `ASSET_UNDER_MAINTENANCE`         | 422    | Aset sedang dalam perbaikan dan tidak dapat dioperasikan   | `{ assetId: string, repairId: string }`             |

---

### 3.4. Stock Errors (STOCK\_\*)

| Code                             | Status | Message                                                                      | Details                                                                     |
| -------------------------------- | ------ | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `STOCK_INSUFFICIENT`             | 422    | Stok {itemName} tidak mencukupi. Tersedia: {available}, Diminta: {requested} | `{ itemName: string, brand: string, available: number, requested: number }` |
| `STOCK_NEGATIVE_BALANCE`         | 422    | Operasi akan menyebabkan saldo negatif                                       | `{ current: number, deduction: number }`                                    |
| `STOCK_THRESHOLD_EXCEEDED`       | 422    | Pengambilan melebihi batas yang diizinkan                                    | `{ threshold: number, requested: number }`                                  |
| `STOCK_RESERVED`                 | 409    | Stok sudah dialokasikan untuk request lain                                   | `{ reservedFor: string, quantity: number }`                                 |
| `STOCK_MEASUREMENT_INSUFFICIENT` | 422    | Sisa {item} tidak cukup. Tersedia: {available}{unit}                         | `{ itemName: string, available: number, unit: string, requested: number }`  |

---

### 3.5. Request Errors (REQUEST\_\*)

| Code                             | Status | Message                                                         | Details                                                                                  |
| -------------------------------- | ------ | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `REQUEST_NOT_FOUND`              | 404    | Request dengan ID {id} tidak ditemukan                          | `{ requestId: string }`                                                                  |
| `REQUEST_ALREADY_PROCESSED`      | 409    | Request sudah diproses sebelumnya                               | `{ requestId: string, currentStatus: string, processedBy: string, processedAt: string }` |
| `REQUEST_INVALID_APPROVAL_ORDER` | 422    | Request harus disetujui oleh {requiredApprover} terlebih dahulu | `{ currentStatus: string, requiredApprover: string }`                                    |
| `REQUEST_CANNOT_CANCEL`          | 422    | Request tidak dapat dibatalkan pada status {status}             | `{ requestId: string, currentStatus: string }`                                           |
| `REQUEST_CANNOT_MODIFY`          | 422    | Request tidak dapat diubah setelah diproses                     | `{ requestId: string, currentStatus: string }`                                           |
| `REQUEST_ITEMS_EMPTY`            | 400    | Request harus memiliki minimal 1 item                           | -                                                                                        |
| `REQUEST_DUPLICATE_ITEMS`        | 400    | Terdapat item duplikat dalam request                            | `{ duplicates: string[] }`                                                               |
| `REQUEST_INVALID_PRIORITY`       | 422    | Anda tidak memiliki izin untuk membuat request {priority}       | `{ priority: string, requiredRole: string[] }`                                           |

---

### 3.6. Loan Request Errors (LOAN\_\*)

| Code                     | Status | Message                                                                    | Details                                    |
| ------------------------ | ------ | -------------------------------------------------------------------------- | ------------------------------------------ |
| `LOAN_NOT_FOUND`         | 404    | Request peminjaman tidak ditemukan                                         | `{ loanId: string }`                       |
| `LOAN_ALREADY_ASSIGNED`  | 409    | Aset sudah ditetapkan untuk peminjaman lain                                | `{ assetId: string, assignedTo: string }`  |
| `LOAN_OVERDUE`           | 422    | Peminjaman sudah melewati batas waktu. Proses pengembalian terlebih dahulu | `{ dueDate: string, overdueDays: number }` |
| `LOAN_RETURN_MISMATCH`   | 422    | Jumlah aset yang dikembalikan tidak sesuai                                 | `{ expected: number, returned: number }`   |
| `LOAN_ASSET_NOT_IN_LOAN` | 422    | Aset {assetId} tidak termasuk dalam peminjaman ini                         | `{ assetId: string, loanId: string }`      |

---

### 3.7. Transaction Errors (TRANSACTION\_\*)

| Code                             | Status | Message                                                            | Details                                      |
| -------------------------------- | ------ | ------------------------------------------------------------------ | -------------------------------------------- |
| `TRANSACTION_NOT_FOUND`          | 404    | Transaksi tidak ditemukan                                          | `{ transactionId: string, type: string }`    |
| `HANDOVER_INVALID_RECIPIENT`     | 422    | Penerima tidak valid untuk serah terima ini                        | `{ recipientId: number }`                    |
| `DISMANTLE_ASSET_NOT_INSTALLED`  | 422    | Aset tidak dalam status terinstall di pelanggan                    | `{ assetId: string, currentStatus: string }` |
| `INSTALLATION_CUSTOMER_INACTIVE` | 422    | Pelanggan dalam status {status} dan tidak dapat menerima instalasi | `{ customerId: string, status: string }`     |
| `MAINTENANCE_INVALID_TYPE`       | 400    | Tipe maintenance tidak valid                                       | `{ provided: string, allowed: string[] }`    |

---

### 3.8. Customer Errors (CUSTOMER\_\*)

| Code                         | Status | Message                                                             | Details                  |
| ---------------------------- | ------ | ------------------------------------------------------------------- | ------------------------ |
| `CUSTOMER_NOT_FOUND`         | 404    | Pelanggan tidak ditemukan                                           | `{ customerId: string }` |
| `CUSTOMER_HAS_ACTIVE_ASSETS` | 422    | Pelanggan tidak dapat dihapus karena masih memiliki aset terinstall | `{ assetCount: number }` |
| `CUSTOMER_DUPLICATE_EMAIL`   | 409    | Email pelanggan sudah terdaftar                                     | `{ email: string }`      |

---

### 3.9. User Errors (USER\_\*)

| Code                           | Status | Message                                                   | Details                                |
| ------------------------------ | ------ | --------------------------------------------------------- | -------------------------------------- |
| `USER_NOT_FOUND`               | 404    | Pengguna tidak ditemukan                                  | `{ userId: number }`                   |
| `USER_DUPLICATE_EMAIL`         | 409    | Email sudah digunakan oleh pengguna lain                  | `{ email: string }`                    |
| `USER_CANNOT_DELETE_SELF`      | 422    | Anda tidak dapat menghapus akun sendiri                   | -                                      |
| `USER_CANNOT_MODIFY_ROLE_SELF` | 422    | Anda tidak dapat mengubah role sendiri                    | -                                      |
| `USER_HAS_ACTIVE_TRANSACTIONS` | 422    | Pengguna memiliki transaksi aktif dan tidak dapat dihapus | `{ transactionCount: number }`         |
| `USER_INVALID_PERMISSION`      | 400    | Permission {permission} tidak valid untuk role {role}     | `{ permission: string, role: string }` |

---

### 3.10. Category Errors (CATEGORY\_\*)

| Code                      | Status | Message                                                    | Details                  |
| ------------------------- | ------ | ---------------------------------------------------------- | ------------------------ |
| `CATEGORY_NOT_FOUND`      | 404    | Kategori tidak ditemukan                                   | `{ categoryId: number }` |
| `CATEGORY_IN_USE`         | 422    | Kategori tidak dapat dihapus karena memiliki aset terkait  | `{ assetCount: number }` |
| `CATEGORY_DUPLICATE_NAME` | 409    | Nama kategori sudah ada                                    | `{ name: string }`       |
| `TYPE_IN_USE`             | 422    | Tipe aset tidak dapat dihapus karena memiliki aset terkait | `{ assetCount: number }` |

---

### 3.11. System Errors (SYSTEM\_\*)

| Code                            | Status | Message                                                   | Details                        |
| ------------------------------- | ------ | --------------------------------------------------------- | ------------------------------ |
| `SYSTEM_INTERNAL_ERROR`         | 500    | Terjadi kesalahan internal pada server                    | `{ traceId: string }`          |
| `SYSTEM_DATABASE_ERROR`         | 500    | Terjadi kesalahan pada database                           | `{ traceId: string }`          |
| `SYSTEM_EXTERNAL_SERVICE_ERROR` | 502    | Layanan eksternal tidak merespons                         | `{ service: string }`          |
| `SYSTEM_MAINTENANCE`            | 503    | Sistem sedang dalam pemeliharaan. Silakan coba lagi nanti | `{ estimatedEndTime: string }` |
| `SYSTEM_RATE_LIMITED`           | 429    | Terlalu banyak permintaan. Silakan tunggu sebentar        | `{ retryAfter: number }`       |

---

### 3.12. Network/Client Errors (NETWORK\_\*)

| Code              | Status | Message                                                  | Details               |
| ----------------- | ------ | -------------------------------------------------------- | --------------------- |
| `NETWORK_ERROR`   | -      | Gagal terhubung ke server. Periksa koneksi internet Anda | -                     |
| `NETWORK_TIMEOUT` | -      | Server tidak merespons. Silakan coba lagi                | `{ timeout: number }` |
| `NETWORK_OFFLINE` | -      | Anda sedang offline. Periksa koneksi internet            | -                     |

---

## 4. Frontend Error Handling Matrix

### 4.1. Error Response Actions

| Error Code Pattern    | Toast Type | Auto-Action       | Recovery UI       |
| --------------------- | ---------- | ----------------- | ----------------- |
| `AUTH_SESSION_*`      | -          | Logout + Redirect | -                 |
| `AUTH_INSUFFICIENT_*` | error      | -                 | "Hubungi Admin"   |
| `VALIDATION_*`        | -          | -                 | Highlight fields  |
| `*_NOT_FOUND`         | warning    | -                 | "Kembali" button  |
| `*_CONFLICT`          | warning    | Auto-refresh      | "Refresh" button  |
| `STOCK_*`             | warning    | -                 | Show availability |
| `SYSTEM_*`            | error      | -                 | "Coba Lagi"       |
| `NETWORK_*`           | warning    | -                 | "Retry" button    |

### 4.2. Implementation Example

```typescript
// services/api.ts

const handleApiError = (error: ApiError): void => {
  const { addToast } = useNotificationStore.getState();

  switch (true) {
    // Auth errors - auto logout
    case error.code?.startsWith("AUTH_SESSION"):
    case error.code === "AUTH_TOKEN_INVALID":
      useAuthStore.getState().logout();
      window.location.href = "/";
      break;

    // Validation errors - show in form
    case error.code === "VALIDATION_ERROR":
      // Error details will be handled by form component
      break;

    // Conflict errors - suggest refresh
    case error.status === 409:
      addToast(error.message, "warning", {
        duration: 10000,
        actions: [
          { label: "Refresh", onClick: () => window.location.reload() },
        ],
      });
      break;

    // Stock errors - show details
    case error.code?.startsWith("STOCK_"):
      const stockDetails = error.details as {
        available: number;
        requested: number;
      };
      addToast(
        `${error.message} (Tersedia: ${stockDetails?.available || 0})`,
        "warning",
      );
      break;

    // System errors - generic message
    case error.status >= 500:
      addToast("Terjadi kesalahan server. Silakan coba lagi.", "error");
      break;

    // Default
    default:
      addToast(error.message, "error");
  }
};
```

---

## 5. Backend Implementation

### 5.1. Throwing Custom Errors (NestJS)

```typescript
// src/common/exceptions/index.ts

import { HttpException, HttpStatus } from "@nestjs/common";

export class AppException extends HttpException {
  constructor(
    public readonly code: string,
    message: string,
    status: HttpStatus,
    public readonly details?: Record<string, any>,
  ) {
    super({ code, message, details }, status);
  }
}

// Specific exceptions
export class AssetNotFoundException extends AppException {
  constructor(assetId: string) {
    super(
      "ASSET_NOT_FOUND",
      `Aset dengan ID ${assetId} tidak ditemukan`,
      HttpStatus.NOT_FOUND,
      { assetId },
    );
  }
}

export class InsufficientStockException extends AppException {
  constructor(
    itemName: string,
    brand: string,
    available: number,
    requested: number,
  ) {
    super(
      "STOCK_INSUFFICIENT",
      `Stok ${itemName} tidak mencukupi. Tersedia: ${available}, Diminta: ${requested}`,
      HttpStatus.UNPROCESSABLE_ENTITY,
      { itemName, brand, available, requested },
    );
  }
}

export class RaceConditionException extends AppException {
  constructor(resource: string, currentHolder?: string) {
    super(
      "ASSET_ALREADY_ASSIGNED",
      `${resource} sudah digunakan oleh ${currentHolder || "pengguna lain"}`,
      HttpStatus.CONFLICT,
      { resource, currentHolder },
    );
  }
}
```

### 5.2. Usage in Services

```typescript
// src/assets/assets.service.ts

async assignAsset(assetId: string, userId: number): Promise<Asset> {
    return this.prisma.$transaction(async (tx) => {
        // Lock row for update
        const asset = await tx.asset.findUnique({
            where: { id: assetId }
        });

        if (!asset) {
            throw new AssetNotFoundException(assetId);
        }

        if (asset.status !== AssetStatus.IN_STORAGE) {
            throw new RaceConditionException(
                asset.name,
                asset.currentUser || undefined
            );
        }

        // Proceed with assignment
        return tx.asset.update({
            where: { id: assetId },
            data: { status: AssetStatus.IN_USE, currentUserId: userId }
        });
    });
}
```

---

## 6. Error Localization

### 6.1. Message Templates

```typescript
// src/common/i18n/error-messages.ts

export const ERROR_MESSAGES: Record<string, string> = {
  // Auth
  AUTH_INVALID_CREDENTIALS: "Email atau password salah",
  AUTH_SESSION_EXPIRED: "Sesi Anda telah berakhir. Silakan login kembali",

  // Validation
  VALIDATION_REQUIRED: "{field} wajib diisi",
  VALIDATION_MIN_LENGTH: "{field} minimal {min} karakter",

  // Asset
  ASSET_NOT_FOUND: "Aset dengan ID {assetId} tidak ditemukan",
  ASSET_ALREADY_ASSIGNED: "Aset sudah digunakan oleh {currentUser}",

  // Stock
  STOCK_INSUFFICIENT:
    "Stok {itemName} tidak mencukupi. Tersedia: {available}, Diminta: {requested}",

  // ... etc
};

export const formatErrorMessage = (
  code: string,
  params: Record<string, any> = {},
): string => {
  let message = ERROR_MESSAGES[code] || "Terjadi kesalahan";

  Object.entries(params).forEach(([key, value]) => {
    message = message.replace(`{${key}}`, String(value));
  });

  return message;
};
```

---

## 7. Monitoring & Alerting

### 7.1. Error Tracking Metrics

| Metric                | Threshold        | Alert Level |
| --------------------- | ---------------- | ----------- |
| 5xx error rate        | > 1% of requests | 🔴 Critical |
| 401 error spike       | > 50/minute      | 🟡 Warning  |
| 409 conflicts         | > 20/minute      | 🟡 Warning  |
| Average response time | > 2 seconds      | 🟡 Warning  |

### 7.2. Sentry Integration

```typescript
// Error context untuk Sentry
Sentry.captureException(error, {
  tags: {
    errorCode: error.code,
    httpStatus: error.status,
    endpoint: request.url,
  },
  extra: {
    userId: request.user?.id,
    requestBody: sanitizeBody(request.body),
    errorDetails: error.details,
  },
});
```

---

## 8. Quick Reference Card

```
┌────────────────────────────────────────────────────────────────┐
│                    ERROR CODE QUICK REFERENCE                  │
├────────────────────────────────────────────────────────────────┤
│ 400 - VALIDATION_*      → Show field errors                   │
│ 401 - AUTH_*            → Redirect to login                   │
│ 403 - AUTH_INSUFFICIENT → Show "access denied"                │
│ 404 - *_NOT_FOUND       → Show "not found" + back button      │
│ 409 - *_CONFLICT        → Suggest refresh                     │
│ 422 - STOCK_*, REQUEST_ → Show business error                 │
│ 429 - RATE_LIMITED      → Show countdown + retry              │
│ 500 - SYSTEM_*          → Show generic error + trace ID       │
│ 503 - MAINTENANCE       → Show maintenance message            │
└────────────────────────────────────────────────────────────────┘
```
