# 🚗 EasyCar Rental — Panduan Setup Supabase

---

## LANGKAH 1 — Buat Project Supabase

1. Buka https://supabase.com dan login/daftar
2. Klik **"New Project"**
3. Isi:
   - **Name**: `easycar-rental`
   - **Database Password**: buat password yang kuat, **simpan baik-baik**
   - **Region**: pilih `Southeast Asia (Singapore)`
4. Klik **"Create new project"** → tunggu ±2 menit sampai selesai

---

## LANGKAH 2 — Jalankan SQL Schema (Buat Tabel)

1. Di dashboard Supabase, klik menu **"SQL Editor"** (ikon terminal di sidebar kiri)
2. Klik **"New query"**
3. Buka file `supabase_schema.sql` di folder ini, **copy semua isinya**
4. Paste ke SQL Editor Supabase
5. Klik tombol **"Run"** (atau tekan Ctrl+Enter)
6. Pastikan muncul pesan **"Success"** di bawah — artinya semua tabel, RLS, dan trigger sudah terbuat

---

## LANGKAH 3 — Ambil URL & API Key

1. Di Supabase, klik **"Project Settings"** (ikon ⚙️ di sidebar bawah kiri)
2. Klik tab **"API"**
3. Salin dua nilai berikut:
   - **Project URL** → contoh: `https://abcdefghij.supabase.co`
   - **anon public** key → string panjang yang dimulai dengan `eyJ...`

---

## LANGKAH 4 — Isi Config di Kode

1. Buka file `supabase-config.js`
2. Ganti baris berikut:
   ```js
   const SUPABASE_URL = "https://XXXXXXXXXXXXXXXX.supabase.co";
   const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.XXXXX";
   ```
   Dengan URL dan key yang kamu salin tadi. Contoh:
   ```js
   const SUPABASE_URL = "https://abcdefghij.supabase.co";
   const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCJ9.eyJpc3MiOi...";
   ```
3. Simpan file

---

## LANGKAH 5 — Matikan Konfirmasi Email (Opsional tapi Disarankan untuk Dev)

Agar user bisa langsung login tanpa harus klik link konfirmasi email:

1. Buka **Authentication** → **Providers** → **Email**
2. Matikan toggle **"Enable email confirmations"**
3. Klik **Save**

---

## LANGKAH 6 — Buat Akun Admin

1. Buka file `index.html` di browser (buka langsung atau pakai Live Server)
2. Klik **"Daftar"** dan buat akun baru dengan email admin kamu
3. Setelah berhasil daftar, buka Supabase **SQL Editor** lagi
4. Jalankan query berikut untuk menjadikan akun tersebut admin:
   ```sql
   UPDATE public.profiles
   SET role = 'admin'
   WHERE email = 'email_admin_kamu@gmail.com';
   ```
5. Logout dan login ulang — kamu sekarang masuk sebagai Admin

---

## LANGKAH 7 — Coba Daftar sebagai User Biasa

1. Gunakan browser berbeda (atau mode incognito)
2. Daftar akun baru → setelah login, kamu hanya bisa melihat:
   - ✅ Pemesanan (booking.html)
   - ✅ Kendaraan (kendaraan.html)
   - ❌ Dashboard (admin only — akan di-redirect)
   - ❌ Admin Panel (admin only — akan di-redirect)
   - ❌ Docs (admin only — akan di-redirect)

---

## Struktur File

```
📁 easycar/
├── index.html          → Halaman login & register
├── dashboard.html      → Dashboard statistik (ADMIN ONLY)
├── kendaraan.html      → Daftar kendaraan (semua user login)
├── booking.html        → Form pemesanan (semua user login)
├── admin.html          → Panel manajemen (ADMIN ONLY)
├── docs.html           → Dokumentasi API (ADMIN ONLY)
├── supabase-config.js  → ⚠️ WAJIB diisi URL & KEY Supabase
└── supabase_schema.sql → Script SQL untuk buat tabel di Supabase
```

## Hak Akses per Halaman

| Halaman        | User Biasa | Admin |
|----------------|------------|-------|
| index.html     | ✅          | ✅     |
| booking.html   | ✅          | ✅     |
| kendaraan.html | ✅ (read)   | ✅     |
| dashboard.html | ❌ redirect | ✅     |
| admin.html     | ❌ redirect | ✅     |
| docs.html      | ❌ redirect | ✅     |

---

## Troubleshooting

**Login gagal padahal password benar?**
→ Cek apakah Email Confirmation sudah dimatikan (Langkah 5)

**Data tidak muncul di Admin Panel?**
→ Pastikan SQL schema sudah dijalankan (Langkah 2). Cek di Table Editor apakah tabel `pemesanan` sudah ada.

**RLS error saat baca data?**
→ Pastikan user sudah login. RLS memblokir akses anonim ke semua tabel.

**Tidak bisa masuk halaman admin padahal sudah update role?**
→ Logout dulu, lalu login ulang agar session ter-refresh.
