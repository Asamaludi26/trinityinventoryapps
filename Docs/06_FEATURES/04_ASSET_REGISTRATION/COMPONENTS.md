# Komponen: Registrasi Aset

## Daftar Komponen

| Komponen         | Path                                     | Deskripsi            |
| ---------------- | ---------------------------------------- | -------------------- |
| RegistrationPage | `assetRegistration/RegistrationPage.tsx` | Halaman utama        |
| AssetForm        | `components/AssetForm.tsx`               | Form registrasi/edit |
| AssetList        | `components/AssetList.tsx`               | Daftar aset          |
| AssetDetailModal | `components/AssetDetailModal.tsx`        | Detail aset          |
| QRCodeGenerator  | `components/QRCodeGenerator.tsx`         | Generate QR          |
| PrintLabelModal  | `components/PrintLabelModal.tsx`         | Print labels         |

## Store

| Store         | Deskripsi                       |
| ------------- | ------------------------------- |
| useAssetStore | State untuk assets & categories |

---

## 1. RegistrationPage

### Props

```typescript
interface RegistrationPageProps {
  currentUser: User;
  setActivePage: (page: Page, state?: any) => void;
  onShowPreview: (data: PreviewData) => void;
  initialFilters?: any;
  onClearInitialFilters: () => void;
  prefillData?: { request: Request; itemToRegister: any };
  onClearPrefill: () => void;
  onInitiateHandover: (asset: Asset) => void;
  onInitiateDismantle: (asset: Asset) => void;
  onInitiateInstallation: (asset: Asset) => void;
  assetToViewId: string | null;
  itemToEdit: { type: "asset"; id: string } | null;
  onClearItemToEdit: () => void;
  setIsGlobalScannerOpen: (open: boolean) => void;
  setScanContext: (context: "global" | "form") => void;
  setFormScanCallback: (cb: ((data: any) => void) | null) => void;
}
```

### State

```typescript
const [mode, setMode] = useState<"list" | "form" | "detail">("list");
const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
const [formData, setFormData] = useState<AssetFormData | null>(null);
const [filters, setFilters] = useState({
  search: "",
  category: "",
  status: "",
});
```

---

## 2. AssetForm

### Props

```typescript
interface AssetFormProps {
  mode: "create" | "edit";
  initialData?: Partial<Asset>;
  prefillFromRequest?: { request: Request; item: RequestItem };
  categories: AssetCategory[];
  onSubmit: (data: AssetFormData) => Promise<void>;
  onCancel: () => void;
}
```

### Form Tabs

```tsx
const FormTabs = () => (
  <Tabs value={activeTab} onChange={setActiveTab}>
    <Tab value="basic" label="Informasi Dasar" />
    <Tab value="technical" label="Detail Teknis" />
    <Tab value="purchase" label="Pembelian" />
    <Tab value="attachments" label="Lampiran" />
  </Tabs>
);
```

### Tab: Informasi Dasar

```tsx
<div className="space-y-4">
  <FormField label="Kategori" required>
    <CategorySelect value={formData.category} onChange={handleCategoryChange} />
  </FormField>

  <FormField label="Tipe" required>
    <TypeSelect
      categoryId={formData.category}
      value={formData.type}
      onChange={handleTypeChange}
    />
  </FormField>

  <FormField label="Brand/Model" required>
    <BrandSelect
      typeId={formData.type}
      value={formData.brand}
      onChange={handleBrandChange}
    />
  </FormField>

  <FormField label="Kondisi" required>
    <ConditionSelect
      value={formData.condition}
      onChange={(v) => setFormData({ ...formData, condition: v })}
    />
  </FormField>

  <FormField label="Lokasi">
    <Input
      value={formData.location}
      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
      placeholder="Gudang A, Rak 1"
    />
  </FormField>
</div>
```

### Tab: Detail Teknis

```tsx
<div className="space-y-4">
  <FormField label="Serial Number">
    <Input
      value={formData.serialNumber}
      onChange={(e) =>
        setFormData({ ...formData, serialNumber: e.target.value })
      }
    />
  </FormField>

  <FormField label="MAC Address">
    <Input
      value={formData.macAddress}
      onChange={(e) => setFormData({ ...formData, macAddress: e.target.value })}
      placeholder="AA:BB:CC:DD:EE:FF"
    />
  </FormField>

  {/* For bulk assets */}
  {isBulkAsset && (
    <>
      <FormField label="Jumlah Awal">
        <Input
          type="number"
          value={formData.initialBalance}
          onChange={(e) =>
            setFormData({ ...formData, initialBalance: Number(e.target.value) })
          }
        />
      </FormField>
      <FormField label="Satuan">
        <Input value={formData.unitOfMeasure} disabled />
      </FormField>
    </>
  )}
</div>
```

---

## 3. AssetCard / AssetRow

### Props

```typescript
interface AssetCardProps {
  asset: Asset;
  onView: () => void;
  onEdit: () => void;
  onPrint: () => void;
  onAction: (action: AssetAction) => void;
}
```

### Render

