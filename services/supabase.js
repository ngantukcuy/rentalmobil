// ===============================
// SUPABASE CONFIG (FIX FINAL)
// ===============================

// Cegah double init (ini kunci biar ga error lagi)
if (!window.supabaseClient) {
  const SUPABASE_URL = "https://cdzcyfphxcjrwbgmvvlk.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkemN5ZnBoeGNqcndiZ212dmxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2ODA5NDIsImV4cCI6MjA5MjI1Njk0Mn0.6w4kUvHta_llhcwzzAaMTqZwSUpQTGgKSFMtY0tlAts";

  window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );
}

// Pakai global (biar ga bentrok)
var supabase = window.supabaseClient;

console.log("Supabase READY:", supabase);

async function getCurrentUser() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const { data: profile, error } = await supabase  // tambah error
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  console.log("PROFILE:", profile);  // tambah ini
  console.log("ERROR:", error);      // tambah ini

  return profile;
}

async function requireLogin() {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = "index.html";
    return null;
  }
  return user;
}

function renderSidebar(user) {
  if (!user) return;

  const isAdmin = user.role === "admin";
  const initial = user.full_name ? user.full_name[0].toUpperCase() : "U";

  const nameEl = document.getElementById("sidebarUserName");
  const roleEl = document.getElementById("sidebarUserRole");
  const avatarEl = document.getElementById("sidebarAvatar");

  if (nameEl) nameEl.textContent = user.full_name || user.email;
  if (roleEl) roleEl.textContent = isAdmin ? "Super Admin" : "Pelanggan";
  if (avatarEl) avatarEl.textContent = initial;

  document.querySelectorAll("[data-role='admin']").forEach(el => {
    el.style.display = isAdmin ? "flex" : "none";
  });
}

async function handleLogout() {
  await supabase.auth.signOut();
  localStorage.removeItem("ec_user");
  window.location.href = "index.html";
}

async function requireAdmin() {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    window.location.href = "index.html";
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  if (!profile) {
    window.location.href = "index.html";
    return null;
  }

  if (profile.role !== "admin") {
    window.location.href = "booking.html"; // user biasa diarahkan ke booking
    return null;
  }

  return profile;
}
// ============================================================
// FORMAT HELPERS
// ============================================================

function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(angka);
}

function formatTanggal(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

function statusBadgeClass(status) {
  const map = {
    "Menunggu": "warning",
    "Dikonfirmasi": "info",
    "Aktif": "success",
    "Selesai": "secondary",
    "Dibatalkan": "danger",
    "Tersedia": "success",
    "Disewa": "warning",
    "Perawatan": "danger"
  };
  return map[status] || "secondary";
}