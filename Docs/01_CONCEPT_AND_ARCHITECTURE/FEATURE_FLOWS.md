# Alur Fitur & Workflow Aplikasi

Dokumen ini menjelaskan alur kerja (workflow) lengkap untuk setiap fitur utama dalam aplikasi. Setiap diagram menunjukkan langkah-langkah yang harus diikuti pengguna dan sistem untuk menyelesaikan suatu tugas.

---

## 1. Modul Request & Procurement

### 1.1. Alur Request Aset Baru (End-to-End)

```mermaid
flowchart TD
    Start([Staff/Leader Membuat Request]) --> FillForm[Isi Form Request:<br/>- Pilih Item<br/>- Tentukan Quantity<br/>- Pilih Order Type]
    
    FillForm --> Validate{Validasi<br/>Frontend}
    Validate -->|Invalid| ShowError[Tampilkan Error]
    ShowError --> FillForm
    
    Validate -->|Valid| Submit[Submit Request]
    Submit --> BackendCheck{Backend:<br/>Cek Stok Otomatis}
    
    BackendCheck -->|Stok Cukup| AutoAllocate[Status: STOCK_ALLOCATED<br/>Auto-allocate stok]
    BackendCheck -->|Stok Kurang| NeedProcure[Status: PROCUREMENT_NEEDED<br/>Butuh pembelian]
    
    AutoAllocate --> NotifyLogistic[Notifikasi ke<br/>Admin Logistik]
    NeedProcure --> NotifyLogistic
    
    NotifyLogistic --> ReviewLogistic{Admin Logistik<br/>Review Request}
    
    ReviewLogistic -->|Approve| UpdateStatus1[Status: LOGISTIC_APPROVED]
    ReviewLogistic -->|Reject| Rejected[Status: REJECTED<br/>Notifikasi ke Requester]
    ReviewLogistic -->|Revisi Qty| ReviseQty[Update Approved Qty<br/>Status: LOGISTIC_APPROVED]
    
    UpdateStatus1 --> CheckValue{Total Value<br/>> Limit?}
    ReviseQty --> CheckValue
    
    CheckValue -->|Ya > Rp 10M| CEOApproval[Status: AWAITING_CEO_APPROVAL<br/>Notifikasi ke Super Admin]
    CheckValue -->|Tidak| PurchaseFlow[Status: PURCHASING]
    
    CEOApproval --> CEOAction{Super Admin<br/>Decision}
    CEOAction -->|Approve| PurchaseFlow
    CEOAction -->|Reject| Rejected
    
    PurchaseFlow --> AdminPurchase[Admin Purchase:<br/>- Input PO Number<br/>- Input Vendor<br/>- Input Price]
    AdminPurchase --> UpdateStatus2[Status: PURCHASING]
    
    UpdateStatus2 --> VendorShip[Vendor Kirim Barang]
    VendorShip --> UpdateStatus3[Status: IN_DELIVERY]
    
    UpdateStatus3 --> Arrive[Barang Tiba di Gudang]
    Arrive --> UpdateStatus4[Status: ARRIVED<br/>Notifikasi ke Admin Logistik]
    
    UpdateStatus4 --> Register[Admin Logistik:<br/>Registrasi Aset]
    Register --> Complete[Status: COMPLETED]
    
    Complete --> End([Selesai])
    Rejected --> End
    
    style Start fill:#e1f5ff
    style End fill:#c8e6c9
    style Rejected fill:#ffcdd2
    style Complete fill:#c8e6c9
```

### 1.2. Alur Approval Request (Detail)

