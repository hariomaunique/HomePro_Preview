// HomePro Animated Splash Screen Controller
// Provides high-precision playback, timeline scrubbing, speed control & 1:1 comparison

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const ringMaskPath = document.getElementById('ringMaskPath');
  const sparkHead = document.getElementById('sparkHead');
  const logoHouse = document.getElementById('logoHouse');
  const brandTextInner = document.getElementById('brandTextInner');
  const textWipeBeam = document.getElementById('textWipeBeam');
  const bottomLoader = document.getElementById('bottomLoader');
  const ambientGlow = document.getElementById('ambientGlow');
  const protectionWave = document.getElementById('protectionWave');

  // Controls
  const btnPlayPause = document.getElementById('btnPlayPause');
  const playIcon = document.getElementById('playIcon');
  const replayIcon = document.getElementById('replayIcon');
  const playBtnText = document.getElementById('playBtnText');
  const btnReset = document.getElementById('btnReset');
  const timeScrubber = document.getElementById('timeScrubber');
  const scrubPercent = document.getElementById('scrubPercent');
  const animStatusPill = document.getElementById('animStatusPill');
  const speedButtons = document.querySelectorAll('.speed-btn');
  const chkLoop = document.getElementById('chkLoop');

  // Compare & Modal
  const btnCompare = document.getElementById('btnCompare');
  const compareOverlay = document.getElementById('compareOverlay');
  const compareControlsCard = document.getElementById('compareControlsCard');
  const compareOpacitySlider = document.getElementById('compareOpacitySlider');
  const blendVal = document.getElementById('blendVal');

  const btnKotlinCode = document.getElementById('btnKotlinCode');
  const codeModal = document.getElementById('codeModal');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const btnCopyCode = document.getElementById('btnCopyCode');
  const copyBtnText = document.getElementById('copyBtnText');
  const kotlinCodeContainer = document.getElementById('kotlinCodeContainer');

  // Ring Position Adjuster Elements
  const maskShiftGroup = document.getElementById('maskShiftGroup');
  const ringContentGroup = document.getElementById('ringContentGroup');
  const sliderOffsetX = document.getElementById('sliderOffsetX');
  const sliderOffsetY = document.getElementById('sliderOffsetY');
  const valX = document.getElementById('valX');
  const valY = document.getElementById('valY');
  const offsetReadout = document.getElementById('offsetReadout');
  const btnPresetDefault = document.getElementById('btnPresetDefault');
  const btnPresetMore = document.getElementById('btnPresetMore');
  const btnPresetReset = document.getElementById('btnPresetReset');

  function setRingOffset(dx, dy) {
    if (maskShiftGroup) maskShiftGroup.setAttribute('transform', `translate(${dx}, ${dy})`);
    if (ringContentGroup) ringContentGroup.setAttribute('transform', `translate(${dx}, ${dy})`);
    if (sliderOffsetX) sliderOffsetX.value = dx;
    if (sliderOffsetY) sliderOffsetY.value = dy;
    if (valX) valX.textContent = `${dx >= 0 ? '+' : ''}${dx}px (${dx >= 0 ? 'Right' : 'Left'})`;
    if (valY) valY.textContent = `${dy >= 0 ? '+' : ''}${dy}px (${dy >= 0 ? 'Down' : 'Up'})`;
    if (offsetReadout) offsetReadout.textContent = `X: ${dx >= 0 ? '+' : ''}${dx}px | Y: ${dy >= 0 ? '+' : ''}${dy}px`;
  }

  if (sliderOffsetX && sliderOffsetY) {
    const handleSliderInput = () => {
      const dx = parseInt(sliderOffsetX.value, 10);
      const dy = parseInt(sliderOffsetY.value, 10);
      setRingOffset(dx, dy);
      [btnPresetDefault, btnPresetMore, btnPresetReset].forEach(b => b?.classList.remove('active'));
    };
    sliderOffsetX.addEventListener('input', handleSliderInput);
    sliderOffsetY.addEventListener('input', handleSliderInput);
  }

  btnPresetDefault?.addEventListener('click', () => {
    setRingOffset(58, 11);
    [btnPresetDefault, btnPresetMore, btnPresetReset].forEach(b => b?.classList.remove('active'));
    btnPresetDefault.classList.add('active');
  });

  btnPresetMore?.addEventListener('click', () => {
    setRingOffset(44, 38);
    [btnPresetDefault, btnPresetMore, btnPresetReset].forEach(b => b?.classList.remove('active'));
    btnPresetMore.classList.add('active');
  });

  btnPresetReset?.addEventListener('click', () => {
    setRingOffset(0, 0);
    [btnPresetDefault, btnPresetMore, btnPresetReset].forEach(b => b?.classList.remove('active'));
    btnPresetReset.classList.add('active');
  });

  // Time & Status Clock
  const statusTime = document.getElementById('statusTime');
  if (statusTime) {
    const updateClock = () => {
      const now = new Date();
      statusTime.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    };
    updateClock();
    setInterval(updateClock, 30000);
  }

  // Animation Constants
  const TOTAL_DURATION = 2400; // ms at 1.0x speed
  let playbackSpeed = 1.0;
  let isPlaying = false;
  let currentTime = 0; // ms
  let animFrameId = null;
  let lastTimestamp = null;
  let hasTriggeredWave = false;

  // Path metric for SVG
  const totalPathLength = ringMaskPath ? ringMaskPath.getTotalLength() : 1358;

  // Render Frame at given timeline millisecond (0 to TOTAL_DURATION)
  function renderFrame(timeMs) {
    currentTime = Math.max(0, Math.min(TOTAL_DURATION, timeMs));
    const progress = currentTime / TOTAL_DURATION;

    // Update scrubber UI
    timeScrubber.value = Math.round(progress * 1000);
    scrubPercent.textContent = `${Math.round(progress * 100)}%`;

    // 1. House Logo state:
    // Sits in the center; initial soft scale entrance (0 to 400ms)
    const houseP = Math.min(1, currentTime / 400);
    const houseScale = 0.95 + 0.05 * easeOutCubic(houseP);
    logoHouse.style.transform = `scale(${houseScale})`;
    logoHouse.style.opacity = Math.min(1, 0.4 + 0.6 * houseP);

    // 2. Ring Reveal:
    // Starts at t=350ms, finishes at t=1800ms
    const RING_START = 350;
    const RING_END = 1800;
    let ringP = 0;
    if (currentTime >= RING_START) {
      ringP = Math.min(1, (currentTime - RING_START) / (RING_END - RING_START));
    }
    const ringEased = easeInOutCubic(ringP);

    // SVG path offset: 1000 (hidden) down to 0 (fully revealed)
    const currentOffset = 1000 * (1 - ringEased);
    ringMaskPath.setAttribute('stroke-dashoffset', currentOffset.toFixed(2));

    // Leading Spark / Comet Flare
    if (ringP > 0.01 && ringP < 0.99) {
      sparkHead.classList.add('active');
      try {
        const pointDist = totalPathLength * ringEased;
        const pt = ringMaskPath.getPointAtLength(pointDist);
        sparkHead.setAttribute('transform', `translate(${pt.x}, ${pt.y})`);
      } catch (e) {
        // Fallback if browser security or detached
      }
    } else {
      sparkHead.classList.remove('active');
    }

    // Protection Wave & Ambient Glow (Triggers when ring completes wrap)
    if (ringP >= 0.95 && !hasTriggeredWave) {
      hasTriggeredWave = true;
      ambientGlow.classList.add('active');
      protectionWave.classList.remove('pulse');
      // Trigger reflow
      void protectionWave.offsetWidth;
      protectionWave.classList.add('pulse');
    } else if (ringP < 0.9) {
      hasTriggeredWave = false;
      ambientGlow.classList.remove('active');
      protectionWave.classList.remove('pulse');
    }

    // 3. Text Reveal (Left to Right Wipe):
    // Starts at t=700ms (as ring sweeps through bottom), ends at t=1950ms
    const TEXT_START = 700;
    const TEXT_END = 1950;
    let textP = 0;
    if (currentTime >= TEXT_START) {
      textP = Math.min(1, (currentTime - TEXT_START) / (TEXT_END - TEXT_START));
    }
    const textEased = easeOutCubic(textP);
    const hiddenRightPercent = (1 - textEased) * 100;
    brandTextInner.style.clipPath = `inset(0 ${hiddenRightPercent.toFixed(2)}% 0 0)`;

    // Leading shimmer beam on text
    if (textP > 0.02 && textP < 0.98) {
      textWipeBeam.classList.add('active');
      textWipeBeam.style.left = `${(textEased * 100).toFixed(2)}%`;
    } else {
      textWipeBeam.classList.remove('active');
    }

    // 4. Bottom Loading Spinner:
    // Fades in at t=1900ms
    if (currentTime >= 1900) {
      bottomLoader.classList.add('visible');
    } else {
      bottomLoader.classList.remove('visible');
    }
  }

  // Animation Loop
  function tick(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const delta = (timestamp - lastTimestamp) * playbackSpeed;
    lastTimestamp = timestamp;

    currentTime += delta;

    if (currentTime >= TOTAL_DURATION) {
      renderFrame(TOTAL_DURATION);
      if (chkLoop.checked) {
        // Reset and continue loop after brief pause
        setTimeout(() => {
          if (isPlaying) {
            currentTime = 0;
            lastTimestamp = null;
            animFrameId = requestAnimationFrame(tick);
          }
        }, 800);
      } else {
        stopAnimation(true);
      }
      return;
    }

    renderFrame(currentTime);
    animFrameId = requestAnimationFrame(tick);
  }

  function startAnimation() {
    if (currentTime >= TOTAL_DURATION) {
      currentTime = 0;
    }
    isPlaying = true;
    lastTimestamp = null;
    playIcon.style.display = 'none';
    replayIcon.style.display = 'none';
    playBtnText.textContent = 'Pause';
    animStatusPill.textContent = 'Playing';
    animStatusPill.className = 'status-pill playing';
    animFrameId = requestAnimationFrame(tick);
  }

  function pauseAnimation() {
    isPlaying = false;
    if (animFrameId) cancelAnimationFrame(animFrameId);
    playIcon.style.display = 'block';
    replayIcon.style.display = 'none';
    playBtnText.textContent = 'Resume';
    animStatusPill.textContent = 'Paused';
    animStatusPill.className = 'status-pill';
  }

  function stopAnimation(completed = false) {
    isPlaying = false;
    if (animFrameId) cancelAnimationFrame(animFrameId);
    if (completed) {
      playIcon.style.display = 'none';
      replayIcon.style.display = 'block';
      playBtnText.textContent = 'Replay';
      animStatusPill.textContent = 'Completed';
      animStatusPill.className = 'status-pill completed';
    } else {
      playIcon.style.display = 'block';
      replayIcon.style.display = 'none';
      playBtnText.textContent = 'Play Animation';
      animStatusPill.textContent = 'Ready';
      animStatusPill.className = 'status-pill';
    }
  }

  function resetAnimation() {
    stopAnimation(false);
    currentTime = 0;
    renderFrame(0);
  }

  // Easing helpers
  function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
  }

  function easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }

  // Play / Pause Button Listener
  btnPlayPause.addEventListener('click', () => {
    if (isPlaying) {
      pauseAnimation();
    } else {
      startAnimation();
    }
  });

  // Reset Button Listener
  btnReset.addEventListener('click', resetAnimation);

  // Scrubber Listener
  timeScrubber.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    const targetMs = (val / 1000) * TOTAL_DURATION;
    if (isPlaying) pauseAnimation();
    renderFrame(targetMs);
  });

  // Speed Buttons Listener
  speedButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      speedButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      playbackSpeed = parseFloat(btn.dataset.speed);
    });
  });

  // Keyboard Shortcuts (Space to Play/Pause, R to reset)
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.code === 'Space') {
      e.preventDefault();
      if (isPlaying) pauseAnimation(); else startAnimation();
    } else if (e.code === 'KeyR') {
      resetAnimation();
    }
  });

  // 1:1 Reference Compare Toggle
  let compareActive = false;
  btnCompare.addEventListener('click', () => {
    compareActive = !compareActive;
    btnCompare.classList.toggle('active', compareActive);
    compareControlsCard.style.display = compareActive ? 'block' : 'none';
    if (compareActive) {
      compareOverlay.style.opacity = (compareOpacitySlider.value / 100).toString();
    } else {
      compareOverlay.style.opacity = '0';
    }
  });

  compareOpacitySlider.addEventListener('input', (e) => {
    const val = e.target.value;
    blendVal.textContent = `${val}%`;
    if (compareActive) {
      compareOverlay.style.opacity = (val / 100).toString();
    }
  });

  // Kotlin Code Modal
  btnKotlinCode.addEventListener('click', () => {
    codeModal.classList.add('open');
  });

  btnCloseModal.addEventListener('click', () => {
    codeModal.classList.remove('open');
  });

  codeModal.addEventListener('click', (e) => {
    if (e.target === codeModal) codeModal.classList.remove('open');
  });

  // Copy Code Button
  btnCopyCode.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(kotlinCodeContainer.textContent);
      copyBtnText.textContent = 'Copied!';
      btnCopyCode.style.background = '#10b981';
      btnCopyCode.style.borderColor = '#34d399';
      setTimeout(() => {
        copyBtnText.textContent = 'Copy Kotlin Code';
        btnCopyCode.style.background = '#0284c7';
        btnCopyCode.style.borderColor = '#38bdf8';
      }, 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  });

  // Initial Ring Offset (+58px Right, +11px Down)
  setRingOffset(58, 11);

  // Initial Frame Render
  renderFrame(0);

  // Automatically kick off a smooth preview run on load!
  setTimeout(() => {
    startAnimation();
  }, 400);
});
