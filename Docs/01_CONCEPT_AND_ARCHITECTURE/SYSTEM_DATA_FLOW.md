# Alur Data Sistem (System Data Flow)

Dokumen ini menjelaskan bagaimana data mengalir melalui sistem dari input user hingga penyimpanan di database, termasuk transformasi dan validasi di setiap layer.

---

## 1. Data Flow Overview

```mermaid
graph TD
    User[User Input] --> Frontend[Frontend React]
    Frontend --> Validation1[Client-Side Validation]
    Validation1 --> API[API Service Layer]
    API --> Network[HTTPS Request]
    Network --> Nginx[Nginx Reverse Proxy]
    Nginx --> Backend[Backend NestJS]
    Backend --> Auth[Authentication Guard]
    Auth --> Validation2[Server-Side Validation]
    Validation2 --> Service[Business Logic Service]
    Service --> ORM[Prisma ORM]
    ORM --> DB[(PostgreSQL Database)]
    
    DB --> ORM
    ORM --> Service
    Service --> Response[Response DTO]
    Response --> Backend
    Backend --> Nginx
    Nginx --> Network
    Network --> API
    API --> Store[Zustand Store]
    Store --> UI[UI Update]
    UI --> User
```

---

## 2. Detailed Data Flow per Feature

### 2.1. Create Request Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant Backend
    participant DB
    participant WA as WhatsApp
    
    User->>Frontend: Fill Request Form
    Frontend->>Frontend: Client Validation
    Frontend->>API: POST /api/requests (DTO)
    API->>Backend: HTTPS Request
    Backend->>Backend: JWT Auth Check
    Backend->>Backend: DTO Validation (class-validator)
    Backend->>DB: Check Stock Availability
    DB-->>Backend: Stock Data
    Backend->>Backend: Calculate Item Status
    Backend->>DB: BEGIN TRANSACTION
    Backend->>DB: Insert Request + Items
    Backend->>DB: Create ActivityLog
    Backend->>DB: COMMIT
    Backend->>WA: Send Notification
    Backend-->>API: 201 Created (Request Object)
    API->>Frontend: Update Zustand Store
    Frontend->>User: Show Success Notification
```

### 2.2. Approve Request Flow

```mermaid
sequenceDiagram
    participant Admin
    participant Frontend
    participant API
    participant Backend
    participant DB
    participant WA as WhatsApp
    
    Admin->>Frontend: Click Approve Button
    Frontend->>API: PATCH /api/requests/:id/review
    API->>Backend: Request with Adjustments
    Backend->>Backend: Check Role Permission
    Backend->>DB: BEGIN TRANSACTION
    Backend->>DB: Get Request + Items
    Backend->>Backend: Calculate New Status
    Backend->>DB: Update Request Status
    Backend->>DB: Update Item ApprovedQty
    Backend->>DB: Create ActivityLog
    Backend->>DB: COMMIT
    Backend->>WA: Send Notification to Next Approver
    Backend-->>API: 200 OK (Updated Request)
    API->>Frontend: Update Store
    Frontend->>Admin: Show Success + Refresh List
```

### 2.3. Register Asset Flow

```mermaid
sequenceDiagram
    participant Admin
    participant Frontend
    participant API
    participant Backend
    participant DB
    
    Admin->>Frontend: Fill Asset Registration Form
    Frontend->>Frontend: Validate Serial Number (if required)
    Frontend->>API: POST /api/assets
    API->>Backend: CreateAssetDto
    Backend->>Backend: Validate DTO
    Backend->>DB: Check Serial Number Uniqueness
    DB-->>Backend: Check Result
    alt Serial Number Duplicate
        Backend-->>API: 409 Conflict
        API-->>Frontend: Error Message
        Frontend-->>Admin: Show Error
    else Serial Number Unique
        Backend->>Backend: Generate Asset ID (AST-YYYY-XXXX)
        Backend->>DB: BEGIN TRANSACTION
        Backend->>DB: Insert Asset
        Backend->>DB: Create ActivityLog (ASSET_REGISTERED)
        Backend->>DB: COMMIT
        Backend-->>API: 201 Created (Asset Object)
        API->>Frontend: Update Store
        Frontend->>Backend: Generate QR Code
        Backend-->>Frontend: QR Code Data
        Frontend->>Admin: Show Success + QR Code
    end
```

---

## 3. State Management Flow

### 3.1. Zustand Store Update Flow

```mermaid
graph LR
    API[API Response] --> Store[Zustand Store]
    Store --> Components[React Components]
    Components --> UserAction[User Action]
    UserAction --> API
    
    Store --> Persist[localStorage Persist]
    Persist --> Hydrate[Hydrate on Load]
    Hydrate --> Store
```

### 3.2. Store Synchronization

- **Initial Load**: Fetch all data saat aplikasi pertama kali load
- **Optimistic Updates**: Update UI immediately, sync dengan server
- **Error Handling**: Rollback jika server update gagal
- **Persistence**: Store state di localStorage untuk persist across sessions

---

## 4. Database Transaction Flow

### 4.1. Atomic Operations

Semua operasi yang mengubah multiple entities harus dalam transaction:

```mermaid
graph TD
    Start[Start Operation] --> Begin[BEGIN TRANSACTION]
    Begin --> Op1[Operation 1]
    Op1 --> Op2[Operation 2]
    Op2 --> Op3[Operation 3]
    Op3 --> Check{All Success?}
    Check -->|Yes| Commit[COMMIT]
    Check -->|No| Rollback[ROLLBACK]
    Commit --> End[End - Success]
    Rollback --> Error[End - Error]