```mermaid
sequenceDiagram
    participant Staff
    participant Frontend
    participant Backend
    participant DB
    participant Admin
    participant WA as WhatsApp
    
    Staff->>Frontend: Buat Request
    Frontend->>Backend: POST /api/requests
    Backend->>DB: Cek Stok Real-time
    DB-->>Backend: Stok Info
    Backend->>DB: Simpan Request (Status: PENDING)
    Backend->>WA: Kirim Notifikasi ke Admin
    Backend-->>Frontend: 201 Created
    Frontend-->>Staff: Notifikasi "Request Berhasil"
    
    Note over Admin: Admin menerima notifikasi
    
    Admin->>Frontend: Buka Detail Request
    Frontend->>Backend: GET /api/requests/:id
    Backend->>DB: Ambil Data Request
    DB-->>Backend: Data Request + Items
    Backend-->>Frontend: 200 OK
    Frontend-->>Admin: Tampilkan Detail
    
    Admin->>Frontend: Review & Edit Qty (Opsional)
    Admin->>Frontend: Klik "Approve"
    Frontend->>Backend: PATCH /api/requests/:id/approve
    
    alt Semua Item Ditolak (Qty = 0)
        Backend->>DB: Update Status = REJECTED
        Backend->>WA: Notifikasi ke Requester
    else Ada Item yang Disetujui
        Backend->>DB: Update Status = LOGISTIC_APPROVED
        Backend->>DB: Update Approved Qty per Item
        Backend->>DB: Create ActivityLog
        Backend->>WA: Notifikasi ke Purchase
    end
    
    Backend-->>Frontend: 200 OK
    Frontend-->>Admin: Notifikasi "Request Disetujui"
```

---

## 2. Modul Loan & Handover

### 2.1. Alur Peminjaman Aset

```mermaid
flowchart TD
    Start([Staff Membuat Loan Request]) --> FillLoanForm[Isi Form:<br/>- Pilih Aset<br/>- Tentukan Durasi<br/>- Tujuan Peminjaman]
    
    FillLoanForm --> SubmitLoan[Submit Loan Request]
    SubmitLoan --> SaveLoan[Backend: Simpan LoanRequest<br/>Status: PENDING]
    
    SaveLoan --> NotifyAdmin[Notifikasi ke<br/>Admin Logistik]
    
    NotifyAdmin --> AdminReview{Admin Review<br/>Loan Request}
    
    AdminReview -->|Reject| RejectLoan[Status: REJECTED<br/>Notifikasi ke Requester]
    AdminReview -->|Approve| SelectAsset[Pilih Aset dari Stok<br/>Assign Asset ID]
    
    SelectAsset --> CheckAsset{Backend:<br/>Cek Status Aset}
    
    CheckAsset -->|IN_STORAGE| LockAsset[Lock Asset<br/>Status: IN_USE<br/>Atomic Transaction]
    CheckAsset -->|IN_USE| Conflict[409 Conflict<br/>Aset sudah diambil]
    
    LockAsset --> CreateHandover[Create Handover Document<br/>Status: DRAFT]
    CreateHandover --> NotifyUser[Notifikasi ke Requester]
    
    NotifyUser --> UserReceive{User Terima<br/>Barang?}
    
    UserReceive -->|Ya| ConfirmHandover[User Konfirmasi<br/>di Frontend]
    ConfirmHandover --> UpdateStatus1[Update Handover<br/>Status: CONFIRMED]
    UpdateStatus1 --> UpdateLoan[Update LoanRequest<br/>Status: ON_LOAN]
    
    UserReceive -->|Tidak| CancelHandover[Cancel Handover<br/>Kembalikan Aset ke Stok]
    
    UpdateLoan --> End([Loan Aktif])
    RejectLoan --> End
    CancelHandover --> End
    Conflict --> End
    
    style Start fill:#e1f5ff
    style End fill:#c8e6c9
    style Conflict fill:#ffcdd2
    style RejectLoan fill:#ffcdd2
```

### 2.2. Alur Return Aset (Pengembalian)

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant DB
    
    User->>Frontend: Buka Halaman Return
    Frontend->>Backend: GET /api/loans/:id
    Backend->>DB: Ambil Data Loan + Assets
    DB-->>Backend: Loan Data
    Backend-->>Frontend: 200 OK
    Frontend-->>User: Tampilkan Daftar Aset yang Dipinjam
    
    User->>Frontend: Pilih Aset & Input Kondisi
    User->>Frontend: Submit Return
    Frontend->>Backend: POST /api/loans/:id/return
    
    Backend->>DB: BEGIN TRANSACTION
    Backend->>DB: Update Asset Status = IN_STORAGE
    Backend->>DB: Update LoanItem Status = RETURNED
    Backend->>DB: Create ActivityLog
    Backend->>DB: COMMIT
    
    Backend-->>Frontend: 200 OK
    Frontend-->>User: Notifikasi "Aset Dikembalikan"
