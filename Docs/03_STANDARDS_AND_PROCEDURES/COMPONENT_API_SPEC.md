# Spesifikasi API Komponen UI

Dokumen ini mencantumkan kontrak props untuk komponen UI inti (Atomic Components).

---

## 1. ActionButton

Lokasi: `src/components/ui/ActionButton.tsx`
Fungsi: Tombol standar untuk aksi di dalam tabel atau toolbar.

| Prop       | Tipe         | Wajib       | Default   | Deskripsi                              |
| :--------- | :----------- | :---------- | :-------- | :------------------------------------- | ----------- | ---------------------------- |
| `label`    | `string`     | Ya          | -         | Teks pada tombol.                      |
| `icon`     | `ReactNode`  | Tidak       | -         | Ikon (biasanya dari Lucide/Heroicons). |
| `onClick`  | `() => void` | Ya          | -         | Fungsi handler saat diklik.            |
| `variant`  | `'primary'   | 'secondary' | 'danger'` | Tidak                                  | `'primary'` | Menentukan warna background. |
| `disabled` | `boolean`    | Tidak       | `false`   | Menonaktifkan interaksi.               |

**Aturan Penggunaan:**

- Gunakan `variant="danger"` hanya untuk aksi destruktif (Hapus, Reject).
- Selalu sertakan `icon` untuk aksi di dalam baris tabel (Table Row Actions).

---

## 2. StatusBadge

Lokasi: `src/components/ui/StatusBadge.tsx`
Fungsi: Menampilkan status entitas dengan kode warna yang konsisten.

| Prop        | Tipe      | Wajib | Default | Deskripsi                                  |
| :---------- | :-------- | :---- | :------ | :----------------------------------------- | ------ | ------------- |
| `status`    | `string`  | Ya    | -       | Nilai status (cth: 'Pending', 'Approved'). |
| `className` | `string`  | Tidak | `''`    | Class CSS tambahan.                        |
| `size`      | `'sm'     | 'md'  | 'lg'`   | Tidak                                      | `'sm'` | Ukuran badge. |
| `icon`      | `boolean` | Tidak | `false` | Tampilkan ikon status.                     |

**Skema Warna Otomatis (Intent):**

- **success**: active, completed, approved, arrived, returned
- **warning**: pending, awaiting, on_loan, under_repair
- **danger**: rejected, cancelled, damaged, overdue, decommissioned
- **info**: in_progress, purchasing, delivery, maintenance
- **indigo**: in_use, digunakan
- **purple**: custody, out_for_repair
- **slate**: consumed, habis
- **neutral**: in_storage, inactive

---

## 3. Modal

Lokasi: `src/components/ui/Modal.tsx`
Fungsi: Container _overlay_ standar.

| Prop                     | Tipe         | Wajib | Default   | Deskripsi                         |
| :----------------------- | :----------- | :---- | :-------- | :-------------------------------- | ----- | ----- | ----- | ------- | ----- | ------ | ------------ |
| `isOpen`                 | `boolean`    | Ya    | -         | State visibilitas modal.          |
| `onClose`                | `() => void` | Ya    | -         | Fungsi untuk menutup modal.       |
| `title`                  | `string`     | Ya    | -         | Judul header modal.               |
| `children`               | `ReactNode`  | Ya    | -         | Konten body modal.                |
| `footerContent`          | `ReactNode`  | Tidak | -         | Area tombol aksi di bawah.        |
| `size`                   | `'sm'        | 'md'  | 'lg'      | 'xl'                              | '2xl' | '3xl' | '4xl' | 'full'` | Tidak | `'lg'` | Lebar modal. |
| `hideDefaultCloseButton` | `boolean`    | Tidak | `false`   | Sembunyikan tombol Tutup default. |
| `closeButtonText`        | `string`     | Tidak | `'Tutup'` | Teks tombol tutup default.        |
| `zIndex`                 | `string`     | Tidak | `'z-50'`  | Z-index class.                    |
| `disableContentPadding`  | `boolean`    | Tidak | `false`   | Nonaktifkan padding konten.       |

---

## 4. ConfirmDialog (NEW v1.1.0)

Lokasi: `src/components/ui/ConfirmDialog.tsx`
Fungsi: Modal konfirmasi untuk aksi berbahaya atau penting.

| Prop                  | Tipe         | Wajib          | Default        | Deskripsi                    |
| :-------------------- | :----------- | :------------- | :------------- | :--------------------------- | ----------------------- | ------------------ |
| `isOpen`              | `boolean`    | Ya             | -              | State visibilitas dialog.    |
| `onClose`             | `() => void` | Ya             | -              | Fungsi untuk menutup dialog. |
| `onConfirm`           | `() => void  | Promise<void>` | Ya             | -                            | Fungsi saat konfirmasi. |
| `title`               | `string`     | Ya             | -              | Judul dialog.                |
| `message`             | `string      | ReactNode`     | Ya             | -                            | Pesan/deskripsi dialog. |
| `confirmLabel`        | `string`     | Tidak          | `'Konfirmasi'` | Label tombol konfirmasi.     |
| `cancelLabel`         | `string`     | Tidak          | `'Batal'`      | Label tombol batal.          |
| `variant`             | `'danger'    | 'warning'      | 'info'`        | Tidak                        | `'warning'`             | Warna tema dialog. |
| `isLoading`           | `boolean`    | Tidak          | `false`        | Tampilkan loading state.     |
| `requireConfirmation` | `boolean`    | Tidak          | `false`        | Wajib ketik teks konfirmasi. |
| `confirmationText`    | `string`     | Tidak          | `'HAPUS'`      | Teks yang harus diketik.     |

