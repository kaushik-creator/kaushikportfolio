(function () {
  const SECTION = document.querySelector(".fav-people");
  if (!SECTION) return;

  const GRID = SECTION.querySelector(".fav-people__grid");
  if (!GRID) return;

  const CACHE = "20260903people2";

  const PEOPLE = [
    {
      file: "ar-rahman.png",
      name: "A.R. Rahman",
      role: "Composer",
      url: "https://en.wikipedia.org/wiki/A._R._Rahman",
    },
    {
      file: "ram.png",
      name: "Ram",
      role: "Filmmaker",
      url: "https://en.wikipedia.org/wiki/Ram_(director)",
    },
    {
      file: "shah-rukh-khan.png",
      name: "Shah Rukh Khan",
      role: "Actor",
      url: "https://en.wikipedia.org/wiki/Shah_Rukh_Khan",
    },
    {
      file: "sj-suryah.png",
      name: "S.J. Suryah",
      role: "Actor · Director",
      url: "https://en.wikipedia.org/wiki/S._J._Suryah",
    },
    {
      file: "javed-akhtar.png",
      name: "Javed Akhtar",
      role: "Lyricist · Writer",
      url: "https://en.wikipedia.org/wiki/Javed_Akhtar",
    },
    {
      file: "rahul-dravid.png",
      name: "Rahul Dravid",
      role: "Cricketer",
      url: "https://en.wikipedia.org/wiki/Rahul_Dravid",
    },
    {
      file: "aamir-khan.png",
      name: "Aamir Khan",
      role: "Actor",
      url: "https://en.wikipedia.org/wiki/Aamir_Khan",
    },
    {
      file: "kapil-dev.png",
      name: "Kapil Dev",
      role: "Cricketer",
      url: "https://en.wikipedia.org/wiki/Kapil_Dev",
    },
    {
      file: "ilaiyaraaja.png",
      name: "Ilaiyaraaja",
      role: "Composer",
      url: "https://en.wikipedia.org/wiki/Ilaiyaraaja",
    },
    {
      file: "desmond-doss.png",
      name: "Desmond Doss",
      role: "Medic · WWII",
      url: "https://en.wikipedia.org/wiki/Desmond_Doss",
    },
  ];

  PEOPLE.forEach(function (item) {
    const fig = document.createElement("figure");
    fig.className = "fav-people__item";

    const link = document.createElement("a");
    link.className = "fav-people__card";
    link.href = item.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", item.name + " on Wikipedia");

    const img = document.createElement("img");
    img.src = "images/fav-people/" + item.file + "?v=" + CACHE;
    img.alt = item.name;
    img.loading = "lazy";
    img.decoding = "async";
    img.width = 640;
    img.height = 640;

    const cap = document.createElement("figcaption");

    const title = document.createElement("span");
    title.className = "fav-people__title";
    title.textContent = item.name;

    const role = document.createElement("span");
    role.className = "fav-people__role";
    role.textContent = item.role;

    cap.appendChild(title);
    cap.appendChild(role);

    link.appendChild(img);
    link.appendChild(cap);
    fig.appendChild(link);
    GRID.appendChild(fig);
  });
})();
