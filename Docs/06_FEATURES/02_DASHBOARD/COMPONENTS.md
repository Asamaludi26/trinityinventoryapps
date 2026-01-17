# Komponen: Dashboard

## Daftar Komponen

| Komponen              | Path                                   | Deskripsi               |
| --------------------- | -------------------------------------- | ----------------------- |
| DashboardPage         | `features/dashboard/DashboardPage.tsx` | Halaman utama dashboard |
| ActionableItemsList   | `components/ActionableItemsList.tsx`   | Daftar tugas pending    |
| AssetMatrix           | `components/AssetMatrix.tsx`           | Tabel stok per kategori |
| AssetStatusDonutChart | `components/DashboardCharts.tsx`       | Chart distribusi status |
| SpendingTrendChart    | `components/DashboardCharts.tsx`       | Chart tren pengeluaran  |
| TechnicianLeaderboard | `components/DashboardCharts.tsx`       | Leaderboard teknisi     |
| StockAlertWidget      | `components/StockAlertWidget.tsx`      | Alert stok rendah       |
| WarrantyAlertWidget   | `components/WarrantyAlertWidget.tsx`   | Alert garansi           |
| CategorySummaryWidget | `components/CategorySummaryWidget.tsx` | Ringkasan kategori      |
| SummaryCard           | `components/SummaryCard.tsx`           | Card metrik             |

## Daftar Hooks

| Hook             | Path                        | Deskripsi                   |
| ---------------- | --------------------------- | --------------------------- |
| useDashboardData | `hooks/useDashboardData.ts` | Centralized dashboard logic |

---

## 1. DashboardPage

### Props

```typescript
interface DashboardProps {
  currentUser: User;
  setActivePage: (page: Page, filters?: any) => void;
  onShowPreview: (data: PreviewData) => void;
}
```

### Render Logic

```tsx
const DashboardPage: React.FC<DashboardProps> = ({
  currentUser,
  setActivePage,
  onShowPreview,
}) => {
  // Jika Staff/Leader, tampilkan dashboard sederhana
  if (currentUser.role === "Staff" || currentUser.role === "Leader") {
    return <StaffDashboard {...props} />;
  }

  // Admin/Super Admin dashboard
  return <AdminDashboard {...props} />;
};
```

---

## 2. MacroStat

### Deskripsi

Card untuk menampilkan metrik tingkat tinggi dengan ikon dan sub-value.

### Props

```typescript
interface MacroStatProps {
  label: string; // Judul metrik
  value: string; // Nilai utama
  icon: React.ComponentType; // Ikon
  subValue?: string; // Nilai sekunder
  tooltip?: string; // Tooltip on hover
}
```

### Contoh Penggunaan

```tsx
<MacroStat
  label="Total Nilai Aset"
  value="500 Jt"
  subValue="Rp 500.000.000"
  tooltip="Total harga pembelian seluruh aset aktif"
  icon={BsCurrencyDollar}
/>
```

---

## 3. UrgencyCard

### Deskripsi

Card untuk menampilkan metrik urgent dengan warna border sesuai tingkat urgensi.

### Props

```typescript
interface UrgencyCardProps {
  label: string;
  value: string;
  icon: React.ComponentType;
  color: string; // Tailwind color class (e.g., 'bg-red-500')
  subtext?: string;
  onClick?: () => void;
}
```

### Contoh Penggunaan

```tsx
<UrgencyCard
  label="Request Pending"
  value="5"
  icon={RequestIcon}
  color="bg-amber-500"
  subtext="Menunggu persetujuan"
  onClick={() => setActivePage("request", { status: "PENDING" })}
/>
```

---

## 4. StockAlertWidget

### Deskripsi

Widget yang menampilkan alert untuk item dengan stok di bawah threshold.

### Props

```typescript
interface StockAlertWidgetProps {
  assets: Asset[];
  setActivePage: (page: Page, filters?: any) => void;
  thresholds: Record<string, number>;
}
```

### Render Conditions

```tsx
// Tidak render jika tidak ada alert
if (lowStockItems.length === 0 && outOfStockItems.length === 0) {
  return null;
}

// Tampilkan banner warning
return (
  <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
    <div className="flex items-center gap-2">
      <ExclamationTriangleIcon className="text-amber-500" />
      <span>STOCK ALERT: {lowStockItems.length} item di bawah threshold</span>
    </div>
    <button onClick={() => setActivePage("stock", { lowStockOnly: true })}>
      Lihat Detail
    </button>
  </div>
);
```

---

## 5. ActionableItemsList

### Deskripsi

Daftar tugas yang memerlukan tindakan, difilter berdasarkan role user.

