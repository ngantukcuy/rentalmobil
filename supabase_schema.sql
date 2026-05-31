-- ============================================================
-- EASYCAR RENTAL - SUPABASE DATABASE SCHEMA
-- Jalankan file ini di Supabase SQL Editor
-- ============================================================

-- 1. TABEL PROFILES (extend dari auth.users bawaan Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABEL KENDARAAN
CREATE TABLE IF NOT EXISTS public.kendaraan (
  id BIGSERIAL PRIMARY KEY,
  nama TEXT NOT NULL,
  merk TEXT NOT NULL,
  tipe TEXT NOT NULL CHECK (tipe IN ('MPV', 'SUV', 'Sedan', 'Hatchback', 'Pickup', 'Van', 'Bus')),
  tahun INT NOT NULL,
  plat_nomor TEXT NOT NULL UNIQUE,
  kapasitas INT NOT NULL DEFAULT 5,
  transmisi TEXT NOT NULL CHECK (transmisi IN ('Automatic', 'Manual')),
  bahan_bakar TEXT NOT NULL CHECK (bahan_bakar IN ('Bensin', 'Solar', 'Listrik', 'Hybrid')),
  harga_per_hari NUMERIC(12,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'Tersedia' CHECK (status IN ('Tersedia', 'Disewa', 'Perawatan', 'Tidak Aktif')),
  foto_url TEXT,
  deskripsi TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL PEMESANAN (BOOKING)
CREATE TABLE IF NOT EXISTS public.pemesanan (
  id BIGSERIAL PRIMARY KEY,
  kode_booking TEXT NOT NULL UNIQUE DEFAULT 'EC-' || LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0'),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  kendaraan_id BIGINT REFERENCES public.kendaraan(id) ON DELETE SET NULL,
  nama_pemesan TEXT NOT NULL,
  email_pemesan TEXT NOT NULL,
  telepon_pemesan TEXT NOT NULL,
  tanggal_mulai DATE NOT NULL,
  tanggal_selesai DATE NOT NULL,
  durasi_hari INT GENERATED ALWAYS AS (tanggal_selesai - tanggal_mulai) STORED,
  lokasi_pengambilan TEXT NOT NULL,
  lokasi_pengembalian TEXT NOT NULL,
  total_harga NUMERIC(14,2) NOT NULL,
  uang_muka NUMERIC(14,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Menunggu' CHECK (status IN ('Menunggu', 'Dikonfirmasi', 'Aktif', 'Selesai', 'Dibatalkan')),
  status_pembayaran TEXT NOT NULL DEFAULT 'Belum Bayar' CHECK (status_pembayaran IN ('Belum Bayar', 'DP', 'Lunas')),
  metode_pembayaran TEXT CHECK (metode_pembayaran IN ('Transfer Bank', 'Cash', 'QRIS', 'Kartu Kredit')),
  catatan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL PENGEMBALIAN
CREATE TABLE IF NOT EXISTS public.pengembalian (
  id BIGSERIAL PRIMARY KEY,
  pemesanan_id BIGINT REFERENCES public.pemesanan(id) ON DELETE CASCADE UNIQUE,
  tanggal_kembali TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  kondisi_kendaraan TEXT NOT NULL DEFAULT 'Baik' CHECK (kondisi_kendaraan IN ('Baik', 'Rusak Ringan', 'Rusak Berat')),
  biaya_tambahan NUMERIC(12,2) DEFAULT 0,
  keterangan TEXT,
  dicatat_oleh UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kendaraan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pemesanan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pengembalian ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "User bisa lihat profilnya sendiri"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "User bisa update profilnya sendiri"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admin bisa lihat semua profil"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "User baru bisa insert profil"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- KENDARAAN policies
CREATE POLICY "Semua user login bisa lihat kendaraan"
  ON public.kendaraan FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Hanya admin bisa insert kendaraan"
  ON public.kendaraan FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Hanya admin bisa update kendaraan"
  ON public.kendaraan FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Hanya admin bisa delete kendaraan"
  ON public.kendaraan FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- PEMESANAN policies
CREATE POLICY "User bisa lihat pemesanannya sendiri"
  ON public.pemesanan FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admin bisa lihat semua pemesanan"
  ON public.pemesanan FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "User login bisa buat pemesanan"
  ON public.pemesanan FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin bisa update semua pemesanan"
  ON public.pemesanan FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "User bisa batalkan pemesanannya sendiri"
  ON public.pemesanan FOR UPDATE
  USING (user_id = auth.uid());
CREATE POLICY "Hanya admin bisa hapus pemesanan"
  ON public.pemesanan FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );


-- PENGEMBALIAN policies
CREATE POLICY "Hanya admin bisa kelola pengembalian"
  ON public.pengembalian FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "User bisa lihat pengembalian miliknya"
  ON public.pengembalian FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.pemesanan p
      WHERE p.id = pengembalian.pemesanan_id AND p.user_id = auth.uid()
    )
  );

-- ============================================================
-- FUNCTION & TRIGGER: Auto buat profil setelah register
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Pengguna Baru'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- FUNCTION: Auto update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_kendaraan
  BEFORE UPDATE ON public.kendaraan
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_pemesanan
  BEFORE UPDATE ON public.pemesanan
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- DATA AWAL: Admin & Kendaraan Sample
-- ============================================================

-- CATATAN: Admin harus dibuat melalui Supabase Auth terlebih dahulu.
-- Setelah register admin, update rolenya dengan query berikut:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@easycar.com';

-- Sample kendaraan
INSERT INTO public.kendaraan (nama, merk, tipe, tahun, plat_nomor, kapasitas, transmisi, bahan_bakar, harga_per_hari, status, deskripsi) VALUES
('Avanza G', 'Toyota', 'MPV', 2023, 'BM 1234 AB', 7, 'Manual', 'Bensin', 350000, 'Tersedia', 'Toyota Avanza G 2023, kondisi prima, cocok untuk keluarga'),
('Fortuner VRZ', 'Toyota', 'SUV', 2022, 'BM 5678 CD', 7, 'Automatic', 'Solar', 750000, 'Tersedia', 'Toyota Fortuner VRZ 2022, SUV mewah untuk perjalanan jauh'),
('Brio RS', 'Honda', 'Hatchback', 2023, 'BM 9101 EF', 5, 'Automatic', 'Bensin', 300000, 'Tersedia', 'Honda Brio RS 2023, irit dan lincah di kota'),
('Innova Reborn', 'Toyota', 'MPV', 2022, 'BM 1121 GH', 7, 'Automatic', 'Solar', 550000, 'Tersedia', 'Toyota Innova Reborn 2022, nyaman dan luas'),
('HR-V SE', 'Honda', 'SUV', 2023, 'BM 3141 IJ', 5, 'Automatic', 'Bensin', 500000, 'Tersedia', 'Honda HR-V SE 2023, SUV kompak stylish'),
('Hiace Premio', 'Toyota', 'Van', 2021, 'BM 5161 KL', 15, 'Manual', 'Solar', 900000, 'Tersedia', 'Toyota Hiace Premio 2021, ideal untuk rombongan');
