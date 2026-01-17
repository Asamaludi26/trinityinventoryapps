# Spesifikasi API Komponen UI

Dokumen ini mencantumkan kontrak props untuk komponen UI inti (Atomic Components).

## 1. ActionButton
Lokasi: `src/components/ui/ActionButton.tsx`
Fungsi: Tombol standar untuk aksi di dalam tabel atau toolbar.

| Prop | Tipe | Wajib | Default | Deskripsi |
| :--- | :--- | :--- | :--- | :--- |
| `label` | `string` | Ya | - | Teks pada tombol. |
| `icon` | `ReactNode` | Tidak | - | Ikon (biasanya dari Lucide/Heroicons). |
| `onClick` | `() => void` | Ya | - | Fungsi handler saat diklik. |
| `variant` | `'primary' | 'secondary' | 'danger'` | Tidak | `'primary'` | Menentukan warna background. |
| `disabled` | `boolean` | Tidak | `false` | Menonaktifkan interaksi. |

**Aturan Penggunaan:**
* Gunakan `variant="danger"` hanya untuk aksi destruktif (Hapus, Reject).
* Selalu sertakan `icon` untuk aksi di dalam baris tabel (Table Row Actions).

## 2. StatusBadge
Lokasi: `src/components/ui/StatusBadge.tsx`
Fungsi: Menampilkan status entitas dengan kode warna yang konsisten.

| Prop | Tipe | Deskripsi |
| :--- | :--- | :--- |
| `status` | `string` | Nilai status (cth: 'Pending', 'Approved'). |
| `type` | `'request' | 'asset' | 'handover'` | Menentukan skema warna berdasarkan domain bisnis. |

**Skema Warna Otomatis:**
* **Request:** Pending (Kuning), Approved (Hijau), Rejected (Merah).
* **Asset:** Available (Hijau), In Use (Biru), Maintenance (Oranye), Disposed (Abu-abu).

## 3. Modal
Lokasi: `src/components/ui/Modal.tsx`
Fungsi: Container *overlay* standar.

| Prop | Tipe | Deskripsi |
| :--- | :--- | :--- |
| `isOpen` | `boolean` | State visibilitas modal. |
| `onClose` | `() => void` | Fungsi untuk menutup modal (klik backdrop/tombol X). |
| `title` | `string` | Judul header modal. |
| `children` | `ReactNode` | Konten body modal. |
| `footer` | `ReactNode` | (Opsional) Area tombol aksi di bawah. |
