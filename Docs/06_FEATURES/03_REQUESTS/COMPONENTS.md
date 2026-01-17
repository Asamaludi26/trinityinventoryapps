# Komponen: Request Module

## Daftar Komponen Request Pengadaan

| Komponen           | Path                                             | Deskripsi                       |
| ------------------ | ------------------------------------------------ | ------------------------------- |
| NewRequestPage     | `requests/new/NewRequestPage.tsx`                | Halaman utama request pengadaan |
| RequestForm        | `requests/new/components/RequestForm.tsx`        | Form input request              |
| RequestList        | `requests/new/components/RequestList.tsx`        | Daftar request                  |
| RequestDetailModal | `requests/new/components/RequestDetailModal.tsx` | Modal detail request            |
| ApprovalPanel      | `requests/new/components/ApprovalPanel.tsx`      | Panel approval                  |

## Daftar Komponen Request Peminjaman

| Komponen                | Path                                           | Deskripsi             |
| ----------------------- | ---------------------------------------------- | --------------------- |
| LoanRequestPage         | `requests/loan/LoanRequestPage.tsx`            | Halaman utama loan    |
| LoanRequestForm         | `requests/loan/components/LoanRequestForm.tsx` | Form input peminjaman |
| AssignmentPanel         | `requests/loan/components/AssignmentPanel.tsx` | Panel assignment aset |
| ReturnAssetFormPage     | `requests/loan/ReturnAssetFormPage.tsx`        | Form pengembalian     |
| ReturnRequestDetailPage | `requests/loan/ReturnRequestDetailPage.tsx`    | Detail pengembalian   |

## Store

| Store           | Deskripsi                           |
| --------------- | ----------------------------------- |
| useRequestStore | State untuk requests & loanRequests |

---

## 1. NewRequestPage

### Props

```typescript
interface NewRequestPageProps {
  currentUser: User;
  onInitiateRegistration: (request: Request, item: any) => void;
  onInitiateHandoverFromRequest: (request: Request) => void;
  initialFilters?: any;
  onClearInitialFilters: () => void;
  onShowPreview: (data: PreviewData) => void;
  setActivePage: (page: Page, initialState?: any) => void;
}
```

### State Internal

```typescript
const [activeTab, setActiveTab] = useState<
  "all" | "pending" | "processing" | "completed" | "rejected"
>("all");
const [isFormOpen, setIsFormOpen] = useState(false);
const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
const [filters, setFilters] = useState({
  search: "",
  status: "",
  dateRange: null,
});
```

### Key Features

- Tab navigation untuk filter status
- Search dan filter multi-kriteria
- Modal form untuk buat request baru
- Detail view dengan approval actions

---

## 2. RequestForm

### Props

```typescript
interface RequestFormProps {
  currentUser: User;
  onSubmit: (data: RequestFormData) => void;
  onCancel: () => void;
  categories: AssetCategory[];
}
```

### Form Fields

```typescript
interface RequestFormData {
  orderType: OrderType;
  justification?: string;
  project?: string;
  allocationTarget: AllocationTarget;
  items: RequestItem[];
}
```

### Validasi

```tsx
const validateForm = (): boolean => {
  if (items.length === 0) {
    showError("Tambahkan minimal 1 item");
    return false;
  }

  if (orderType === "Urgent" && !justification) {
    showError("Justifikasi wajib untuk request Urgent");
    return false;
  }

  return true;
};
```

---

## 3. ApprovalPanel

### Props

```typescript
interface ApprovalPanelProps {
  request: Request;
  currentUser: User;
  onApprove: (payload: ApprovalPayload) => void;
  onReject: (reason: string) => void;
}
```

### Render Logic

```tsx
const ApprovalPanel = ({ request, currentUser, onApprove, onReject }) => {
  const canApproveLogistic =
    request.status === "Menunggu" &&
    hasPermission(currentUser, "requests:approve:logistic");

  const canApprovePurchase =
    request.status === "Disetujui Logistik" &&
    hasPermission(currentUser, "requests:approve:purchase");

  const canApproveFinal =
    request.status === "Menunggu CEO" &&
    hasPermission(currentUser, "requests:approve:final");

  if (!canApproveLogistic && !canApprovePurchase && !canApproveFinal) {
    return null; // No actions available
  }

  return (
    <div className="bg-blue-50 p-4 rounded-lg">
      <h3>Approval Actions</h3>
      {/* Render appropriate approval UI */}
    </div>
  );
};
```

---

## 4. LoanRequestPage

### Props

```typescript
interface LoanRequestPageProps {
  currentUser: User;
  setActivePage: (page: Page, initialState?: any) => void;
  onShowPreview: (data: PreviewData) => void;
  onInitiateHandoverFromLoan: (loanRequest: LoanRequest) => void;
  initialFilters?: any;
  assetCategories: AssetCategory[];
  setIsGlobalScannerOpen: (open: boolean) => void;
  setScanContext: (context: "global" | "form") => void;
  setFormScanCallback: (cb: ((data: any) => void) | null) => void;
}
```

