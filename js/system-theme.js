(function(){
  function getTheme(){ var m=document.cookie.match(/theme=(light|dark)/); return m?m[1]:'light'; }
  function apply(t){
    document.documentElement.setAttribute('data-theme', t);
    var sun=document.getElementById('themeIconSun'), moon=document.getElementById('themeIconMoon');
    if(sun&&moon){ sun.style.display = t==='dark'?'none':'block'; moon.style.display = t==='dark'?'block':'none'; }
  }
  apply(getTheme());
  var tb=document.getElementById('themeToggle');
  if(tb) tb.addEventListener('click', function(){
    var next = (document.documentElement.getAttribute('data-theme')==='dark')?'light':'dark';
    document.cookie='theme='+next+';path=/;max-age=31536000'; apply(next);
  });
  var nt=document.getElementById('navToggle'), nav=document.getElementById('nav');
  if(nt&&nav) nt.addEventListener('click', function(){ nav.classList.toggle('open'); });
})();
