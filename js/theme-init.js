(function () {
  try {
    var t = 'light';
    var ls = localStorage.getItem('portfolio_theme');
    var m = document.cookie.match(/theme=(light|dark)/);
    // Prefer an explicit saved choice; otherwise always light
    if (ls === 'light' || ls === 'dark') t = ls;
    else if (m) t = m[1];
    document.documentElement.dataset.theme = t;
    document.documentElement.style.colorScheme = t;
    if (document.body) {
      document.body.classList.toggle('light-mode', t === 'light');
    }
  } catch (_) {
    document.documentElement.dataset.theme = 'light';
    document.documentElement.style.colorScheme = 'light';
  }
})();
