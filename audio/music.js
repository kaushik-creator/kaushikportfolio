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
  const UNLOCK_EVENTS = ['pointerdown', 'click', 'keydown', 'touchstart', 'scroll'];

  bgMusic.volume = 0.45;
  let userPaused = false;
  let lastSavedAt = 0;
  let unlockListenersBound = false;
  let unlockHandler = null;

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

  function updateMusicButton() {
    const playing = !bgMusic.paused && !bgMusic.ended;
    musicToggle.setAttribute('aria-pressed', playing ? 'true' : 'false');
    musicToggle.setAttribute('aria-label', playing ? 'Pause background music' : 'Play background music');
    if (iconPause) iconPause.hidden = !playing;
    if (iconPlay) iconPlay.hidden = playing;
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
      document.removeEventListener(eventName, unlockHandler, { capture: true });
    });
    unlockHandler = null;
  }

  function bindUnlockListeners() {
    if (unlockListenersBound || userPaused) return;
    unlockListenersBound = true;

    unlockHandler = () => {
      if (userPaused) return;
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

    return bgMusic.play()
      .then(() => {
        markUnlocked();
        updateMusicButton();
        persistMusicState();
        removeUnlockListeners();
        return true;
      })
      .catch(() => {
        updateMusicButton();
        bindUnlockListeners();
        return false;
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

    if (bgMusic.readyState >= 1) {
      run();
      return;
    }

    bgMusic.addEventListener('loadedmetadata', run, { once: true });
    attemptPlay();
  }

  musicToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (bgMusic.paused) {
      userPaused = false;
      attemptPlay().then(() => persistMusicState());
    } else {
      userPaused = true;
      bgMusic.pause();
      persistMusicState();
      updateMusicButton();
    }
  });

  bgMusic.addEventListener('play', () => {
    updateMusicButton();
    persistMusicState();
  });

  bgMusic.addEventListener('pause', () => {
    updateMusicButton();
    if (userPaused) persistMusicState();
  });

  bgMusic.addEventListener('timeupdate', () => {
    if (!bgMusic.paused && !userPaused) maybePersistPlaybackTime();
  });

  window.addEventListener('pagehide', persistMusicState);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') persistMusicState();
    if (document.visibilityState === 'visible' && !userPaused && bgMusic.paused) {
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

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link || userPaused) return;
    const href = link.getAttribute('href') || '';
    if (!href || href.startsWith('#') || link.hasAttribute('data-resume-trigger')) return;
    persistMusicState();
  }, true);

  startPlaybackFlow();
})();
