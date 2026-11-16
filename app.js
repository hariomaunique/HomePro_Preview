/**
 * HomePro Web Preview — Application Controller
 * Handles Multi-view switching (Prototype, All Screens, Dashboard, Download),
 * 15-Screen Interactive Flow Navigator, Mobile Chassis Hotspots, and State Management.
 */

// Screen Definitions (Matches 100% of real HomePro Android XML layouts & Kotlin classes)
const APP_SCREENS = [
  {
    id: 'screen-splash',
    index: 0,
    flow: 'Onboarding & Setup',
    title: 'Splash Screen',
    subtitle: 'Brand logo reveal & protective ring animation',
    xmlLayout: 'activity_splash.xml',
    kotlinClass: 'SplashActivity.kt',
    description: 'Minimalist white & blue brand screen featuring the HomePro house glyph, dynamic protective sweep ring, and brand reveal.',
    hotspots: 'Tap anywhere on screen to start app flow',
    nextScreenIndex: 1
  },
  {
    id: 'screen-onboarding',
    index: 1,
    flow: 'Onboarding & Setup',
    title: 'Onboarding Carousel',
    subtitle: '3-Step core capability walkthrough',
    xmlLayout: 'activity_onboarding.xml',
    kotlinClass: 'OnboardingActivity.kt',
    description: 'Full-screen ViewPager with illustrative slides highlighting Real-Time GPS Tracking, Geofence Safe Zones, and Instant SOS siren.',
    hotspots: 'Tap "Next" or "Skip" to proceed to Login',
    nextScreenIndex: 2
  },
  {
    id: 'screen-login',
    index: 2,
    flow: 'Onboarding & Setup',
    title: 'Modern Phone Login',
    subtitle: 'Fast passwordless phone authentication',
    xmlLayout: 'activity_login_modern.xml',
    kotlinClass: 'LoginModernActivity.kt',
    description: 'Clean phone entry input with +91 country prefix, privacy assurance badge, and instant OTP request trigger.',
    hotspots: 'Tap "Get OTP" button to simulate SMS delivery',
    nextScreenIndex: 3
  },
  {
    id: 'screen-otp',
    index: 3,
    flow: 'Onboarding & Setup',
    title: 'OTP Verification',
    subtitle: '4-Digit secure SMS token entry',
    xmlLayout: 'activity_otp_modern.xml',
    kotlinClass: 'OtpModernActivity.kt',
    description: 'Auto-focus 4-digit verification fields, live 30-second resend countdown timer, and phone edit link.',
    hotspots: 'Tap "Verify & Continue" to proceed to System Setup',
    nextScreenIndex: 4
  },
  {
    id: 'screen-permissions',
    index: 4,
    flow: 'Onboarding & Setup',
    title: 'System Permission Guard',
    subtitle: 'GPS, background, battery optimization & autostart',
    xmlLayout: 'activity_permission.xml',
    kotlinClass: 'PermissionActivity.kt',
    description: 'Step-by-step permission education for GPS satellites, Always-On background service, battery saver bypass, and boot auto-recovery.',
    hotspots: 'Tap "Start Tracking" to finish setup',
    nextScreenIndex: 5
  },
  {
    id: 'screen-profile-setup',
    index: 5,
    flow: 'Onboarding & Setup',
    title: 'Profile Setup',
    subtitle: 'Avatar selection & personal contact identity',
    xmlLayout: 'activity_profile_setup.xml',
    kotlinClass: 'SetupProfileActivity.kt',
    description: 'Profile photo / avatar picker with relation role selector (Head of Family, Spouse, Son, Daughter, etc.).',
    hotspots: 'Tap "Continue" to proceed to Family Circle setup',
    nextScreenIndex: 6
  },
  {
    id: 'screen-family-setup',
    index: 6,
    flow: 'Onboarding & Setup',
    title: 'Family Circle Setup',
    subtitle: 'Create a new circle or join with 6-digit code',
    xmlLayout: 'activity_family_setup.xml',
    kotlinClass: 'FamilySetupActivity.kt',
    description: 'Create a private family vault or enter an existing 6-character family invite code to join a loved one\'s circle.',
    hotspots: 'Tap "Create Family Circle" to enter Live Dashboard',
    nextScreenIndex: 7
  },
  {
    id: 'screen-map',
    index: 7,
    flow: 'Core Tracking',
    title: 'Live Family Map',
    subtitle: 'Interactive Google Map with member stories & moving track',
    xmlLayout: 'fragment_map.xml',
    kotlinClass: 'MapFragment.kt',
    description: 'Core flagship screen: Interactive map with moving family pins, member stories carousel with live battery %, animated road track with exhaust puff, and bottom sheet.',
    hotspots: 'Tap Member Story for Details • Tap Red SOS button for Emergency Siren • Tap Bottom Nav to switch tabs',
    nextScreenIndex: 8
  },
  {
    id: 'screen-family',
    index: 8,
    flow: 'Core Tracking',
    title: 'Family Circle Roster',
    subtitle: 'Member health cards & 6-digit invite code',
    xmlLayout: 'fragment_family_modern.xml',
    kotlinClass: 'FamilyFragment.kt',
    description: 'Shows active circle ("Verma Family"), 6-digit invite code (HP-7842) with copy button, and member status cards with battery % and geofence location.',
    hotspots: 'Tap "+ Add Member" or tap any member card',
    nextScreenIndex: 9
  },
  {
    id: 'screen-alerts',
    index: 9,
    flow: 'Core Tracking',
    title: 'Safety Alerts & Logs',
    subtitle: 'Categorized safety feed with instant filters',
    xmlLayout: 'fragment_alerts.xml',
    kotlinClass: 'AlertsFragment.kt',
    description: 'Real-time safety notifications categorized by All, SOS, Geofence (Home / School check-in), Low Battery, and Speeding alerts.',
    hotspots: 'Tap filter chips (All, SOS, Geofence, Battery, Speed) or tap Bottom Nav',
    nextScreenIndex: 10
  },
  {
    id: 'screen-profile',
    index: 10,
    flow: 'Core Tracking',
    title: 'Account & Settings',
    subtitle: 'Circle preferences, safe zones & privacy',
    xmlLayout: 'fragment_profile_modern.xml',
    kotlinClass: 'ProfileFragment.kt',
    description: 'User details, battery health status, Safe Zones (Geofence) shortcut, notification toggles, and Privacy Policy link.',
    hotspots: 'Tap "Safe Zones" to view Geofences, or Bottom Nav to return to Map',
    nextScreenIndex: 11
  },
  {
    id: 'screen-member-detail',
    index: 11,
    flow: 'Deep Safety & Tools',
    title: 'Member Live Telemetry',
    subtitle: 'Speedometer, battery status & route timeline',
    xmlLayout: 'activity_member_detail.xml',
    kotlinClass: 'MemberDetailActivity.kt',
    description: 'Detailed inspection of a family member (Priya): Live travel speed (42 km/h in transit), 84% battery, route history timeline, and direct Call/SMS buttons.',
    hotspots: 'Tap "Back" arrow to return to Live Map • Tap "Call" button',
    nextScreenIndex: 12
  },
  {
    id: 'screen-sos',
    index: 12,
    flow: 'Deep Safety & Tools',
    title: 'Instant SOS Emergency Siren',
    subtitle: 'Distress dispatch with pulsating audio countdown',
    xmlLayout: 'activity_sos_emergency.xml',
    kotlinClass: 'SosEmergencyActivity.kt',
    description: 'High-priority distress screen: Pulsating radar rings, 5-second cancel countdown, siren audio toggle, automated SMS broadcast with GPS coordinates, and Call 112.',
    hotspots: 'Tap "I am Safe (Cancel)" to disarm • Tap "Call Police (112)"',
    nextScreenIndex: 13
  },
  {
    id: 'screen-geofence',
    index: 13,
    flow: 'Deep Safety & Tools',
    title: 'Smart Geofence Safe Zones',
    subtitle: 'Home, School & Office arrival notifications',
    xmlLayout: 'activity_geofence.xml',
    kotlinClass: 'GeofenceActivity.kt',
    description: 'Configure circular boundary safe zones (Home: 150m, School: 200m, Office: 250m) with automated arrival and departure push notifications.',
    hotspots: 'Tap "+ Add Safe Zone" or tap "Back" to return',
    nextScreenIndex: 14
  },
  {
    id: 'screen-add-member',
    index: 14,
    flow: 'Deep Safety & Tools',
    title: 'Invite Family Member',
    subtitle: 'Share 6-digit code via WhatsApp, SMS or QR',
    xmlLayout: 'activity_add_member.xml',
    kotlinClass: 'AddMemberActivity.kt',
    description: 'Clean sharing interface showing the unique circle invite code HP-7842, QR code scanner for instant pairing, and WhatsApp / SMS share buttons.',
    hotspots: 'Tap "Share via WhatsApp" or "Copy Code" or "Back"',
    nextScreenIndex: 7
  }
];

