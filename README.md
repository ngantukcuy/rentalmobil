# 🚗 EasyCar — Refactor Guide

Panduan lengkap hasil refactor project rental kendaraan.

---

## 📁 Struktur Folder Baru

```
easycar-refactor/
├── assets/
│   └── css/
│       └── shared.css          ← Print media query + shared styles
├── components/
│   └── sidebar.js              ← Sidebar component (inject + mobile toggle)
├── pages/
│   ├── index.html              ← Login / Register
│   ├── dashboard.html          ← Dashboard admin
│   ├── booking.html            ← Wizard pemesanan kendaraan
│   ├── kendaraan.html          ← Daftar & CRUD kendaraan
│   ├── pesanan-saya.html       ← Riwayat pesanan user
│   ├── admin.html              ← (dari original, tinggal ganti path)
│   ├── promo.html              ← (dari original, tinggal ganti path)
│   ├── laporan.html            ← (dari original, tinggal ganti path)
│   └── pengaturan.html         ← (dari original, tinggal ganti path)
├── services/
│   └── supabase.js             ← Supabase config + helper functions
└── utils/
    ├── ui.js                   ← Toast, Modal konfirmasi, Loading state
    └── print.js                ← Print struk (hanya cetak #struk-print)
```

---

## 🔧 Cara Menggunakan

### 1. Di setiap halaman baru, load script ini (urutan penting):

```html
<!-- Di bagian bawah <body>, sebelum </body> -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="../services/supabase.js"></script>
<script src="../components/sidebar.js"></script>
<script src="../utils/ui.js"></script>
<!-- Kalau perlu print struk: -->
<script src="../utils/print.js"></script>
```

### 2. Load Tailwind CSS di `<head>`:

```html
<script src="https://cdn.tailwindcss.com"></script>
<link rel="stylesheet" href="../assets/css/shared.css" />
```

### 3. Init sidebar di JS halaman:

```js
// Di awal script halaman
initSidebar('nama-halaman.html');    // untuk highlight nav aktif
renderSidebarUser(user);            // isi nama/avatar user
```

---

## 🧾 Print Struk — Cara Kerja

**Problem lama:** `window.print()` mencetak seluruh halaman.

**Solusi baru:**

1. Taruh `<div id="struk-print" style="display:none;"></div>` di body
2. CSS di `shared.css` sudah mengatur:
   ```css
   @media print {
     body * { visibility: hidden !important; }
     #struk-print, #struk-print * { visibility: visible !important; }
     #struk-print { position: fixed; top: 0; left: 0; width: 100%; }
   }
   ```
3. Panggil fungsi `printStruk(data)` dari `utils/print.js`:
   ```js
   printStruk({
     bookingId: 'RNT-123ABC',
     customerName: 'Budi Santoso',
     phone: '08123456789',
     vehicleName: 'Toyota Avanza',
     tanggalSewa: '2026-06-01',
     tanggalKembali: '2026-06-03',
     durasi: 2,
     hargaPerHari: 350000,
     subtotal: 700000,
     diskon: 0,
     total: 700000,
     metodePembayaran: 'QRIS',
     statusDP: 'DP Lunas',
     dp: 200000,
   });
   ```

---

## 🔔 Toast Notification

```js
showToast('Pemesanan berhasil!', 'success');
showToast('Gagal menyimpan data', 'error');
showToast('Perhatian! Lengkapi form', 'warning');
showToast('Informasi', 'info');
```

---

## 📦 Modal Konfirmasi

```js
const confirmed = await showModal({
  title: 'Hapus Data',
  message: 'Yakin ingin menghapus data ini?',
  confirmText: 'Ya, Hapus',
  cancelText: 'Batal',
  type: 'danger'   // 'danger' | 'success' | 'warning' | 'default'
});
if (confirmed) { /* lakukan aksi */ }
```

---

## ⏳ Loading State

```js
showLoading('Menyimpan data...');
// ... proses async ...
hideLoading();

// Untuk button loading:
setButtonLoading(btnEl, true);      // disable + spinner
setButtonLoading(btnEl, false, 'Simpan');  // restore
```

---

## 📱 Sidebar Responsive

Sidebar otomatis:
- **Desktop (lg+):** selalu tampil fixed di kiri, konten `lg:ml-64`
- **Mobile:** hidden, muncul via hamburger button (fixed top-left)
- Overlay gelap menutup sidebar saat di mobile

---

## 🎨 Design System

| Token | Nilai |
|-------|-------|
| Primary | `#1a3c6e` |
| Primary Dark | `#0f2347` |
| Accent | `#e85d04` |
| Background | `bg-gray-100` |
| Card | `bg-white rounded-2xl shadow-sm` |
| Spacing | `p-4`, `p-6`, `gap-4` |
| Border radius | `rounded-xl`, `rounded-2xl` |

---

## 🔄 Migrasi Halaman Lama (admin, promo, laporan, pengaturan)

Untuk halaman yang belum direfactor (admin.html, promo.html, dll):

1. Hapus sidebar HTML lama dari file tersebut
2. Tambah script loader di atas
3. Panggil `initSidebar()` + `renderSidebarUser(user)`
4. Ubah margin main dari `margin-left: 260px` jadi class Tailwind `lg:ml-64`
5. Ganti path ke `../services/supabase.js`

### Template halaman baru:

```html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>EasyCar — Halaman</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="../assets/css/shared.css" />
  <style>body { font-family: 'Poppins', sans-serif; }</style>
</head>
<body class="bg-gray-100 min-h-screen">

  <!-- Sidebar diinject otomatis oleh sidebar.js -->

  <div class="lg:ml-64 flex flex-col min-h-screen">
    <!-- TOPBAR -->
    <header class="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-100 px-4 lg:px-8 py-4">
      <div class="pl-12 lg:pl-0">
        <h2 class="text-lg font-bold text-primary">Judul Halaman</h2>
      </div>
    </header>

    <!-- CONTENT -->
    <main class="p-4 lg:p-8 flex-1 fade-in">
      <!-- Konten halaman -->
    </main>

    <footer class="text-center text-gray-400 text-xs py-5">&copy; 2026 EasyCar</footer>
  </div>

  <!-- SCRIPTS (urutan penting) -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="../services/supabase.js"></script>
  <script src="../components/sidebar.js"></script>
  <script src="../utils/ui.js"></script>
  <script>
    (async () => {
      initSidebar('nama-halaman.html');
      const user = await requireLogin(); // atau requireAdmin() untuk admin only
      if (!user) return;
      renderSidebarUser(user);
      document.body.style.visibility = 'visible';
      // ... logika halaman
    })();
  </script>
</body>
</html>
```

---

## ✅ Checklist Refactor

- [x] `services/supabase.js` — config + helpers
- [x] `components/sidebar.js` — sidebar responsive
- [x] `utils/ui.js` — toast, modal, loading
- [x] `utils/print.js` — print struk yang benar
- [x] `assets/css/shared.css` — print CSS + shared
- [x] `pages/index.html` — login/register
- [x] `pages/dashboard.html` — dashboard admin
- [x] `pages/booking.html` — wizard pemesanan
- [x] `pages/kendaraan.html` — CRUD kendaraan
- [x] `pages/pesanan-saya.html` — riwayat pesanan
- [ ] `pages/admin.html` — migrate dari original
- [ ] `pages/promo.html` — migrate dari original
- [ ] `pages/laporan.html` — migrate dari original
- [ ] `pages/pengaturan.html` — migrate dari original
