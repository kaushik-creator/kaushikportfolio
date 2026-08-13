(function () {
  const SECTION = document.querySelector(".fav-media");
  if (!SECTION) return;

  const GRID = SECTION.querySelector(".fav-media__grid");
  const FILTERS = SECTION.querySelector(".fav-media__filters");
  if (!GRID || !FILTERS) return;

  const CACHE = "20260813favmedia16";
  const SERIES = [
    { file: "big-bang-theory.png", alt: "The Big Bang Theory", year: "2007" },
    { file: "how-i-met-your-mother.png", alt: "How I Met Your Mother", year: "2005" },
    { file: "friends.png", alt: "Friends", year: "1994" },
    { file: "silicon-valley.png", alt: "Silicon Valley", year: "2014" },
    { file: "squid-game.png", alt: "Squid Game", year: "2021" },
    { file: "black-mirror.png", alt: "Black Mirror", year: "2011" },
    { file: "family-guy.png", alt: "Family Guy", year: "1999" },
    { file: "galactik-football.png", alt: "Galactik Football", year: "2006" },
    { file: "dragon-booster.png", alt: "Dragon Booster", year: "2004" },
    { file: "kick-buttowski.png", alt: "Kick Buttowski", year: "2010" },
  ];
  const MOVIES = [
    { file: "12-angry-men.png", alt: "12 Angry Men", year: "1957" },
    { file: "mozhi.png", alt: "Mozhi", year: "2007" },
    { file: "her.png", alt: "Her", year: "2013" },
    { file: "the-lunchbox.png", alt: "The Lunchbox", year: "2013" },
    { file: "jojo-rabbit.png", alt: "Jojo Rabbit", year: "2019" },
    { file: "life-is-beautiful.png", alt: "Life Is Beautiful", year: "1997" },
    { file: "life-of-pi.png", alt: "Life of Pi", year: "2012" },
    { file: "the-namesake.png", alt: "The Namesake", year: "2006" },
    { file: "amazing-spider-man.png", alt: "The Amazing Spider-Man", year: "2012" },
    { file: "tamasha.png", alt: "Tamasha", year: "2015" },
    { file: "naanum-rowdy-dhaan.png", alt: "Naanum Rowdy Dhaan", year: "2015" },
    { file: "madras-matinee.png", alt: "Madras Matinee", year: "2025" },
    { file: "oh-my-kadavule.png", alt: "Oh My Kadavule", year: "2020" },
    { file: "sila-nerangalil-sila-manidhargal.png", alt: "Sila Nerangalil Sila Manidhargal", year: "2022" },
    { file: "yaaradi-nee-mohini.png", alt: "Yaaradi Nee Mohini", year: "2008" },
    { file: "the-intern.png", alt: "The Intern", year: "2015" },
    { file: "free-guy.png", alt: "Free Guy", year: "2021" },
    { file: "aandavan-kattalai.png", alt: "Aandavan Kattalai", year: "2016" },
    { file: "nitham-oru-vaanam.png", alt: "Nitham Oru Vaanam", year: "2022" },
    { file: "tourist-family.png", alt: "Tourist Family", year: "2025" },
    { file: "avatar.png", alt: "Avatar", year: "2009" },
    { file: "inside-out.png", alt: "Inside Out", year: "2015" },
    { file: "kaaka-muttai.png", alt: "Kaaka Muttai", year: "2015" },
  ];

  function ytSearch(title, kind) {
    const q = kind === "series" ? title + " TV series" : title + " film";
    return "https://www.youtube.com/results?search_query=" + encodeURIComponent(q);
  }

  function googleSearch(title, kind) {
    const q = kind === "series" ? title + " TV series" : title + " movie";
    return "https://www.google.com/search?q=" + encodeURIComponent(q);
  }

  const ALL = MOVIES.map(function (item) {
    return Object.assign({}, item, {
      kind: "movie",
      url: item.url || ytSearch(item.alt, "movie"),
      google: googleSearch(item.alt, "movie"),
    });
  }).concat(
    SERIES.map(function (item) {
      return Object.assign({}, item, {
        kind: "series",
        url: item.url || ytSearch(item.alt, "series"),
        google: googleSearch(item.alt, "series"),
      });
    })
  );

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

  const ORDER = shuffle(ALL);
  let active = "all";

  function setCounts() {
    const movieCount = MOVIES.length;
    const seriesCount = SERIES.length;
    const allBtn = FILTERS.querySelector('[data-kind="all"]');
    const movieBtn = FILTERS.querySelector('[data-kind="movie"]');
    const seriesBtn = FILTERS.querySelector('[data-kind="series"]');
    if (allBtn) allBtn.textContent = "All · " + (movieCount + seriesCount);
    if (movieBtn) movieBtn.textContent = "Movies · " + movieCount;
    if (seriesBtn) seriesBtn.textContent = "Series · " + seriesCount;
  }

  function buildItem(item) {
    const fig = document.createElement("figure");
    fig.className = "fav-media__item";
    fig.dataset.kind = item.kind;

    const img = document.createElement("img");
    img.src = "images/fav-media/" + item.file + "?v=" + CACHE;
    img.alt = item.alt;
    img.loading = "lazy";
    img.decoding = "async";
    img.width = 300;
    img.height = 450;

    const cap = document.createElement("figcaption");
    const title = document.createElement("a");
    title.className = "fav-media__title";
    title.href = item.url;
    title.target = "_blank";
    title.rel = "noopener noreferrer";
    title.textContent = item.alt;
    title.title = "Open on YouTube";

    const meta = document.createElement("a");
    meta.className = "fav-media__meta";
    meta.href = item.google;
    meta.target = "_blank";
    meta.rel = "noopener noreferrer";
    meta.textContent = item.year + " · " + (item.kind === "series" ? "Series" : "Film");
    meta.title = "Search on Google";

    cap.appendChild(title);
    cap.appendChild(meta);
    fig.appendChild(img);
    fig.appendChild(cap);
    return fig;
  }

  function render() {
    GRID.textContent = "";
    ORDER.forEach(function (item) {
      if (active !== "all" && item.kind !== active) return;
      GRID.appendChild(buildItem(item));
    });
  }

  FILTERS.addEventListener("click", function (e) {
    const btn = e.target.closest("[data-kind]");
    if (!btn || !FILTERS.contains(btn)) return;
    active = btn.getAttribute("data-kind") || "all";
    FILTERS.querySelectorAll("[data-kind]").forEach(function (el) {
      const on = el === btn;
      el.classList.toggle("active", on);
      el.setAttribute("aria-selected", on ? "true" : "false");
    });
    render();
  });

  setCounts();
  render();
})();
