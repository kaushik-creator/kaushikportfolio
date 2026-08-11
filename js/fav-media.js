(function () {
  const ROOT = document.querySelector(".fav-media__marquee");
  if (!ROOT) return;

  const TRACK = ROOT.querySelector(".marquee__track");
  if (!TRACK) return;

  const CACHE = "20260811favmedia6";
  const SERIES = [
    { file: "big-bang-theory.png", alt: "The Big Bang Theory" },
    { file: "how-i-met-your-mother.png", alt: "How I Met Your Mother" },
    { file: "friends.png", alt: "Friends" },
    { file: "silicon-valley.png", alt: "Silicon Valley" },
    { file: "squid-game.png", alt: "Squid Game" },
    { file: "black-mirror.png", alt: "Black Mirror" },
  ];
  const MOVIES = [
    { file: "12-angry-men.png", alt: "12 Angry Men" },
    { file: "mozhi.png", alt: "Mozhi" },
    { file: "her.png", alt: "Her" },
    { file: "the-lunchbox.png", alt: "The Lunchbox" },
    { file: "jojo-rabbit.png", alt: "Jojo Rabbit" },
    { file: "life-is-beautiful.png", alt: "Life Is Beautiful" },
    { file: "life-of-pi.png", alt: "Life of Pi" },
    { file: "the-namesake.png", alt: "The Namesake" },
    { file: "amazing-spider-man.png", alt: "The Amazing Spider-Man" },
    { file: "tamasha.png", alt: "Tamasha" },
    { file: "naanum-rowdy-dhaan.png", alt: "Naanum Rowdy Dhaan" },
  ];

  function shuffle(list) {
    const arr = list.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  /** Series never adjacent, including wrap (loop seam). */
  function interleaveNoAdjacentSeries(movies, series) {
    const m = shuffle(movies);
    const s = shuffle(series);
    const n = m.length + s.length;
    const k = s.length;

    function isValid(positions) {
      const sorted = positions.slice().sort(function (a, b) {
        return a - b;
      });
      for (let i = 0; i < sorted.length - 1; i++) {
        if (sorted[i + 1] === sorted[i] + 1) return false;
      }
      if (sorted.length > 1 && sorted[0] === 0 && sorted[sorted.length - 1] === n - 1) {
        return false;
      }
      return true;
    }

    let positions = null;
    for (let attempt = 0; attempt < 400; attempt++) {
      const candidate = shuffle(
        Array.from({ length: n }, function (_, i) {
          return i;
        })
      ).slice(0, k);
      if (isValid(candidate)) {
        positions = candidate;
        break;
      }
    }

    if (!positions) {
      positions = [];
      for (let i = 0; i < k; i++) {
        positions.push(Math.min(n - 1, 1 + Math.floor((i * n) / k)));
      }
      positions = positions.filter(function (p, idx, arr) {
        return arr.indexOf(p) === idx;
      });
    }

    const seriesSet = new Set(positions);
    const out = new Array(n);
    let mi = 0;
    let si = 0;
    for (let i = 0; i < n; i++) {
      out[i] = seriesSet.has(i) ? s[si++] : m[mi++];
    }
    return out;
  }

  function posterEl(item, hidden) {
    const img = document.createElement("img");
    img.className = "fav-media__poster";
    img.src = "images/fav-media/" + item.file + "?v=" + CACHE;
    img.alt = hidden ? "" : item.alt;
    img.height = 200;
    img.loading = "lazy";
    img.decoding = "async";
    if (hidden) img.setAttribute("aria-hidden", "true");
    img.dataset.kind = SERIES.some(function (s) {
      return s.file === item.file;
    })
      ? "series"
      : "movie";
    return img;
  }

  const order = interleaveNoAdjacentSeries(MOVIES, SERIES);
  TRACK.textContent = "";
  order.forEach(function (item) {
    TRACK.appendChild(posterEl(item, false));
  });
  // Duplicate for seamless loop
  order.forEach(function (item) {
    TRACK.appendChild(posterEl(item, true));
  });

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let offset = 0;
  let half = 0;
  let raf = 0;
  let last = 0;
  let dragging = false;
  let dragX = 0;
  const AUTO_PX_PER_MS = reduceMotion ? 0 : 0.045; // ~45px/s
  const WHEEL_BOOST = 3.2;

  function measure() {
    half = TRACK.scrollWidth / 2;
  }

  function wrapOffset() {
    if (half <= 0) return;
    offset = ((offset % half) + half) % half;
  }

  function paint() {
    TRACK.style.transform = "translate3d(" + -offset + "px,0,0)";
  }

  function tick(now) {
    if (!last) last = now;
    const dt = Math.min(48, now - last);
    last = now;
    if (!ROOT.matches(":hover") && !dragging) {
      offset += AUTO_PX_PER_MS * dt;
      wrapOffset();
      paint();
    }
    raf = requestAnimationFrame(tick);
  }

  function applyDelta(dx) {
    offset += dx;
    wrapOffset();
    paint();
  }

  // Fast horizontal scrub — trackpad / shift+wheel / touch — no native scrollbar
  ROOT.addEventListener(
    "wheel",
    function (e) {
      const dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : 0;
      if (!dx) return;
      e.preventDefault();
      applyDelta(dx * WHEEL_BOOST);
    },
    { passive: false }
  );

  ROOT.addEventListener(
    "pointerdown",
    function (e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      dragging = true;
      dragX = e.clientX;
      ROOT.setPointerCapture(e.pointerId);
      ROOT.classList.add("is-dragging");
    },
    { passive: true }
  );
  ROOT.addEventListener(
    "pointermove",
    function (e) {
      if (!dragging) return;
      const dx = dragX - e.clientX;
      dragX = e.clientX;
      applyDelta(dx * 1.35);
    },
    { passive: true }
  );
  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    ROOT.classList.remove("is-dragging");
    try {
      ROOT.releasePointerCapture(e.pointerId);
    } catch (_) {}
  }
  ROOT.addEventListener("pointerup", endDrag);
  ROOT.addEventListener("pointercancel", endDrag);

  // Kill CSS animation — JS owns motion
  TRACK.style.animation = "none";

  measure();
  paint();
  window.addEventListener("resize", function () {
    measure();
    wrapOffset();
    paint();
  });
  // Images may load and change width
  TRACK.querySelectorAll("img").forEach(function (img) {
    if (img.complete) return;
    img.addEventListener("load", function () {
      measure();
      wrapOffset();
      paint();
    });
  });

  raf = requestAnimationFrame(tick);
})();