// App State
let activeScreenIndex = 7; // Default to Live Map (Screen 8) for immediate visual wow factor
let activeView = 'prototype'; // 'prototype' | 'all-screens' | 'dashboard' | 'download'
let autoPlayActive = false;
let autoPlayInterval = null;

// ==========================================
// VIEW SWITCHING (Header Tabs)
// ==========================================
function switchView(viewName) {
  if (!['prototype', 'all-screens', 'dashboard', 'download'].includes(viewName)) {
    viewName = 'prototype';
  }
  activeView = viewName;

  // Update URL hash without jumping
  window.history.replaceState(null, '', `#${viewName}`);

  // Update header tab button states
  const viewBtns = document.querySelectorAll('.view-nav-pill');
  viewBtns.forEach(btn => {
    if (btn.getAttribute('data-view') === viewName) {
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
    } else {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    }
  });

  // Toggle view containers
  const views = ['prototype', 'all-screens', 'dashboard', 'download'];
  views.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    if (el) {
      if (v === viewName) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    }
  });

  // Scroll to top of window smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Refresh lucide icons if available
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

// ==========================================
// SCREEN NAVIGATION (Inside Prototype View)
// ==========================================
function goToScreen(index) {
  if (index < 0 || index >= APP_SCREENS.length) return;
  activeScreenIndex = index;
  const screen = APP_SCREENS[index];

  // 1. Update Phone Chassis viewport screens
  APP_SCREENS.forEach((s, i) => {
    const el = document.getElementById(s.id);
    if (el) {
      if (i === index) {
        el.classList.add('active');
        el.removeAttribute('hidden');
      } else {
        el.classList.remove('active');
        el.setAttribute('hidden', 'true');
      }
    }
  });

  // 2. Update Left Sidebar items
  const sidebarItems = document.querySelectorAll('.sidebar-screen-item');
  sidebarItems.forEach((item, i) => {
    if (i === index) {
      item.classList.add('active');
      item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      item.classList.remove('active');
    }
  });

  // 3. Update Right Inspector Details
  updateInspectorPanel(screen);

  // 4. Update Bottom Mockup Controls Counter
  const counterEl = document.getElementById('mockup-screen-counter');
  if (counterEl) {
    counterEl.textContent = `Screen ${index + 1} of ${APP_SCREENS.length}`;
  }

  // 5. Update Status bar color scheme based on screen background
  const statusBar = document.getElementById('phone-status-bar');
  if (statusBar) {
    if (screen.id === 'screen-splash' || screen.id === 'screen-sos') {
      statusBar.classList.add('text-white');
      statusBar.classList.remove('text-slate-900');
    } else {
      statusBar.classList.add('text-slate-900');
      statusBar.classList.remove('text-white');
    }
  }

  // Refresh icons
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

// Helper: Update Inspector Panel with active screen metadata
function updateInspectorPanel(screen) {
  const titleEl = document.getElementById('inspector-title');
  const flowEl = document.getElementById('inspector-flow-badge');
  const xmlEl = document.getElementById('inspector-xml-tag');
  const kotlinEl = document.getElementById('inspector-kotlin-tag');
  const descEl = document.getElementById('inspector-description');
  const hotspotsEl = document.getElementById('inspector-hotspots');
  const stepBadge = document.getElementById('inspector-step-badge');

  if (titleEl) titleEl.textContent = screen.title;
  if (flowEl) flowEl.textContent = screen.flow;
  if (xmlEl) xmlEl.textContent = screen.xmlLayout;
  if (kotlinEl) kotlinEl.textContent = screen.kotlinClass;
  if (descEl) descEl.textContent = screen.description;
  if (hotspotsEl) hotspotsEl.textContent = screen.hotspots;
  if (stepBadge) stepBadge.textContent = `Screen ${screen.index + 1}/${APP_SCREENS.length}`;
}

// Quick relative navigation
function nextScreen() {
  const nextIdx = (activeScreenIndex + 1) % APP_SCREENS.length;
  goToScreen(nextIdx);
}

function prevScreen() {
  const prevIdx = (activeScreenIndex - 1 + APP_SCREENS.length) % APP_SCREENS.length;
  goToScreen(prevIdx);
}

// Auto-play toggle
function toggleAutoPlay() {
  autoPlayActive = !autoPlayActive;
  const btn = document.getElementById('btn-autoplay-toggle');
  const icon = document.getElementById('icon-autoplay');

  if (autoPlayActive) {
    if (btn) {
      btn.classList.add('bg-brand-blue', 'text-white');
      btn.classList.remove('bg-white', 'text-slate-700');
    }
    autoPlayInterval = setInterval(() => {
      nextScreen();
    }, 4500);
  } else {
    if (btn) {
      btn.classList.remove('bg-brand-blue', 'text-white');
      btn.classList.add('bg-white', 'text-slate-700');
    }
    if (autoPlayInterval) clearInterval(autoPlayInterval);
  }
}

// Sidebar Search Filter
function filterScreens(query) {
  query = (query || '').toLowerCase().trim();
  const sidebarItems = document.querySelectorAll('.sidebar-screen-item');

  sidebarItems.forEach((item, index) => {
    const screen = APP_SCREENS[index];
    const match = screen.title.toLowerCase().includes(query) ||
                  screen.subtitle.toLowerCase().includes(query) ||
                  screen.xmlLayout.toLowerCase().includes(query) ||
                  screen.flow.toLowerCase().includes(query);

    if (match) {
      item.classList.remove('hidden');
    } else {
      item.classList.add('hidden');
    }
  });
}

// Copy Text Utility
function copyText(text, btnElement) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      showCopiedFeedback(btnElement);
    });
  } else {
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    showCopiedFeedback(btnElement);
  }
}

function showCopiedFeedback(btnElement) {
  if (!btnElement) return;
  const originalHtml = btnElement.innerHTML;
  btnElement.innerHTML = `<i data-lucide="check" class="w-4 h-4 text-emerald-600 inline"></i> Copied!`;
  if (window.lucide) window.lucide.createIcons();
  setTimeout(() => {
    btnElement.innerHTML = originalHtml;
    if (window.lucide) window.lucide.createIcons();
  }, 2000);
}

// ==========================================
// INITIALIZATION ON DOM READY
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Check URL hash for initial view
  const hash = window.location.hash.replace('#', '');
  if (['prototype', 'all-screens', 'dashboard', 'download'].includes(hash)) {
    switchView(hash);
  } else {
    switchView('prototype');
  }

  // Initialize prototype at screen 7 (Live Family Map)
  goToScreen(7);

  // Search input listener
  const searchInput = document.getElementById('input-screen-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      filterScreens(e.target.value);
    });
  }

  // Keyboard Navigation: Arrow Left/Right to switch screens in prototype
  document.addEventListener('keydown', (e) => {
    if (activeView === 'prototype') {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        nextScreen();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        prevScreen();
      }
    }
  });

  // Initialize Lucide icons
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
});
