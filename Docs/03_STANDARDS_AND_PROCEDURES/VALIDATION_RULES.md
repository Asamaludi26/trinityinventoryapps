# Aturan Validasi Data (Validation Rules)

Dokumen ini mendefinisikan aturan validasi untuk semua input data di aplikasi Trinity Asset Flow. Validasi diterapkan baik di Frontend (untuk UX) maupun Backend (untuk keamanan).

---

## 1. Prinsip Validasi

### 1.1. Defense in Depth

```
┌─────────────────────────────────────────────────────────────┐
│                    VALIDATION LAYERS                        │
├─────────────────────────────────────────────────────────────┤
│  Layer 1: HTML5 Validation    (Browser-level)              │
│  ├─ required, type="email", min, max, pattern              │
├─────────────────────────────────────────────────────────────┤
│  Layer 2: Frontend Validation  (React/Form-level)          │
│  ├─ Custom validation functions                            │
│  ├─ Cross-field validation                                 │
│  ├─ Async validation (duplicate check)                     │
├─────────────────────────────────────────────────────────────┤
│  Layer 3: Backend Validation   (NestJS/DTO-level)          │
│  ├─ class-validator decorators                             │
│  ├─ Custom validation pipes                                │
│  ├─ Database constraints                                   │
├─────────────────────────────────────────────────────────────┤
│  Layer 4: Database Constraints (PostgreSQL-level)          │
│  ├─ NOT NULL, UNIQUE, CHECK, FOREIGN KEY                   │
└─────────────────────────────────────────────────────────────┘
```

### 1.2. Prinsip Utama

| Prinsip                   | Deskripsi                                                       |
| ------------------------- | --------------------------------------------------------------- |
| **Never Trust Input**     | Validasi ulang di backend meskipun sudah divalidasi di frontend |
| **Fail Fast**             | Validasi sebelum proses bisnis dimulai                          |
| **Clear Feedback**        | Pesan error harus spesifik dan actionable                       |
| **Sanitize Before Store** | Bersihkan data sebelum menyimpan ke database                    |

---

## 2. Validasi Per Entity

### 2.1. User

| Field         | Type   | Required | Validation Rules                                                                      |
| ------------- | ------ | -------- | ------------------------------------------------------------------------------------- |
| `name`        | string | ✅       | Min 2, Max 100 chars. Hanya huruf, spasi, titik                                       |
| `email`       | string | ✅       | Format email valid. Unique di database                                                |
| `role`        | enum   | ✅       | Salah satu dari: `Super Admin`, `Admin Logistik`, `Admin Purchase`, `Leader`, `Staff` |
| `divisionId`  | number | ⚠️       | Required jika role = Staff atau Leader                                                |
| `permissions` | array  | ✅       | Array of valid Permission strings                                                     |
| `password`    | string | ✅       | Min 8 chars. Kombinasi huruf besar, huruf kecil, angka                                |

**Validation Code (Frontend):**

```typescript
const validateUser = (user: Partial<User>): Record<string, string> => {
  const errors: Record<string, string> = {};

  // Name validation
  if (!user.name?.trim()) {
    errors.name = "Nama wajib diisi";
  } else if (user.name.length < 2) {
    errors.name = "Nama minimal 2 karakter";
  } else if (!/^[a-zA-Z\s.]+$/.test(user.name)) {
    errors.name = "Nama hanya boleh mengandung huruf, spasi, dan titik";
  }

  // Email validation
  if (!user.email?.trim()) {
    errors.email = "Email wajib diisi";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
    errors.email = "Format email tidak valid";
  }

  // Role-specific validation
  if ((user.role === "Staff" || user.role === "Leader") && !user.divisionId) {
    errors.divisionId = "Divisi wajib dipilih untuk role ini";
  }

  return errors;
};
```

**Validation Code (Backend - NestJS DTO):**

```typescript
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  MinLength,
  MaxLength,
  ValidateIf,
  IsInt,
  ArrayNotEmpty,
  IsIn,
} from "class-validator";

export class CreateUserDto {
  @IsNotEmpty({ message: "Nama wajib diisi" })
  @MinLength(2, { message: "Nama minimal 2 karakter" })
  @MaxLength(100, { message: "Nama maksimal 100 karakter" })
  name: string;

  @IsEmail({}, { message: "Format email tidak valid" })
  email: string;

  @IsEnum(UserRole, { message: "Role tidak valid" })
  role: UserRole;

  @ValidateIf((o) => ["Staff", "Leader"].includes(o.role))
  @IsInt({ message: "Divisi harus berupa ID yang valid" })
  divisionId?: number;

  @ArrayNotEmpty({ message: "Minimal satu permission harus dipilih" })
  @IsIn(ALL_PERMISSION_KEYS, { each: true, message: "Permission tidak valid" })
  permissions: string[];
}
```

