(function () {
  var THEME_KEY = 'portfolio_theme';
  var toggle = document.getElementById('themeToggle');
  var html = document.documentElement;
  var body = document.body;

  function persist(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (_) {}
  }

  function apply(isLight) {
    html.dataset.theme = isLight ? 'light' : 'dark';
    html.style.colorScheme = isLight ? 'light' : 'dark';
    if (body) body.classList.toggle('light-mode', isLight);
    persist(isLight ? 'light' : 'dark');
  }

  function savedTheme() {
    try {
      var t = localStorage.getItem(THEME_KEY);
      if (t === 'light' || t === 'dark') return t;
    } catch (_) {}
    return null;
  }

  var initial = savedTheme() || 'light';
  apply(initial === 'light');

  if (!toggle) return;

  toggle.addEventListener('click', function () {
    var nextLight = html.dataset.theme !== 'light';

    if (typeof getCanvasColor === 'function' && html.classList) {
      var rect = toggle.getBoundingClientRect();
      html.style.setProperty('--reveal-x', rect.left + rect.width / 2 + 'px');
      html.style.setProperty('--reveal-y', rect.top + rect.height / 2 + 'px');
      html.style.setProperty('--theme-prev-canvas', getCanvasColor());

      apply(nextLight);

      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        html.classList.add('theme-transitioning');
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            html.classList.add('theme-reveal');
          });
        });
        window.setTimeout(function () {
          html.classList.remove('theme-transitioning', 'theme-reveal');
          html.style.removeProperty('--theme-prev-canvas');
        }, 520);
      }
      return;
    }

    apply(nextLight);
  });
})();
