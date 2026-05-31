// =====================================================
// SIDEBAR COMPONENT - EasyCar Rental
// Inject sidebar HTML + handle mobile toggle
// =====================================================

const SIDEBAR_HTML = `
<aside id="sidebar" class="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col z-50 shadow-2xl transition-transform duration-300 ease-in-out">
  <!-- Brand -->
  <div class="flex items-center gap-3 px-6 py-7 border-b border-white/10">
    <div class="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
      <i class='bx bxs-car text-white text-2xl'></i>
    </div>
    <div>
      <h2 class="text-white font-bold text-lg leading-tight">Easy<span class="text-orange-400">Car</span></h2>
      <p class="text-slate-400 text-xs">Rental Kendaraan</p>
    </div>
  </div>

  <!-- Nav -->
  <nav class="flex-1 py-5 overflow-y-auto sidebar-scroll">
    <div class="px-6 mb-2">
      <p class="text-slate-500 text-[10px] font-semibold uppercase tracking-widest">Menu Utama</p>
    </div>

    <a href="../pages/dashboard.html" class="sidebar-link flex items-center gap-3 px-6 py-3 text-slate-400 hover:text-white hover:bg-white/8 transition-all border-l-2 border-transparent text-sm font-medium" data-role="admin">
      <i class='bx bxs-dashboard text-lg'></i>
      <span>Dashboard</span>
    </a>
    <a href="../pages/kendaraan.html" class="sidebar-link flex items-center gap-3 px-6 py-3 text-slate-400 hover:text-white hover:bg-white/8 transition-all border-l-2 border-transparent text-sm font-medium">
      <i class='bx bxs-car text-lg'></i>
      <span>Kendaraan</span>
    </a>
    <a href="../pages/booking.html" class="sidebar-link flex items-center gap-3 px-6 py-3 text-slate-400 hover:text-white hover:bg-white/8 transition-all border-l-2 border-transparent text-sm font-medium">
      <i class='bx bxs-calendar-check text-lg'></i>
      <span>Pemesanan Baru</span>
    </a>
    <a href="../pages/pesanan-saya.html" class="sidebar-link flex items-center gap-3 px-6 py-3 text-slate-400 hover:text-white hover:bg-white/8 transition-all border-l-2 border-transparent text-sm font-medium">
      <i class='bx bxs-receipt text-lg'></i>
      <span>Pesanan Saya</span>
    </a>

    <div class="px-6 mt-4 mb-2" data-role="admin">
      <p class="text-slate-500 text-[10px] font-semibold uppercase tracking-widest">Manajemen</p>
    </div>

    <a href="../pages/admin.html" class="sidebar-link flex items-center gap-3 px-6 py-3 text-slate-400 hover:text-white hover:bg-white/8 transition-all border-l-2 border-transparent text-sm font-medium" data-role="admin">
      <i class='bx bxs-user-account text-lg'></i>
      <span>Admin Panel</span>
    </a>
    <a href="../pages/promo.html" class="sidebar-link flex items-center gap-3 px-6 py-3 text-slate-400 hover:text-white hover:bg-white/8 transition-all border-l-2 border-transparent text-sm font-medium" data-role="admin">
      <i class='bx bxs-tag text-lg'></i>
      <span>Promo & Diskon</span>
    </a>
    <a href="../pages/laporan.html" class="sidebar-link flex items-center gap-3 px-6 py-3 text-slate-400 hover:text-white hover:bg-white/8 transition-all border-l-2 border-transparent text-sm font-medium" data-role="admin">
      <i class='bx bxs-bar-chart-alt-2 text-lg'></i>
      <span>Laporan</span>
    </a>

    <div class="px-6 mt-4 mb-2">
      <p class="text-slate-500 text-[10px] font-semibold uppercase tracking-widest">Akun</p>
    </div>

    <a href="../pages/pengaturan.html" class="sidebar-link flex items-center gap-3 px-6 py-3 text-slate-400 hover:text-white hover:bg-white/8 transition-all border-l-2 border-transparent text-sm font-medium">
      <i class='bx bxs-cog text-lg'></i>
      <span>Pengaturan</span>
    </a>
  </nav>

  <!-- User Footer -->
  <div class="px-4 py-4 border-t border-white/10">
    <div class="flex items-center gap-3">
      <div id="sidebarAvatar" class="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-base flex-shrink-0 shadow">U</div>
      <div class="flex-1 min-w-0">
        <p id="sidebarUserName" class="text-white text-sm font-semibold truncate">User</p>
        <p id="sidebarUserRole" class="text-slate-400 text-xs">Pelanggan</p>
      </div>
      <button onclick="handleLogout()" title="Logout" class="text-slate-500 hover:text-orange-400 transition-colors p-1">
        <i class='bx bx-log-out text-lg'></i>
      </button>
    </div>
  </div>
</aside>

<!-- Overlay Mobile -->
<div id="sidebarOverlay" class="fixed inset-0 bg-black/50 z-40 hidden lg:hidden" onclick="closeSidebar()"></div>

<!-- Hamburger -->
<button id="hamburgerBtn" onclick="toggleSidebar()" class="fixed top-4 left-4 z-50 lg:hidden w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center shadow-lg">
  <i class='bx bx-menu text-white text-xl'></i>
</button>
`;

function initSidebar(activePage) {
  // Inject sidebar into body start
  const wrapper = document.createElement('div');
  wrapper.innerHTML = SIDEBAR_HTML;
  document.body.insertBefore(wrapper, document.body.firstChild);

  // Mark active link
  if (activePage) {
    document.querySelectorAll('.sidebar-link').forEach(link => {
      if (link.href.includes(activePage)) {
        link.classList.add('!text-white', '!border-l-orange-500', '!bg-orange-500/10');
        link.classList.remove('text-slate-400', 'border-transparent');
      }
    });
  }
}

function renderSidebarUser(user) {
  if (!user) return;
  const isAdmin = user.role === 'admin';
  const nameEl = document.getElementById('sidebarUserName');
  const roleEl = document.getElementById('sidebarUserRole');
  const avatarEl = document.getElementById('sidebarAvatar');

  if (nameEl) nameEl.textContent = user.full_name || user.email || 'User';
  if (roleEl) roleEl.textContent = isAdmin ? 'Super Admin' : 'Pelanggan';
  if (avatarEl) avatarEl.textContent = (user.full_name || user.email || 'U')[0].toUpperCase();

  // Show/hide admin-only items
  document.querySelectorAll('[data-role="admin"]').forEach(el => {
    el.style.display = isAdmin ? 'flex' : 'none';
  });
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const isOpen = !sidebar.classList.contains('-translate-x-full');

  if (isOpen) {
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
  } else {
    sidebar.classList.remove('-translate-x-full');
    overlay.classList.remove('hidden');
  }
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  sidebar.classList.add('-translate-x-full');
  overlay.classList.add('hidden');
}

// Mobile: start hidden
window.addEventListener('DOMContentLoaded', () => {
  if (window.innerWidth < 1024) {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.add('-translate-x-full');
  }
});