---

### 2.2. Asset

| Field             | Type   | Required | Validation Rules                                    |
| ----------------- | ------ | -------- | --------------------------------------------------- |
| `name`            | string | ✅       | Min 2, Max 200 chars                                |
| `category`        | string | ✅       | Harus ada di daftar kategori                        |
| `type`            | string | ✅       | Harus ada di daftar tipe (sesuai kategori)          |
| `brand`           | string | ✅       | Min 1, Max 100 chars                                |
| `serialNumber`    | string | ⚠️       | Required jika trackingMethod = individual. Unique   |
| `macAddress`      | string | ❌       | Format MAC Address valid (jika diisi)               |
| `purchasePrice`   | number | ⚠️       | Required jika role = Admin Purchase. Min 0          |
| `purchaseDate`    | date   | ❌       | Tidak boleh di masa depan                           |
| `warrantyEndDate` | date   | ❌       | Harus setelah purchaseDate (jika keduanya diisi)    |
| `status`          | enum   | ✅       | Salah satu dari AssetStatus enum                    |
| `condition`       | enum   | ✅       | Salah satu dari AssetCondition enum                 |
| `initialBalance`  | number | ⚠️       | Required jika bulkType = measurement. Min 1         |
| `quantity`        | number | ⚠️       | Required jika trackingMethod = bulk. Min 1, integer |

**Validation Rules Detail:**

```typescript
// Serial Number Format (contoh format perusahaan)
const SN_PATTERN = /^[A-Z0-9]{5,30}$/;

// MAC Address Format (dengan atau tanpa separator)
const MAC_PATTERN =
  /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$|^([0-9A-Fa-f]{12})$/;

// Price validation (Rupiah)
const validatePrice = (price: number): boolean => {
  return price >= 0 && price <= 100_000_000_000; // Max 100 Miliar
};

// Quantity validation
const validateQuantity = (qty: number): boolean => {
  return Number.isInteger(qty) && qty > 0 && qty <= 999_999;
};
```

**Cross-Field Validation:**

```typescript
const validateAsset = (
  asset: Partial<Asset>,
  categories: AssetCategory[],
): Record<string, string> => {
  const errors: Record<string, string> = {};

  // Category-Type Relationship
  const category = categories.find((c) => c.name === asset.category);
  if (!category) {
    errors.category = "Kategori tidak valid";
  } else {
    const type = category.types.find((t) => t.name === asset.type);
    if (!type) {
      errors.type = "Tipe tidak valid untuk kategori ini";
    } else {
      // Tracking Method Validation
      if (type.trackingMethod === "individual" && !asset.serialNumber?.trim()) {
        errors.serialNumber = "Serial Number wajib untuk tipe aset ini";
      }

      if (type.trackingMethod === "bulk") {
        // Bulk items tidak boleh punya SN
        if (asset.serialNumber) {
          errors.serialNumber = "Tipe bulk tidak memerlukan Serial Number";
        }

        // Check measurement vs count
        const bulkType = type.standardItems?.find(
          (si) => si.name === asset.name && si.brand === asset.brand,
        )?.bulkType;

        if (bulkType === "measurement" && !asset.initialBalance) {
          errors.initialBalance =
            "Saldo awal wajib diisi untuk item measurement";
        }

        if (bulkType === "count" && !asset.quantity) {
          errors.quantity = "Jumlah wajib diisi untuk item bulk";
        }
      }
    }
  }

  // Date Validation
  if (asset.purchaseDate && asset.warrantyEndDate) {
    if (new Date(asset.warrantyEndDate) < new Date(asset.purchaseDate)) {
      errors.warrantyEndDate =
        "Tanggal garansi harus setelah tanggal pembelian";
    }
  }

  return errors;
};
```

---

### 2.3. Request (Procurement)