### Tab Structure

```tsx
const tabs = [
  { id: "pending", label: "Menunggu", count: pendingCount },
  { id: "active", label: "Dipinjam", count: activeCount },
  { id: "returns", label: "Pengembalian", count: returnsCount },
  { id: "completed", label: "Selesai", count: completedCount },
];
```

---

## 5. AssignmentPanel

### Deskripsi

Panel untuk Admin menugaskan aset spesifik ke item yang diminta dalam loan request.

### Props

```typescript
interface AssignmentPanelProps {
  loanRequest: LoanRequest;
  availableAssets: Asset[];
  onAssign: (itemId: number, assetIds: string[]) => void;
  onSubmit: () => void;
  onCancel: () => void;
}
```

### Visual Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ Assignment Panel                                                │
├─────────────────────────────────────────────────────────────────┤
│ Item: Router Mikrotik x2                                        │
│                                                                 │
│ Available Assets:                              Assigned: 2/2    │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ ☑ AST-2026-001 | RB750Gr3 | SN: ABC123 | Di Gudang          ││
│ │ ☑ AST-2026-002 | RB750Gr3 | SN: ABC124 | Di Gudang          ││
│ │ ☐ AST-2026-003 | RB750Gr3 | SN: ABC125 | Di Gudang          ││
│ │ ☐ AST-2026-004 | RB750Gr3 | SN: ABC126 | Digunakan (locked) ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ [Scan QR] untuk tambah aset cepat                              │
└─────────────────────────────────────────────────────────────────┘
```

### Key Features

- Filter aset berdasarkan tipe yang diminta
- Checkbox untuk select/deselect aset
- Validasi kuantitas match dengan request
- QR scan untuk quick assignment
- Lock aset yang tidak tersedia

---

## 6. ReturnAssetFormPage

### Props

```typescript
interface ReturnAssetFormPageProps {
  currentUser: User;
  onCancel: () => void;
  loanRequest?: LoanRequest;
  preselectedAssets: Asset[];
  onShowPreview: (data: PreviewData) => void;
}
```

### Form Structure

```typescript
interface ReturnFormData {
  items: Array<{
    assetId: string;
    returnedCondition: AssetCondition;
    notes?: string;
    photos?: File[];
  }>;
  generalNotes?: string;
}
```

---

## 7. useRequestStore

### Interface

```typescript
interface RequestState {
  requests: Request[];
  loanRequests: LoanRequest[];
  returns: AssetReturn[];
  isLoading: boolean;

  // Actions
  fetchRequests: () => Promise<void>;
  createRequest: (data: RequestFormData) => Promise<Request>;
  updateRequest: (id: string, data: Partial<Request>) => Promise<void>;
  approveRequest: (id: string, payload: ApprovalPayload) => Promise<void>;
  rejectRequest: (id: string, reason: string) => Promise<void>;

  createLoanRequest: (data: LoanFormData) => Promise<LoanRequest>;
  approveLoanRequest: (
    id: string,
    assignments: AssetAssignment,
  ) => Promise<void>;
  submitReturn: (data: ReturnSubmission) => Promise<void>;
  verifyReturn: (
    id: string,
    verifications: ReturnVerification,
  ) => Promise<void>;
}
```

### Selectors

```typescript
// Get filtered requests
const pendingRequests = useRequestStore((state) =>
  state.requests.filter((r) => r.status === "Menunggu"),
);

// Get user's own requests
const myRequests = useRequestStore((state) =>
  state.requests.filter((r) => r.requester === currentUser.name),
);

// Get overdue loans
const overdueLoans = useRequestStore((state) =>
  state.loanRequests.filter((lr) => lr.status === "Terlambat"),
);
```

---

## Best Practices

### 1. Form State Management

```tsx
// Gunakan controlled components
const [formData, setFormData] = useState<RequestFormData>(initialState);

const handleItemChange = (index: number, field: string, value: any) => {
  setFormData((prev) => ({
    ...prev,
    items: prev.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    ),
  }));
};
```

### 2. Optimistic Updates

```tsx
const handleApprove = async () => {
  // Optimistic update
  setLocalStatus("APPROVED");

  try {
    await approveRequest(request.id, payload);
    addNotification("Request berhasil disetujui", "success");
  } catch (error) {
    // Rollback on error
    setLocalStatus(request.status);
    addNotification("Gagal menyetujui request", "error");
  }
};
```

### 3. Loading & Error States

```tsx
const { isLoading, error } = useRequestStore();

if (isLoading) return <RequestListSkeleton />;
if (error) return <ErrorMessage message={error} onRetry={fetchRequests} />;
```

### 4. Confirmation Dialogs

```tsx
// Konfirmasi sebelum aksi penting
const handleReject = () => {
  openConfirmDialog({
    title: "Tolak Request?",
    message: "Tindakan ini tidak dapat dibatalkan.",
    onConfirm: () => rejectRequest(id, reason),
    confirmLabel: "Ya, Tolak",
    confirmVariant: "danger",
  });
};
```
