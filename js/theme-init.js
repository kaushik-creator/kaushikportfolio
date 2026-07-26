(function () {
  try {
    var t = localStorage.getItem('portfolio_theme');
    if (t === 'light' || t === 'dark') {
      document.documentElement.dataset.theme = t;
      document.documentElement.style.colorScheme = t;
      if (document.body) {
        document.body.classList.toggle('light-mode', t === 'light');
      }
    }
  } catch (_) {}
})();