| Field                   | Type   | Required | Validation Rules                                             |
| ----------------------- | ------ | -------- | ------------------------------------------------------------ |
| `requester`             | string | ✅       | Nama user yang valid                                         |
| `division`              | string | ✅       | Nama divisi yang valid                                       |
| `requestDate`           | date   | ✅       | Tidak boleh di masa depan                                    |
| `order.type`            | enum   | ✅       | `Regular Stock`, `Urgent`, atau `Project Based`              |
| `order.justification`   | string | ⚠️       | Required jika type = Urgent atau Project Based. Min 10 chars |
| `order.project`         | string | ⚠️       | Required jika type = Project Based                           |
| `items`                 | array  | ✅       | Min 1 item                                                   |
| `items[].itemName`      | string | ✅       | Min 2 chars                                                  |
| `items[].itemTypeBrand` | string | ✅       | Format: "Type - Brand"                                       |
| `items[].quantity`      | number | ✅       | Min 1, integer positif                                       |

**Request Type Validation:**

```typescript
const validateRequest = (
  request: Partial<Request>,
  userRole: UserRole,
): Record<string, string> => {
  const errors: Record<string, string> = {};

  // Urgent/Project validation
  if (
    request.order?.type === "Urgent" ||
    request.order?.type === "Project Based"
  ) {
    // Permission check
    if (userRole === "Staff") {
      errors["order.type"] =
        "Anda tidak memiliki izin untuk membuat request Urgent/Project";
    }

    // Justification required
    if (!request.order?.justification?.trim()) {
      errors["order.justification"] =
        "Justifikasi wajib diisi untuk request Urgent/Project";
    } else if (request.order.justification.length < 10) {
      errors["order.justification"] = "Justifikasi minimal 10 karakter";
    }

    // Project name required for Project Based
    if (
      request.order?.type === "Project Based" &&
      !request.order?.project?.trim()
    ) {
      errors["order.project"] = "Nama proyek wajib diisi";
    }
  }

  // Items validation
  if (!request.items || request.items.length === 0) {
    errors.items = "Minimal 1 item harus ditambahkan";
  } else {
    request.items.forEach((item, index) => {
      if (!item.itemName?.trim()) {
        errors[`items[${index}].itemName`] = "Nama item wajib diisi";
      }
      if (item.quantity < 1) {
        errors[`items[${index}].quantity`] = "Quantity minimal 1";
      }
      if (!Number.isInteger(item.quantity)) {
        errors[`items[${index}].quantity`] = "Quantity harus bilangan bulat";
      }
    });

    // Duplicate check
    const itemKeys = request.items.map(
      (i) => `${i.itemName}|${i.itemTypeBrand}`,
    );
    const duplicates = itemKeys.filter(
      (key, idx) => itemKeys.indexOf(key) !== idx,
    );
    if (duplicates.length > 0) {
      errors.items = "Terdapat item duplikat dalam request";
    }
  }

  return errors;
};
```

---

### 2.4. Loan Request

| Field                | Type   | Required | Validation Rules                                  |
| -------------------- | ------ | -------- | ------------------------------------------------- |
| `requester`          | string | ✅       | Nama user yang valid                              |
| `division`           | string | ✅       | Nama divisi yang valid                            |
| `requestDate`        | date   | ✅       | Tidak boleh di masa depan                         |
| `items`              | array  | ✅       | Min 1 item                                        |
| `items[].itemName`   | string | ✅       | Min 2 chars                                       |
| `items[].quantity`   | number | ✅       | Min 1, integer positif                            |
| `items[].returnDate` | date   | ✅       | Harus di masa depan, max 30 hari dari requestDate |

**Return Date Validation:**

```typescript
const MAX_LOAN_DAYS = 30;

const validateLoanItem = (
  item: LoanItem,
  requestDate: string,
): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!item.returnDate) {
    errors.returnDate = "Tanggal pengembalian wajib diisi";
  } else {
    const returnDate = new Date(item.returnDate);
    const reqDate = new Date(requestDate);
    const today = new Date();

    // Must be in future
    if (returnDate <= today) {
      errors.returnDate = "Tanggal pengembalian harus di masa depan";
    }

    // Max loan duration
    const diffDays = Math.ceil(
      (returnDate.getTime() - reqDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays > MAX_LOAN_DAYS) {
      errors.returnDate = `Maksimal peminjaman ${MAX_LOAN_DAYS} hari`;
    }
  }

  return errors;
};
```

---

### 2.5. Customer

| Field            | Type   | Required | Validation Rules                       |
| ---------------- | ------ | -------- | -------------------------------------- |
| `name`           | string | ✅       | Min 3, Max 200 chars                   |
| `address`        | string | ✅       | Min 10, Max 500 chars                  |
| `phone`          | string | ✅       | Format telepon Indonesia valid         |
| `email`          | string | ✅       | Format email valid                     |
| `status`         | enum   | ✅       | `Active`, `Inactive`, atau `Suspended` |
| `servicePackage` | string | ✅       | Min 1 char                             |

