// =====================================================
// PRINT STRUK UTILITY — EasyCar Rental
// Hanya mencetak area struk, bukan seluruh halaman
// =====================================================

/**
 * printStruk(data)
 * @param {Object} data - Data transaksi
 * data = {
 *   bookingId, customerName, phone, email,
 *   vehicleName, vehiclePlat, vehicleCategory,
 *   tanggalSewa, tanggalKembali, durasi,
 *   hargaPerHari, subtotal, diskon, total,
 *   metodePembayaran, statusDP, dp,
 *   createdAt
 * }
 */
function printStruk(data) {
  // Isi konten struk
  const el = document.getElementById('struk-print');
  if (!el) {
    console.warn('[printStruk] Element #struk-print tidak ditemukan.');
    return;
  }

  const now = new Date().toLocaleDateString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  el.innerHTML = `
    <div style="max-width:380px;margin:0 auto;font-family:'Poppins',sans-serif;font-size:13px;color:#1e293b;">
      <!-- Header -->
      <div style="text-align:center;border-bottom:2px dashed #e2e8f0;padding-bottom:16px;margin-bottom:16px;">
        <div style="font-size:22px;font-weight:800;color:#1a3c6e;">Easy<span style="color:#e85d04;">Car</span></div>
        <div style="font-size:11px;color:#64748b;margin-top:2px;">Rental Kendaraan — Bukti Transaksi</div>
        <div style="font-size:10px;color:#94a3b8;margin-top:6px;">Dicetak: ${now}</div>
      </div>

      <!-- Booking ID -->
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px 14px;text-align:center;margin-bottom:16px;">
        <div style="font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Nomor Pemesanan</div>
        <div style="font-size:18px;font-weight:800;color:#1a3c6e;letter-spacing:2px;margin-top:2px;">${data.bookingId || '—'}</div>
      </div>

      <!-- Customer Info -->
      <div style="margin-bottom:14px;">
        <div style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Pelanggan</div>
        ${row('Nama', data.customerName)}
        ${row('No. HP', data.phone)}
        ${data.email ? row('Email', data.email) : ''}
      </div>

      <!-- Kendaraan -->
      <div style="margin-bottom:14px;">
        <div style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Kendaraan</div>
        ${row('Kendaraan', data.vehicleName)}
        ${data.vehicleCategory ? row('Kategori', data.vehicleCategory) : ''}
        ${data.vehiclePlat ? row('Plat Nomor', data.vehiclePlat) : ''}
      </div>

      <!-- Tanggal -->
      <div style="margin-bottom:14px;">
        <div style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Periode Sewa</div>
        ${row('Tanggal Sewa', formatTanggal(data.tanggalSewa))}
        ${row('Tanggal Kembali', formatTanggal(data.tanggalKembali))}
        ${row('Durasi', `${data.durasi || 1} hari`)}
      </div>

      <!-- Rincian Harga -->
      <div style="border-top:2px dashed #e2e8f0;padding-top:14px;margin-bottom:14px;">
        <div style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Rincian Harga</div>
        ${row('Harga/hari', formatRupiah(data.hargaPerHari))}
        ${row(`${data.durasi || 1} hari × ${formatRupiah(data.hargaPerHari)}`, formatRupiah(data.subtotal || data.total))}
        ${data.diskon > 0 ? row('Diskon', `- ${formatRupiah(data.diskon)}`, '#16a34a') : ''}
      </div>

      <!-- Total -->
      <div style="background:#1a3c6e;border-radius:10px;padding:12px 14px;display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
        <span style="color:rgba(255,255,255,0.8);font-weight:600;font-size:13px;">TOTAL</span>
        <span style="color:#fff;font-size:18px;font-weight:800;">${formatRupiah(data.total)}</span>
      </div>

      <!-- Status DP -->
      <div style="margin-bottom:14px;">
        <div style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Pembayaran</div>
        ${row('Metode', data.metodePembayaran || '—')}
        ${row('Status DP', data.statusDP || '—')}
        ${data.dp > 0 ? row('Jumlah DP', formatRupiah(data.dp)) : ''}
      </div>

      <!-- Footer -->
      <div style="border-top:2px dashed #e2e8f0;padding-top:14px;text-align:center;">
        <p style="font-size:11px;color:#64748b;line-height:1.7;">
          Bawa struk ini saat pengambilan kendaraan.<br>
          Tunjukkan bersama KTP & SIM A asli.<br>
          <strong style="color:#1a3c6e;">EasyCar — Terima kasih atas kepercayaan Anda!</strong>
        </p>
        <div style="margin-top:12px;font-size:10px;color:#94a3b8;">
          ★ Simpan struk ini sebagai bukti transaksi ★
        </div>
      </div>
    </div>
  `;

  window.print();
}

// Helper row
function row(label, value, valueColor = '#1e293b') {
  return `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:5px;">
      <span style="color:#64748b;flex-shrink:0;min-width:120px;">${label}</span>
      <span style="font-weight:600;color:${valueColor};text-align:right;">${value || '—'}</span>
    </div>
  `;
}
