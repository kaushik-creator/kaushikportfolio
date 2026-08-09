(function () {
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  if (!bgMusic || !musicToggle) return;

  const iconPause = document.getElementById('musicIconPause');
  const iconPlay = document.getElementById('musicIconPlay');
  const MUSIC_PREF_KEY = 'portfolio_music_paused';
  const MUSIC_TIME_KEY = 'portfolio_music_time';
  const MUSIC_SRC_KEY = 'portfolio_music_src';
  const MUSIC_UNLOCK_KEY = 'portfolio_music_unlocked';
  const MUSIC_SRC_ID = 'bittersweet-v20260724';
  const TARGET_VOLUME = 0.45;
  const UNLOCK_EVENTS = ['pointerdown', 'keydown', 'touchstart', 'click'];

  bgMusic.volume = TARGET_VOLUME;
  bgMusic.setAttribute('playsinline', '');
  bgMusic.setAttribute('webkit-playsinline', '');
  bgMusic.removeAttribute('autoplay');

  // Opt-in only — never autoplay on load or navigation (a11y guardrail)
  let userPaused = true;
  let playToken = 0;
  let lastSavedAt = 0;
  let unlockListenersBound = false;
  let unlockHandler = null;
  let waitingToUnmute = false;

  try {
    localStorage.setItem(MUSIC_PREF_KEY, 'true');
    const savedSrc = localStorage.getItem(MUSIC_SRC_KEY);
    const savedTime = parseFloat(localStorage.getItem(MUSIC_TIME_KEY) || '0');

    if (savedSrc !== MUSIC_SRC_ID) {
      localStorage.setItem(MUSIC_SRC_KEY, MUSIC_SRC_ID);
      localStorage.setItem(MUSIC_TIME_KEY, '0');
      bgMusic.currentTime = 0;
    } else if (Number.isFinite(savedTime) && savedTime > 0) {
      bgMusic.currentTime = savedTime;
    }
  } catch (_) {}

  function persistMusicState() {
    try {
      localStorage.setItem(MUSIC_PREF_KEY, userPaused ? 'true' : 'false');
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
    const playing = !bgMusic.paused && !bgMusic.ended && !bgMusic.muted && !userPaused;
    const armed = !bgMusic.paused && !bgMusic.ended && !userPaused;
    musicToggle.setAttribute('aria-pressed', armed ? 'true' : 'false');
    musicToggle.setAttribute(
      'aria-label',
      playing ? 'Pause background music' : 'Play background music'
    );
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
    UNLOCK_EVENTS.forEach((eventName) => {
      document.removeEventListener(eventName, unlockHandler, true);
    });
    unlockHandler = null;
  }

  function enforcePaused() {
    playToken += 1;
    waitingToUnmute = false;
    removeUnlockListeners();
    bgMusic.pause();
    bgMusic.muted = false;
    updateMusicButton();
  }

  function unmuteNow() {
    if (userPaused) {
      enforcePaused();
      return;
    }
    waitingToUnmute = false;
    bgMusic.muted = false;
    bgMusic.volume = TARGET_VOLUME;
    markUnlocked();
    updateMusicButton();
    persistMusicState();
    removeUnlockListeners();
  }

  function bindUnlockListeners() {
    if (unlockListenersBound || userPaused) return;
    unlockListenersBound = true;

    unlockHandler = () => {
      if (userPaused) return;

      if (waitingToUnmute || (!bgMusic.paused && bgMusic.muted)) {
        unmuteNow();
        if (bgMusic.paused) attemptPlay();
        return;
      }

      attemptPlay();
    };

    UNLOCK_EVENTS.forEach((eventName) => {
      document.addEventListener(eventName, unlockHandler, { capture: true, passive: true });
    });
  }

  function attemptPlay() {
    if (userPaused) {
      enforcePaused();
      return Promise.resolve(false);
    }

    const token = ++playToken;

    const onAudible = () => {
      if (token !== playToken || userPaused) {
        if (!bgMusic.paused) bgMusic.pause();
        updateMusicButton();
        return false;
      }
      waitingToUnmute = false;
      bgMusic.muted = false;
      bgMusic.volume = TARGET_VOLUME;
      markUnlocked();
      updateMusicButton();
      persistMusicState();
      removeUnlockListeners();
      return true;
    };

    bgMusic.muted = false;
    bgMusic.volume = TARGET_VOLUME;

    return bgMusic
      .play()
      .then(onAudible)
      .catch(() => {
        if (token !== playToken || userPaused) {
          if (userPaused) enforcePaused();
          return false;
        }

        bgMusic.muted = true;
        return bgMusic
          .play()
          .then(() => {
            if (token !== playToken || userPaused) {
              enforcePaused();
              return false;
            }
            waitingToUnmute = true;
            updateMusicButton();
            bindUnlockListeners();
            return true;
          })
          .catch(() => {
            if (token === playToken) {
              bgMusic.muted = false;
              waitingToUnmute = false;
              updateMusicButton();
              if (!userPaused) bindUnlockListeners();
            }
            return false;
          });
      });
  }

  function startPlaybackFlow() {
    if (userPaused) {
      enforcePaused();
      persistMusicState();
      return;
    }

    const run = () => {
      if (userPaused) {
        enforcePaused();
        return;
      }
      restoreSavedTime();
      attemptPlay();
    };

    if (bgMusic.readyState >= 2) {
      run();
    } else {
      bgMusic.addEventListener('canplay', run, { once: true });
      bgMusic.addEventListener('loadeddata', run, { once: true });
      try {
        bgMusic.load();
      } catch (_) {}
      attemptPlay();
    }

    window.setTimeout(() => {
      if (userPaused) {
        enforcePaused();
        return;
      }
      if (bgMusic.paused || bgMusic.muted) attemptPlay();
    }, 400);
  }

  musicToggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Pause whenever audio is currently running (audible or muted unlock state)
    if (!bgMusic.paused && !userPaused) {
      userPaused = true;
      enforcePaused();
      persistMusicState();
      return;
    }

    userPaused = false;
    waitingToUnmute = false;
    bgMusic.muted = false;
    bgMusic.volume = TARGET_VOLUME;
    persistMusicState();
    attemptPlay().then(() => {
      persistMusicState();
    });
  });

  // Guard: if anything starts playback while the user paused, stop it immediately.
  bgMusic.addEventListener('play', () => {
    if (userPaused) {
      bgMusic.pause();
      updateMusicButton();
      return;
    }
    updateMusicButton();
  });
  bgMusic.addEventListener('pause', updateMusicButton);
  bgMusic.addEventListener('volumechange', updateMusicButton);

  bgMusic.addEventListener('timeupdate', () => {
    if (!bgMusic.paused && !userPaused) maybePersistPlaybackTime();
  });

  window.addEventListener('pagehide', persistMusicState);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') persistMusicState();
    if (document.visibilityState === 'visible' && userPaused) enforcePaused();
  });

  window.addEventListener('pageshow', () => {
    // Stay paused unless the user pressed play on this page
    if (userPaused) enforcePaused();
  });

  // Persist pause/play preference before navigating to another page
  document.addEventListener(
    'click',
    (e) => {
      const link = e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href') || '';
      if (!href || href.startsWith('#') || link.hasAttribute('data-resume-trigger')) return;
      persistMusicState();
    },
    true
  );

  updateMusicButton();
  enforcePaused();
  persistMusicState();
})();
