# PTSP Madrasah Digital

Sistem Pelayanan Terpadu Satu Pintu (PTSP) Digital untuk Madrasah.

## 1. Struktur Folder Project

```text
/
├── app/
│   ├── dashboard/
│   │   ├── pengajuan/
│   │   │   └── page.tsx      # Halaman daftar pengajuan (Siswa & Verifikator)
│   │   ├── layout.tsx        # Layout dashboard (Sidebar, Header)
│   │   └── page.tsx          # Halaman utama dashboard (Statistik)
│   ├── login/
│   │   └── page.tsx          # Halaman login (Simulasi RBAC)
│   ├── pengajuan/
│   │   └── page.tsx          # Form pengajuan layanan untuk Siswa
│   ├── globals.css           # Styling global (Tailwind CSS)
│   ├── layout.tsx            # Root layout Next.js
│   └── page.tsx              # Landing Page Publik
├── components/               # Komponen UI reusable (jika ada)
├── lib/
│   ├── store.ts              # State management (Zustand) & Mock Database
│   └── utils.ts              # Utility functions
├── public/                   # Asset statis (gambar, icon)
└── package.json              # Konfigurasi dependensi
```

## 2. Struktur Database (ERD Sederhana)

Jika diimplementasikan menggunakan database relasional (MySQL/PostgreSQL), berikut adalah struktur tabelnya:

### Tabel `users`
- `id` (PK, UUID)
- `name` (VARCHAR)
- `role` (ENUM: 'Siswa', 'Wali Kelas', 'Guru', 'Staff TU', 'Kepala Madrasah')
- `nis` (VARCHAR, nullable)
- `kelas` (VARCHAR, nullable)
- `email` (VARCHAR, unique)
- `password` (VARCHAR, hashed)
- `created_at` (TIMESTAMP)

### Tabel `pengajuan`
- `id` (PK, VARCHAR, misal: 'P-001')
- `siswa_id` (FK -> users.id)
- `jenis_layanan` (VARCHAR)
- `deskripsi` (TEXT)
- `status` (ENUM: 'Menunggu Verifikasi', 'Diproses', 'Ditolak', 'Selesai')
- `current_verifikator_role` (VARCHAR)
- `tanggal_pengajuan` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Tabel `riwayat_verifikasi` (Audit Trail)
- `id` (PK, UUID)
- `pengajuan_id` (FK -> pengajuan.id)
- `verifikator_id` (FK -> users.id)
- `status_diberikan` (VARCHAR)
- `catatan` (TEXT, nullable)
- `tanggal` (TIMESTAMP)

## 3. Flow Diagram Sistem

1. **Akses Publik (Landing Page)**
   - Pengunjung/Siswa membuka halaman utama (`/`).
   - Melihat daftar layanan yang tersedia.
   - Klik "Ajukan Layanan".

2. **Autentikasi**
   - Jika belum login, sistem mengarahkan ke halaman Login (`/login`).
   - Siswa login menggunakan akun yang terdaftar.

3. **Pengajuan Layanan (Siswa)**
   - Siswa mengisi form pengajuan (`/pengajuan`).
   - Data otomatis terisi (Nama, NIS, Kelas).
   - Siswa memilih jenis layanan, mengisi deskripsi, dan upload dokumen (opsional).
   - Klik "Kirim". Status awal: **Menunggu Verifikasi**.

4. **Verifikasi Berjenjang (RBAC)**
   - **Tahap 1 (Wali Kelas):** Wali kelas melihat pengajuan di dashboard. Jika disetujui, diteruskan ke Staff TU. Status: **Diproses**.
   - **Tahap 2 (Staff TU):** Staff TU memverifikasi dokumen. Jika lengkap, diteruskan ke Kepala Madrasah. Status: **Diproses**.
   - **Tahap 3 (Kepala Madrasah):** Kepala Madrasah memberikan final approval. Status berubah menjadi **Selesai**.
   - *Catatan:* Di setiap tahap, verifikator berhak menolak pengajuan dengan memberikan catatan alasan penolakan. Status berubah menjadi **Ditolak**.

5. **Tracking & Notifikasi**
   - Siswa dapat melihat status pengajuan secara real-time di Dashboard Siswa (`/dashboard`).
   - Siswa dapat melihat riwayat verifikasi (siapa yang memproses dan catatannya).

## 4. Teknologi yang Digunakan
- **Frontend & Backend:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **State Management:** Zustand (Untuk simulasi database & state)
- **Icons:** Lucide React
