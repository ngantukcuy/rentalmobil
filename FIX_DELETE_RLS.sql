-- ============================================================
-- PERBAIKAN: Tambah policy DELETE untuk tabel pemesanan
-- Jalankan query ini di Supabase Dashboard > SQL Editor
-- ============================================================

-- Cek apakah policy sudah ada (opsional)
-- SELECT policyname FROM pg_policies WHERE tablename = 'pemesanan';

-- Tambah policy DELETE untuk admin
CREATE POLICY "Hanya admin bisa hapus pemesanan"
  ON public.pemesanan FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Verifikasi: lihat semua policy pada tabel pemesanan
-- SELECT policyname, cmd FROM pg_policies WHERE tablename = 'pemesanan';
