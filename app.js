// HomePro Web Preview — Interactive Controller & State Management

let currentScreenIndex = 0;
let autoPlayTimer = null;
const totalScreens = 4;
let userInteracted = false;

// Screen Switching Function
function switchScreen(index) {
  currentScreenIndex = index;

  for (let i = 0; i < totalScreens; i++) {
    const screenEl = document.getElementById(`mock-screen-${i}`);
    const tabBtn = document.getElementById(`tab-btn-${i}`);

    if (i === index) {
      // Active Screen
      if (screenEl) {
        screenEl.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
        screenEl.classList.add('opacity-100', 'scale-100');
      }
      if (tabBtn) {
        tabBtn.classList.add('active-tab', 'text-white');
        tabBtn.classList.remove('text-slate-400');
      }
    } else {
      // Inactive Screen
      if (screenEl) {
        screenEl.classList.remove('opacity-100', 'scale-100');
        screenEl.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
      }
      if (tabBtn) {
        tabBtn.classList.remove('active-tab', 'text-white');
        tabBtn.classList.add('text-slate-400');
      }
    }
  }

  // Update bottom mockup nav highlights
  const navMockBtns = document.querySelectorAll('.nav-mock-btn');
  navMockBtns.forEach((btn, idx) => {
    if (idx === index) {
      btn.classList.add('text-brand-400');
      btn.classList.remove('hover:text-white', 'text-slate-400');
    } else {
      btn.classList.remove('text-brand-400');
      btn.classList.add('text-slate-400');
    }
  });
}

// Auto-play screen presentation every 5 seconds
function startAutoPlay() {
  if (autoPlayTimer) clearInterval(autoPlayTimer);
  autoPlayTimer = setInterval(() => {
    if (!userInteracted) {
      currentScreenIndex = (currentScreenIndex + 1) % totalScreens;
      switchScreen(currentScreenIndex);
    }
  }, 4500);
}

// Pause autoplay on direct click
document.addEventListener('DOMContentLoaded', () => {
  startAutoPlay();

  const viewport = document.getElementById('screen-viewport');
  if (viewport) {
    viewport.addEventListener('mouseenter', () => {
      userInteracted = true;
    });
    viewport.addEventListener('mouseleave', () => {
      userInteracted = false;
    });
  }

  // Update QR Code target URL dynamically
  updateQrCode();
});

// Modal Logic for QR Code
function openQrModal() {
  const modal = document.getElementById('qrModal');
  if (modal) {
    modal.classList.remove('hidden');
    setTimeout(() => {
      modal.classList.remove('opacity-0');
    }, 10);
  }
}

function closeQrModal() {
  const modal = document.getElementById('qrModal');
  if (modal) {
    modal.classList.add('opacity-0');
    setTimeout(() => {
      modal.classList.add('hidden');
    }, 300);
  }
}

// Close modal when clicking outside box
window.addEventListener('click', (e) => {
  const modal = document.getElementById('qrModal');
  if (e.target === modal) {
    closeQrModal();
  }
});

// QR Code dynamic generation
function updateQrCode() {
  const qrImg = document.getElementById('qrCodeImage');
  const currentUrl = window.location.href;
  if (qrImg) {
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(currentUrl)}`;
  }
}

// Copy URL to Clipboard
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