```

### 4.2. Example: Loan Approval Transaction

```typescript
// Atomic transaction untuk approve loan
await prisma.$transaction(async (tx) => {
  // 1. Lock assets (FOR UPDATE)
  const assets = await tx.asset.findMany({
    where: { id: { in: assetIds } },
    for: 'update' // Pessimistic locking
  });
  
  // 2. Verify all assets are IN_STORAGE
  const unavailable = assets.filter(a => a.status !== 'IN_STORAGE');
  if (unavailable.length > 0) {
    throw new ConflictException('Some assets are not available');
  }
  
  // 3. Update assets
  await tx.asset.updateMany({
    where: { id: { in: assetIds } },
    data: { status: 'IN_USE', currentUser: userId }
  });
  
  // 4. Update loan request
  await tx.loanRequest.update({
    where: { id: loanId },
    data: { status: 'APPROVED' }
  });
  
  // 5. Create handover
  await tx.handover.create({ data: {...} });
  
  // 6. Create activity logs
  await tx.activityLog.createMany({ data: logs });
});
```

---

## 5. Caching Strategy

### 5.1. Frontend Caching (Zustand)

- **Store Cache**: Data di Zustand store sebagai cache
- **TTL**: Tidak ada TTL, cache invalidated saat:
  - User action (create/update/delete)
  - Manual refresh
  - Logout/login

### 5.2. Backend Caching (Future)

- **API Response Cache**: Cache untuk data yang jarang berubah
- **Database Query Cache**: Cache untuk expensive queries
- **Cache Invalidation**: Invalidate saat data berubah

---

## 6. Error Propagation Flow

```mermaid
graph TD
    Error[Error Occurs] --> Catch[Catch in Service]
    Catch --> Log[Log Error]
    Log --> Transform[Transform to User-Friendly Message]
    Transform --> Response[Return Error Response]
    Response --> Frontend[Frontend Receives]
    Frontend --> Handle[Handle Error]
    Handle --> Notify[Show Notification to User]
    Notify --> Action[User Action]
```

### 6.1. Error Handling Layers

1. **Database Layer**: Database errors (constraint violations, connection errors)
2. **Service Layer**: Business logic errors (validation, business rules)
3. **Controller Layer**: HTTP errors (status codes)
4. **Frontend Layer**: User-friendly error messages

---

## 7. Notification Flow

```mermaid
graph TD
    Event[System Event] --> Service[Service Detects]
    Service --> Format[Format Message]
    Format --> WA[WhatsApp Service]
    Format --> DB[Save to Database]
    WA --> Send[Send to Group]
    DB --> Store[Store Notification]
    Store --> Frontend[Frontend Polls/WebSocket]
    Frontend --> User[User Sees Notification]
```

### 7.1. Notification Events

- Request created → Notify Admin Logistik
- Request approved → Notify Requester
- Request rejected → Notify Requester
- Asset assigned → Notify User
- Maintenance reported → Notify Admin Logistik
- Dismantle pending → Notify Admin Gudang

---

## 8. Search & Filter Flow

### 8.1. Frontend Search

```mermaid
graph LR
    User[User Types] --> Debounce[Debounce 300ms]
    Debounce --> Filter[Filter Local Data]
    Filter --> Display[Display Results]
```

### 8.2. Backend Search

```mermaid
graph LR
    Query[Search Query] --> Parse[Parse Query]
    Parse --> Build[Build Prisma Query]
    Build --> DB[Execute Query]
    DB --> Results[Return Results]
```

---

## 9. File Upload Flow (Future)

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant Backend
    participant Storage
    
    User->>Frontend: Select File
    Frontend->>Frontend: Validate File (type, size)
    Frontend->>API: POST /api/upload (FormData)
    API->>Backend: Multipart Form
    Backend->>Backend: Validate File
    Backend->>Storage: Save File
    Storage-->>Backend: File URL
    Backend->>DB: Save File Metadata
    Backend-->>API: File URL
    API-->>Frontend: File URL
    Frontend->>User: Show Uploaded File
```

---

## 10. Real-time Updates (Future)

### 10.1. WebSocket Flow

```mermaid
graph TD
    Event[Database Event] --> Trigger[Trigger Notification]
    Trigger --> WS[WebSocket Server]
    WS --> Clients[Connected Clients]
    Clients --> Update[Update UI]
```

### 10.2. Polling (Current)

- Frontend polls untuk notifications setiap 30 detik
- Poll endpoint: `GET /api/notifications?unreadOnly=true`

---

## 11. Data Validation Flow

### 11.1. Multi-Layer Validation

```mermaid
graph TD
    Input[User Input] --> Client[Client Validation]
    Client -->|Invalid| ClientError[Show Error]
    Client -->|Valid| API[Send to API]
    API --> Server[Server Validation]
    Server -->|Invalid| ServerError[Return 400]
    Server -->|Valid| Business[Business Logic Validation]
    Business -->|Invalid| BusinessError[Return 409/422]
    Business -->|Valid| DB[Save to Database]
```

### 11.2. Validation Rules

**Client-Side (Frontend)**:
- Required fields
- Format validation (email, date)
- Basic business rules (quantity > 0)

**Server-Side (Backend)**:
- All client validations
- Database constraints
- Business logic rules
- Authorization checks

---

## 12. References

- [Architecture](./ARCHITECTURE.md) - Arsitektur sistem
- [Technical Blueprint](./TECHNICAL_BLUEPRINT.md) - Detail implementasi
- [Feature Flows](./FEATURE_FLOWS.md) - Alur fitur lengkap

---

**Last Updated**: 2025-01-XX

