# TechHire - Platform E-Recruitment & E-Portofolio

> **Tugas Ujian Tengah Semester (UTS) - E-Application**  
> **Program Studi:** D3 Teknik Informatika - Fakultas Vokasi Universitas Sumatera Utara  
> **Pengembang:** Habil Rizky Tazir (NIM: 241712030)  
> **Repository:** [https://github.com/HabilRizky/techhire-eapp](https://github.com/HabilRizky/techhire-eapp)

---

## 📌 Tentang Aplikasi

**TechHire** adalah platform *E-Recruitment* dan *E-Portofolio* terpadu yang dirancang khusus untuk memfasilitasi mahasiswa dan lulusan IT dalam mencari pekerjaan serta memamerkan portofolio teknis mereka (seperti repositori GitHub, proyek nyata, dan CV). 

Di sisi lain, perusahaan IT dapat mempublikasikan lowongan pekerjaan, meninjau portofolio teknis pelamar secara langsung, mengelola status tahapan rekrutmen, hingga mengatur jadwal *E-Interview* terpadu.

---

## ✨ Fitur Utama

### 1. 👤 Pelamar (Job Seeker / Mahasiswa IT)
- **Registrasi & Autentikasi**: Manajemen akun pelamar dengan sistem sesi aman.
- **E-Portofolio & Profil**: Unggah CV, kelola profil, tautan GitHub/Portofolio, riwayat pendidikan, dan daftar keahlian (*skills*).
- **Eksplorasi Lowongan**: Pencarian dan filter lowongan berdasarkan jenis pekerjaan (*Full-time*, *Part-time*, *Magang*, *Remote*) serta lokasi.
- **Apply Lowongan**: Melamar lowongan kerja secara langsung dengan melampirkan profil portofolio digital.
- **Tracking Status Lamaran**: Memantau progres lamaran secara *real-time* (*Dilamar*, *Dilihat*, *Interview*, *Diterima*, *Ditolak*) serta melihat jadwal dan catatan *E-Interview*.

### 2. 🏢 Perusahaan (Employer / Recruiter)
- **Profil Perusahaan**: Mengelola identitas perusahaan, deskripsi, alamat, website, dan logo.
- **Posting Lowongan**: Mempublikasikan info lowongan pekerjaan baru beserta kualifikasi, rentang gaji, tipe kerja, dan tenggat waktu (*deadline*).
- **Review Lamaran & Portofolio**: Memeriksa berkas pelamar, tautan GitHub, dan CV secara komprehensif.
- **Manajemen Status & Penjadwalan Interview**: Memperbarui status lamaran dan menjadwalkan *E-Interview* disertai catatan teknis untuk pelamar.

### 3. ⚙️ Admin
- **Dashboard Ringkasan**: Pemantauan statistik pengguna, total lowongan, dan lamaran aktif di dalam sistem.

---

## 🛠️ Arsitektur & Teknologi

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server & Client Components)
- **UI Library**: [React](https://react.dev/)
- **Bahasa Pemrograman**: [TypeScript](https://www.typescriptlang.org/)
- **ORM**: [Prisma ORM](https://www.prisma.io/)
- **Database**: SQLite (`prisma/dev.db`)
- **Styling**: Modern CSS & Tailwind CSS

---

## 🚀 Panduan Menjalankan Proyek Secara Lokal

### Prasyarat
- [Node.js](https://nodejs.org/) (versi 18.x atau yang lebih baru disarankan)
- NPM (bawaan dari instalasi Node.js)

### Langkah-langkah Instalasi:

1. **Clone Repository**
   ```bash
   git clone https://github.com/HabilRizky/techhire-eapp.git
   cd techhire-eapp
   ```

2. **Install Dependensi**
   ```bash
   npm install
   ```

3. **Sinkronisasi Database (Prisma)**
   Database SQLite (`prisma/dev.db`) telah disertakan dengan data pengujian. Jika Anda ingin melakukan generate ulang schema:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Jalankan Development Server**
   ```bash
   npm run dev
   ```

5. **Buka Aplikasi**  
   Buka peramban (browser) dan akses alamat:
   ```
   http://localhost:3000
   ```

---

## 🔑 Akun Demo untuk Pengujian

Untuk mempermudah dosen atau penguji dalam mencoba seluruh fitur, akun berikut telah tersedia:

| Peran (*Role*) | Email | Password | Keterangan |
| :--- | :--- | :--- | :--- |
| **Pelamar** | `kuro@gmail.com` | `123456` | Akun pelamar lengkap dengan profil & portofolio |
| **Pelamar 2** | `Rizky@gmail.com` | `123456` | Akun pelamar alternatif |
| **Perusahaan** | `pertamina@gmail.com` | `123456` | Akun perusahaan dengan lowongan kerja aktif |

*Catatan: Anda juga dapat mendaftarkan akun baru secara langsung melalui menu Register.*

---

## 📄 Lisensi & Hak Cipta
Dikembangkan untuk keperluan akademik Ujian Tengah Semester (UTS) mata kuliah E-Application, Program Studi D3 Teknik Informatika USU.
