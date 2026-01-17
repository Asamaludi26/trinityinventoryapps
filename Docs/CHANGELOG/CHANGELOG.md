# Changelog

Semua perubahan penting pada proyek ini akan didokumentasikan dalam file ini.

Format berdasarkan [Keep a Changelog](https://keepachangelog.com/id-ID/1.0.0/),
dan proyek ini mengikuti [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned

- Implementasi backend NestJS dengan PostgreSQL
- Integrasi TanStack Query untuk server-state management
- Implementasi React Router untuk routing berbasis URL
- Modul depresiasi aset otomatis
- Integrasi WhatsApp untuk notifikasi
- Aplikasi mobile untuk teknisi lapangan

---

## [1.0.0] - 2026-01-17

### 🎉 Initial Production Release

Rilis pertama dari Aplikasi Inventori Aset PT. Triniti Media Indonesia sebagai **Prototipe Frontend Fungsional Penuh**.

### Added

#### Modul Autentikasi & Otorisasi

- Sistem login dengan validasi email/password
- Role-Based Access Control (RBAC) dengan 5 peran: Super Admin, Admin Logistik, Admin Purchase, Leader, Staff
- Permission system granular dengan 50+ izin
- Session management dengan auto-logout
- Request password reset workflow

#### Modul Dashboard

- Dashboard eksekutif untuk Admin dengan metrik makro
- Dashboard personal untuk Staff dengan aset yang dipegang
- Widget actionable items (tugas pending)
- Grafik status aset (donut chart)
- Grafik tren pengeluaran bulanan
- Leaderboard teknisi
- Alert stok rendah & peringatan garansi

#### Modul Request Pengadaan

- Form request barang dengan item standar
- Tiga tipe order: Regular Stock, Urgent, Project Based
- Alur persetujuan multi-level (Logistik → Purchase → CEO)
- Approval dengan revisi kuantitas
- Pelacakan status pembelian hingga barang tiba
- Export daftar request ke CSV

#### Modul Request Peminjaman (Loan)

- Form peminjaman aset dari gudang
- Penugasan aset spesifik oleh Admin
- Pelacakan status peminjaman aktif
- Fitur pengembalian aset dengan verifikasi kondisi
- Deteksi keterlambatan pengembalian

#### Modul Registrasi Aset

- Pencatatan aset individual dengan ID unik
- Pencatatan aset bulk (count & measurement)
- Import dari request yang sudah tiba
- Generate & print QR Code label
- Edit data aset existing
- Pelacakan riwayat perubahan (activity log)

#### Modul Stok & Gudang

- Overview stok global per kategori/brand
- Stok personal (aset yang dipegang user)
- Threshold stok minimum dengan alert
- Riwayat pergerakan stok (stock movement)
- Filter multi-kriteria
- Export data stok ke CSV

#### Modul Serah Terima (Handover)

- Form Berita Acara Serah Terima (BAST)
- Handover dari gudang ke user
- Handover dari request/peminjaman yang disetujui
- Status tracking handover
- Preview & cetak dokumen handover

#### Modul Perbaikan (Repair)

- Pelaporan kerusakan dengan foto
- Alur perbaikan: Report → Start Repair → Complete/Decommission
- Tracking perbaikan internal vs eksternal
- Progress update dengan timeline
- Pencatatan hasil perbaikan

#### Modul Pelanggan & Instalasi

- Manajemen data pelanggan
- Form instalasi aset di lokasi pelanggan
- Form maintenance/pemeliharaan
- Form dismantle (penarikan aset)
- Pelacakan aset terpasang per pelanggan
- Riwayat aktivitas per pelanggan

#### Modul Manajemen Pengguna

- CRUD user dengan validasi
- Manajemen divisi perusahaan
- Penugasan izin custom per user
- Request password reset oleh admin

#### Modul Kategori & Master Data

- Hierarki: Kategori → Tipe → Model/Brand
- Konfigurasi tracking method (individual/bulk)
- Konfigurasi unit pengukuran
- Asosiasi kategori dengan divisi

#### Fitur Umum

- Responsive design (mobile-friendly)
- Dark mode support ready
- Global search dengan QR scanner
- Sistem notifikasi real-time (mock)
- Preview modal untuk detail cepat
- Skeleton loading states
- Form validation

### Technical

- React 18 dengan TypeScript
- Zustand untuk state management
- Tailwind CSS untuk styling
- Mock API layer dengan localStorage
- Arsitektur berbasis fitur (feature-based)

### Documentation

- Product Requirements Document (PRD)
- Database Schema (ERD)
- API Reference Blueprint
- Frontend Development Guide
- Backend Development Guide
- Deployment Guide
- User Guide

---

## [0.9.0] - 2025-12-15

### Added

- Beta version dengan fitur inti

### Changed

- Refactoring major pada struktur folder

---

## [0.1.0] - 2025-10-01

### Added

- Project initialization
- Basic UI components
- Initial mock data structure

---

[Unreleased]: https://github.com/trinitimedia/inventory-app/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/trinitimedia/inventory-app/releases/tag/v1.0.0
[0.9.0]: https://github.com/trinitimedia/inventory-app/releases/tag/v0.9.0
[0.1.0]: https://github.com/trinitimedia/inventory-app/releases/tag/v0.1.0