**Phone Number Validation:**

```typescript
// Indonesian phone number formats
const PHONE_PATTERNS = {
  mobile: /^(\+62|62|0)8[1-9][0-9]{7,10}$/, // Mobile
  landline: /^(\+62|62|0)[2-7][0-9]{6,9}$/, // Landline
  general: /^(\+62|62|0)[0-9]{8,12}$/, // General
};

const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[\s\-()]/g, "");
  return PHONE_PATTERNS.general.test(cleaned);
};

const normalizePhone = (phone: string): string => {
  // Hapus semua non-digit kecuali + di awal
  let cleaned = phone.replace(/[^\d+]/g, "");

  // Konversi ke format +62
  if (cleaned.startsWith("0")) {
    cleaned = "+62" + cleaned.substring(1);
  } else if (cleaned.startsWith("62")) {
    cleaned = "+" + cleaned;
  }

  return cleaned;
};
```

---

### 2.6. Handover

| Field              | Type   | Required | Validation Rules                   |
| ------------------ | ------ | -------- | ---------------------------------- |
| `handoverDate`     | date   | ✅       | Tidak boleh di masa depan          |
| `menyerahkan`      | string | ✅       | Nama user yang valid (dari sistem) |
| `penerima`         | string | ✅       | Min 3 chars                        |
| `mengetahui`       | string | ✅       | Nama user yang valid (dari sistem) |
| `items`            | array  | ✅       | Min 1 item                         |
| `items[].assetId`  | string | ✅       | ID aset yang valid dan tersedia    |
| `items[].quantity` | number | ✅       | Min 1                              |

**Handover Item Validation:**

```typescript
const validateHandoverItem = (
  item: HandoverItem,
  assets: Asset[],
): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!item.assetId) {
    errors.assetId = "Pilih aset yang akan diserahkan";
  } else {
    const asset = assets.find((a) => a.id === item.assetId);
    if (!asset) {
      errors.assetId = "Aset tidak ditemukan";
    } else if (
      asset.status !== AssetStatus.IN_STORAGE &&
      asset.status !== AssetStatus.IN_CUSTODY
    ) {
      errors.assetId = `Aset tidak tersedia (Status: ${asset.status})`;
    }
  }

  return errors;
};
```

---

### 2.7. Installation / Maintenance

| Field                                  | Type   | Required | Validation Rules                            |
| -------------------------------------- | ------ | -------- | ------------------------------------------- |
| `installationDate` / `maintenanceDate` | date   | ✅       | Tidak boleh lebih dari 7 hari di masa depan |
| `technician`                           | string | ✅       | Nama teknisi dari sistem                    |
| `customerId`                           | string | ✅       | ID customer yang valid dan Active           |
| `assetsInstalled` / `assets`           | array  | ⚠️       | Min 1 untuk installation                    |
| `materialsUsed`                        | array  | ❌       | Validasi stok jika ada                      |
| `problemDescription`                   | string | ⚠️       | Required untuk maintenance. Min 10 chars    |
| `actionsTaken`                         | string | ⚠️       | Required untuk maintenance. Min 10 chars    |

**Material Stock Validation:**

```typescript
const validateMaterialUsage = (
  materials: InstallationMaterial[],
  checkAvailability: Function,
): Record<string, string> => {
  const errors: Record<string, string> = {};

  materials.forEach((material, index) => {
    if (!material.itemName?.trim()) {
      errors[`materials[${index}].itemName`] = "Nama material wajib";
    }

    if (material.quantity < 1) {
      errors[`materials[${index}].quantity`] = "Quantity minimal 1";
    }

    // Stock availability check
    const stock = checkAvailability(
      material.itemName,
      material.brand,
      material.quantity,
      material.unit,
    );

    if (!stock.isSufficient) {
      errors[`materials[${index}].quantity`] =
        `Stok tidak cukup. Tersedia: ${stock.availableSmart}${stock.baseUnit}`;
    }
  });

  return errors;
};
```

---

## 3. Format Validasi Umum

### 3.1. String Patterns

