(function(){
  function getTheme(){
    try {
      var ls = localStorage.getItem('portfolio_theme');
      if (ls === 'light' || ls === 'dark') return ls;
    } catch (_) {}
    var m = document.cookie.match(/theme=(light|dark)/);
    return m ? m[1] : 'light';
  }
  function apply(t){
    document.documentElement.setAttribute('data-theme', t);
    document.documentElement.style.colorScheme = t;
    if (document.body) document.body.classList.toggle('light-mode', t === 'light');
    var sun = document.getElementById('themeIconSun'), moon = document.getElementById('themeIconMoon');
    if (sun && moon) {
      sun.style.display = t === 'dark' ? 'none' : 'block';
      moon.style.display = t === 'dark' ? 'block' : 'none';
    }
  }
  function persist(t){
    document.cookie = 'theme=' + t + ';path=/;max-age=31536000';
    try { localStorage.setItem('portfolio_theme', t); } catch (_) {}
  }
  apply(getTheme());
  var tb = document.getElementById('themeToggle');
  if (tb) tb.addEventListener('click', function(){
    var next = (document.documentElement.getAttribute('data-theme') === 'dark') ? 'light' : 'dark';
    persist(next);
    apply(next);
  });
  var nt = document.getElementById('navToggle'), nav = document.getElementById('nav');
  if (nt && nav) nt.addEventListener('click', function(){ nav.classList.toggle('open'); });
})();
