# Referensi API Backend - Lengkap

Dokumen ini menyediakan referensi teknis lengkap untuk setiap endpoint REST API yang akan diekspos oleh server backend. Semua endpoint, kecuali `/api/auth/login`, memerlukan otentikasi menggunakan JWT `Bearer Token` di header `Authorization`.

**Base URL**: `https://aset.trinitymedia.co.id/api` (Production) atau `http://localhost:3001/api` (Development)

---

## 📋 Daftar Isi

1. [Autentikasi & Otorisasi](#1-autentikasi--otorisasi)
2. [Assets (Aset)](#2-assets-aset)
3. [Requests (Permintaan Aset)](#3-requests-permintaan-aset)
4. [Loan Requests (Peminjaman)](#4-loan-requests-peminjaman)
5. [Handovers (Serah Terima)](#5-handovers-serah-terima)
6. [Dismantles (Penarikan)](#6-dismantles-penarikan)
7. [Installations (Instalasi)](#7-installations-instalasi)
8. [Maintenance (Perbaikan)](#8-maintenance-perbaikan)
9. [Customers (Pelanggan)](#9-customers-pelanggan)
10. [Users (Pengguna)](#10-users-pengguna)
11. [Divisions (Divisi)](#11-divisions-divisi)
12. [Categories (Kategori Aset)](#12-categories-kategori-aset)
13. [Stock (Stok)](#13-stock-stok)
14. [Notifications (Notifikasi)](#14-notifications-notifikasi)
15. [Dashboard (Dashboard)](#15-dashboard-dashboard)
16. [Health Check](#16-health-check)

---

## 1. Autentikasi & Otorisasi

### `POST /api/auth/login`

Mengautentikasi pengguna berdasarkan email dan password. Jika berhasil, akan mengembalikan JWT access token.

- **Otorisasi**: Publik (tidak memerlukan token)
- **Request Body**:
  ```json
  {
    "email": "user@trinitymedia.co.id",
    "password": "password123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "user@trinitymedia.co.id",
      "name": "John Doe",
      "role": "Admin Logistik",
      "divisionId": 4,
      "division": {
        "id": 4,
        "name": "Logistik & Gudang"
      }
    }
  }
  ```
- **Response (401 Unauthorized)**:
  ```json
  {
    "statusCode": 401,
    "message": "Invalid credentials",
    "error": "Unauthorized"
  }
  ```

### `POST /api/auth/refresh`

Memperbarui access token menggunakan refresh token.

- **Otorisasi**: Publik (refresh token di body)
- **Request Body**:
  ```json
  {
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Response (200 OK)**: Sama seperti `/api/auth/login`

### `POST /api/auth/logout`

Logout pengguna dan invalidate token.

- **Otorisasi**: `Bearer Token` (Semua Peran)
- **Response (200 OK)**:
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

---

## 2. Assets (Aset)

### `GET /api/assets`

Mengambil daftar semua aset dengan dukungan paginasi, pencarian, dan filter.

- **Otorisasi**: `Bearer Token` (Semua Peran)
- **Query Parameters**:

  - `page` (number, optional): Nomor halaman (default: 1)
  - `limit` (number, optional): Jumlah item per halaman (default: 10, max: 100)
  - `search` (string, optional): Pencarian berdasarkan ID, nama, brand, atau serial number
  - `status` (string, optional): Filter berdasarkan status (`IN_STORAGE`, `IN_USE`, `DAMAGED`, `UNDER_REPAIR`, `OUT_FOR_REPAIR`, `DECOMMISSIONED`)
  - `category` (string, optional): Filter berdasarkan kategori aset
  - `type` (string, optional): Filter berdasarkan tipe aset
  - `location` (string, optional): Filter berdasarkan lokasi
  - `currentUser` (string, optional): Filter berdasarkan user yang menggunakan aset
  - `sortBy` (string, optional): Field untuk sorting (`id`, `name`, `createdAt`, `purchaseDate`)
  - `sortOrder` (string, optional): `asc` atau `desc` (default: `desc`)

- **Response (200 OK)**:
  ```json
  {
    "data": [
      {
        "id": "AST-2025-001",
        "name": "Router MikroTik RB750",
        "brand": "MikroTik",
        "serialNumber": "SN123456789",
        "macAddress": "00:11:22:33:44:55",
        "typeId": 1,
        "type": {
          "id": 1,
          "name": "Router",
          "category": {
            "id": 1,
            "name": "Perangkat Jaringan"
          }
        },
        "status": "IN_STORAGE",
        "condition": "GOOD",
        "location": "Gudang A, Rak 1",
        "currentUser": null,
        "purchasePrice": 2500000,
        "purchaseDate": "2025-01-15T00:00:00.000Z",
        "vendor": "PT. Network Solution",
        "warrantyEndDate": "2026-01-15T00:00:00.000Z",
        "createdAt": "2025-01-15T10:30:00.000Z",
        "updatedAt": "2025-01-15T10:30:00.000Z"
      }
    ],
    "meta": {
      "totalItems": 150,
      "itemCount": 10,
      "itemsPerPage": 10,
      "totalPages": 15,
      "currentPage": 1
    }
  }
  ```

### `GET /api/assets/:id`

Mengambil detail satu aset berdasarkan ID-nya, termasuk history dan maintenance records.

- **Otorisasi**: `Bearer Token` (Semua Peran)
- **Path Parameters**:
  - `id` (string): ID aset (contoh: `AST-2025-001`)
- **Response (200 OK)**:
  ```json
  {
    "id": "AST-2025-001",
    "name": "Router MikroTik RB750",
    "brand": "MikroTik",
    "serialNumber": "SN123456789",
    "macAddress": "00:11:22:33:44:55",
    "typeId": 1,
    "type": {
      "id": 1,
      "name": "Router",
      "category": {
        "id": 1,
        "name": "Perangkat Jaringan"
      }
    },
    "status": "IN_STORAGE",
    "condition": "GOOD",
    "location": "Gudang A, Rak 1",
    "currentUser": null,
    "purchasePrice": 2500000,
    "purchaseDate": "2025-01-15T00:00:00.000Z",
    "vendor": "PT. Network Solution",
    "warrantyEndDate": "2026-01-15T00:00:00.000Z",
    "activityLogs": [
      {
        "id": 1,
        "action": "ASSET_REGISTERED",
        "userId": 2,
        "user": {
          "name": "Admin Logistik"
        },
        "timestamp": "2025-01-15T10:30:00.000Z",
        "details": {
          "note": "Aset baru diregistrasi"
        }
      }
    ],
    "maintenances": [],
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
  ```
- **Response (404 Not Found)**: Jika aset tidak ditemukan

### `POST /api/assets`

Membuat satu atau lebih aset baru (bulk creation didukung).

- **Otorisasi**: `Bearer Token` (Hanya `Admin Logistik`, `Super Admin`)
- **Request Body** (Single):
  ```json
  {
    "name": "Router MikroTik RB750",
    "brand": "MikroTik",
    "serialNumber": "SN123456789",
    "macAddress": "00:11:22:33:44:55",
    "typeId": 1,
    "status": "IN_STORAGE",
    "condition": "GOOD",
    "location": "Gudang A, Rak 1",
    "purchasePrice": 2500000,
    "purchaseDate": "2025-01-15",
    "vendor": "PT. Network Solution",
    "warrantyEndDate": "2026-01-15"
  }
  ```
- **Request Body** (Bulk):
  ```json
  {
    "assets": [
      {
        "name": "Router MikroTik RB750",
        "brand": "MikroTik",
        "serialNumber": "SN123456789",
        "typeId": 1,
        "status": "IN_STORAGE",
        "condition": "GOOD",
        "location": "Gudang A, Rak 1"
      },
      {
        "name": "Router MikroTik RB750",
        "brand": "MikroTik",
        "serialNumber": "SN123456790",
        "typeId": 1,
        "status": "IN_STORAGE",
        "condition": "GOOD",
        "location": "Gudang A, Rak 1"
      }
    ]
  }
  ```
- **Response (201 Created)** (Single):
  ```json
  {
    "id": "AST-2025-001",
    "name": "Router MikroTik RB750",
    ...
  }
  ```
- **Response (201 Created)** (Bulk):
  ```json
  {
    "created": 2,
    "failed": 0,
    "assets": [
      { "id": "AST-2025-001", ... },
      { "id": "AST-2025-002", ... }
    ],
    "errors": []
  }
  ```

### `PATCH /api/assets/:id`

Memperbarui sebagian informasi dari sebuah aset.

- **Otorisasi**: `Bearer Token` (Hanya `Admin Logistik`, `Super Admin`)
- **Path Parameters**:
  - `id` (string): ID aset
- **Request Body** (semua field optional):
  ```json
  {
    "name": "Router MikroTik RB750 (Updated)",
    "location": "Gudang B, Rak 2",
    "status": "IN_USE",
    "currentUser": "user@trinitymedia.co.id"
  }
  ```
- **Response (200 OK)**: Objek aset yang telah diperbarui
- **Response (404 Not Found)**: Jika aset tidak ditemukan
- **Response (409 Conflict)**: Jika ada konflik (misal: serial number duplicate)

### `DELETE /api/assets/:id`

Menghapus sebuah aset (soft delete).

- **Otorisasi**: `Bearer Token` (Hanya `Super Admin`)
- **Path Parameters**:
  - `id` (string): ID aset
- **Response (204 No Content)**: Berhasil dihapus
- **Response (404 Not Found)**: Jika aset tidak ditemukan
- **Response (400 Bad Request)**: Jika aset sedang digunakan atau memiliki relasi aktif

### `GET /api/assets/:id/qr-code`

Mengambil QR code untuk aset dalam format base64 atau SVG.

- **Otorisasi**: `Bearer Token` (Semua Peran)
- **Path Parameters**:
  - `id` (string): ID aset
- **Query Parameters**:
  - `format` (string, optional): `base64` atau `svg` (default: `base64`)
  - `size` (number, optional): Ukuran QR code dalam pixel (default: 200)
- **Response (200 OK)**:
  ```json
  {
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "assetId": "AST-2025-001"
  }
  ```

### `POST /api/assets/bulk-qr-codes`

Generate QR codes untuk multiple aset sekaligus.

- **Otorisasi**: `Bearer Token` (Hanya `Admin Logistik`, `Super Admin`)
- **Request Body**:
  ```json
  {
    "assetIds": ["AST-2025-001", "AST-2025-002", "AST-2025-003"],
    "format": "base64",
    "size": 200
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "qrCodes": [
      {
        "assetId": "AST-2025-001",
        "qrCode": "data:image/png;base64,..."
      },
      ...
    ]
  }
  ```

---

## 3. Requests (Permintaan Aset)

### `GET /api/requests`

Mengambil daftar semua permintaan aset dengan filter dan paginasi.

- **Otorisasi**: `Bearer Token` (Semua Peran, `Staff`/`Leader` hanya melihat request miliknya)
- **Query Parameters**:

  - `page` (number, optional): Nomor halaman
  - `limit` (number, optional): Jumlah item per halaman
  - `search` (string, optional): Pencarian berdasarkan ID request atau item name
  - `status` (string, optional): Filter berdasarkan status (`PENDING`, `LOGISTIC_APPROVED`, `AWAITING_CEO_APPROVAL`, `APPROVED`, `PURCHASING`, `IN_DELIVERY`, `ARRIVED`, `COMPLETED`, `REJECTED`)
  - `requesterId` (number, optional): Filter berdasarkan ID requester
  - `division` (string, optional): Filter berdasarkan divisi
  - `orderType` (string, optional): Filter berdasarkan tipe order (`Regular`, `Urgent`, `Project Based`)
  - `startDate` (string, optional): Filter dari tanggal (ISO format)
  - `endDate` (string, optional): Filter sampai tanggal (ISO format)
  - `sortBy` (string, optional): Field untuk sorting
  - `sortOrder` (string, optional): `asc` atau `desc`

- **Response (200 OK)**:
  ```json
  {
    "data": [
      {
        "id": "REQ-2025-001",
        "requesterId": 5,
        "requester": {
          "id": 5,
          "name": "John Doe",
          "email": "john@trinitymedia.co.id",
          "division": {
            "id": 1,
            "name": "Network Engineering"
          }
        },
        "division": "Network Engineering",
        "status": "PENDING",
        "requestDate": "2025-01-20T08:00:00.000Z",
        "orderType": "Regular",
        "justification": null,
        "project": null,
        "items": [
          {
            "id": 1,
            "itemName": "Router MikroTik RB750",
            "quantity": 5,
            "approvedQty": null,
            "status": "PENDING",
            "poNumber": null,
            "price": null,
            "vendor": null
          }
        ],
        "logisticApprover": null,
        "finalApprover": null,
        "createdAt": "2025-01-20T08:00:00.000Z",
        "updatedAt": "2025-01-20T08:00:00.000Z"
      }
    ],
    "meta": {
      "totalItems": 50,
      "itemCount": 10,
      "itemsPerPage": 10,
      "totalPages": 5,
      "currentPage": 1
    }
  }
  ```

### `GET /api/requests/:id`

Mengambil detail satu request beserta semua item dan history approval.

- **Otorisasi**: `Bearer Token` (Semua Peran, `Staff`/`Leader` hanya bisa melihat request miliknya)
- **Path Parameters**:
  - `id` (string): ID request (contoh: `REQ-2025-001`)
- **Response (200 OK)**: Objek request lengkap dengan items dan history
- **Response (404 Not Found)**: Jika request tidak ditemukan

### `POST /api/requests`

Membuat permintaan aset baru.

- **Otorisasi**: `Bearer Token` (Semua Peran)
- **Request Body**:
  ```json
  {
    "division": "Network Engineering",
    "requestDate": "2025-01-20",
    "orderType": "Regular",
    "justification": null,
    "project": null,
    "items": [
      {
        "itemName": "Router MikroTik RB750",
        "brand": "MikroTik",
        "quantity": 5,
        "categoryId": 1,
        "typeId": 1
      },
      {
        "itemName": "Kabel UTP Cat6",
        "brand": "Belden",
        "quantity": 100,
        "categoryId": 3,
        "typeId": 5,
        "unitOfMeasure": "Meter"
      }
    ]
  }
  ```
- **Response (201 Created)**: Objek request yang baru dibuat
- **Response (400 Bad Request)**: Jika validasi gagal atau stok tidak mencukupi

### `PATCH /api/requests/:id/review`

Review dan approve/reject request dengan optional quantity adjustment.

- **Otorisasi**: `Bearer Token` (`Admin Logistik`, `Admin Purchase`, `Super Admin`)
- **Path Parameters**:
  - `id` (string): ID request
- **Request Body**:
  ```json
  {
    "action": "approve",
    "adjustments": {
      "1": {
        "approvedQty": 3,
        "reason": "Budget terbatas, disetujui 3 dari 5"
      },
      "2": {
        "approvedQty": 0,
        "reason": "Stok masih cukup, tidak perlu beli"
      }
    },
    "notes": "Disetujui dengan revisi quantity"
  }
  ```
- **Response (200 OK)**: Objek request yang telah diperbarui
- **Response (400 Bad Request)**: Jika action tidak valid atau adjustments tidak valid

### `POST /api/requests/:id/reject`

Menolak sebuah permintaan.

- **Otorisasi**: `Bearer Token` (`Admin Logistik`, `Admin Purchase`, `Super Admin`)
- **Path Parameters**:
  - `id` (string): ID request
- **Request Body**:
  ```json
  {
    "reason": "Stok tidak mencukupi dan tidak ada budget untuk pembelian baru."
  }
  ```
- **Response (200 OK)**: Objek request dengan status `REJECTED`

### `POST /api/requests/:id/start-procurement`

Memulai proses pengadaan (setelah approval).

- **Otorisasi**: `Bearer Token` (`Admin Purchase`, `Super Admin`)
- **Path Parameters**:
  - `id` (string): ID request
- **Request Body**:
  ```json
  {
    "items": [
      {
        "id": 1,
        "poNumber": "PO-2025-001",
        "price": 2500000,
        "vendor": "PT. Network Solution",
        "estimatedArrivalDate": "2025-02-15"
      }
    ]
  }
  ```
- **Response (200 OK)**: Objek request dengan status `PURCHASING`

### `POST /api/requests/:id/mark-arrived`

Menandai barang sudah tiba di gudang.

- **Otorisasi**: `Bearer Token` (`Admin Logistik`, `Super Admin`)
- **Path Parameters**:
  - `id` (string): ID request
- **Request Body**:
  ```json
  {
    "arrivalDate": "2025-02-15",
    "notes": "Barang sudah tiba dan siap untuk registrasi"
  }
  ```
- **Response (200 OK)**: Objek request dengan status `ARRIVED`

### `POST /api/requests/:id/register-assets`

Mengkonversi request items menjadi aset terdaftar.

- **Otorisasi**: `Bearer Token` (`Admin Logistik`, `Super Admin`)
- **Path Parameters**:
  - `id` (string): ID request
- **Request Body**:
  ```json
  {
    "items": [
      {
        "requestItemId": 1,
        "assets": [
          {
            "serialNumber": "SN123456789",
            "macAddress": "00:11:22:33:44:55",
            "location": "Gudang A, Rak 1"
          },
          {
            "serialNumber": "SN123456790",
            "macAddress": "00:11:22:33:44:56",
            "location": "Gudang A, Rak 1"
          }
        ]
      }
    ]
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "registeredAssets": [
      { "id": "AST-2025-001", ... },
      { "id": "AST-2025-002", ... }
    ],
    "request": {
      "id": "REQ-2025-001",
      "status": "COMPLETED"
    }
  }
  ```

### `POST /api/requests/:id/follow-up`

Mengirim notifikasi follow-up kepada admin.

- **Otorisasi**: `Bearer Token` (Semua Peran, hanya requester yang bisa follow-up request miliknya)
- **Path Parameters**:
  - `id` (string): ID request
- **Request Body**:
  ```json
  {
    "message": "Mohon segera ditindaklanjuti, request ini sudah menunggu 3 hari"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "message": "Follow-up notification sent successfully"
  }
  ```
- **Response (429 Too Many Requests)**: Jika follow-up sudah dilakukan dalam 24 jam terakhir

---

## 4. Loan Requests (Peminjaman)

### `GET /api/loan-requests`

Mengambil daftar semua loan request.

- **Otorisasi**: `Bearer Token` (Semua Peran, `Staff`/`Leader` hanya melihat loan miliknya)
- **Query Parameters**: Sama seperti `/api/requests`
- **Response (200 OK)**: Array of loan requests dengan pagination

### `GET /api/loan-requests/:id`

Mengambil detail satu loan request.

- **Otorisasi**: `Bearer Token` (Semua Peran)
- **Response (200 OK)**: Objek loan request lengkap

### `POST /api/loan-requests`

Membuat loan request baru.

- **Otorisasi**: `Bearer Token` (Semua Peran)
- **Request Body**:
  ```json
  {
    "purpose": "Untuk proyek instalasi di customer ABC",
    "loanStartDate": "2025-01-25",
    "loanEndDate": "2025-02-25",
    "items": [
      {
        "assetId": "AST-2025-001",
        "quantity": 1
      }
    ]
  }
  ```
- **Response (201 Created)**: Objek loan request yang baru dibuat

### `PATCH /api/loan-requests/:id/approve`

Menyetujui loan request dan assign aset.

- **Otorisasi**: `Bearer Token` (`Admin Logistik`, `Super Admin`)
- **Path Parameters**:
  - `id` (string): ID loan request
- **Request Body**:
  ```json
  {
    "assignedAssetIds": {
      "1": ["AST-2025-001", "AST-2025-002"]
    },
    "itemStatuses": {
      "1": {
        "status": "approved",
        "approvedQty": 2
      }
    },
    "notes": "Aset sudah di-assign dan siap untuk handover"
  }
  ```
- **Response (200 OK)**: Objek loan request yang telah diperbarui
- **Response (409 Conflict)**: Jika aset tidak tersedia (race condition)

### `POST /api/loan-requests/:id/return`

Mengembalikan aset yang dipinjam.

- **Otorisasi**: `Bearer Token` (Semua Peran, hanya requester atau admin)
- **Path Parameters**:
  - `id` (string): ID loan request
- **Request Body**:
  ```json
  {
    "returnedItems": [
      {
        "assetId": "AST-2025-001",
        "condition": "GOOD",
        "notes": "Aset dikembalikan dalam kondisi baik"
      }
    ],
    "returnDate": "2025-02-20"
  }
  ```
- **Response (200 OK)**: Objek loan request dengan status `RETURNED`

---

## 5. Handovers (Serah Terima)

### `GET /api/handovers`

Mengambil daftar semua handover.

- **Otorisasi**: `Bearer Token` (Semua Peran)
- **Query Parameters**: Sama seperti assets
- **Response (200 OK)**: Array of handovers dengan pagination

### `GET /api/handovers/:id`

Mengambil detail handover.

- **Otorisasi**: `Bearer Token` (Semua Peran)
- **Response (200 OK)**: Objek handover lengkap

### `POST /api/handovers`

Membuat handover baru.

- **Otorisasi**: `Bearer Token` (`Admin Logistik`, `Super Admin`)
- **Request Body**:
  ```json
  {
    "loanRequestId": "LOAN-2025-001",
    "userId": 5,
    "handoverDate": "2025-01-25",
    "items": [
      {
        "assetId": "AST-2025-001",
        "condition": "GOOD"
      }
    ],
    "notes": "Serah terima aset untuk keperluan proyek"
  }
  ```
- **Response (201 Created)**: Objek handover yang baru dibuat

### `POST /api/handovers/:id/confirm`

Konfirmasi handover oleh user.

- **Otorisasi**: `Bearer Token` (User yang menerima handover)
- **Path Parameters**:
  - `id` (string): ID handover
- **Response (200 OK)**: Objek handover dengan status `CONFIRMED`

---

## 6. Dismantles (Penarikan)

### `GET /api/dismantles`

Mengambil daftar semua dismantle.

- **Otorisasi**: `Bearer Token` (Semua Peran)
- **Response (200 OK)**: Array of dismantles

### `GET /api/dismantles/:id`

Mengambil detail dismantle.

- **Otorisasi**: `Bearer Token` (Semua Peran)
- **Response (200 OK)**: Objek dismantle lengkap

### `POST /api/dismantles`

Membuat dismantle record (oleh teknisi di lapangan).

- **Otorisasi**: `Bearer Token` (Semua Peran)
- **Request Body**:
  ```json
  {
    "customerId": 1,
    "assetId": "AST-2025-001",
    "dismantleDate": "2025-02-20",
    "condition": "GOOD",
    "technician": "Teknisi Lapangan",
    "notes": "Aset ditarik dari customer karena kontrak berakhir",
    "photos": ["base64_image_1", "base64_image_2"]
  }
  ```
- **Response (201 Created)**: Objek dismantle dengan status `PENDING_WAREHOUSE`

### `PATCH /api/dismantles/:id/confirm`

Konfirmasi penerimaan aset di gudang (oleh admin gudang).

- **Otorisasi**: `Bearer Token` (`Admin Logistik`, `Super Admin`)
- **Path Parameters**:
  - `id` (string): ID dismantle
- **Request Body**:
  ```json
  {
    "receivedDate": "2025-02-21",
    "finalCondition": "GOOD",
    "location": "Gudang A, Rak 1",
    "notes": "Aset diterima dalam kondisi baik"
  }
  ```
- **Response (200 OK)**: Objek dismantle dengan status `COMPLETED`

---

## 7. Installations (Instalasi)

### `GET /api/installations`

Mengambil daftar semua instalasi.

- **Otorisasi**: `Bearer Token` (Semua Peran)
- **Response (200 OK)**: Array of installations

### `GET /api/installations/:id`

Mengambil detail instalasi.

- **Otorisasi**: `Bearer Token` (Semua Peran)
- **Response (200 OK)**: Objek instalasi lengkap

### `POST /api/installations`

Membuat instalasi baru.

- **Otorisasi**: `Bearer Token` (`Admin Logistik`, `Super Admin`)
- **Request Body**:
  ```json
  {
    "customerId": 1,
    "installationDate": "2025-01-25",
    "technician": "Teknisi Lapangan",
    "items": [
      {
        "assetId": "AST-2025-001",
        "serialNumber": "SN123456789",
        "macAddress": "00:11:22:33:44:55"
      }
    ],
    "address": "Jl. Contoh No. 123",
    "notes": "Instalasi untuk customer baru"
  }
  ```
- **Response (201 Created)**: Objek instalasi yang baru dibuat

### `PATCH /api/installations/:id/complete`

Menandai instalasi selesai.

- **Otorisasi**: `Bearer Token` (Semua Peran)
- **Path Parameters**:
  - `id` (number): ID instalasi
- **Response (200 OK)**: Objek instalasi dengan status `COMPLETED`

---

## 8. Maintenance (Perbaikan)

### `GET /api/maintenance`

Mengambil daftar semua maintenance records.

- **Otorisasi**: `Bearer Token` (Semua Peran)
- **Response (200 OK)**: Array of maintenance records

### `GET /api/maintenance/:id`

Mengambil detail maintenance.

- **Otorisasi**: `Bearer Token` (Semua Peran)
- **Response (200 OK)**: Objek maintenance lengkap

### `POST /api/maintenance/report`

Melaporkan kerusakan aset.

- **Otorisasi**: `Bearer Token` (Semua Peran)
- **Request Body**:
  ```json
  {
    "assetId": "AST-2025-001",
    "type": "DAMAGE",
    "description": "Router tidak bisa boot, kemungkinan power supply rusak",
    "photos": ["base64_image_1"],
    "customerId": null
  }
  ```
- **Response (201 Created)**: Objek maintenance dengan status `REPORTED`

### `PATCH /api/maintenance/:id/start`

Memulai proses perbaikan.

- **Otorisasi**: `Bearer Token` (`Admin Logistik`, `Super Admin`)
- **Path Parameters**:
  - `id` (number): ID maintenance
- **Request Body**:
  ```json
  {
    "type": "INTERNAL",
    "technician": "Teknisi Internal",
    "estimatedCost": 500000,
    "estimatedCompletionDate": "2025-02-25"
  }
  ```
- **Response (200 OK)**: Objek maintenance dengan status `UNDER_REPAIR` atau `OUT_FOR_REPAIR`

### `PATCH /api/maintenance/:id/complete`

Menandai perbaikan selesai.

- **Otorisasi**: `Bearer Token` (`Admin Logistik`, `Super Admin`)
- **Path Parameters**:
  - `id` (number): ID maintenance
- **Request Body**:
  ```json
  {
    "completedDate": "2025-02-25",
    "actualCost": 450000,
    "notes": "Perbaikan selesai, aset sudah berfungsi normal",
    "finalStatus": "IN_STORAGE"
  }
  ```
- **Response (200 OK)**: Objek maintenance dengan status `COMPLETED`

---

## 9. Customers (Pelanggan)

### `GET /api/customers`

Mengambil daftar semua pelanggan.

- **Otorisasi**: `Bearer Token` (Semua Peran)
- **Query Parameters**: `page`, `limit`, `search`, `status`
- **Response (200 OK)**: Array of customers dengan pagination

### `GET /api/customers/:id`

Mengambil detail pelanggan beserta instalasi dan maintenance history.

- **Otorisasi**: `Bearer Token` (Semua Peran)
- **Response (200 OK)**: Objek customer lengkap

### `POST /api/customers`

Membuat pelanggan baru.

- **Otorisasi**: `Bearer Token` (`Admin Logistik`, `Admin Purchase`, `Super Admin`)
- **Request Body**:
  ```json
  {
    "name": "PT. Customer ABC",
    "address": "Jl. Contoh No. 123",
    "phone": "081234567890",
    "email": "contact@customerabc.com",
    "status": "ACTIVE"
  }
  ```
- **Response (201 Created)**: Objek customer yang baru dibuat

### `PATCH /api/customers/:id`

Memperbarui data pelanggan.

- **Otorisasi**: `Bearer Token` (`Admin Logistik`, `Admin Purchase`, `Super Admin`)
- **Response (200 OK)**: Objek customer yang telah diperbarui

### `DELETE /api/customers/:id`

Menghapus pelanggan (soft delete).

- **Otorisasi**: `Bearer Token` (`Super Admin`)
- **Response (204 No Content)**: Berhasil dihapus
- **Response (400 Bad Request)**: Jika pelanggan masih memiliki aset terpasang

---

## 10. Users (Pengguna)

### `GET /api/users`

Mengambil daftar semua pengguna.

- **Otorisasi**: `Bearer Token` (`Super Admin`)
- **Response (200 OK)**: Array of users

### `GET /api/users/:id`

Mengambil detail pengguna.

- **Otorisasi**: `Bearer Token` (`Super Admin` atau user sendiri)
- **Response (200 OK)**: Objek user lengkap

### `POST /api/users`

Membuat pengguna baru.

- **Otorisasi**: `Bearer Token` (`Super Admin`)
- **Request Body**:
  ```json
  {
    "email": "newuser@trinitymedia.co.id",
    "password": "SecurePassword123!",
    "name": "New User",
    "role": "Staff",
    "divisionId": 1
  }
  ```
- **Response (201 Created)**: Objek user yang baru dibuat (tanpa password)

### `PATCH /api/users/:id`

Memperbarui data pengguna.

- **Otorisasi**: `Bearer Token` (`Super Admin` atau user sendiri untuk data tertentu)
- **Response (200 OK)**: Objek user yang telah diperbarui

### `DELETE /api/users/:id`

Menghapus pengguna (soft delete).

- **Otorisasi**: `Bearer Token` (`Super Admin`)
- **Response (204 No Content)**: Berhasil dihapus

---

## 11. Divisions (Divisi)

### `GET /api/divisions`

Mengambil daftar semua divisi.

- **Otorisasi**: `Bearer Token` (Semua Peran)
- **Response (200 OK)**: Array of divisions

### `GET /api/divisions/:id`

Mengambil detail divisi beserta daftar anggota.

- **Otorisasi**: `Bearer Token` (Semua Peran)
- **Response (200 OK)**: Objek division lengkap

### `POST /api/divisions`

Membuat divisi baru.

- **Otorisasi**: `Bearer Token` (`Super Admin`)
- **Request Body**:
  ```json
  {
    "name": "Network Engineering"
  }
  ```
- **Response (201 Created)**: Objek division yang baru dibuat

### `PATCH /api/divisions/:id`

Memperbarui nama divisi.

- **Otorisasi**: `Bearer Token` (`Super Admin`)
- **Response (200 OK)**: Objek division yang telah diperbarui

### `DELETE /api/divisions/:id`

Menghapus divisi.

- **Otorisasi**: `Bearer Token` (`Super Admin`)
- **Response (204 No Content)**: Berhasil dihapus
- **Response (400 Bad Request)**: Jika divisi masih memiliki anggota

---

## 12. Categories (Kategori Aset)

### `GET /api/categories`

Mengambil daftar semua kategori aset.

- **Otorisasi**: `Bearer Token` (Semua Peran)
- **Response (200 OK)**: Array of categories dengan types

### `GET /api/categories/:id`

Mengambil detail kategori beserta semua types.

- **Otorisasi**: `Bearer Token` (Semua Peran)
- **Response (200 OK)**: Objek category lengkap

### `POST /api/categories`

Membuat kategori baru.

- **Otorisasi**: `Bearer Token` (`Admin Logistik`, `Admin Purchase`, `Super Admin`)
- **Request Body**:
  ```json
  {
    "name": "Perangkat Jaringan",
    "isCustomerInstallable": false
  }
  ```
- **Response (201 Created)**: Objek category yang baru dibuat

### `POST /api/categories/:id/types`

Menambahkan tipe baru ke kategori.

- **Otorisasi**: `Bearer Token` (`Admin Logistik`, `Admin Purchase`, `Super Admin`)
- **Request Body**:
  ```json
  {
    "name": "Router",
    "classification": "asset",
    "trackingMethod": "individual",
    "unitOfMeasure": "Unit"
  }
  ```
- **Response (201 Created)**: Objek type yang baru dibuat

---

## 13. Stock (Stok)

### `GET /api/stock/overview`

Mengambil overview stok untuk semua kategori.

- **Otorisasi**: `Bearer Token` (Semua Peran)
- **Response (200 OK)**:
  ```json
  {
    "categories": [
      {
        "categoryId": 1,
        "categoryName": "Perangkat Jaringan",
        "types": [
          {
            "typeId": 1,
            "typeName": "Router",
            "totalStock": 50,
            "inStorage": 30,
            "inUse": 15,
            "damaged": 5,
            "lowStockThreshold": 10,
            "isLowStock": false
          }
        ]
      }
    ]
  }
  ```

### `GET /api/stock/movements`

Mengambil riwayat pergerakan stok.

- **Otorisasi**: `Bearer Token` (Semua Peran)
- **Query Parameters**: `assetName`, `brand`, `type`, `startDate`, `endDate`
- **Response (200 OK)**: Array of stock movements

### `POST /api/stock/movements`

Mencatat pergerakan stok (masuk/keluar).

- **Otorisasi**: `Bearer Token` (`Admin Logistik`, `Super Admin`)
- **Request Body**:
  ```json
  {
    "assetName": "Kabel UTP Cat6",
    "brand": "Belden",
    "type": "IN_PURCHASE",
    "quantity": 100,
    "date": "2025-01-20",
    "notes": "Pembelian baru"
  }
  ```
- **Response (201 Created)**: Objek stock movement yang baru dibuat

---

## 14. Notifications (Notifikasi)

### `GET /api/notifications`

Mengambil daftar notifikasi untuk user yang login.

- **Otorisasi**: `Bearer Token` (Semua Peran)
- **Query Parameters**: `unreadOnly` (boolean), `page`, `limit`
- **Response (200 OK)**: Array of notifications

### `PATCH /api/notifications/:id/read`

Menandai notifikasi sebagai sudah dibaca.

- **Otorisasi**: `Bearer Token` (Semua Peran, hanya notifikasi milik user)
- **Response (200 OK)**: Objek notifikasi yang telah diperbarui

### `PATCH /api/notifications/read-all`

Menandai semua notifikasi sebagai sudah dibaca.

- **Otorisasi**: `Bearer Token` (Semua Peran)
- **Response (200 OK)**:
  ```json
  {
    "message": "All notifications marked as read",
    "count": 10
  }
  ```

---

## 15. Dashboard (Dashboard)

### `GET /api/dashboard/stats`

Mengambil statistik dashboard.

- **Otorisasi**: `Bearer Token` (Semua Peran)
- **Response (200 OK)**:
  ```json
  {
    "totalAssets": 150,
    "totalValue": 500000000,
    "totalStockItems": 80,
    "totalActiveItems": 60,
    "totalCategories": 10,
    "totalModels": 50,
    "pendingRequests": 5,
    "pendingApprovals": 3,
    "damagedAssets": 2,
    "lowStockItems": 8
  }
  ```

### `GET /api/dashboard/actionable-items`

Mengambil daftar item yang memerlukan tindakan.

- **Otorisasi**: `Bearer Token` (Semua Peran)
- **Response (200 OK)**:
  ```json
  {
    "requests": [
      {
        "id": "REQ-2025-001",
        "type": "request",
        "title": "Request Aset Baru",
        "description": "Request dari Network Engineering",
        "priority": "high",
        "createdAt": "2025-01-20T08:00:00.000Z"
      }
    ],
    "assetRegistrations": [],
    "assetDamages": []
  }
  ```

---

## 16. Health Check

### `GET /api/health`

Endpoint untuk health check aplikasi.

- **Otorisasi**: Publik
- **Response (200 OK)**:
  ```json
  {
    "status": "ok",
    "timestamp": "2025-01-20T10:30:00.000Z",
    "database": "connected",
    "uptime": 3600
  }
  ```

---

## Format Error Response

Semua endpoint mengembalikan error dalam format yang konsisten:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [
    {
      "field": "email",
      "message": "email must be an email"
    }
  ]
}
```

**Status Codes**:

- `200 OK`: Request berhasil
- `201 Created`: Resource berhasil dibuat
- `204 No Content`: Request berhasil, tidak ada content
- `400 Bad Request`: Request tidak valid
- `401 Unauthorized`: Tidak terautentikasi
- `403 Forbidden`: Tidak memiliki akses
- `404 Not Found`: Resource tidak ditemukan
- `409 Conflict`: Konflik (misal: duplicate, race condition)
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Error server
- `503 Service Unavailable`: Service tidak tersedia

---

## Rate Limiting

API memiliki rate limiting untuk mencegah abuse:

- **Default**: 100 requests per menit per IP
- **Login endpoint**: 5 requests per menit per IP
- **Response saat limit exceeded**: `429 Too Many Requests`

---

## Pagination

Semua endpoint list menggunakan pagination dengan format:

```json
{
  "data": [...],
  "meta": {
    "totalItems": 150,
    "itemCount": 10,
    "itemsPerPage": 10,
    "totalPages": 15,
    "currentPage": 1
  }
}
```

---

## Filtering & Sorting

Endpoint yang mendukung filtering dan sorting menggunakan query parameters:

- Filter: `?status=IN_STORAGE&category=1`
- Search: `?search=router`
- Sort: `?sortBy=createdAt&sortOrder=desc`
- Date range: `?startDate=2025-01-01&endDate=2025-01-31`

---

## Authentication Header

Semua request yang memerlukan autentikasi harus menyertakan header:

```
Authorization: Bearer <access_token>
```

---

## Best Practices

1. **Gunakan pagination** untuk list endpoints yang besar
2. **Handle errors gracefully** dengan proper error handling
3. **Cache responses** di frontend untuk performa
4. **Retry failed requests** dengan exponential backoff
5. **Validate input** di frontend sebelum mengirim request
6. **Handle loading states** untuk UX yang baik

---

## OpenAPI Specification

Untuk dokumentasi interaktif, gunakan Swagger UI yang tersedia di:

- **Development**: `http://localhost:3001/api/docs`
- **Production**: `https://aset.trinitymedia.co.id/api/docs`

---

**Last Updated**: 2025-01-XX
**API Version**: v1