```typescript
export const PATTERNS = {
  // Basic
  alphanumeric: /^[a-zA-Z0-9]+$/,
  alphanumericSpace: /^[a-zA-Z0-9\s]+$/,
  lettersOnly: /^[a-zA-Z\s]+$/,

  // Identifiers
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phoneIndonesia: /^(\+62|62|0)[0-9]{8,12}$/,
  macAddress: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$|^([0-9A-Fa-f]{12})$/,

  // Document Numbers
  docNumber: /^[A-Z]{2,4}-\d{4}-\d{4,6}$/, // e.g., RO-2026-000001

  // Dates
  isoDate: /^\d{4}-\d{2}-\d{2}$/,
  isoDateTime: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,

  // Security
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  noScriptTags: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
};
```

### 3.2. Numeric Ranges

```typescript
export const LIMITS = {
  // Strings
  nameMinLength: 2,
  nameMaxLength: 100,
  descriptionMaxLength: 1000,
  notesMaxLength: 500,
  addressMaxLength: 500,

  // Numbers
  quantityMin: 1,
  quantityMax: 999_999,
  priceMin: 0,
  priceMax: 100_000_000_000, // 100 Miliar
  balanceMin: 0,
  balanceMax: 999_999_999,

  // Arrays
  requestItemsMin: 1,
  requestItemsMax: 50,
  attachmentsMax: 10,

  // Files
  fileSizeMax: 10 * 1024 * 1024, // 10 MB
  imageMaxDimension: 4096,

  // Time
  loanDaysMax: 30,
  backdateDaysMax: 7,
};
```

### 3.3. Date Validation Helpers

```typescript
export const DateValidation = {
  isValidDate: (dateStr: string): boolean => {
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
  },

  isPast: (dateStr: string): boolean => {
    return new Date(dateStr) < new Date();
  },

  isFuture: (dateStr: string): boolean => {
    return new Date(dateStr) > new Date();
  },

  isWithinDays: (dateStr: string, days: number): boolean => {
    const date = new Date(dateStr);
    const now = new Date();
    const maxDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    return date <= maxDate;
  },

  isAfter: (dateStr: string, afterDateStr: string): boolean => {
    return new Date(dateStr) > new Date(afterDateStr);
  },
};
```

---

## 4. Sanitization Rules

### 4.1. Input Sanitization

```typescript
export const Sanitize = {
  // Trim whitespace
  trim: (value: string): string => value?.trim() || "",

  // Remove extra spaces
  normalizeSpaces: (value: string): string =>
    value?.replace(/\s+/g, " ").trim() || "",

  // Escape HTML
  escapeHtml: (value: string): string => {
    const htmlEntities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return value?.replace(/[&<>"']/g, (char) => htmlEntities[char]) || "";
  },

  // Remove script tags
  removeScripts: (value: string): string =>
    value?.replace(PATTERNS.noScriptTags, "") || "",

  // Normalize phone number
  normalizePhone: (value: string): string => {
    let cleaned = value?.replace(/[^\d+]/g, "") || "";
    if (cleaned.startsWith("0")) {
      cleaned = "+62" + cleaned.substring(1);
    } else if (cleaned.startsWith("62")) {
      cleaned = "+" + cleaned;
    }
    return cleaned;
  },

  // Normalize email
  normalizeEmail: (value: string): string => value?.toLowerCase().trim() || "",

  // Enforce integer
  toInteger: (value: number | string): number => {
    const num = typeof value === "string" ? parseInt(value, 10) : value;
    return Number.isNaN(num) ? 0 : Math.round(num);
  },

  // Enforce positive
  toPositive: (value: number): number => Math.max(0, value),
};
```

### 4.2. Output Sanitization (XSS Prevention)

```typescript
// Digunakan saat menampilkan data dari database ke UI
export const sanitizeForDisplay = (value: string): string => {
  if (!value) return "";

  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};
```

---

## 5. Validation Error Display

### 5.1. Form Field Error Component

```tsx
interface FieldErrorProps {
  error?: string;
}

const FieldError: React.FC<FieldErrorProps> = ({ error }) => {
  if (!error) return null;

  return (
    <p className="mt-1 text-sm text-danger-text flex items-center gap-1">
      <AlertCircle className="w-4 h-4" />
      {error}
    </p>
  );
};
```

### 5.2. Form Validation Pattern