```

---

## 3. Modul Instalasi & Dismantle

### 3.1. Alur Instalasi ke Pelanggan

```mermaid
flowchart TD
    Start([Admin/Teknisi:<br/>Mulai Instalasi]) --> SelectCustomer[Pilih Customer]
    SelectCustomer --> FillInstallForm[Isi Form Instalasi:<br/>- Alamat Instalasi<br/>- Tanggal<br/>- Aset yang akan dipasang]
    
    FillInstallForm --> CheckStock{Cek Stok<br/>Aset}
    
    CheckStock -->|Stok Cukup| AssignAsset[Assign Asset ke<br/>Installation]
    CheckStock -->|Stok Kurang| ShowError[Error: Stok Tidak Cukup]
    ShowError --> FillInstallForm
    
    AssignAsset --> LockAssets[Backend: Lock Assets<br/>Status: IN_TRANSIT]
    LockAssets --> CreateInstall[Create Installation Record<br/>Status: PENDING]
    
    CreateInstall --> TechDeploy[Teknisi Deploy ke Lokasi]
    TechDeploy --> InstallComplete{Teknisi:<br/>Instalasi Selesai?}
    
    InstallComplete -->|Ya| ConfirmInstall[Teknisi Konfirmasi<br/>di Mobile/Web]
    InstallComplete -->|Tidak| TechDeploy
    
    ConfirmInstall --> UpdateStatus1[Update Installation<br/>Status: COMPLETED]
    UpdateStatus1 --> UpdateAssets[Update Assets:<br/>Status: IN_USE<br/>currentUser: Customer ID]
    UpdateAssets --> CreateActivityLog[Create ActivityLog:<br/>INSTALLATION_COMPLETED]
    
    CreateActivityLog --> NotifyAdmin[Notifikasi ke Admin]
    NotifyAdmin --> End([Instalasi Selesai])
    
    style Start fill:#e1f5ff
    style End fill:#c8e6c9
    style ShowError fill:#ffcdd2
```

### 3.2. Alur Dismantle (Penarikan dari Pelanggan)

```mermaid
sequenceDiagram
    participant Tech as Teknisi
    participant Frontend
    participant Backend
    participant DB
    participant Admin
    
    Tech->>Frontend: Scan QR Code Aset<br/>atau Input Manual
    Frontend->>Backend: GET /api/assets/:id
    Backend->>DB: Cek Asset + Customer Info
    DB-->>Backend: Asset Data
    Backend-->>Frontend: 200 OK
    Frontend-->>Tech: Tampilkan Info Aset & Customer
    
    Tech->>Frontend: Input Kondisi Aset<br/>& Foto (Opsional)
    Tech->>Frontend: Submit Dismantle
    Frontend->>Backend: POST /api/dismantles
    
    Backend->>DB: BEGIN TRANSACTION
    Backend->>DB: Verify Asset Status = IN_USE
    Backend->>DB: Create DismantleRecord<br/>(Status: PENDING_WAREHOUSE)
    Backend->>DB: Update Asset Status = IN_TRANSIT
    Backend->>DB: Create ActivityLog
    Backend->>DB: COMMIT
    
    Backend-->>Frontend: 201 Created
    Frontend-->>Tech: Berita Acara Draft<br/>Tampilkan QR Code untuk Print
    
    Note over Tech,Admin: Teknisi bawa aset ke gudang
    
    Admin->>Frontend: Scan QR Code Dismantle<br/>atau Buka dari List
    Frontend->>Backend: GET /api/dismantles/:id
    Backend-->>Frontend: Dismantle Data
    
    Admin->>Frontend: Verifikasi Kondisi Fisik
    Admin->>Frontend: Klik "Confirm Received"
    Frontend->>Backend: PATCH /api/dismantles/:id/confirm
    
    Backend->>DB: BEGIN TRANSACTION
    Backend->>DB: Update Dismantle Status = COMPLETED
    Backend->>DB: Update Asset Status = IN_STORAGE
    Backend->>DB: Update Asset Location = "Gudang"
    Backend->>DB: Update Asset currentUser = NULL
    Backend->>DB: Create ActivityLog
    Backend->>DB: COMMIT
    
    Backend-->>Frontend: 200 OK
    Frontend-->>Admin: Notifikasi "Aset Diterima"
