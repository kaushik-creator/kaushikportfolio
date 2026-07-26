(function () {
  try {
    var t = localStorage.getItem('portfolio_theme');
    if (t === 'light' || t === 'dark') {
      document.documentElement.dataset.theme = t;
      document.documentElement.style.colorScheme = t;
    }
  } catch (_) {}
})();