```tsx
const AssetForm = () => {
  const [formData, setFormData] = useState<Partial<Asset>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());

  const validateField = (field: string, value: any) => {
    const newErrors = { ...errors };

    switch (field) {
      case "name":
        if (!value?.trim()) {
          newErrors.name = "Nama aset wajib diisi";
        } else if (value.length < 2) {
          newErrors.name = "Nama minimal 2 karakter";
        } else {
          delete newErrors.name;
        }
        break;
      // ... other fields
    }

    setErrors(newErrors);
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => new Set(prev).add(field));
    validateField(field, formData[field as keyof Asset]);
  };

  const handleSubmit = () => {
    // Validate all fields
    const allErrors = validateAsset(formData, categories);
    setErrors(allErrors);

    // Mark all as touched
    setTouched(new Set(Object.keys(formData)));

    if (Object.keys(allErrors).length === 0) {
      // Submit form
      saveAsset(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nama Aset</label>
        <input
          value={formData.name || ""}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          onBlur={() => handleBlur("name")}
          className={errors.name && touched.has("name") ? "border-red-500" : ""}
        />
        {touched.has("name") && <FieldError error={errors.name} />}
      </div>
    </form>
  );
};
```

---

## 6. Backend Validation (NestJS)

### 6.1. DTO with class-validator

```typescript
// src/assets/dto/create-asset.dto.ts
import {
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
  Min,
  Max,
  Matches,
  ValidateIf,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { Transform } from "class-transformer";

export class CreateAssetDto {
  @IsNotEmpty({ message: "Nama aset wajib diisi" })
  @MinLength(2, { message: "Nama minimal 2 karakter" })
  @MaxLength(200, { message: "Nama maksimal 200 karakter" })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsNotEmpty({ message: "Kategori wajib dipilih" })
  category: string;

  @IsNotEmpty({ message: "Tipe wajib dipilih" })
  type: string;

  @IsNotEmpty({ message: "Brand wajib diisi" })
  brand: string;

  @IsOptional()
  @Matches(/^[A-Z0-9]{5,30}$/, {
    message: "Format Serial Number tidak valid",
  })
  serialNumber?: string;

  @IsOptional()
  @Matches(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$|^([0-9A-Fa-f]{12})$/, {
    message: "Format MAC Address tidak valid",
  })
  macAddress?: string;

  @IsOptional()
  @IsNumber({}, { message: "Harga harus berupa angka" })
  @Min(0, { message: "Harga tidak boleh negatif" })
  @Max(100_000_000_000, { message: "Harga melebihi batas maksimum" })
  purchasePrice?: number;

  @ValidateIf((o) => o.trackingMethod === "bulk")
  @IsNumber({}, { message: "Quantity harus berupa angka" })
  @Min(1, { message: "Quantity minimal 1" })
  @Transform(({ value }) => Math.round(value))
  quantity?: number;

  @IsEnum(AssetCondition, { message: "Kondisi tidak valid" })
  condition: AssetCondition;
}
```

### 6.2. Custom Validation Decorator

```typescript
// src/common/validators/is-unique.validator.ts
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private prisma: PrismaService) {}

  async validate(value: any, args: any) {
    const [model, field] = args.constraints;
    const record = await this.prisma[model].findFirst({
      where: { [field]: value },
    });
    return !record;
  }

  defaultMessage(args: any) {
    const [model, field] = args.constraints;
    return `${field} sudah terdaftar`;
  }
}

export function IsUnique(
  model: string,
  field: string,
  options?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      constraints: [model, field],
      validator: IsUniqueConstraint,
    });
  };
}

// Usage
export class CreateAssetDto {
  @IsUnique("asset", "serialNumber", {
    message: "Serial Number sudah terdaftar",
  })
  serialNumber?: string;
}
```

---

## 7. Validation Checklist

### 7.1. Code Review Checklist

- [ ] Field validasi di frontend dengan pesan yang jelas
- [ ] Validasi ulang di backend dengan class-validator
- [ ] Sanitization diterapkan sebelum simpan ke database
- [ ] Cross-field validation (tanggal, conditional fields)
- [ ] Array validation (min/max items, duplicate check)
- [ ] Unique constraint validation (async check untuk duplicate)
- [ ] Error messages dalam Bahasa Indonesia
- [ ] Touch/blur tracking untuk UX yang baik
- [ ] Submit disabled saat ada error

### 7.2. Security Checklist

- [ ] Tidak ada eval() atau innerHTML dari user input
- [ ] XSS prevention dengan escape/sanitize
- [ ] SQL Injection prevention (Prisma parameterized queries)
- [ ] File upload validation (type, size, extension)
- [ ] Rate limiting pada form submission
- [ ] CSRF token validation (jika applicable)
