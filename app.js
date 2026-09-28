// HomePro Web Preview — Accessible & High-Performance Interactive Controller

let currentScreenIndex = 0;
let autoPlayTimer = null;
const totalScreens = 4;
let userInteracted = false;
let lastFocusedElement = null;

// Screen Switching Function with full ARIA sync
function switchScreen(index) {
  if (index < 0 || index >= totalScreens) return;
  currentScreenIndex = index;

  for (let i = 0; i < totalScreens; i++) {
    const screenEl = document.getElementById(`mock-screen-${i}`);
    const tabBtn = document.getElementById(`tab-btn-${i}`);

    if (i === index) {
      // Active Screen
      if (screenEl) {
        screenEl.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
        screenEl.classList.add('opacity-100', 'scale-100');
        screenEl.removeAttribute('hidden');
      }
      if (tabBtn) {
        tabBtn.classList.add('active-tab');
        tabBtn.classList.remove('text-ink-secondary');
        tabBtn.setAttribute('aria-selected', 'true');
        tabBtn.setAttribute('tabindex', '0');
      }
    } else {
      // Inactive Screen
      if (screenEl) {
        screenEl.classList.remove('opacity-100', 'scale-100');
        screenEl.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
        screenEl.setAttribute('hidden', 'true');
      }
      if (tabBtn) {
        tabBtn.classList.remove('active-tab');
        tabBtn.classList.add('text-ink-secondary');
        tabBtn.setAttribute('aria-selected', 'false');
        tabBtn.setAttribute('tabindex', '-1');
      }
    }
  }

  // Update bottom mockup nav highlights
  const navMockBtns = document.querySelectorAll('.nav-mock-btn');
  navMockBtns.forEach((btn, idx) => {
    if (idx === index) {
      btn.classList.add('text-brand-600');
      btn.classList.remove('text-slate-500');
      btn.setAttribute('aria-current', 'page');
    } else {
      btn.classList.remove('text-brand-600');
      btn.classList.add('text-slate-500');
      btn.removeAttribute('aria-current');
    }
  });
}

// Auto-play screen presentation every 4.5 seconds
function startAutoPlay() {
  if (autoPlayTimer) clearInterval(autoPlayTimer);
  autoPlayTimer = setInterval(() => {
    if (!userInteracted) {
      currentScreenIndex = (currentScreenIndex + 1) % totalScreens;
      switchScreen(currentScreenIndex);
    }
  }, 4500);
}

// Interactive event listeners
document.addEventListener('DOMContentLoaded', () => {
  startAutoPlay();

  const viewport = document.getElementById('screen-viewport');
  const tablist = document.getElementById('screen-tablist');

  if (viewport) {
    viewport.addEventListener('mouseenter', () => { userInteracted = true; });
    viewport.addEventListener('mouseleave', () => { userInteracted = false; });
  }

  // Arrow Key navigation for screen tabs (WAI-ARIA Tab Pattern)
  if (tablist) {
    tablist.addEventListener('keydown', (e) => {
      let targetIndex = currentScreenIndex;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        targetIndex = (currentScreenIndex + 1) % totalScreens;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        targetIndex = (currentScreenIndex - 1 + totalScreens) % totalScreens;
      } else if (e.key === 'Home') {
        e.preventDefault();
        targetIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        targetIndex = totalScreens - 1;
      }

      if (targetIndex !== currentScreenIndex) {
        userInteracted = true;
        switchScreen(targetIndex);
        const newTab = document.getElementById(`tab-btn-${targetIndex}`);
        if (newTab) newTab.focus();
      }
    });
  }

  // Update QR Code target URL dynamically
  updateQrCode();
});

// Accessible Modal Logic for QR Code
function openQrModal() {
  lastFocusedElement = document.activeElement;
  const modal = document.getElementById('qrModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    setTimeout(() => {
      modal.classList.remove('opacity-0');
      const closeBtn = document.getElementById('closeModalBtn');
      if (closeBtn) closeBtn.focus();
    }, 10);
  }
}

function closeQrModal() {
  const modal = document.getElementById('qrModal');
  if (modal) {
    modal.classList.add('opacity-0');
    modal.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
      modal.classList.add('hidden');
      if (lastFocusedElement) lastFocusedElement.focus();
    }, 300);
  }
}

// Close modal when clicking outside or pressing Escape key
window.addEventListener('click', (e) => {
  const modal = document.getElementById('qrModal');
  if (e.target === modal) {
    closeQrModal();
  }
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modal = document.getElementById('qrModal');
    if (modal && !modal.classList.contains('hidden')) {
      closeQrModal();
    }
  }
});

// QR Code dynamic generation
function updateQrCode() {
  const qrImg = document.getElementById('qrCodeImage');
  const currentUrl = window.location.href;
  if (qrImg) {
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(currentUrl)}`;
  }
}

// Copy URL to Clipboard with accessible user feedback
function copyCurrentUrl() {
  const copyBtnText = document.getElementById('copyBtnText');
  const url = window.location.href;

  navigator.clipboard.writeText(url).then(() => {
    if (copyBtnText) {
      const original = copyBtnText.innerText;
      copyBtnText.innerText = "Copied to Clipboard! ✓";
      setTimeout(() => {
        copyBtnText.innerText = original;
      }, 2500);
    }
  }).catch(() => {
    alert("URL copied: " + url);
  });
}
