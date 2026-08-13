(function () {
  const SECTION = document.querySelector(".fav-youtube");
  if (!SECTION) return;

  const GRID = SECTION.querySelector(".fav-youtube__grid");
  if (!GRID) return;

  const CACHE = "20260813youtube4";
  const CHANNELS = [
    {
      file: "veritasium-logo.jpg",
      alt: "Veritasium",
      meta: "Science",
      url: "https://www.youtube.com/@veritasium",
    },
    {
      file: "mrbeast-logo.jpg",
      alt: "MrBeast",
      meta: "Entertainment",
      url: "https://www.youtube.com/@MrBeast",
    },
    {
      file: "mkbhd-logo.jpg",
      alt: "MKBHD",
      meta: "Tech",
      url: "https://www.youtube.com/@mkbhd",
    },
    {
      file: "kurzgesagt-logo.jpg",
      alt: "Kurzgesagt",
      meta: "Science",
      url: "https://www.youtube.com/@kurzgesagt",
    },
    {
      file: "alux-logo.jpg",
      alt: "Alux",
      meta: "Wealth",
      url: "https://www.youtube.com/@alux",
    },
    {
      file: "daily-dose-logo.jpg",
      alt: "Daily Dose of Internet",
      meta: "Internet",
      url: "https://www.youtube.com/@DailyDoseOfInternet",
    },
    {
      file: "what-if-logo.jpg",
      alt: "What If",
      meta: "Science",
      url: "https://www.youtube.com/@WhatIfScienceShow",
    },
    {
      file: "wsj-logo.jpg",
      alt: "The Wall Street Journal",
      meta: "News",
      url: "https://www.youtube.com/@wsj",
    },
    {
      file: "cold-fusion-logo.jpg",
      alt: "ColdFusion",
      meta: "Tech",
      url: "https://www.youtube.com/@ColdFusion",
    },
    {
      file: "the-dodo-logo.jpg",
      alt: "The Dodo",
      meta: "Animals",
      url: "https://www.youtube.com/@TheDodo",
    },
    {
      file: "infographics-logo.jpg",
      alt: "The Infographics Show",
      meta: "Explainer",
      url: "https://www.youtube.com/@TheInfographicsShow",
    },
    {
      file: "bbc-earth-science-logo.jpg",
      alt: "BBC Earth Science",
      meta: "Nature",
      url: "https://www.youtube.com/@BBCEarthScience",
    },
    {
      file: "bloomberg-logo.jpg",
      alt: "Bloomberg Originals",
      meta: "Business",
      url: "https://www.youtube.com/@BloombergOriginals",
    },
    {
      file: "ycombinator-logo.jpg",
      alt: "Y Combinator",
      meta: "Startups",
      url: "https://www.youtube.com/@ycombinator",
    },
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

  shuffle(CHANNELS).forEach(function (item) {
    const fig = document.createElement("figure");
    fig.className = "fav-youtube__item";

    const link = document.createElement("a");
    link.className = "fav-youtube__card";
    link.href = item.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", item.alt + " on YouTube");

    const img = document.createElement("img");
    img.src = "images/fav-youtube/" + item.file + "?v=" + CACHE;
    img.alt = item.alt + " channel logo";
    img.loading = "lazy";
    img.decoding = "async";
    img.width = 900;
    img.height = 900;

    const cap = document.createElement("figcaption");
    const title = document.createElement("span");
    title.className = "fav-youtube__title";
    title.textContent = item.alt;
    const meta = document.createElement("span");
    meta.className = "fav-youtube__meta";
    meta.textContent = item.meta + " · YouTube";
    cap.appendChild(title);
    cap.appendChild(meta);

    link.appendChild(img);
    link.appendChild(cap);
    fig.appendChild(link);
    GRID.appendChild(fig);
  });
})();
