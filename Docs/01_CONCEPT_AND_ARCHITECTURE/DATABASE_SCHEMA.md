
# Dokumentasi Skema Database (Physical Data Model)

Dokumen ini menjelaskan struktur fisik database yang akan diimplementasikan menggunakan **PostgreSQL** dan **Prisma ORM**. Skema ini dirancang untuk mengakomodir seluruh fitur yang ada di prototipe frontend.

## 1. Ringkasan ERD (Entity Relationship Diagram)

### 1.1. ERD Lengkap - Semua Entitas & Relasi

```mermaid
erDiagram
    %% User Management
    Division ||--o{ User : "has"
    User ||--o{ Request : "makes"
    User ||--o{ LoanRequest : "makes"
    User ||--o{ ActivityLog : "performs"
    User ||--o{ Maintenance : "reports"
    
    %% Asset Hierarchy
    AssetCategory ||--o{ AssetType : "contains"
    AssetType ||--o{ Asset : "classifies"
    Asset ||--o{ ActivityLog : "has_history"
    Asset ||--o{ Maintenance : "undergoes"
    Asset ||--o{ HandoverItem : "transferred_in"
    Asset ||--o{ Dismantle : "retrieved_in"
    Asset ||--o{ Installation : "installed_in"
    Asset ||--o{ LoanItem : "loaned_in"
    
    %% Request & Procurement
    Request ||--|{ RequestItem : "contains"
    Request }o--|| User : "requested_by"
    
    %% Loan Management
    LoanRequest ||--|{ LoanItem : "contains"
    LoanRequest }o--|| User : "requested_by"
    LoanRequest ||--o| Handover : "fulfilled_by"
    
    %% Handover
    Handover ||--|{ HandoverItem : "contains"
    Handover }o--|| User : "handed_to"
    
    %% Dismantle
    Dismantle }o--|| Asset : "retrieves"
    Dismantle }o--|| Customer : "from_customer"
    
    %% Installation
    Installation }o--|| Customer : "at_customer"
    Installation ||--|{ InstallationItem : "contains"
    
    %% Customer Management
    Customer ||--o{ Installation : "has"
    Customer ||--o{ Dismantle : "has"
    Customer ||--o{ Maintenance : "has"
    
    %% Maintenance
    Maintenance }o--|| Asset : "for_asset"
    Maintenance }o--|| User : "reported_by"
    
    Division {
        int id PK
        string name UK
        datetime createdAt
        datetime updatedAt
    }
    
    User {
        int id PK
        string email UK
        string password
        string name
        string role
        int divisionId FK
        datetime createdAt
        datetime updatedAt
        datetime deletedAt
    }
    
    AssetCategory {
        int id PK
        string name
        boolean isCustomerInstallable
        datetime createdAt
        datetime updatedAt
    }
    
    AssetType {
        int id PK
        int categoryId FK
        string name
        string classification
        string trackingMethod
        string unitOfMeasure
        datetime createdAt
        datetime updatedAt
    }
    
    Asset {
        string id PK
        string name
        string brand
        string serialNumber
        string macAddress
        int typeId FK
        string status
        string condition
        string location
        string currentUser
        decimal purchasePrice
        datetime purchaseDate
        string vendor
        datetime warrantyEndDate
        datetime createdAt
        datetime updatedAt
        datetime deletedAt
    }
    
    Request {
        string id PK
        int requesterId FK
        string division
        string status
        datetime requestDate
        string orderType
        string justification
        string project
        string logisticApprover
        string finalApprover
        datetime createdAt
        datetime updatedAt
    }
    
    RequestItem {
        int id PK
        string requestId FK
        string itemName
        int quantity
        int approvedQty
        string poNumber
        decimal price
        string vendor
    }
    
    LoanRequest {
        string id PK
        int requesterId FK
        string status
        datetime requestDate
        datetime loanStartDate
        datetime loanEndDate
        string purpose
    }
    
    LoanItem {
        int id PK
        string loanRequestId FK
        string assetId FK
        string status
    }
    
    Handover {
        string id PK
        int userId FK
        string loanRequestId FK
        string status
        datetime handoverDate
        string notes
    }
    
    HandoverItem {
        int id PK
        string handoverId FK
        string assetId FK
        string condition
    }
    
    Customer {
        int id PK
        string name
        string address
        string phone
        string email
        string status
        datetime createdAt
        datetime updatedAt
    }
    
    Installation {
        int id PK
        int customerId FK
        string status
        datetime installationDate
        string technician
        string notes
    }
    
    InstallationItem {
        int id PK
        int installationId FK
        string assetId FK
        string serialNumber
        string macAddress
    }
    
    Dismantle {
        int id PK
        int customerId FK
        string assetId FK
        string status
        datetime dismantleDate
        string condition
        string technician
        string notes
    }
    
    Maintenance {
        int id PK
        string assetId FK
        int reportedById FK
        int customerId FK
        string status
        string type
        string description
        decimal cost
        datetime reportedDate
        datetime completedDate
    }
    
    ActivityLog {
        int id PK
        string assetId FK
        int userId FK
        string action
        json details
        datetime timestamp
    }
```

### 1.2. ERD Simplified - Core Entities

Diagram ini menunjukkan entitas inti dan relasi utama:

