(function () {
  const targets = [];
  const pageTitle = document.querySelector('.page-intro > h1');
  if (pageTitle) targets.push(pageTitle);
  document.querySelectorAll('[data-title-scramble]').forEach(function (el) {
    if (targets.indexOf(el) === -1) targets.push(el);
  });
  if (!targets.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const DURATION_MS = 350;
  const FRAME_MS = 40;

  function randomGlyph() {
    return GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));
  }

  function isKeepChar(ch) {
    return ch === ' ' || ch === '\u00a0' || ch === '–' || ch === '-' || ch === '—';
  }

  function scrambleEl(el, delayMs) {
    const finalText = (el.getAttribute('data-title') || el.textContent || '').trim();
    if (!finalText) return;

    el.setAttribute('aria-label', finalText);

    if (reduceMotion) {
      el.textContent = finalText;
      return;
    }

    function begin() {
      const start = performance.now();

      function scrambleFrame(now) {
        const elapsed = now - start;
        const progress = Math.min(1, elapsed / DURATION_MS);
        const revealCount = Math.floor(progress * finalText.length);

        let out = '';
        for (let i = 0; i < finalText.length; i++) {
          const ch = finalText.charAt(i);
          if (isKeepChar(ch)) {
            out += ch;
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
          return isKeepChar(ch) ? ch : randomGlyph();
        })
        .join('');

      scrambleFrame(start);
    }

    if (delayMs > 0) window.setTimeout(begin, delayMs);
    else begin();
  }

  targets.forEach(function (el, i) {
    // Slight stagger so date badges don’t all settle in lockstep
    const delay = el.classList.contains('li-date') ? 40 + i * 35 : 0;
    scrambleEl(el, delay);
  });
})();