```tsx
const AssetCard = ({ asset, onView, onEdit, onPrint, onAction }) => (
  <div className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <span className="text-sm text-gray-500">{asset.id}</span>
        <h3 className="font-semibold">{asset.name}</h3>
        <p className="text-sm text-gray-600">{asset.brand}</p>
      </div>
      <StatusBadge status={asset.status} />
    </div>

    {asset.serialNumber && (
      <p className="text-xs text-gray-500 mt-2">SN: {asset.serialNumber}</p>
    )}

    {asset.currentBalance !== undefined && (
      <div className="mt-2">
        <BalanceBar
          current={asset.currentBalance}
          initial={asset.initialBalance}
          unit={asset.unitOfMeasure}
        />
      </div>
    )}

    <div className="flex gap-2 mt-4">
      <Button size="sm" onClick={onView}>
        Detail
      </Button>
      <Button size="sm" variant="outline" onClick={onPrint}>
        QR
      </Button>
      <DropdownMenu>
        <DropdownItem onClick={onEdit}>Edit</DropdownItem>
        <DropdownItem onClick={() => onAction("handover")}>
          Serah Terima
        </DropdownItem>
      </DropdownMenu>
    </div>
  </div>
);
```

---

## 4. QRCodeGenerator

### Props

```typescript
interface QRCodeGeneratorProps {
  asset: Asset;
  size?: number;
  showLabel?: boolean;
}
```

### Implementation

```tsx
import QRCode from "qrcode.react";

const QRCodeGenerator = ({ asset, size = 128, showLabel = true }) => {
  const qrData = JSON.stringify({
    id: asset.id,
    sn: asset.serialNumber,
    name: asset.name,
  });

  return (
    <div className="text-center">
      <QRCode value={qrData} size={size} />
      {showLabel && (
        <div className="mt-2 text-xs">
          <p className="font-bold">{asset.id}</p>
          <p>{asset.name}</p>
        </div>
      )}
    </div>
  );
};
```

---

## 5. PrintLabelModal

### Props

```typescript
interface PrintLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: Asset[];
  labelSize: "small" | "medium" | "large";
}
```

### Label Sizes

```typescript
const LABEL_SIZES = {
  small: { width: 38, height: 25, qrSize: 50 }, // 38mm x 25mm
  medium: { width: 50, height: 30, qrSize: 70 }, // 50mm x 30mm
  large: { width: 70, height: 40, qrSize: 100 }, // 70mm x 40mm
};
```

### Print Layout

```tsx
const PrintableLabels = ({ assets, labelSize }) => (
  <div
    className="print-container"
    style={{ display: "flex", flexWrap: "wrap" }}
  >
    {assets.map((asset) => (
      <div
        key={asset.id}
        className="label"
        style={{
          width: `${LABEL_SIZES[labelSize].width}mm`,
          height: `${LABEL_SIZES[labelSize].height}mm`,
          border: "1px dashed #ccc",
          padding: "2mm",
        }}
      >
        <QRCodeGenerator
          asset={asset}
          size={LABEL_SIZES[labelSize].qrSize}
          showLabel={true}
        />
      </div>
    ))}
  </div>
);
```

---

## 6. useAssetStore

### Interface

```typescript
interface AssetState {
  assets: Asset[];
  categories: AssetCategory[];
  thresholds: Record<string, number>;
  isLoading: boolean;

  // Actions
  fetchAssets: () => Promise<void>;
  createAsset: (data: AssetFormData) => Promise<Asset>;
  updateAsset: (id: string, data: Partial<Asset>) => Promise<void>;
  deleteAsset: (id: string) => Promise<void>;

  // Stock
  getStockHistory: (name: string, brand: string) => StockMovement[];
  updateThresholds: (thresholds: Record<string, number>) => void;

  // Helpers
  getAssetById: (id: string) => Asset | undefined;
  getAvailableAssets: (categoryId?: number, typeId?: number) => Asset[];
}
```

### Selectors

```typescript
// Get assets by status
const inStorageAssets = useAssetStore((state) =>
  state.assets.filter((a) => a.status === "Di Gudang"),
);

// Get bulk assets
const bulkAssets = useAssetStore((state) =>
  state.assets.filter((a) => a.initialBalance !== undefined),
);
```

---

## Best Practices

### 1. Form Validation UX

```tsx
// Real-time validation feedback
const [errors, setErrors] = useState<Record<string, string>>({});

const handleFieldBlur = (field: string, value: any) => {
  const error = validateField(field, value);
  setErrors((prev) => ({ ...prev, [field]: error }));
};

<Input
  value={formData.serialNumber}
  onBlur={(e) => handleFieldBlur("serialNumber", e.target.value)}
  error={errors.serialNumber}
/>;
```

### 2. Autosave Draft

```tsx
// Save draft to localStorage
useEffect(() => {
  if (formData && mode === "create") {
    localStorage.setItem("asset_draft", JSON.stringify(formData));
  }
}, [formData]);

// Restore on mount
useEffect(() => {
  const draft = localStorage.getItem("asset_draft");
  if (draft) {
    setFormData(JSON.parse(draft));
    showNotification("Draft form dipulihkan");
  }
}, []);
```

### 3. Bulk Operations

```tsx
// Select multiple assets for bulk print
const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

const handleBulkPrint = () => {
  const selectedAssets = assets.filter((a) => selectedIds.has(a.id));
  openPrintModal(selectedAssets);
};
```
