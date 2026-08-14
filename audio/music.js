(function () {
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  if (!bgMusic || !musicToggle) return;

  const iconPause = document.getElementById('musicIconPause');
  const iconPlay = document.getElementById('musicIconPlay');
  const MUSIC_PLAYING_KEY = 'portfolio_music_playing';
  const MUSIC_TIME_KEY = 'portfolio_music_time';
  const MUSIC_SRC_KEY = 'portfolio_music_src';
  const MUSIC_UNLOCK_KEY = 'portfolio_music_unlocked';
  const MUSIC_SRC_ID = 'bittersweet-v20260724';
  const TARGET_VOLUME = 0.45;
  const UNLOCK_EVENTS = ['pointerdown', 'keydown', 'touchstart', 'click', 'scroll', 'wheel'];

  bgMusic.volume = TARGET_VOLUME;
  bgMusic.setAttribute('playsinline', '');
  bgMusic.setAttribute('webkit-playsinline', '');
  bgMusic.removeAttribute('autoplay');

  let userPaused = false;
  let playToken = 0;
  let lastSavedAt = 0;
  let unlockListenersBound = false;
  let unlockHandler = null;
  let awaitingUnmute = false;

  try {
    const savedPlaying = localStorage.getItem(MUSIC_PLAYING_KEY);
    // unset or "true" → should play. "false" → user paused.
    userPaused = savedPlaying === 'false';

    const savedSrc = localStorage.getItem(MUSIC_SRC_KEY);
    const savedTime = parseFloat(localStorage.getItem(MUSIC_TIME_KEY) || '0');

    if (savedSrc !== MUSIC_SRC_ID) {
      localStorage.setItem(MUSIC_SRC_KEY, MUSIC_SRC_ID);
      localStorage.setItem(MUSIC_TIME_KEY, '0');
      bgMusic.currentTime = 0;
    } else if (Number.isFinite(savedTime) && savedTime > 0) {
      bgMusic.currentTime = savedTime;
    }
  } catch (_) {
    userPaused = false;
  }

  function wasUnlocked() {
    try {
      return sessionStorage.getItem(MUSIC_UNLOCK_KEY) === 'true';
    } catch (_) {
      return false;
    }
  }

  function persistMusicState() {
    try {
      localStorage.setItem(MUSIC_PLAYING_KEY, userPaused ? 'false' : 'true');
      localStorage.setItem(MUSIC_TIME_KEY, String(bgMusic.currentTime || 0));
      localStorage.setItem(MUSIC_SRC_KEY, MUSIC_SRC_ID);
      lastSavedAt = Date.now();
    } catch (_) {}
  }

  function markUnlocked() {
    try {
      sessionStorage.setItem(MUSIC_UNLOCK_KEY, 'true');
    } catch (_) {}
  }

  function maybePersistPlaybackTime() {
    if (Date.now() - lastSavedAt < 1000) return;
    persistMusicState();
  }

  function setIconVisibility(el, visible) {
    if (!el) return;
    el.classList.toggle('is-hidden', !visible);
    if (visible) el.removeAttribute('hidden');
    else el.setAttribute('hidden', '');
  }

  function updateMusicButton() {
    const playing = !bgMusic.paused && !bgMusic.ended && !userPaused;
    musicToggle.setAttribute('aria-pressed', playing ? 'true' : 'false');
    musicToggle.setAttribute(
      'aria-label',
      playing ? 'Pause background music' : 'Play background music'
    );
    // Show pause when audio is running (even if still muted waiting for gesture)
    setIconVisibility(iconPause, playing);
    setIconVisibility(iconPlay, !playing);
  }

  function restoreSavedTime() {
    try {
      const savedTime = parseFloat(localStorage.getItem(MUSIC_TIME_KEY) || '0');
      if (Number.isFinite(savedTime) && savedTime > 0) {
        if (!bgMusic.duration || savedTime < bgMusic.duration) {
          bgMusic.currentTime = savedTime;
        }
      }
    } catch (_) {}
  }

  function removeUnlockListeners() {
    if (!unlockListenersBound || !unlockHandler) return;
    unlockListenersBound = false;
    UNLOCK_EVENTS.forEach(function (eventName) {
      document.removeEventListener(eventName, unlockHandler, true);
    });
    unlockHandler = null;
  }

  function enforcePaused() {
    playToken += 1;
    awaitingUnmute = false;
    removeUnlockListeners();
    bgMusic.pause();
    bgMusic.muted = false;
    updateMusicButton();
  }

  function unmuteAudible() {
    if (userPaused) return false;
    bgMusic.muted = false;
    bgMusic.volume = TARGET_VOLUME;
    awaitingUnmute = false;
    markUnlocked();
    updateMusicButton();
    persistMusicState();
    removeUnlockListeners();
    return true;
  }

  function bindUnlockListeners() {
    if (unlockListenersBound || userPaused) return;
    unlockListenersBound = true;

    unlockHandler = function () {
      if (userPaused) return;
      // Prefer unmute if already playing muted; otherwise start play
      if (!bgMusic.paused && awaitingUnmute) {
        unmuteAudible();
        return;
      }
      attemptPlay(true);
    };

    UNLOCK_EVENTS.forEach(function (eventName) {
      document.addEventListener(eventName, unlockHandler, { capture: true, passive: true });
    });
  }

  function attemptPlay(fromGesture) {
    if (userPaused) {
      enforcePaused();
      return Promise.resolve(false);
    }

    const token = ++playToken;

    function onAudible() {
      if (token !== playToken || userPaused) {
        if (!bgMusic.paused) bgMusic.pause();
        updateMusicButton();
        return false;
      }
      return unmuteAudible();
    }

    function startMutedThenUnmute() {
      bgMusic.muted = true;
      bgMusic.volume = TARGET_VOLUME;
      return bgMusic
        .play()
        .then(function () {
          if (token !== playToken || userPaused) {
            if (!bgMusic.paused) bgMusic.pause();
            return false;
          }
          awaitingUnmute = true;
          updateMusicButton();
          persistMusicState();

          // Try unmute immediately (works after prior gesture / some browsers)
          bgMusic.muted = false;
          if (!bgMusic.paused && !bgMusic.muted) {
            return onAudible();
          }

          // Still muted / blocked — keep playing muted until gesture
          bgMusic.muted = true;
          awaitingUnmute = true;
          if (fromGesture) {
            return onAudible();
          }
          bindUnlockListeners();
          return false;
        })
        .catch(function () {
          if (token !== playToken || userPaused) {
            if (userPaused) enforcePaused();
            return false;
          }
          updateMusicButton();
          bindUnlockListeners();
          return false;
        });
    }

    // After user gesture, go straight to audible
    if (fromGesture || wasUnlocked()) {
      bgMusic.muted = false;
      bgMusic.volume = TARGET_VOLUME;
      return bgMusic
        .play()
        .then(onAudible)
        .catch(function () {
          return startMutedThenUnmute();
        });
    }

    // Fresh load / refresh — unmuted autoplay is usually blocked
    bgMusic.muted = false;
    bgMusic.volume = TARGET_VOLUME;
    return bgMusic
      .play()
      .then(onAudible)
      .catch(function () {
        return startMutedThenUnmute();
      });
  }

  function startPlaybackFlow() {
    if (userPaused) {
      enforcePaused();
      persistMusicState();
      return;
    }

    const run = function () {
      if (userPaused) {
        enforcePaused();
        return;
      }
      restoreSavedTime();
      attemptPlay(false);
    };

    if (bgMusic.readyState >= 2) {
      run();
    } else {
      bgMusic.addEventListener('canplay', run, { once: true });
      bgMusic.addEventListener('loadeddata', run, { once: true });
      try {
        bgMusic.load();
      } catch (_) {}
      attemptPlay(false);
    }

    window.setTimeout(function () {
      if (userPaused) {
        enforcePaused();
        return;
      }
      if (bgMusic.paused) attemptPlay(false);
    }, 250);

    window.setTimeout(function () {
      if (userPaused || !bgMusic.paused) return;
      attemptPlay(false);
    }, 800);
  }

  musicToggle.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (!userPaused && !bgMusic.paused) {
      userPaused = true;
      enforcePaused();
      persistMusicState();
      return;
    }

    userPaused = false;
    awaitingUnmute = false;
    bgMusic.muted = false;
    bgMusic.volume = TARGET_VOLUME;
    persistMusicState();
    attemptPlay(true).then(function () {
      persistMusicState();
    });
  });

  bgMusic.addEventListener('play', function () {
    if (userPaused) {
      bgMusic.pause();
      updateMusicButton();
      return;
    }
    updateMusicButton();
  });
  bgMusic.addEventListener('pause', updateMusicButton);
  bgMusic.addEventListener('volumechange', updateMusicButton);

  bgMusic.addEventListener('timeupdate', function () {
    if (!bgMusic.paused && !userPaused) maybePersistPlaybackTime();
  });

  window.addEventListener('pagehide', persistMusicState);
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
      persistMusicState();
      return;
    }
    // Tab visible again — resume if user wanted music on
    if (!userPaused && bgMusic.paused) {
      startPlaybackFlow();
    } else if (!userPaused && awaitingUnmute) {
      bindUnlockListeners();
    }
  });

  window.addEventListener('pageshow', function (event) {
    if (userPaused) {
      enforcePaused();
      return;
    }
    if (event.persisted || bgMusic.paused) {
      startPlaybackFlow();
    }
  });

  document.addEventListener(
    'click',
    function (e) {
      const link = e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href') || '';
      if (!href || href.startsWith('#') || link.hasAttribute('data-resume-trigger')) return;
      persistMusicState();
    },
    true
  );

  updateMusicButton();

  if (userPaused) {
    enforcePaused();
    persistMusicState();
  } else {
    persistMusicState();
    startPlaybackFlow();
  }

  (function setupMusicHint() {
    const HINT_KEY = 'portfolio_music_hint_dismissed';
    try {
      if (localStorage.getItem(HINT_KEY) === '1') return;
    } catch (_) {}

    if (document.getElementById('musicHint')) return;

    const style = document.createElement('style');
    style.textContent =
      '.music-hint{position:fixed;right:1.25rem;bottom:calc(1.25rem + 54px);z-index:90;display:flex;align-items:flex-start;gap:10px;max-width:min(268px,calc(100vw - 2.5rem));padding:14px 12px 14px 16px;background:#0A0A0A;color:#FFF;border:1px solid #0A0A0A;font-family:Inter,system-ui,sans-serif;box-shadow:0 10px 28px rgba(0,0,0,.22);opacity:0;transform:translateY(8px);transition:opacity .28s ease,transform .28s ease;pointer-events:none}' +
      '.music-hint.is-visible{opacity:1;transform:none;pointer-events:auto}' +
      '.music-hint__copy{margin:0;font-size:13px;line-height:1.45;font-weight:500;letter-spacing:-0.01em}' +
      '.music-hint__close{flex:none;width:28px;height:28px;margin:-4px -2px 0 0;border:0;background:transparent;color:inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;opacity:.72}' +
      '.music-hint__close:hover,.music-hint__close:focus-visible{opacity:1}' +
      '.music-hint__close:focus-visible{outline:2px solid currentColor;outline-offset:2px}' +
      '.music-hint::after{content:"";position:absolute;right:14px;bottom:-6px;width:12px;height:12px;background:#0A0A0A;transform:rotate(45deg)}' +
      ':root[data-theme="dark"] .music-hint{background:#FFF;color:#0A0A0A;border-color:#FFF}' +
      ':root[data-theme="dark"] .music-hint::after{background:#FFF}' +
      '.music-toggle.is-hinted{box-shadow:0 0 0 2px #0A0A0A,0 0 0 5px rgba(10,10,10,.18)!important}' +
      ':root[data-theme="dark"] .music-toggle.is-hinted{box-shadow:0 0 0 2px #FFF,0 0 0 5px rgba(255,255,255,.22)!important}' +
      '@media (prefers-reduced-motion:reduce){.music-hint,.music-hint.is-visible{transition:none;transform:none}}';
    document.head.appendChild(style);

    const hint = document.createElement('div');
    hint.id = 'musicHint';
    hint.className = 'music-hint';
    hint.setAttribute('role', 'status');
    hint.setAttribute('aria-live', 'polite');
    hint.innerHTML =
      '<p class="music-hint__copy">Play or pause the music anytime from here.</p>' +
      '<button type="button" class="music-hint__close" aria-label="Dismiss music tip">' +
      '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
      '</button>';
    document.body.appendChild(hint);

    musicToggle.setAttribute('aria-describedby', 'musicHint');

    const closeBtn = hint.querySelector('.music-hint__close');

    function dismissHint() {
      hint.classList.remove('is-visible');
      musicToggle.classList.remove('is-hinted');
      musicToggle.removeAttribute('aria-describedby');
      try {
        localStorage.setItem(HINT_KEY, '1');
      } catch (_) {}
      window.setTimeout(function () {
        if (hint.parentNode) hint.parentNode.removeChild(hint);
      }, 280);
    }

    closeBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      dismissHint();
    });

    musicToggle.addEventListener('click', function () {
      if (document.getElementById('musicHint')) dismissHint();
    });

    document.addEventListener('keydown', function onEsc(e) {
      if (e.key !== 'Escape') return;
      document.removeEventListener('keydown', onEsc);
      if (document.getElementById('musicHint')) dismissHint();
    });

    window.setTimeout(function () {
      musicToggle.classList.add('is-hinted');
      hint.classList.add('is-visible');
    }, 700);
  })();
})();