**Contoh Penggunaan:**

```tsx
<ConfirmDialog
  isOpen={isDeleteOpen}
  onClose={() => setIsDeleteOpen(false)}
  onConfirm={handleDelete}
  title="Hapus Item?"
  message="Aksi ini tidak dapat dibatalkan."
  variant="danger"
  requireConfirmation
/>
```

---

## 5. EmptyState (NEW v1.1.0)

Lokasi: `src/components/ui/EmptyState.tsx`
Fungsi: Tampilan unified untuk state kosong.

| Prop              | Tipe                                                           | Wajib    | Default               | Deskripsi               |
| :---------------- | :------------------------------------------------------------- | :------- | :-------------------- | :---------------------- | ----- | ----------- | ----------------- |
| `title`           | `string`                                                       | Tidak    | `'Tidak ada data'`    | Judul empty state.      |
| `description`     | `string`                                                       | Tidak    | `'Belum ada data...'` | Deskripsi.              |
| `icon`            | `ComponentType`                                                | Tidak    | -                     | Custom icon component.  |
| `variant`         | `'default'                                                     | 'search' | 'error'               | 'minimal'`              | Tidak | `'default'` | Variant tampilan. |
| `action`          | `{ label: string, onClick: () => void, icon?: ComponentType }` | Tidak    | -                     | Aksi utama.             |
| `secondaryAction` | `{ label: string, onClick: () => void }`                       | Tidak    | -                     | Aksi sekunder.          |
| `className`       | `string`                                                       | Tidak    | `''`                  | Class CSS tambahan.     |
| `children`        | `ReactNode`                                                    | Tidak    | -                     | Konten kustom tambahan. |

**Helper Components:**

- `SearchEmptyState`: props `query` (string), `onClear` (function)
- `TableEmptyState`: props `itemName` (string), `onAdd` (function), `addLabel` (string)

---

## 6. ErrorBoundary (NEW v1.1.0)

Lokasi: `src/components/ui/ErrorBoundary.tsx`
Fungsi: Menangkap error di child components untuk graceful degradation.

| Prop       | Tipe                                           | Wajib | Default | Deskripsi                      |
| :--------- | :--------------------------------------------- | :---- | :------ | :----------------------------- |
| `children` | `ReactNode`                                    | Ya    | -       | Komponen anak yang dilindungi. |
| `fallback` | `ReactNode`                                    | Tidak | -       | Custom fallback UI.            |
| `onError`  | `(error: Error, errorInfo: ErrorInfo) => void` | Tidak | -       | Callback saat error.           |

**HOC Helper:**

```tsx
const SafeComponent = withErrorBoundary(UnsafeComponent, <CustomFallback />);
```

---

## 7. CustomSelect

Lokasi: `src/components/ui/CustomSelect.tsx`
Fungsi: Dropdown select kustom dengan fitur search dan keyboard navigation.

| Prop                    | Tipe                      | Wajib   | Default                         | Deskripsi                                             |
| :---------------------- | :------------------------ | :------ | :------------------------------ | :---------------------------------------------------- | -------------- |
| `options`               | `Option[]`                | Ya      | -                               | Array opsi `{ value, label, indicator?, disabled? }`. |
| `value`                 | `string`                  | Ya      | -                               | Nilai terpilih saat ini.                              |
| `onChange`              | `(value: string) => void` | Ya      | -                               | Handler perubahan nilai.                              |
| `placeholder`           | `string`                  | Tidak   | `'Pilih...'`                    | Placeholder saat kosong.                              |
| `disabled`              | `boolean`                 | Tidak   | `false`                         | Nonaktifkan input.                                    |
| `emptyStateMessage`     | `string`                  | Tidak   | `'Tidak ada pilihan tersedia.'` | Pesan saat opsi kosong.                               |
| `emptyStateButtonLabel` | `string`                  | Tidak   | -                               | Label tombol saat kosong.                             |
| `onEmptyStateClick`     | `() => void`              | Tidak   | -                               | Handler tombol empty state.                           |
| `direction`             | `'up'                     | 'down'` | Tidak                           | `'down'`                                              | Arah dropdown. |
| `isSearchable`          | `boolean`                 | Tidak   | `false`                         | Aktifkan fitur pencarian.                             |
| `actionLabel`           | `string`                  | Tidak   | -                               | Label aksi di footer dropdown.                        |
| `onActionClick`         | `() => void`              | Tidak   | -                               | Handler aksi footer.                                  |
| `id`                    | `string`                  | Tidak   | -                               | ID untuk accessibility.                               |
| `aria-label`            | `string`                  | Tidak   | -                               | ARIA label.                                           |

**Keyboard Navigation:**

- `ArrowDown/Up`: Navigate options
- `Enter/Space`: Select highlighted option
- `Escape`: Close dropdown
- `Home/End`: Jump to first/last option

---

## Konvensi Umum

### Naming

- Props wajib selalu didefinisikan terlebih dahulu
- Boolean props menggunakan prefix `is` atau `has` (cth: `isOpen`, `hasError`)
- Handler props menggunakan prefix `on` (cth: `onClick`, `onChange`)

### Accessibility

- Semua komponen interaktif harus memiliki `aria-label` atau `aria-labelledby`
- Komponen harus mendukung keyboard navigation
- Focus states harus visible

### Performance

- Gunakan `React.memo` untuk komponen yang sering re-render
- Handler functions dibungkus dengan `useCallback`
- Complex computations dibungkus dengan `useMemo`
