(function () {
  const targets = [];
  const pageTitle = document.querySelector('.page-intro > h1');
  if (pageTitle) targets.push(pageTitle);
  document.querySelectorAll('[data-title-scramble]').forEach(function (el) {
    if (targets.indexOf(el) === -1) targets.push(el);
  });
  if (!targets.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const DURATION_MS = 350;
  const FRAME_MS = 40;

  function randomGlyph() {
    return GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));
  }

  function scrambleEl(el) {
    const finalText = (el.getAttribute('data-title') || el.textContent || '').trim();
    if (!finalText) return;

    el.setAttribute('aria-label', finalText);

    if (reduceMotion) {
      el.textContent = finalText;
      return;
    }

    const start = performance.now();

    function scrambleFrame(now) {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / DURATION_MS);
      const revealCount = Math.floor(progress * finalText.length);

      let out = '';
      for (let i = 0; i < finalText.length; i++) {
        const ch = finalText.charAt(i);
        if (ch === ' ' || ch === '\u00a0') {
          out += ' ';
        } else if (i < revealCount) {
          out += ch;
        } else {
          out += randomGlyph();
        }
      }

      el.textContent = out;

      if (progress < 1) {
        window.setTimeout(function () {
          scrambleFrame(performance.now());
        }, FRAME_MS);
      } else {
        el.textContent = finalText;
      }
    }

    el.textContent = finalText
      .split('')
      .map(function (ch) {
        return ch === ' ' || ch === '\u00a0' ? ' ' : randomGlyph();
      })
      .join('');

    scrambleFrame(start);
  }

  targets.forEach(scrambleEl);
})();
