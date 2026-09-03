(function () {
  const SECTION = document.querySelector(".fav-media");
  if (!SECTION) return;

  const GRID = SECTION.querySelector(".fav-media__grid");
  const FILTERS = SECTION.querySelector(".fav-media__filters");
  const SIDEBAR = SECTION.querySelector(".fav-media__sidebar");
  const SEARCH = SECTION.querySelector(".fav-media__search");
  const EMPTY = SECTION.querySelector(".fav-media__empty");
  if (!GRID || !FILTERS) return;

  const CACHE = "20260903favmedia27";

  const SERIES = [
    { file: "big-bang-theory.png", alt: "The Big Bang Theory", year: "2007", lang: "English", genres: ["Comedy"] },
    { file: "how-i-met-your-mother.png", alt: "How I Met Your Mother", year: "2005", lang: "English", genres: ["Comedy", "Romance"] },
    { file: "friends.png", alt: "Friends", year: "1994", lang: "English", genres: ["Comedy", "Romance"] },
    { file: "silicon-valley.png", alt: "Silicon Valley", year: "2014", lang: "English", genres: ["Comedy"] },
    { file: "squid-game.png", alt: "Squid Game", year: "2021", lang: "Korean", genres: ["Thriller", "Drama", "Mystery"] },
    { file: "black-mirror.png", alt: "Black Mirror", year: "2011", lang: "English", genres: ["Science Fiction", "Thriller", "Drama"] },
    { file: "family-guy.png", alt: "Family Guy", year: "1999", lang: "English", genres: ["Comedy"] },
    { file: "galactik-football.png", alt: "Galactik Football", year: "2006", lang: "English", genres: ["Adventure", "Science Fiction"] },
    { file: "dragon-booster.png", alt: "Dragon Booster", year: "2004", lang: "English", genres: ["Adventure", "Action"] },
    { file: "kick-buttowski.png", alt: "Kick Buttowski", year: "2010", lang: "English", genres: ["Comedy", "Adventure"] },
  ];

  const MOVIES = [
    { file: "12-angry-men.png", alt: "12 Angry Men", year: "1957", lang: "English", genres: ["Drama", "Crime"] },
    { file: "mozhi.png", alt: "Mozhi", year: "2007", lang: "Tamil", genres: ["Romance", "Drama"] },
    { file: "her.png", alt: "Her", year: "2013", lang: "English", genres: ["Romance", "Science Fiction", "Drama"] },
    { file: "the-lunchbox.png", alt: "The Lunchbox", year: "2013", lang: "Hindi", genres: ["Romance", "Drama"] },
    { file: "jojo-rabbit.png", alt: "Jojo Rabbit", year: "2019", lang: "English", genres: ["Comedy", "Drama"] },
    { file: "life-is-beautiful.png", alt: "Life Is Beautiful", year: "1997", lang: "Italian", genres: ["Comedy", "Drama", "Romance"] },
    { file: "life-of-pi.png", alt: "Life of Pi", year: "2012", lang: "English", genres: ["Adventure", "Drama", "Fantasy"] },
    { file: "the-namesake.png", alt: "The Namesake", year: "2006", lang: "English", genres: ["Drama"] },
    { file: "amazing-spider-man.png", alt: "The Amazing Spider-Man", year: "2012", lang: "English", genres: ["Action", "Adventure", "Science Fiction"] },
    { file: "tamasha.png", alt: "Tamasha", year: "2015", lang: "Hindi", genres: ["Romance", "Drama", "Comedy"] },
    { file: "naanum-rowdy-dhaan.png", alt: "Naanum Rowdy Dhaan", year: "2015", lang: "Tamil", genres: ["Comedy", "Romance", "Action"] },
    { file: "madras-matinee.png", alt: "Madras Matinee", year: "2025", lang: "Tamil", genres: ["Drama", "Romance"] },
    { file: "oh-my-kadavule.png", alt: "Oh My Kadavule", year: "2020", lang: "Tamil", genres: ["Romance", "Comedy", "Fantasy"] },
    { file: "sila-nerangalil-sila-manidhargal.png", alt: "Sila Nerangalil Sila Manidhargal", year: "2022", lang: "Tamil", genres: ["Drama"] },
    { file: "yaaradi-nee-mohini.png", alt: "Yaaradi Nee Mohini", year: "2008", lang: "Tamil", genres: ["Romance", "Comedy"] },
    { file: "the-intern.png", alt: "The Intern", year: "2015", lang: "English", genres: ["Comedy", "Drama"] },
    { file: "free-guy.png", alt: "Free Guy", year: "2021", lang: "English", genres: ["Action", "Comedy", "Science Fiction"] },
    { file: "aandavan-kattalai.png", alt: "Aandavan Kattalai", year: "2016", lang: "Tamil", genres: ["Comedy", "Drama"] },
    { file: "nitham-oru-vaanam.png", alt: "Nitham Oru Vaanam", year: "2022", lang: "Tamil", genres: ["Drama"] },
    { file: "tourist-family.png", alt: "Tourist Family", year: "2025", lang: "Tamil", genres: ["Comedy", "Drama"] },
    { file: "avatar.png", alt: "Avatar", year: "2009", lang: "English", genres: ["Action", "Adventure", "Science Fiction", "Fantasy"] },
    { file: "inside-out.png", alt: "Inside Out", year: "2015", lang: "English", genres: ["Comedy", "Adventure", "Fantasy"] },
    { file: "kaaka-muttai.png", alt: "Kaaka Muttai", year: "2015", lang: "Tamil", genres: ["Comedy", "Drama"] },
    { file: "dragon.png", alt: "Dragon", year: "2025", lang: "Tamil", genres: ["Action", "Drama"] },
    { file: "chronicles-of-narnia.png", alt: "The Chronicles of Narnia: The Lion, the Witch and the Wardrobe", year: "2005", lang: "English", genres: ["Adventure", "Fantasy"] },
    { file: "dharma-durai.png", alt: "Dharma Durai", year: "2016", lang: "Tamil", genres: ["Drama", "Comedy"] },
    { file: "raanjhanaa.png", alt: "Raanjhanaa", year: "2013", lang: "Hindi", genres: ["Romance", "Drama"] },
    { file: "kandukondain-kandukondain.png", alt: "Kandukondain Kandukondain", year: "2000", lang: "Tamil", genres: ["Romance", "Drama"] },
    { file: "yeh-jawaani-hai-deewani.png", alt: "Yeh Jawaani Hai Deewani", year: "2013", lang: "Hindi", genres: ["Romance", "Drama", "Comedy"] },
    { file: "my-name-is-khan.png", alt: "My Name Is Khan", year: "2010", lang: "Hindi", genres: ["Drama", "Romance"] },
    { file: "3-idiots.png", alt: "3 Idiots", year: "2009", lang: "Hindi", genres: ["Comedy", "Drama"] },
    { file: "taare-zameen-par.png", alt: "Taare Zameen Par", year: "2007", lang: "Hindi", genres: ["Drama"] },
    { file: "barfi.png", alt: "Barfi!", year: "2012", lang: "Hindi", genres: ["Romance", "Comedy", "Drama"] },
    { file: "boy-in-the-striped-pajamas.png", alt: "The Boy in the Striped Pajamas", year: "2008", lang: "English", genres: ["Drama"] },
    { file: "schindlers-list.png", alt: "Schindler's List", year: "1993", lang: "English", genres: ["Drama"] },
    { file: "hacksaw-ridge.png", alt: "Hacksaw Ridge", year: "2016", lang: "English", genres: ["Action", "Drama"] },
    { file: "vaaranam-aayiram.png", alt: "Vaaranam Aayiram", year: "2008", lang: "Tamil", genres: ["Romance", "Drama", "Action"] },
    { file: "j-baby.png", alt: "J.Baby", year: "2024", lang: "Tamil", genres: ["Drama", "Comedy"] },
    { file: "naduvula-konjam-pakkatha-kaanom.png", alt: "Naduvula Konjam Pakkatha Kaanom", year: "2012", lang: "Tamil", genres: ["Comedy", "Drama"] },
    { file: "gandhi-talks.png", alt: "Gandhi Talks", year: "2026", lang: "Tamil", genres: ["Drama", "Comedy"] },
    { file: "pesum-padam.png", alt: "Pesum Padam", year: "1987", lang: "Tamil", genres: ["Comedy"] },
    { file: "pk.png", alt: "PK", year: "2014", lang: "Hindi", genres: ["Comedy", "Drama", "Science Fiction"] },
    { file: "kumbalangi-nights.png", alt: "Kumbalangi Nights", year: "2019", lang: "Malayalam", genres: ["Drama", "Comedy"] },
    { file: "bangalore-days.png", alt: "Bangalore Days", year: "2014", lang: "Malayalam", genres: ["Romance", "Drama", "Comedy"] },
    { file: "njan-prakashan.png", alt: "Njan Prakashan", year: "2018", lang: "Malayalam", genres: ["Comedy", "Drama"] },
    { file: "va-quarter-cutting.png", alt: "Va Quarter Cutting", year: "2010", lang: "Tamil", genres: ["Comedy"] },
    { file: "chennai-600028.png", alt: "Chennai 600028", year: "2007", lang: "Tamil", genres: ["Comedy", "Drama"] },
    { file: "peranbu.png", alt: "Peranbu", year: "2018", lang: "Tamil", genres: ["Drama"] },
    { file: "thanga-meenkal.png", alt: "Thanga Meenkal", year: "2013", lang: "Tamil", genres: ["Drama"] },
    { file: "maaveeran.png", alt: "Maaveeran", year: "2023", lang: "Tamil", genres: ["Action", "Comedy", "Fantasy"] },
    { file: "mandela.png", alt: "Mandela", year: "2021", lang: "Tamil", genres: ["Comedy", "Drama"] },
    { file: "monster.png", alt: "Monster", year: "2019", lang: "Tamil", genres: ["Comedy", "Thriller"] },
    { file: "sarpatta-parambarai.png", alt: "Sarpatta Parambarai", year: "2021", lang: "Tamil", genres: ["Action", "Drama"] },
    { file: "queen.png", alt: "Queen", year: "2014", lang: "Hindi", genres: ["Comedy", "Drama"] },
  ];

  const LANGS = ["English", "Tamil", "Hindi", "Malayalam", "Korean", "Italian"];
  const DECADES = [
    { id: "2020s", label: "2020s", min: 2020, max: 2029 },
    { id: "2010s", label: "2010s", min: 2010, max: 2019 },
    { id: "2000s", label: "2000s", min: 2000, max: 2009 },
    { id: "1990s", label: "1990s", min: 1990, max: 1999 },
    { id: "1980s", label: "1980s", min: 1980, max: 1989 },
    { id: "older", label: "Older", min: 0, max: 1979 },
  ];
  const GENRES = [
    "Action", "Thriller", "Drama", "Science Fiction", "Comedy",
    "Adventure", "Crime", "Romance", "Mystery", "Fantasy",
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
  const state = {
    kind: "all",
    query: "",
    langs: new Set(),
    decades: new Set(),
    genres: new Set(),
  };

  function decadeOf(yearStr) {
    const y = parseInt(yearStr, 10);
    if (!y) return null;
    for (let i = 0; i < DECADES.length; i++) {
      const d = DECADES[i];
      if (y >= d.min && y <= d.max) return d.id;
    }
    return null;
  }

  function matches(item) {
    if (state.kind !== "all" && item.kind !== state.kind) return false;

    if (state.query) {
      const q = state.query;
      if (item.alt.toLowerCase().indexOf(q) === -1) return false;
    }

    if (state.langs.size && !state.langs.has(item.lang)) return false;

    if (state.decades.size) {
      const id = decadeOf(item.year);
      if (!id || !state.decades.has(id)) return false;
    }

    if (state.genres.size) {
      const has = (item.genres || []).some(function (g) {
        return state.genres.has(g);
      });
      if (!has) return false;
    }

    return true;
  }

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

    const poster = document.createElement("a");
    poster.className = "fav-media__poster";
    poster.href = item.url;
    poster.target = "_blank";
    poster.rel = "noopener noreferrer";
    poster.title = "Open on YouTube";
    poster.setAttribute("aria-label", item.alt + " on YouTube");

    const img = document.createElement("img");
    img.src = "images/fav-media/" + item.file + "?v=" + CACHE;
    img.alt = "";
    img.loading = "lazy";
    img.decoding = "async";
    img.width = 300;
    img.height = 450;
    poster.appendChild(img);

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
    fig.appendChild(poster);
    fig.appendChild(cap);
    return fig;
  }

  function render() {
    GRID.textContent = "";
    let shown = 0;
    ORDER.forEach(function (item) {
      if (!matches(item)) return;
      GRID.appendChild(buildItem(item));
      shown += 1;
    });
    if (EMPTY) EMPTY.hidden = shown > 0;
    GRID.hidden = shown === 0;
  }

  function chip(label, pressed) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "fav-chip" + (pressed ? " is-active" : "");
    btn.textContent = label;
    btn.setAttribute("aria-pressed", pressed ? "true" : "false");
    return btn;
  }

  function syncChip(btn, on) {
    btn.classList.toggle("is-active", on);
    btn.setAttribute("aria-pressed", on ? "true" : "false");
  }

  function buildSidebar() {
    if (!SIDEBAR) return;

    const langGroup = SIDEBAR.querySelector('[data-filter-group="lang"]');
    const yearGroup = SIDEBAR.querySelector('[data-filter-group="year"]');
    const genreGroup = SIDEBAR.querySelector('[data-filter-group="genre"]');

    if (langGroup) {
      LANGS.forEach(function (lang) {
        const btn = chip(lang, false);
        btn.dataset.value = lang;
        btn.addEventListener("click", function () {
          if (state.langs.has(lang)) state.langs.delete(lang);
          else state.langs.add(lang);
          syncChip(btn, state.langs.has(lang));
          render();
        });
        langGroup.appendChild(btn);
      });
    }

    if (yearGroup) {
      DECADES.forEach(function (d) {
        const btn = chip(d.label, false);
        btn.dataset.value = d.id;
        btn.addEventListener("click", function () {
          if (state.decades.has(d.id)) state.decades.delete(d.id);
          else state.decades.add(d.id);
          syncChip(btn, state.decades.has(d.id));
          render();
        });
        yearGroup.appendChild(btn);
      });
    }

    if (genreGroup) {
      GENRES.forEach(function (g) {
        const btn = chip(g, false);
        btn.dataset.value = g;
        btn.addEventListener("click", function () {
          if (state.genres.has(g)) state.genres.delete(g);
          else state.genres.add(g);
          syncChip(btn, state.genres.has(g));
          render();
        });
        genreGroup.appendChild(btn);
      });
    }
  }

  FILTERS.addEventListener("click", function (e) {
    const btn = e.target.closest("[data-kind]");
    if (!btn || !FILTERS.contains(btn)) return;
    state.kind = btn.getAttribute("data-kind") || "all";
    FILTERS.querySelectorAll("[data-kind]").forEach(function (el) {
      const on = el === btn;
      el.classList.toggle("active", on);
      el.setAttribute("aria-selected", on ? "true" : "false");
    });
    render();
  });

  if (SEARCH) {
    SEARCH.addEventListener("input", function () {
      state.query = (SEARCH.value || "").trim().toLowerCase();
      render();
    });
  }

  buildSidebar();
  setCounts();
  render();
})();
