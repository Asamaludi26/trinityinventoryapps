# Dokumentasi Aplikasi Inventori Aset

Selamat datang di pusat dokumentasi untuk Aplikasi Inventori Aset PT. Trinity Media Indonesia. Dokumen ini berfungsi sebagai gerbang utama untuk semua sumber daya, panduan, dan referensi yang berkaitan dengan proyek ini.

## Deskripsi Singkat

Aplikasi ini adalah sistem terpusat yang modern, aman, dan efisien untuk mengelola seluruh siklus hidup aset—mulai dari permintaan, pencatatan, serah terima, instalasi di pelanggan, hingga penarikan dan penghapusan.

## Status Proyek (Penting!)

Saat ini, proyek berada pada tahap **Prototipe Frontend Fungsional Penuh (High-Fidelity Functional Frontend Prototype)**.

- **Frontend**: Aplikasi antarmuka (UI/UX) telah selesai sepenuhnya, mencakup semua alur kerja, komponen, dan logika sisi klien.
- **Backend & Database**: Logika bisnis dan penyimpanan data saat ini **disimulasikan** menggunakan **Mock API** yang berjalan di browser (`localStorage`). Belum ada server backend atau database produksi yang terhubung.
- **Tujuan Dokumentasi**: Dokumentasi ini melayani dua tujuan:
  1.  Mendokumentasikan **status saat ini** dari aplikasi frontend yang telah selesai.
  2.  Menyediakan **cetak biru (blueprint) lengkap** untuk tim backend dalam membangun API dan database sesuai dengan arsitektur yang telah dirancang.

---

## Komitmen Terhadap Kualitas Profesional

Aplikasi ini tidak hanya dirancang untuk fungsionalitas, tetapi dibangun di atas fondasi rekayasa perangkat lunak profesional. Kami memahami bahwa investasi yang signifikan menuntut hasil yang terbaik. Oleh karena itu, setiap aspek—mulai dari arsitektur folder hingga setiap baris kode—dibuat dengan mematuhi prinsip **clean, terstruktur, efisien, dan efektif**.

Fondasi ini memastikan bahwa aplikasi tidak hanya memenuhi kebutuhan saat ini, tetapi juga merupakan aset digital berkualitas tinggi yang **mudah dipelihara**, **dapat diskalakan**, dan **siap untuk pengembangan di masa depan**, menjamin nilai jangka panjang dari investasi Anda.

---

## Rekomendasi Pengembangan Lanjutan

Prototipe ini sengaja dibangun dengan pola manajemen state dan routing yang sederhana untuk kecepatan pengembangan. Untuk evolusi menuju aplikasi skala produksi, kami telah menyediakan panduan terperinci untuk mengadopsi praktik terbaik industri. Silakan merujuk ke:

