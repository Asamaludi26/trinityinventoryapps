# Component Library & UI Reference

Dokumen ini menjelaskan semua komponen UI yang tersedia di aplikasi, cara penggunaannya, dan contoh implementasi.

---

## 📋 Daftar Isi

1. [Atomic Design Principles](#1-atomic-design-principles)
2. [Base Components (Atoms)](#2-base-components-atoms)
3. [Composite Components (Molecules)](#3-composite-components-molecules)
4. [Layout Components (Organisms)](#4-layout-components-organisms)
5. [Page Templates](#5-page-templates)
6. [Icons](#6-icons)
7. [Best Practices](#7-best-practices)

---

## 1. Atomic Design Principles

Aplikasi menggunakan **Atomic Design** untuk organisasi komponen:

- **Atoms**: Komponen dasar yang tidak bisa dipecah lagi (Button, Input, Label)
- **Molecules**: Kombinasi atoms (Form Field, Search Bar)
- **Organisms**: Kombinasi molecules (Form, Table, Modal)
- **Templates**: Layout halaman
- **Pages**: Halaman lengkap dengan data

---

## 2. Base Components (Atoms)

### 2.1. Button (`ActionButton.tsx`)

Komponen button dengan berbagai variant dan size.

**Props**:
```typescript
interface ActionButtonProps {
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}
```

**Contoh Penggunaan**:
```tsx
<ActionButton variant="primary" onClick={handleSave}>
  Simpan
</ActionButton>

<ActionButton variant="danger" onClick={handleDelete}>
  Hapus
</ActionButton>

<ActionButton variant="secondary" disabled>
  Batal
</ActionButton>
```

**Variants**:
- `primary`: Tombol utama (biru)
- `secondary`: Tombol sekunder (putih dengan border)
- `danger`: Tombol destruktif (merah)
- `outline`: Tombol outline (transparent dengan border)

### 2.2. Input (`CustomSelect.tsx`, `CreatableSelect.tsx`)

Input field dengan berbagai tipe.

**Text Input**:
```tsx
<input
  type="text"
  className="w-full px-3 py-2 border border-gray-300 rounded-md"
  placeholder="Masukkan nama"
/>
```

**Select Dropdown**:
```tsx
<CustomSelect
  options={options}
  value={selectedValue}
  onChange={setSelectedValue}
  placeholder="Pilih opsi"
/>
```

**Creatable Select** (bisa menambah opsi baru):
```tsx
<CreatableSelect
  options={options}
  value={selectedValue}
  onChange={setSelectedValue}
  onCreateOption={handleCreate}
  placeholder="Pilih atau buat baru"
/>
```

### 2.3. Checkbox (`Checkbox.tsx`)

Checkbox untuk multiple selection.

```tsx
<Checkbox
  checked={isChecked}
  onChange={setIsChecked}
  label="Saya setuju dengan syarat dan ketentuan"
/>
```

### 2.4. Date Picker (`DatePicker.tsx`)

Date picker untuk memilih tanggal.

```tsx
<DatePicker
  value={selectedDate}
  onChange={setSelectedDate}
  label="Tanggal Request"
  required
/>
```

### 2.5. Modal (`Modal.tsx`)

Modal dialog untuk menampilkan konten overlay.

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Konfirmasi Hapus"
>
  <p>Apakah Anda yakin ingin menghapus item ini?</p>
  <div className="flex gap-2 mt-4">
    <ActionButton variant="danger" onClick={handleDelete}>
      Hapus
    </ActionButton>
    <ActionButton variant="secondary" onClick={() => setIsOpen(false)}>
      Batal
    </ActionButton>
  </div>
</Modal>
```

### 2.6. Tooltip (`Tooltip.tsx`)

Tooltip untuk informasi tambahan.

```tsx
<Tooltip content="Ini adalah tooltip">
  <button>Hover me</button>
</Tooltip>
```

### 2.7. Avatar (`Avatar.tsx`)

Avatar untuk menampilkan user.

```tsx
<Avatar name="John Doe" size="md" />
```

### 2.8. Badge/Status

Badge untuk menampilkan status.

```tsx
<span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
  APPROVED
</span>
```

---

## 3. Composite Components (Molecules)

### 3.1. Form Field

Kombinasi Label + Input + Error Message.

```tsx
<div className="space-y-1">
  <label className="block text-sm font-medium text-gray-700">
    Nama Aset <span className="text-red-500">*</span>
  </label>
  <input
    type="text"
    className="w-full px-3 py-2 border border-gray-300 rounded-md"
    value={value}
    onChange={(e) => setValue(e.target.value)}
  />
  {error && (
    <p className="text-sm text-red-600">{error}</p>
  )}
</div>
```

### 3.2. Search Bar

Search input dengan icon.

```tsx
<div className="relative">
  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
  <input
    type="text"
    placeholder="Cari aset..."
    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
  />
</div>
```

### 3.3. Pagination (`PaginationControls.tsx`)

Kontrol pagination untuk list data.

```tsx
<PaginationControls
  currentPage={currentPage}
  totalPages={totalPages}
  itemsPerPage={itemsPerPage}
  totalItems={totalItems}
  onPageChange={setCurrentPage}
  onItemsPerPageChange={setItemsPerPage}
/>
```

---

## 4. Layout Components (Organisms)

### 4.1. Main Layout (`MainLayout.tsx`)

Layout utama aplikasi dengan sidebar dan header.

```tsx
<MainLayout
  currentUser={currentUser}
  activePage={activePage}
  onPageChange={setActivePage}
>
  {children}
</MainLayout>
```

### 4.2. Sidebar (`Sidebar.tsx`)

Sidebar navigation dengan menu items.

**Props**:
- `currentUser`: User object dengan role
- `activePage`: Halaman aktif saat ini
- `onPageChange`: Callback saat page berubah

### 4.3. Form Page Layout (`FormPageLayout.tsx`)

Layout khusus untuk halaman form.

```tsx
<FormPageLayout
  title="Tambah Aset Baru"
  breadcrumbs={[
    { label: 'Home', href: '/' },
    { label: 'Aset', href: '/assets' },
    { label: 'Tambah Baru' }
  ]}
  actions={
    <ActionButton variant="primary" onClick={handleSave}>
      Simpan
    </ActionButton>
  }
>
  {/* Form content */}
</FormPageLayout>
```

### 4.4. Detail Page Layout (`DetailPageLayout.tsx`)

Layout untuk halaman detail.

```tsx
<DetailPageLayout
  title="Detail Aset"
  subtitle="AST-2025-001"
  breadcrumbs={[...]}
  actions={
    <>
      <ActionButton variant="secondary">Edit</ActionButton>
      <ActionButton variant="danger">Hapus</ActionButton>
    </>
  }
>
  {/* Detail content */}
</DetailPageLayout>
```

### 4.5. Table

Table component untuk menampilkan data dalam format tabel.

```tsx
<table className="min-w-full divide-y divide-gray-200">
  <thead className="bg-gray-50">
    <tr>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
        ID
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
        Nama
      </th>
    </tr>
  </thead>
  <tbody className="bg-white divide-y divide-gray-200">
    {items.map((item) => (
      <tr key={item.id} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap">{item.id}</td>
        <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
      </tr>
    ))}
  </tbody>
</table>
```

### 4.6. Card

Card component untuk menampilkan konten dalam box.

```tsx
<div className="bg-white rounded-lg shadow p-6">
  <h3 className="text-lg font-semibold mb-4">Judul Card</h3>
  <p>Konten card...</p>
</div>
```

---

## 5. Page Templates

### 5.1. List Page Template

Template untuk halaman list data.

**Struktur**:
- Header dengan title dan action buttons
- Filter bar (search, filters)
- Table/list dengan pagination
- Bulk actions (jika diperlukan)

### 5.2. Form Page Template

Template untuk halaman form.

**Struktur**:
- Header dengan breadcrumbs
- Form dengan sections
- Floating action bar (untuk form panjang)
- Validation errors

### 5.3. Detail Page Template

Template untuk halaman detail.

**Struktur**:
- Header dengan title dan actions
- Tabs untuk berbagai informasi
- Related data sections
- Activity log/history

---

## 6. Icons

Aplikasi menggunakan **Lucide React** untuk icons.

### 6.1. Usage

```tsx
import { DashboardIcon } from '../components/icons/DashboardIcon';
import { AssetIcon } from '../components/icons/AssetIcon';

<DashboardIcon className="w-5 h-5" />
<AssetIcon className="w-6 h-6 text-blue-500" />
```

### 6.2. Available Icons

Semua icons tersedia di `src/components/icons/`:
- `DashboardIcon`
- `AssetIcon`
- `RequestIcon`
- `UserIcon`
- `SettingsIcon`
- Dan 70+ icons lainnya

---

## 7. Best Practices

### 7.1. Component Composition

Gunakan composition daripada inheritance:

```tsx
// ✅ Good
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardBody>
    Content
  </CardBody>
</Card>

// ❌ Bad
<Card title="Title" content="Content" />
```

### 7.2. Props Naming

- Gunakan nama yang deskriptif
- Hindari singkatan yang tidak jelas
- Konsisten dengan naming convention

### 7.3. Styling

- Gunakan Tailwind CSS utility classes
- Hindari inline styles
- Gunakan CSS variables untuk theme colors

### 7.4. Accessibility

- Semua interactive elements harus keyboard accessible
- Gunakan semantic HTML
- Tambahkan ARIA labels jika diperlukan
- Pastikan kontras warna cukup

---

## 8. Component Documentation Template

Setiap komponen baru harus memiliki dokumentasi:

```typescript
/**
 * ComponentName
 * 
 * Deskripsi singkat komponen
 * 
 * @example
 * ```tsx
 * <ComponentName prop1="value" />
 * ```
 */
```

---

## 9. References

- [Design System](./../03_STANDARDS_AND_PROCEDURES/DESIGN_SYSTEM.md)
- [Frontend Guide](./FRONTEND_GUIDE.md)
- [Lucide Icons](https://lucide.dev/)

---

**Last Updated**: 2025-01-XX

