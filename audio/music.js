(function () {
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  if (!bgMusic || !musicToggle) return;

  const iconPause = document.getElementById('musicIconPause');
  const iconPlay = document.getElementById('musicIconPlay');
  const MUSIC_PREF_KEY = 'portfolio_music_paused';
  const MUSIC_TIME_KEY = 'portfolio_music_time';
  const MUSIC_SRC_KEY = 'portfolio_music_src';
  const MUSIC_SRC_ID = 'bittersweet-v20260724';

  bgMusic.volume = 0.45;
  let userPaused = false;
  let lastSavedAt = 0;

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

  function maybePersistPlaybackTime() {
    if (Date.now() - lastSavedAt < 1000) return;
    persistMusicState();
  }

  function updateMusicButton() {
    const playing = !bgMusic.paused;
    musicToggle.setAttribute('aria-pressed', playing ? 'true' : 'false');
    musicToggle.setAttribute('aria-label', playing ? 'Pause background music' : 'Play background music');
    if (iconPause) iconPause.hidden = !playing;
    if (iconPlay) iconPlay.hidden = playing;
  }

  musicToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (bgMusic.paused) {
      userPaused = false;
      bgMusic.play().catch(() => {});
    } else {
      userPaused = true;
      bgMusic.pause();
    }
    persistMusicState();
    updateMusicButton();
  });

  bgMusic.addEventListener('play', () => {
    updateMusicButton();
    persistMusicState();
  });
  bgMusic.addEventListener('pause', () => {
    updateMusicButton();
    persistMusicState();
  });
  bgMusic.addEventListener('timeupdate', () => {
    if (!bgMusic.paused && !userPaused) maybePersistPlaybackTime();
  });
  window.addEventListener('pagehide', persistMusicState);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') persistMusicState();
  });

  function tryAutoPlay() {
    if (userPaused) {
      updateMusicButton();
      return;
    }
    bgMusic.play().then(() => updateMusicButton()).catch(() => updateMusicButton());
  }

  tryAutoPlay();
  window.addEventListener('pageshow', tryAutoPlay);
  window.addEventListener('focus', tryAutoPlay);
  document.addEventListener('pointerdown', (e) => {
    if (musicToggle.contains(e.target)) return;
    if (userPaused) return;
    if (bgMusic.paused) bgMusic.play().catch(() => {});
  }, { once: true });
})();