```

---

## 4. Modul Maintenance & Repair

### 4.1. Alur Perbaikan Aset

```mermaid
stateDiagram-v2
    [*] --> IN_USE: Aset Normal
    
    IN_USE --> DAMAGED: User Laporkan Kerusakan
    DAMAGED --> UNDER_REPAIR: Admin Mulai Perbaikan Internal
    DAMAGED --> OUT_FOR_REPAIR: Admin Kirim ke Vendor
    
    UNDER_REPAIR --> IN_STORAGE: Perbaikan Selesai<br/>(Masuk Stok)
    UNDER_REPAIR --> IN_USE: Perbaikan Selesai<br/>(Kembali ke User)
    UNDER_REPAIR --> DECOMMISSIONED: Gagal Perbaiki<br/>(Scrap)
    
    OUT_FOR_REPAIR --> IN_STORAGE: Terima dari Vendor<br/>(Baik)
    OUT_FOR_REPAIR --> DECOMMISSIONED: Vendor Konfirmasi<br/>(Tidak Bisa Diperbaiki)
    
    DECOMMISSIONED --> [*]
    
    note right of DAMAGED
        Maintenance Record Created
        - Reported By: User ID
        - Description: User Input
        - Photos: Optional
    end note
    
    note right of UNDER_REPAIR
        Maintenance Record Updated
        - Technician: Admin Input
        - Cost: Internal Cost
        - Notes: Repair Details
    end note
    
    note right of OUT_FOR_REPAIR
        Maintenance Record Updated
        - Vendor: Admin Input
        - Cost: Vendor Cost
        - Expected Return Date
    end note
```

### 4.2. Sequence Diagram: Report Damage

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant DB
    participant Admin
    
    User->>Frontend: Buka Detail Aset yang Dipinjam
    Frontend->>Backend: GET /api/assets/:id
    Backend-->>Frontend: Asset Data
    
    User->>Frontend: Klik "Laporkan Kerusakan"
    Frontend->>User: Tampilkan Form:<br/>- Deskripsi<br/>- Upload Foto
    User->>Frontend: Isi Form & Submit
    
    Frontend->>Backend: POST /api/maintenance/report
    Backend->>DB: BEGIN TRANSACTION
    Backend->>DB: Create Maintenance Record<br/>(Status: REPORTED)
    Backend->>DB: Update Asset Status = DAMAGED
    Backend->>DB: Create ActivityLog
    Backend->>DB: COMMIT
    
    Backend->>Admin: Notifikasi WhatsApp/Email
    Backend-->>Frontend: 201 Created
    Frontend-->>User: Notifikasi "Laporan Terkirim"
    
    Note over Admin: Admin melihat notifikasi
    
    Admin->>Frontend: Buka Maintenance Detail
    Frontend->>Backend: GET /api/maintenance/:id
    Backend-->>Frontend: Maintenance Data + Photos
    
    Admin->>Frontend: Pilih Aksi:<br/>- Mulai Perbaikan Internal<br/>- Kirim ke Vendor
    Frontend->>Backend: PATCH /api/maintenance/:id/start
    Backend->>DB: Update Status + Technician Info
    Backend-->>Frontend: 200 OK
```

---

## 5. Modul Asset Registration

### 5.1. Alur Registrasi Aset Baru

```mermaid
flowchart TD
    Start([Admin Logistik:<br/>Registrasi Aset Baru]) --> Source{Asal Aset}
    
    Source -->|Dari Request| FromRequest[Pilih Request<br/>Status: ARRIVED]
    Source -->|Manual Entry| ManualEntry[Input Manual]
    
    FromRequest --> Prefill[Backend: Pre-fill Data<br/>dari RequestItem]
    Prefill --> FillForm[Isi Form Registrasi:<br/>- Serial Number<br/>- MAC Address<br/>- Brand, Model<br/>- Purchase Info]
    
    ManualEntry --> FillForm
    
    FillForm --> Validate{Validasi<br/>Data}
    
    Validate -->|SN Duplicate| ShowError[Error: Serial Number<br/>Sudah Terdaftar]
    ShowError --> FillForm
    
    Validate -->|Valid| GenerateID[Backend: Generate<br/>Asset ID: AST-YYYY-XXXX]
    GenerateID --> SaveAsset[Backend: Save Asset<br/>Status: IN_STORAGE]
    
    SaveAsset --> CreateLog[Create ActivityLog:<br/>ASSET_REGISTERED]
    CreateLog --> GenerateQR[Generate QR Code]
    GenerateQR --> PrintLabel[Print Label QR Code]
    
    PrintLabel --> End([Aset Terdaftar])
    
    style Start fill:#e1f5ff
    style End fill:#c8e6c9
    style ShowError fill:#ffcdd2
```

