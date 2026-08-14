(function () {
  const SECTION = document.querySelector(".fav-toys");
  if (!SECTION) return;

  const GRID = SECTION.querySelector(".fav-toys__grid");
  if (!GRID) return;

  const CACHE = "20260814toys2";
  const TOYS = [
    {
      file: "phlat-ball.png",
      alt: "Color Changing Ball",
      meta: "Phlat Ball · Fidget",
      search: "Phlat Ball color changing fidget toy",
    },
    {
      file: "double-cross.png",
      alt: "Double Cross",
      meta: "Kaleidoscope Classic",
      search: "Double Cross Kaleidoscope Classic",
    },
    {
      file: "rubiks-slide.png",
      alt: "Rubik’s Slide",
      meta: "Puzzle",
      search: "Rubik's Slide",
    },
    {
      file: "perplexus-rebel.png",
      alt: "Perplexus Rebel",
      meta: "Maze",
    },
    {
      file: "kendama.png",
      alt: "Kendama",
      meta: "Skill",
    },
    {
      file: "jenga.png",
      alt: "Jenga",
      meta: "Game",
    },
  ];

  function googleSearch(title) {
    return "https://www.google.com/search?q=" + encodeURIComponent(title);
  }

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

  shuffle(TOYS).forEach(function (item) {
    const fig = document.createElement("figure");
    fig.className = "fav-toys__item";

    const link = document.createElement("a");
    link.className = "fav-toys__card";
    link.href = googleSearch(item.search || item.alt);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", item.alt);

    const img = document.createElement("img");
    img.src = "images/fav-toys/" + item.file + "?v=" + CACHE;
    img.alt = item.alt;
    img.loading = "lazy";
    img.decoding = "async";

    const cap = document.createElement("figcaption");
    const title = document.createElement("span");
    title.className = "fav-toys__title";
    title.textContent = item.alt;
    const meta = document.createElement("span");
    meta.className = "fav-toys__meta";
    meta.textContent = item.meta;
    cap.appendChild(title);
    cap.appendChild(meta);

    link.appendChild(img);
    link.appendChild(cap);
    fig.appendChild(link);
    GRID.appendChild(fig);
  });
})();