```mermaid
erDiagram
    User ||--o{ Request : creates
    User ||--o{ LoanRequest : creates
    Division ||--o{ User : contains
    
    AssetCategory ||--o{ AssetType : has
    AssetType ||--o{ Asset : classifies
    
    Request ||--|{ RequestItem : contains
    LoanRequest ||--|{ LoanItem : contains
    LoanRequest ||--o| Handover : fulfilled_by
    
    Asset ||--o{ LoanItem : loaned_in
    Asset ||--o{ HandoverItem : transferred_in
    Asset ||--o{ InstallationItem : installed_in
    Asset ||--o{ Dismantle : retrieved_in
    Asset ||--o{ Maintenance : requires
    Asset ||--o{ ActivityLog : tracked_in
    
    Customer ||--o{ Installation : has
    Customer ||--o{ Dismantle : has
    Customer ||--o{ Maintenance : has
```

## 2. Definisi Model (Prisma Schema)

Ini adalah *blueprint* yang akan digunakan backend untuk membuat tabel database.

### 2.1. User Management
```prisma
model Division {
  id    Int    @id @default(autoincrement())
  name  String @unique // e.g., "Network Engineering", "HR"
  users User[]
}

model User {
  id          Int      @id @default(autoincrement())
  email       String   @unique
  password    String   // Hashed (bcrypt)
  name        String
  role        String   // Enum: 'Super Admin', 'Staff', etc.
  divisionId  Int?
  division    Division? @relation(fields: [divisionId], references: [id])
  
  // Relations
  requests    Request[]
  loans       LoanRequest[]
  activityLogs ActivityLog[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  deletedAt   DateTime? // Soft Delete support
}
```

### 2.2. Asset Management
```prisma
model AssetCategory {
  id                    Int     @id @default(autoincrement())
  name                  String  // e.g., "Perangkat Jaringan"
  isCustomerInstallable Boolean @default(false)
  types                 AssetType[]
}

model AssetType {
  id              Int           @id @default(autoincrement())
  categoryId      Int
  category        AssetCategory @relation(fields: [categoryId], references: [id])
  name            String        // e.g., "Router", "Kabel"
  classification  String        // 'asset' (satuan) or 'material' (bulk)
  trackingMethod  String        // 'individual' or 'bulk'
  unitOfMeasure   String        // 'Unit', 'Meter'
  assets          Asset[]
}

model Asset {
  id              String   @id // Custom ID: "AST-2025-001"
  name            String
  brand           String
  serialNumber    String?  // Unique for trackingMethod='individual'
  macAddress      String?
  
  // Relations
  typeId          Int
  type            AssetType @relation(fields: [typeId], references: [id])
  
  // Status
  status          String   // 'IN_STORAGE', 'IN_USE', 'DAMAGED'
  condition       String   // 'GOOD', 'MINOR_DAMAGE'
  
  // Location / Assignment
  location        String?  // "Gudang A", "Rak 1"
  currentUser     String?  // Bisa ID User atau ID Customer
  
  // Financial
  purchasePrice   Decimal?
  purchaseDate    DateTime?
  vendor          String?
  warrantyEndDate DateTime?
  
  // History
  logs            ActivityLog[]
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  deletedAt       DateTime? // Soft Delete support
}
```

### 2.3. Request & Procurement
```prisma
model Request {
  id              String        @id // "REQ-001"
  requesterId     Int
  requester       User          @relation(fields: [requesterId], references: [id])
  division        String
  status          String        // 'PENDING', 'APPROVED', etc.
  requestDate     DateTime
  
  // Order Details
  orderType       String        // 'Regular', 'Urgent'
  justification   String?
  project         String?
  
  items           RequestItem[]
  
  // Approval Info
  logisticApprover String?
  finalApprover    String?
}

model RequestItem {
  id              Int     @id @default(autoincrement())
  requestId       String
  request         Request @relation(fields: [requestId], references: [id])
  
  itemName        String
  quantity        Int
  approvedQty     Int?    // Quantity after revision
  
  // Procurement Info (Filled by Purchase Admin)
  poNumber        String?
  price           Decimal?
  vendor          String?
}
```

### 2.4. Transactions & History
```prisma
model ActivityLog {
  id          Int      @id @default(autoincrement())
  assetId     String
  asset       Asset    @relation(fields: [assetId], references: [id])
  userId      Int
  user        User     @relation(fields: [userId], references: [id])
  action      String   // "HANDOVER", "REPAIR", "STATUS_CHANGE"
  details     Json?    // JSONB: Menyimpan snapshot data saat log dibuat
  timestamp   DateTime @default(now())
}
```

## 3. Catatan Penting untuk Implementasi

1.  **JSONB vs Relasi**: Untuk fitur seperti `Handover` atau `ActivityLog`, sangat disarankan menggunakan tipe data `JSONB` untuk menyimpan snapshot detail item. Ini menjaga integritas sejarah data (history) meskipun data master aset (nama, brand) berubah di kemudian hari.
2.  **Enum**: Gunakan fitur `enum` di Prisma untuk kolom `status`, `role`, dan `condition` untuk menjaga konsistensi data dan menghindari *typo*.
3.  **Soft Delete (Wajib)**: Kolom `deletedAt` telah ditambahkan pada tabel `Asset` dan `User`. Backend harus selalu memfilter `where: { deletedAt: null }` pada setiap query `find`, kecuali untuk keperluan audit atau restore.
4.  **Constraints**: Pastikan `serialNumber` memiliki constraint `UNIQUE` hanya jika aset tersebut tidak terhapus (Partial Index di PostgreSQL).