### Props

```typescript
interface ActionableItemsListProps {
  currentUser: User;
  setActivePage: (page: Page, filters?: any) => void;
  onShowPreview: (data: PreviewData) => void;
}
```

### Item Structure

```typescript
interface ActionableItem {
  id: string;
  type: "request" | "loan" | "handover" | "repair" | "return";
  icon: React.ComponentType;
  title: string;
  description: string;
  badge?: { text: string; color: string };
  onClick: () => void;
}
```

### Contoh Render

```tsx
<ul className="divide-y divide-gray-100">
  {actionableItems.map((item) => (
    <li
      key={item.id}
      onClick={item.onClick}
      className="hover:bg-gray-50 p-4 cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <item.icon className="w-5 h-5 text-gray-400" />
        <div className="flex-1">
          <p className="font-medium">{item.title}</p>
          <p className="text-sm text-gray-500">{item.description}</p>
        </div>
        {item.badge && (
          <span className={`px-2 py-1 text-xs rounded ${item.badge.color}`}>
            {item.badge.text}
          </span>
        )}
      </div>
    </li>
  ))}
</ul>
```

---

## 6. AssetStatusDonutChart

### Deskripsi

Chart donut yang menampilkan distribusi status aset.

### Props

```typescript
interface DonutChartProps {
  data: Array<{
    label: string;
    value: number;
    color: string;
  }>;
}
```

### Data Mapping

```typescript
const chartData = [
  { label: "Di Gudang", value: statusCounts.inStorage, color: "#22C55E" },
  { label: "Digunakan", value: statusCounts.inUse, color: "#3B82F6" },
  { label: "Custody", value: statusCounts.inCustody, color: "#8B5CF6" },
  { label: "Rusak", value: statusCounts.damaged, color: "#EF4444" },
  { label: "Service", value: statusCounts.outForRepair, color: "#F59E0B" },
];
```

---

## 7. SpendingTrendChart

### Deskripsi

Line chart menampilkan tren pengeluaran pembelian aset 6 bulan terakhir.

### Props

```typescript
interface TrendChartProps {
  data: Array<{
    month: string;
    value: number;
  }>;
}
```

---

## 8. useDashboardData Hook

### Deskripsi

Custom hook yang mengenkapsulasi semua logika pengambilan dan kalkulasi data dashboard.

### Return Value

```typescript
interface DashboardData {
  assets: Asset[];
  assetCategories: AssetCategory[];
  macroMetrics: {
    totalValue: number;
    totalAssets: number;
    totalActiveItems: number;
  };
  urgencyMetrics: {
    pendingRequests: number;
    overdueLoans: number;
    damagedAssets: number;
    criticalStock: number;
  };
  featureMetrics: {
    requests: { pending: number; approved: number; completed: number };
    loans: { active: number; returned: number; overdue: number };
    repairs: { active: number; completed: number };
  };
  analyticsData: {
    statusDistribution: ChartData[];
    spendingTrend: ChartData[];
    technicianLeaderboard: LeaderboardEntry[];
  };
  allActivities: Activity[];
}
```

### Contoh Penggunaan

```tsx
const DashboardPage = ({ currentUser }) => {
  const { macroMetrics, urgencyMetrics, analyticsData } = useDashboardData(
    currentUser.role,
    currentUser.name,
  );

  return (
    <div>
      <MacroStat value={macroMetrics.totalAssets} />
      <UrgencyCard value={urgencyMetrics.pendingRequests} />
      <AssetStatusDonutChart data={analyticsData.statusDistribution} />
    </div>
  );
};
```

---

## Best Practices

### 1. Permission-based Rendering

```tsx
// Sembunyikan metrik harga untuk non-admin
const canViewPrice = hasPermission(currentUser, "assets:view-price");

{
  canViewPrice ? (
    <MacroStat label="Total Nilai" value={formatCurrency(totalValue)} />
  ) : (
    <MacroStat label="Total Aset Fisik" value={totalAssets} />
  );
}
```

### 2. Loading States

```tsx
// Tampilkan skeleton saat data loading
if (isLoading) {
  return <DashboardSkeleton />;
}
```

### 3. Empty States

```tsx
// Handle ketika tidak ada data
if (actionableItems.length === 0) {
  return (
    <div className="text-center py-8 text-gray-500">
      <CheckIcon className="w-12 h-12 mx-auto mb-2" />
      <p>Tidak ada tugas pending</p>
    </div>
  );
}
```

### 4. Responsive Design

```tsx
// Grid responsif untuk berbagai ukuran layar
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  <MacroStat />
  <MacroStat />
  <MacroStat />
  <MacroStat />
</div>
```
