/* Unlock all Identity Resilience final-design frames with one password.
   Listing cards (projects / next-up) only show an NDA teaser — no password. */
(function () {
  var KEY = "ir_final_unlocked_v1";
  var LEGACY_KEY = "ir_cover_unlocked_v1";
  var PASS = "12345678123";
  var FINAL_SRC = /identity-resilience\/(design-frame|final)\.png/i;

  function isUnlocked() {
    try {
      return localStorage.getItem(KEY) === "1" || localStorage.getItem(LEGACY_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function setUnlocked() {
    try {
      localStorage.setItem(KEY, "1");
      localStorage.setItem(LEGACY_KEY, "1");
    } catch (e) {}
    document.documentElement.classList.add("ir-nda-unlocked");
  }

  if (isUnlocked()) {
    document.documentElement.classList.add("ir-nda-unlocked");
  }

  function unlockAll() {
    setUnlocked();
    document.querySelectorAll("[data-ir-nda]").forEach(function (wrap) {
      wrap.classList.remove("is-locked");
    });
  }

  function isListingCard(wrap) {
    return !!wrap.closest(".proj-show, .mw-card");
  }

  function gateMarkup(listing) {
    if (listing) {
      return (
        '<div class="ir-nda-gate ir-nda-gate--teaser" aria-label="NDA protected preview">' +
          '<div class="ir-nda-gate__card">' +
            '<p class="ir-nda-gate__eyebrow">NDA</p>' +
            '<span class="ir-nda-gate__view">View Project</span>' +
          "</div>" +
        "</div>"
      );
    }
    return (
      '<div class="ir-nda-gate" role="dialog" aria-label="NDA protected final design">' +
        '<div class="ir-nda-gate__card">' +
          '<p class="ir-nda-gate__eyebrow">NDA protected</p>' +
          '<p class="ir-nda-gate__title">Final design locked</p>' +
          '<p class="ir-nda-gate__copy">Password needed to view. One unlock reveals every final frame.</p>' +
          '<form class="ir-nda-gate__form" autocomplete="off">' +
            '<input type="password" name="nda-password" placeholder="Password" aria-label="NDA password" required/>' +
            '<button type="submit">Unlock</button>' +
          "</form>" +
          '<p class="ir-nda-gate__error" aria-live="polite"></p>' +
        "</div>" +
      "</div>"
    );
  }

  function ensureWrap(img) {
    var existing = img.closest("[data-ir-nda]");
    if (existing) return existing;

    var wrap = document.createElement("div");
    wrap.className = "ir-nda-wrap is-locked";
    wrap.setAttribute("data-ir-nda", "");

    var host = img.closest(".ir-magnify") || img.parentNode;
    if (host && host !== img && host.contains(img) && host.parentNode && host.classList && host.classList.contains("ir-magnify")) {
      host.parentNode.insertBefore(wrap, host);
      wrap.appendChild(host);
    } else {
      img.parentNode.insertBefore(wrap, img);
      wrap.appendChild(img);
    }
    return wrap;
  }

  function bindGate(wrap) {
    if (wrap.getAttribute("data-ir-nda-bound") === "1") return;
    wrap.setAttribute("data-ir-nda-bound", "1");

    var listing = isListingCard(wrap);
    if (!wrap.querySelector(".ir-nda-gate")) {
      wrap.insertAdjacentHTML("beforeend", gateMarkup(listing));
    }

    var gate = wrap.querySelector(".ir-nda-gate");
    if (!gate) return;

    // Listing teaser: let clicks pass through to the parent project link.
    if (listing) return;

    var form = wrap.querySelector(".ir-nda-gate__form");
    var input = wrap.querySelector('.ir-nda-gate__form input[type="password"]');
    var err = wrap.querySelector(".ir-nda-gate__error");
    if (!form || !input) return;

    ["click", "mousedown", "mouseup", "pointerdown"].forEach(function (evt) {
      gate.addEventListener(evt, function (e) {
        e.stopPropagation();
        if (e.target.closest("input, button, label, form")) return;
        e.preventDefault();
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (input.value === PASS) {
        if (err) err.textContent = "";
        unlockAll();
        return;
      }
      if (err) err.textContent = "Incorrect password.";
      input.focus();
      input.select();
    });
  }

  function collectTargets() {
    var set = new Set();
    document.querySelectorAll("[data-ir-nda]").forEach(function (el) {
      set.add(el);
    });
    document.querySelectorAll("img[src]").forEach(function (img) {
      var src = img.getAttribute("src") || "";
      if (!FINAL_SRC.test(src)) return;
      set.add(ensureWrap(img));
    });
    return Array.from(set);
  }

  function init() {
    var wraps = collectTargets();
    if (!wraps.length) return;

    wraps.forEach(function (wrap) {
      wrap.classList.add("ir-nda-wrap");
      if (isListingCard(wrap)) {
        wrap.classList.add("ir-nda-wrap--card");
      }
      if (isUnlocked()) {
        wrap.classList.remove("is-locked");
      } else {
        wrap.classList.add("is-locked");
        bindGate(wrap);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  var observer = new MutationObserver(function () {
    init();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  setTimeout(function () {
    observer.disconnect();
  }, 2500);
})();
