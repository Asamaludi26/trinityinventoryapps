
# Referensi API Backend

Dokumen ini menyediakan referensi teknis untuk setiap endpoint REST API.

## 1. Sumber Daya: `Assets` (Inventori)

### `GET /api/assets`
-   **Deskripsi**: Mengambil daftar aset (mendukung filter status, lokasi, user).
### `POST /api/assets`
-   **Deskripsi**: Registrasi aset baru (mendukung batch create).
### `PATCH /api/assets/:id`
-   **Deskripsi**: Update data aset (termasuk update saldo/balance untuk measurement item).
### `POST /api/assets/consume`
-   **Deskripsi**: Mengurangi stok material (bulk/measurement) untuk keperluan instalasi/maintenance.
    ```json
    {
      "items": [
        { "itemName": "Dropcore", "brand": "Fiberhome", "quantity": 150, "unit": "Meter" }
      ],
      "context": { "customerId": "CUST-001", "technician": "Budi" }
    }
    ```

---

## 2. Sumber Daya: `Requests` (Permintaan Baru)

### `GET /api/requests`
### `POST /api/requests`
### `PATCH /api/requests/:id/approve`
-   **Payload**: `itemStatuses` (approved qty per item).
### `POST /api/requests/:id/register-assets`
-   **Deskripsi**: Mengkonversi item request yang sudah tiba menjadi data aset di sistem.

---

## 3. Sumber Daya: `LoanRequests` (Peminjaman)

### `GET /api/loan-requests`
-   Mengambil daftar peminjaman.
### `POST /api/loan-requests`
-   Membuat pengajuan pinjaman baru.
### `PATCH /api/loan-requests/:id/approve`
-   **Deskripsi**: Menyetujui pinjaman dan menetapkan ID aset (assignment).
    ```json
    {
      "approver": "Siti Logistik",
      "assignedAssetIds": { "itemId_1": ["AST-001", "AST-002"] }
    }
    ```
### `POST /api/loan-requests/:id/return`
-   **Deskripsi**: Memproses pengembalian aset.

---

## 4. Sumber Daya: `Transactions` (Operasional)

### `GET /api/transactions/handovers`
-   List berita acara serah terima.
### `POST /api/transactions/handovers`
-   Membuat handover baru. **Penting**: Backend harus memvalidasi kepemilikan aset pengirim sebelum memindahkan ke penerima.

### `GET /api/transactions/installations`
### `POST /api/transactions/installations`
-   Submit laporan instalasi. Backend otomatis mengupdate status aset terkait menjadi `IN_USE` dengan `currentUser` = ID Pelanggan.

### `GET /api/transactions/maintenances`
### `POST /api/transactions/maintenances`
-   Submit laporan perbaikan. Mendukung penggantian perangkat (*swap*) dan penggunaan material.

### `GET /api/transactions/dismantles`
### `POST /api/transactions/dismantles`
-   Submit laporan penarikan aset.
### `PATCH /api/transactions/dismantles/:id/complete`
-   Konfirmasi penerimaan barang dismantle di gudang. Aset kembali ke `IN_STORAGE` (atau `DAMAGED` sesuai kondisi).

---

## 5. Sumber Daya: `MasterData`

### `GET /api/customers`
### `GET /api/users`
### `GET /api/divisions`
### `GET /api/categories`