### 5.2. Alur Bulk Registration

```mermaid
sequenceDiagram
    participant Admin
    participant Frontend
    participant Backend
    participant DB
    
    Admin->>Frontend: Pilih "Bulk Registration"
    Frontend->>Admin: Tampilkan Options:<br/>- Upload CSV<br/>- Input Form Massal
    
    alt Upload CSV
        Admin->>Frontend: Upload CSV File
        Frontend->>Frontend: Parse CSV
        Frontend->>Admin: Preview Data (100 items)
    else Input Form Massal
        Admin->>Frontend: Input Multiple Items<br/>dalam Satu Form
    end
    
    Admin->>Frontend: Review & Submit
    Frontend->>Backend: POST /api/assets/bulk<br/>(Array of Asset Data)
    
    Backend->>DB: BEGIN TRANSACTION
    loop For Each Item
        Backend->>Backend: Generate Unique ID
        Backend->>Backend: Validate Data
        Backend->>DB: Insert Asset
    end
    Backend->>DB: Create ActivityLog (Bulk Action)
    Backend->>DB: COMMIT
    
    Backend-->>Frontend: 201 Created<br/>(Count: 100, Failed: 0)
    Frontend->>Admin: Notifikasi "100 Aset Berhasil Diregistrasi"
    
    Admin->>Frontend: Generate QR Codes (Bulk)
    Frontend->>Backend: GET /api/assets/bulk-qr?ids=...
    Backend-->>Frontend: QR Code Data
    Frontend->>Admin: Tampilkan QR Codes untuk Print
```

---

## 6. Modul Dashboard & Reporting

### 6.1. Alur Generate Report

```mermaid
flowchart TD
    Start([User Buka Dashboard]) --> LoadData[Backend: Load Aggregated Data]
    
    LoadData --> DisplayWidgets[Tampilkan Widgets:<br/>- Total Assets<br/>- Assets by Status<br/>- Pending Requests<br/>- Recent Activities]
    
    DisplayWidgets --> UserAction{User Action}
    
    UserAction -->|Filter| ApplyFilter[Apply Filter:<br/>- Date Range<br/>- Status<br/>- Division]
    UserAction -->|Export| ExportData[Export Data]
    UserAction -->|View Detail| ViewDetail[Navigate to Detail Page]
    
    ApplyFilter --> ReloadData[Reload Data dengan Filter]
    ReloadData --> DisplayWidgets
    
    ExportData --> ChooseFormat{Pilih Format}
    ChooseFormat -->|CSV| ExportCSV[Generate CSV]
    ChooseFormat -->|PDF| ExportPDF[Generate PDF]
    
    ExportCSV --> Download[Download File]
    ExportPDF --> Download
    
    ViewDetail --> Navigate[Navigate ke Halaman Detail]
    
    Download --> End([Selesai])
    Navigate --> End
    
    style Start fill:#e1f5ff
    style End fill:#c8e6c9
```

---

## 7. Catatan Penting

### 7.1. Atomic Transactions
Semua operasi yang mengubah status aset atau membuat relasi harus dilakukan dalam **atomic transaction** untuk mencegah race condition dan data inconsistency.

### 7.2. Activity Logging
Setiap perubahan status penting harus dicatat di `ActivityLog` untuk audit trail.

### 7.3. Notifications
Sistem harus mengirim notifikasi (WhatsApp/Email) pada milestone penting:
- Request dibuat → Notifikasi ke Admin
- Request disetujui/ditolak → Notifikasi ke Requester
- Aset di-assign → Notifikasi ke User
- Maintenance dilaporkan → Notifikasi ke Admin

### 7.4. Error Handling
Setiap alur harus memiliki error handling yang jelas:
- Validasi input
- Database constraint violations
- Race conditions
- Network errors

---

## 8. Referensi

- [Business Logic Flows](./BUSINESS_LOGIC_FLOWS.md) - Detail logika bisnis
- [Database Schema](./DATABASE_SCHEMA.md) - Struktur database
- [API Reference](../02_DEVELOPMENT_GUIDES/API_REFERENCE.md) - Endpoint API

