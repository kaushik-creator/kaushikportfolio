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

  let userPaused = false;
  let playToken = 0;
  let lastSavedAt = 0;
  let unlockListenersBound = false;
  let unlockHandler = null;
  let waitingToUnmute = false;

  try {
    userPaused = localStorage.getItem(MUSIC_PREF_KEY) === 'true';
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
    const playing = !bgMusic.paused && !bgMusic.ended && !bgMusic.muted;
    const armed = !bgMusic.paused && !bgMusic.ended;
    musicToggle.setAttribute('aria-pressed', armed ? 'true' : 'false');
    musicToggle.setAttribute(
      'aria-label',
      armed && !bgMusic.muted ? 'Pause background music' : 'Play background music'
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

  function unmuteNow() {
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
      updateMusicButton();
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

    // Prefer audible autoplay when the browser allows it.
    bgMusic.muted = false;
    bgMusic.volume = TARGET_VOLUME;

    return bgMusic
      .play()
      .then(onAudible)
      .catch(() => {
        if (token !== playToken || userPaused) return false;

        // Many browsers allow muted autoplay — start muted, unmute on first gesture.
        bgMusic.muted = true;
        return bgMusic
          .play()
          .then(() => {
            if (token !== playToken || userPaused) {
              if (!bgMusic.paused) bgMusic.pause();
              updateMusicButton();
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
              bindUnlockListeners();
            }
            return false;
          });
      });
  }

  function startPlaybackFlow() {
    if (userPaused) {
      updateMusicButton();
      return;
    }

    const run = () => {
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
      // Optimistic attempt — some engines start before canplay.
      attemptPlay();
    }

    // Retry shortly after load in case the first gesture-free attempt raced metadata.
    window.setTimeout(() => {
      if (!userPaused && (bgMusic.paused || bgMusic.muted)) attemptPlay();
    }, 400);
  }

  musicToggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!bgMusic.paused && !bgMusic.muted) {
      playToken += 1;
      userPaused = true;
      waitingToUnmute = false;
      bgMusic.pause();
      bgMusic.muted = false;
      persistMusicState();
      updateMusicButton();
      removeUnlockListeners();
      return;
    }

    userPaused = false;
    waitingToUnmute = false;
    bgMusic.muted = false;
    bgMusic.volume = TARGET_VOLUME;
    attemptPlay().then((started) => {
      if (started || !userPaused) persistMusicState();
    });
  });

  bgMusic.addEventListener('play', updateMusicButton);
  bgMusic.addEventListener('pause', updateMusicButton);
  bgMusic.addEventListener('volumechange', updateMusicButton);

  bgMusic.addEventListener('timeupdate', () => {
    if (!bgMusic.paused && !userPaused) maybePersistPlaybackTime();
  });

  window.addEventListener('pagehide', persistMusicState);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') persistMusicState();
    if (document.visibilityState === 'visible' && !userPaused && (bgMusic.paused || bgMusic.muted)) {
      attemptPlay();
    }
  });

  window.addEventListener('pageshow', () => {
    if (userPaused) {
      updateMusicButton();
      return;
    }
    restoreSavedTime();
    attemptPlay();
  });

  document.addEventListener(
    'click',
    (e) => {
      const link = e.target.closest('a[href]');
      if (!link || userPaused) return;
      const href = link.getAttribute('href') || '';
      if (!href || href.startsWith('#') || link.hasAttribute('data-resume-trigger')) return;
      persistMusicState();
    },
    true
  );

  updateMusicButton();
  startPlaybackFlow();
})();