- [**Rekomendasi di Laporan Final**](./Docs/FINAL_REPORT.md#73-rekomendasi-pengembangan-lanjutan) untuk gambaran besar.
- [**Panduan Peningkatan Arsitektur di Panduan Frontend**](./Docs/02_DEVELOPMENT_GUIDES/FRONTEND_GUIDE.md#8-rekomendasi-peningkatan-arsitektur-langkah-selanjutnya) untuk detail teknis implementasi.

---

## Titik Awal Utama (WAJIB DIBACA)

> Untuk pemahaman komprehensif mengenai proyek dari awal hingga akhir, mulailah dengan membaca dokumen berikut. Dokumen ini merangkum seluruh aspek proyek dan berfungsi sebagai "daftar isi" utama untuk menavigasi seluruh dokumentasi yang tersedia.
>
> ### ➡️ [**Laporan Pertanggungjawaban Final**](./Docs/FINAL_REPORT.md)

## Daftar Isi Dokumentasi

Berikut adalah struktur dokumentasi yang dirancang untuk membantu Anda menemukan informasi yang relevan dengan cepat.

| Kategori                                        | Dokumen                                                                                               | Deskripsi                                                                                            |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Laporan Proyek** <br>_Mulai dari sini_        | [**Laporan Pertanggungjawaban Final**](./Docs/FINAL_REPORT.md)                                        | **(WAJIB DIBACA)** Dokumen lengkap yang merangkum keseluruhan proyek, dari visi hingga serah terima. |
| **Referensi Umum** <br>_Cari tahu istilah_      | [**Glosarium Istilah**](./Docs/GLOSARIUM.md)                                                          | Daftar definisi untuk istilah-istilah teknis dan bisnis yang spesifik untuk proyek ini.              |
| **1. Konsep & Arsitektur** <br>_Gambaran besar_ | [**Product Requirements Document (PRD)**](./Docs/01_CONCEPT_AND_ARCHITECTURE/PRODUCT_REQUIREMENTS.md) | Dokumen fundamental yang menjelaskan APA yang harus dibangun dan MENGAPA.                            |
|                                                 | [Arsitektur Sistem](./Docs/01_CONCEPT_AND_ARCHITECTURE/ARCHITECTURE.md)                               | Blueprint dan diagram arsitektur tingkat tinggi yang menjelaskan interaksi antar komponen sistem.    |
|                                                 | [**Skema Database (ERD)**](./Docs/01_CONCEPT_AND_ARCHITECTURE/DATABASE_SCHEMA.md)                     | **DIPERBARUI** - ERD lengkap dengan semua entitas, relasi, dan constraints. Visualisasi struktur database yang komprehensif. |
|                                                 | [**Struktur File & Direktori**](./Docs/01_CONCEPT_AND_ARCHITECTURE/FILE_STRUCTURE.md)                 | **BARU** - Dokumentasi lengkap struktur file frontend dan backend dengan penjelasan setiap folder dan konvensi penamaan. |
|                                                 | [**Alur Fitur & Workflow**](./Docs/01_CONCEPT_AND_ARCHITECTURE/FEATURE_FLOWS.md)                      | **BARU** - Diagram alur lengkap untuk semua modul utama: Request, Loan, Installation, Dismantle, Maintenance, dll. |
|                                                 | [Panduan Diagram Sistem](./Docs/01_CONCEPT_AND_ARCHITECTURE/SYSTEM_DIAGRAMS.md)                       | Penjelasan semua diagram yang digunakan dalam siklus hidup pengembangan.                             |
|                                                 | [Alur Logika Bisnis](./Docs/01_CONCEPT_AND_ARCHITECTURE/BUSINESS_LOGIC_FLOWS.md)                      | Alur kerja pengguna dan logika sistem untuk modul-modul kritis.                                      |
|                                                 | [Tumpukan Teknologi](./Docs/01_CONCEPT_AND_ARCHITECTURE/TECHNOLOGY_STACK.md)                          | Rincian teknologi yang digunakan dan alasan strategis di balik setiap pilihan.                       |
|                                                 | [Catatan Keputusan Arsitektural (ADR)](./Docs/01_CONCEPT_AND_ARCHITECTURE/ADR/)                       | Kumpulan catatan keputusan teknis penting. **DIPERBARUI** dengan ADR tambahan: Prisma, Zustand, Feature-Based Architecture. |
| **2. Panduan Pengembangan** <br>_Mulai koding_  | [**Panduan Memulai (Wajib)**](./Docs/02_DEVELOPMENT_GUIDES/GETTING_STARTED.md)                        | Panduan langkah demi langkah untuk menyiapkan lingkungan pengembangan lokal.                         |
|                                                 | [Panduan Frontend](./Docs/02_DEVELOPMENT_GUIDES/FRONTEND_GUIDE.md)                                    | Penjelasan mendalam tentang arsitektur sisi klien (React), state management, dan styling.            |
|                                                 | [Panduan Backend](./Docs/02_DEVELOPMENT_GUIDES/BACKEND_GUIDE.md)                                      | Penjelasan mendalam tentang arsitektur sisi server (NestJS), database, dan API.                      |
|                                                 | [**Referensi API Lengkap**](./Docs/02_DEVELOPMENT_GUIDES/API_REFERENCE.md)                            | **DIPERBARUI** - Dokumentasi lengkap semua endpoint API dengan contoh request/response.              |
|                                                 | [**Component Library**](./Docs/02_DEVELOPMENT_GUIDES/COMPONENT_LIBRARY.md)                            | **BARU** - Dokumentasi semua komponen UI dan cara penggunaannya.                                      |
|                                                 | [Panduan Testing](./Docs/02_DEVELOPMENT_GUIDES/TESTING_GUIDE.md)                                      | Strategi dan cara menulis serta menjalankan pengujian (testing) untuk aplikasi.                      |
|                                                 | [**Deployment Checklist**](./Docs/02_DEVELOPMENT_GUIDES/DEPLOYMENT_CHECKLIST.md)                      | **BARU** - Checklist lengkap untuk memastikan aplikasi siap deployment.                              |
| **3. Standar & Proses** <br>_Kerja tim_         | [**Design System & Panduan UI/UX**](./Docs/03_STANDARDS_AND_PROCEDURES/DESIGN_SYSTEM.md)              | **(PENTING)** Sumber kebenaran untuk semua elemen visual, komponen, dan prinsip desain.              |
|                                                 | [Standar Koding](./Docs/03_STANDARDS_AND_PROCEDURES/CODING_STANDARDS.md)                              | Aturan dan konvensi untuk version control (Git), format commit, dan gaya penulisan kode.             |
|                                                 | [Panduan Kontribusi](./Docs/03_STANDARDS_AND_PROCEDURES/CONTRIBUTING.md)                              | Alur kerja untuk berkontribusi pada proyek, termasuk proses Pull Request dan code review.            |
|                                                 | [**Panduan Keamanan**](./Docs/03_STANDARDS_AND_PROCEDURES/SECURITY_GUIDE.md)                          | **DIPERBARUI** - Merangkum semua aspek keamanan dengan threat model, security audit checklist, dan incident response. |
| **4. Operasi** <br>_Menuju produksi_            | **[Panduan Deployment Debian 13 Proxmox](./Docs/04_OPERATIONS/DEPLOYMENT_DEBIAN13_PROXMOX.md)**      | **Panduan lengkap step-by-step** untuk deploy ke Debian 13 di Proxmox VM. **WAJIB DIBACA untuk deployment pertama kali.** |
|                                                 | [Quick Start Deployment](./Docs/04_OPERATIONS/QUICK_START_DEPLOYMENT.md)                             | Panduan cepat untuk deployment dalam 15-30 menit. Untuk yang sudah familiar dengan Docker.          |
|                                                 | [Panduan Deployment Umum](./Docs/04_OPERATIONS/DEPLOYMENT.md)                                        | Instruksi umum untuk proses build dan deployment aplikasi ke lingkungan produksi.                    |
|                                                 | [Dokumentasi Operasional](./Docs/04_OPERATIONS/README.md)                                             | Index semua dokumentasi operasional dan checklist deployment.                                        |
|                                                 | [Monitoring & Logging](./Docs/04_OPERATIONS/MONITORING_AND_LOGGING.md)                                | Strategi operasional untuk memantau kesehatan dan kinerja aplikasi di produksi.                      |
|                                                 | [Backup & Recovery](./Docs/04_OPERATIONS/BACKUP_AND_RECOVERY.md)                                      | Prosedur standar untuk mencadangkan data dan memulihkan sistem jika terjadi kegagalan.               |
| **5. Dokumentasi Pengguna** <br>_Cara pakai_    | [**Panduan Pengguna Umum**](./Docs/05_USER_DOCUMENTATION/USER_GUIDE.md)                              | Panduan fungsional aplikasi dari perspektif pengguna akhir (Staff, Admin).                             |
|                                                 | [**Panduan Staff & Leader**](./Docs/05_USER_DOCUMENTATION/USER_GUIDE_STAFF.md)                        | **BARU** - Panduan lengkap untuk Staff dan Leader.                                                     |
|                                                 | [**Panduan Admin**](./Docs/05_USER_DOCUMENTATION/USER_GUIDE_ADMIN.md)                                 | **BARU** - Panduan lengkap untuk Admin Logistik dan Admin Purchase.                                    |
|                                                 | [**Panduan Super Admin**](./Docs/05_USER_DOCUMENTATION/USER_GUIDE_SUPER_ADMIN.md)                     | **BARU** - Panduan lengkap untuk Super Admin dengan akses penuh.                                        |
|                                                 | [**FAQ**](./Docs/05_USER_DOCUMENTATION/FAQ.md)                                                        | **BARU** - Frequently Asked Questions dengan jawaban lengkap.                                          |
|                                                 | [**Index Dokumentasi User**](./Docs/05_USER_DOCUMENTATION/README.md)                                  | **BARU** - Index dan quick reference untuk semua dokumentasi user.                                     |
| **Dokumen Bisnis** <br>_Legal & Penawaran_      | [Proposal Penawaran](./Docs/Business/quotation.html)                                                  | Dokumen proposal awal yang merinci lingkup proyek dan opsi investasi.                                |
|                                                 | [Perjanjian Kerja](./Docs/Business/perjanjian.md)                                                     | Dokumen legal yang mengikat perjanjian kerja antara pengembang dan klien.                            |
|                                                 | [Berita Acara Kerjasama](./Docs/Business/bak.md)                                                      | Dokumen berita acara yang merangkum poin-poin kesepakatan kerjasama teknis dan operasional.          |
| **Peningkatan Dokumentasi** <br>_Roadmap & Rekomendasi_ | [**Ringkasan Peningkatan**](./Docs/DOCUMENTATION_ENHANCEMENT_SUMMARY.md)                            | **BARU** - Ringkasan semua peningkatan dokumentasi yang telah dilakukan.                              |
|                                                 | [**Rekomendasi Peningkatan**](./Docs/DOCUMENTATION_IMPROVEMENT_RECOMMENDATIONS.md)                    | **BARU** - Saran dan roadmap untuk meningkatkan dokumentasi lebih lanjut.                            |
