(function () {
  const SECTION = document.querySelector(".fav-people");
  if (!SECTION) return;

  const GRID = SECTION.querySelector(".fav-people__grid");
  if (!GRID) return;

  const SELECT = document.getElementById("peopleSortSelect");
  const CACHE = "20260903people6";

  const PEOPLE = [
    { file: "desmond-doss.png", name: "Desmond Doss", role: "Medic · WWII", url: "https://en.wikipedia.org/wiki/Desmond_Doss", birthYear: 1919 },
    { file: "ilaiyaraaja.png", name: "Ilaiyaraaja", role: "Composer", url: "https://en.wikipedia.org/wiki/Ilaiyaraaja", birthYear: 1943 },
    { file: "javed-akhtar.png", name: "Javed Akhtar", role: "Lyricist · Writer", url: "https://en.wikipedia.org/wiki/Javed_Akhtar", birthYear: 1945 },
    { file: "kapil-dev.png", name: "Kapil Dev", role: "Cricketer", url: "https://en.wikipedia.org/wiki/Kapil_Dev", birthYear: 1959 },
    { file: "aamir-khan.png", name: "Aamir Khan", role: "Actor", url: "https://en.wikipedia.org/wiki/Aamir_Khan", birthYear: 1965, birthMonth: 3 },
    { file: "shah-rukh-khan.png", name: "Shah Rukh Khan", role: "Actor", url: "https://en.wikipedia.org/wiki/Shah_Rukh_Khan", birthYear: 1965, birthMonth: 11 },
    { file: "ar-rahman.png", name: "A.R. Rahman", role: "Composer", url: "https://en.wikipedia.org/wiki/A._R._Rahman", birthYear: 1967 },
    { file: "sj-suryah.png", name: "S.J. Suryah", role: "Actor · Director", url: "https://en.wikipedia.org/wiki/S._J._Suryah", birthYear: 1968 },
    { file: "ajith-kumar.png", name: "Ajith Kumar", role: "Actor", url: "https://en.wikipedia.org/wiki/Ajith_Kumar", birthYear: 1971 },
    { file: "rahul-dravid.png", name: "Rahul Dravid", role: "Cricketer", url: "https://en.wikipedia.org/wiki/Rahul_Dravid", birthYear: 1973 },
    { file: "manju-warrier.png", name: "Manju Warrier", role: "Actor", url: "https://en.wikipedia.org/wiki/Manju_Warrier", birthYear: 1974, birthMonth: 9 },
    { file: "ram.png", name: "Ram", role: "Filmmaker", url: "https://en.wikipedia.org/wiki/Ram_(director)", birthYear: 1974, birthMonth: 10 },
    { file: "ms-dhoni.png", name: "MS Dhoni", role: "Cricketer", url: "https://en.wikipedia.org/wiki/MS_Dhoni", birthYear: 1981 },
    { file: "mithali-raj.png", name: "Mithali Raj", role: "Cricketer", url: "https://en.wikipedia.org/wiki/Mithali_Raj", birthYear: 1982 },
    { file: "cristiano-ronaldo.png", name: "Cristiano Ronaldo", role: "Footballer", url: "https://en.wikipedia.org/wiki/Cristiano_Ronaldo", birthYear: 1985 },
    { file: "sushant-singh-rajput.png", name: "Sushant Singh Rajput", role: "Actor", url: "https://en.wikipedia.org/wiki/Sushant_Singh_Rajput", birthYear: 1986 },
    { file: "narayan-subramaniam.png", name: "Narayan Subramaniam", role: "Founder · Ultraviolette", url: "https://en.wikipedia.org/wiki/Ultraviolette_Automotive", birthYear: 1987 },
    { file: "virat-kohli.png", name: "Virat Kohli", role: "Cricketer", url: "https://en.wikipedia.org/wiki/Virat_Kohli", birthYear: 1988 },
  ];

  function ageKey(p) { return (p.birthYear || 0) * 100 + (p.birthMonth || 0); }
  function nameKey(p) { return (p.name || "").toLocaleLowerCase(); }

  function sortedPeople(sortBy, dir) {
    var list = PEOPLE.slice();
    var m = dir === "desc" ? -1 : 1;
    list.sort(function (a, b) {
      if (sortBy === "name") {
        var an = nameKey(a), bn = nameKey(b);
        return an < bn ? -1 * m : an > bn ? 1 * m : 0;
      }
      var av = ageKey(a), bv = ageKey(b);
      return av < bv ? -1 * m : av > bv ? 1 * m : nameKey(a).localeCompare(nameKey(b));
    });
    return list;
  }

  function createCard(item) {
    var fig = document.createElement("figure");
    fig.className = "fav-people__item";
    var link = document.createElement("a");
    link.className = "fav-people__card";
    link.href = item.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", item.name + " on Wikipedia");
    var img = document.createElement("img");
    img.src = "images/fav-people/" + item.file + "?v=" + CACHE;
    img.alt = item.name;
    img.loading = "lazy";
    img.decoding = "async";
    img.width = 640;
    img.height = 640;
    var cap = document.createElement("figcaption");
    var title = document.createElement("span");
    title.className = "fav-people__title";
    title.textContent = item.name;
    var role = document.createElement("span");
    role.className = "fav-people__role";
    role.textContent = item.role;
    cap.appendChild(title);
    cap.appendChild(role);
    link.appendChild(img);
    link.appendChild(cap);
    fig.appendChild(link);
    return fig;
  }

  function render(sortBy, dir) {
    GRID.replaceChildren();
    sortedPeople(sortBy, dir).forEach(function (item) {
      GRID.appendChild(createCard(item));
    });
  }

  function parseValue(val) {
    var parts = val.split("-");
    return { sortBy: parts[0], dir: parts[1] };
  }

  if (SELECT) {
    SELECT.addEventListener("change", function () {
      var o = parseValue(SELECT.value);
      render(o.sortBy, o.dir);
    });
  }

  var init = parseValue(SELECT ? SELECT.value : "age-asc");
  render(init.sortBy, init.dir);
})();
