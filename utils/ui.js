// =====================================================
// UI UTILITIES — Toast, Modal, Loading State
// EasyCar Rental
// =====================================================

// ──────────────────────────────────────────────
// TOAST NOTIFICATIONS
// ──────────────────────────────────────────────
let toastContainer = null;

function getToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.className = 'fixed top-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

/**
 * showToast(message, type)
 * type: 'success' | 'error' | 'warning' | 'info'
 */
function showToast(message, type = 'info', duration = 3500) {
  const icons = {
    success: "<i class='bx bxs-check-circle text-emerald-400'></i>",
    error:   "<i class='bx bxs-x-circle text-red-400'></i>",
    warning: "<i class='bx bxs-error text-amber-400'></i>",
    info:    "<i class='bx bxs-info-circle text-blue-400'></i>",
  };

  const toast = document.createElement('div');
  toast.className = `
    pointer-events-auto flex items-center gap-3 bg-slate-900/95 backdrop-blur border border-white/10
    text-white text-sm font-medium px-4 py-3 rounded-xl shadow-2xl
    transform translate-x-full transition-transform duration-300
  `.replace(/\s+/g, ' ').trim();

  toast.innerHTML = `
    <span class="text-lg flex-shrink-0">${icons[type] || icons.info}</span>
    <span class="flex-1">${message}</span>
    <button onclick="this.parentElement.remove()" class="text-slate-500 hover:text-white transition-colors ml-1">
      <i class='bx bx-x text-lg'></i>
    </button>
  `;

  getToastContainer().appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.classList.remove('translate-x-full');
    });
  });

  // Auto dismiss
  setTimeout(() => {
    toast.classList.add('translate-x-full');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ──────────────────────────────────────────────
// MODAL KONFIRMASI
// ──────────────────────────────────────────────
let activeModalResolve = null;

function showModal({ title = 'Konfirmasi', message = '', confirmText = 'Ya, Lanjutkan', cancelText = 'Batal', type = 'default' }) {
  return new Promise((resolve) => {
    activeModalResolve = resolve;

    const typeStyles = {
      danger:  'bg-red-500',
      success: 'bg-emerald-500',
      warning: 'bg-amber-500',
      default: 'bg-indigo-600',
    };

    const overlay = document.createElement('div');
    overlay.id = 'confirmModal';
    overlay.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] flex items-center justify-center p-4';
    overlay.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md transform scale-95 transition-transform duration-200" id="confirmModalBox">
        <div class="p-6">
          <h3 class="text-lg font-bold text-slate-800 mb-2">${title}</h3>
          <p class="text-slate-500 text-sm leading-relaxed">${message}</p>
        </div>
        <div class="px-6 pb-6 flex gap-3 justify-end">
          <button id="modalCancelBtn" class="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors">
            ${cancelText}
          </button>
          <button id="modalConfirmBtn" class="px-5 py-2.5 rounded-xl ${typeStyles[type] || typeStyles.default} text-white text-sm font-semibold hover:opacity-90 transition-opacity">
            ${confirmText}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.getElementById('confirmModalBox').classList.remove('scale-95');
        document.getElementById('confirmModalBox').classList.add('scale-100');
      });
    });

    document.getElementById('modalConfirmBtn').onclick = () => {
      overlay.remove();
      resolve(true);
    };
    document.getElementById('modalCancelBtn').onclick = () => {
      overlay.remove();
      resolve(false);
    };
    overlay.onclick = (e) => {
      if (e.target === overlay) { overlay.remove(); resolve(false); }
    };
  });
}

// ──────────────────────────────────────────────
// LOADING STATE / SPINNER
// ──────────────────────────────────────────────
function showLoading(message = 'Memuat data...') {
  let el = document.getElementById('globalLoader');
  if (!el) {
    el = document.createElement('div');
    el.id = 'globalLoader';
    el.className = 'fixed inset-0 bg-white/80 backdrop-blur-sm z-[9997] flex flex-col items-center justify-center gap-4';
    el.innerHTML = `
      <div class="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
      <p id="loaderMsg" class="text-slate-600 text-sm font-medium">${message}</p>
    `;
    document.body.appendChild(el);
  } else {
    document.getElementById('loaderMsg').textContent = message;
    el.classList.remove('hidden');
  }
}

function hideLoading() {
  const el = document.getElementById('globalLoader');
  if (el) el.classList.add('hidden');
}

// Button loading helper
function setButtonLoading(btn, loading, originalText = null) {
  if (loading) {
    btn.dataset.originalText = btn.innerHTML;
    btn.innerHTML = `<span class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block mr-2"></span> Memproses...`;
    btn.disabled = true;
  } else {
    btn.innerHTML = originalText || btn.dataset.originalText || 'Submit';
    btn.disabled = false;
  }
}
