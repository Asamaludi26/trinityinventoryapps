# Matriks Role-Based Access Control (RBAC)

Sistem menggunakan hierarki peran yang spesifik untuk memisahkan tanggung jawab operasional, logistik, dan pengadaan. Dokumen ini adalah acuan implementasi *authorization* yang sesuai dengan `src/utils/permissions.ts`.

**Daftar Peran (User Roles):**
1.  **Super Admin**: Akses penuh ke seluruh sistem, konfigurasi, dan manajemen user.
2.  **Admin Logistik**: Bertanggung jawab atas fisik aset, gudang, stok, serah terima, dan perbaikan. **Tidak** melihat harga beli.
3.  **Admin Purchase**: Bertanggung jawab atas pengadaan, input harga, vendor, dan persetujuan pembelian.
4.  **Leader**: Kepala Divisi/SPV. Dapat membuat request *Urgent* dan melihat aset divisinya.
5.  **Staff**: Pengguna akhir. Hanya dapat membuat request reguler dan melihat aset yang dipegang sendiri.

## Matriks Izin Fitur (Feature Permissions)

| Fitur / Modul | Aksi Utama | Super Admin | Admin Logistik | Admin Purchase | Leader | Staff |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Dashboard** | View Statistics | ✅ | ✅ | ✅ | ✅ | ✅ (Personal) |
| | View Value (Rp) | ✅ | ❌ | ✅ | ❌ | ❌ |
| **Aset (Asset)** | View All Assets | ✅ | ✅ | ✅ | ⚠️ (Divisi) | ❌ |
| | Register/Create | ✅ | ✅ | ❌ | ❌ | ❌ |
| | Edit Detail | ✅ | ✅ | ❌ | ❌ | ❌ |
| | Delete | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Permintaan (Request)** | Create Regular | ✅ | ✅ | ✅ | ✅ | ✅ |
| | **Create Urgent** | ✅ | ✅ | ✅ | ✅ | ❌ |
| | Approve (Logistic) | ✅ | ✅ | ❌ | ❌ | ❌ |
| | Approve (Purchase) | ✅ | ❌ | ✅ | ❌ | ❌ |
| | Approve (Final) | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Operasional** | Handover | ✅ | ✅ | ❌ | ❌ | ❌ |
| | Dismantle | ✅ | ✅ | ❌ | ❌ | ❌ |
| | Repair Management| ✅ | ✅ | ❌ | ❌ | ⚠️ (Report) |
| **Stok & Opname** | Manage Threshold | ✅ | ✅ | ❌ | ❌ | ❌ |
| **User Management** | Create/Edit User | ✅ | ❌ | ❌ | ❌ | ❌ |
| | Manage Permission| ✅ | ❌ | ❌ | ❌ | ❌ |
| **Laporan** | Export CSV | ✅ | ✅ | ✅ | ✅ | ❌ |

**Keterangan:**
*   ✅ : Diizinkan sepenuhnya.
*   ❌ : Dilarang/Tidak memiliki akses.
*   ⚠️ : Diizinkan dengan batasan (misal: hanya aset divisi sendiri atau hanya fitur pelaporan).

## Implementasi Teknis

### Logic Hak Akses (Permissions.ts)
Sistem tidak hanya mengecek Role, tetapi array `permissions` yang melekat pada User.

1.  **Hard Restriction**: `ROLE_RESTRICTIONS` di backend/utils mencegah role tertentu melakukan aksi terlarang meskipun memiliki permission di database (Safety Net).
2.  **Dependency**: Hak akses `Create` otomatis membutuhkan hak akses `View`.

### Contoh Guard (Frontend)
```typescript
// src/utils/permissions.ts
export const hasPermission = (user: User, permission: string) => {
    // Super Admin bypass
    if (user.role === 'Super Admin') return true;
    
    // Cek Hard Restriction
    if (ROLE_RESTRICTIONS[user.role]?.includes(permission)) return false;

    return user.permissions.includes(permission);
};
```