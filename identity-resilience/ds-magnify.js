/* Magnifying loupe for design-system + iteration viewers. */
(function () {
  var zoom = 2.4;
  var size = 168;

  function bindViewer(root) {
    var stage = root.querySelector(".ir-magnify__stage");
    var img = root.querySelector(".ir-magnify__img");
    var loupe = root.querySelector(".ir-magnify__loupe");
    var btn = root.querySelector(".ir-magnify__btn");
    if (!stage || !img || !loupe || !btn) return;

    var on = false;

    function setOn(next) {
      on = next;
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.classList.toggle("is-on", on);
      stage.classList.toggle("is-magnifying", on);
      if (!on) {
        loupe.hidden = true;
        loupe.setAttribute("aria-hidden", "true");
      }
    }

    function placeLoupe(clientX, clientY) {
      var rect = img.getBoundingClientRect();
      if (rect.width < 8 || rect.height < 8) return;

      var x = clientX - rect.left;
      var y = clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        loupe.hidden = true;
        return;
      }

      var half = size / 2;
      var left = img.offsetLeft + x - half;
      var top = img.offsetTop + y - half;

      loupe.hidden = false;
      loupe.setAttribute("aria-hidden", "false");
      loupe.style.width = size + "px";
      loupe.style.height = size + "px";
      loupe.style.left = left + "px";
      loupe.style.top = top + "px";
      loupe.style.backgroundImage = 'url("' + img.currentSrc + '")';
      loupe.style.backgroundSize = rect.width * zoom + "px " + rect.height * zoom + "px";
      loupe.style.backgroundPosition =
        -(x * zoom - half) + "px " + -(y * zoom - half) + "px";
    }

    btn.addEventListener("click", function () {
      setOn(!on);
    });

    stage.addEventListener("pointermove", function (e) {
      if (!on) return;
      placeLoupe(e.clientX, e.clientY);
    });

    stage.addEventListener("pointerleave", function () {
      loupe.hidden = true;
      loupe.setAttribute("aria-hidden", "true");
    });

    stage.addEventListener("pointerdown", function (e) {
      if (!on) {
        setOn(true);
        placeLoupe(e.clientX, e.clientY);
      }
    });

    setOn(true);
  }

  // Legacy design-system IDs → wrap as one viewer root
  var legacyStage = document.getElementById("irDsStage");
  if (legacyStage) {
    var legacyRoot = legacyStage.closest(".ir-ds-viewer") || legacyStage.parentElement;
    if (legacyRoot && !legacyRoot.classList.contains("ir-magnify")) {
      legacyRoot.classList.add("ir-magnify");
      legacyStage.classList.add("ir-magnify__stage");
      var legacyImg = document.getElementById("irDsImg");
      var legacyLoupe = document.getElementById("irDsLoupe");
      var legacyBtn = document.getElementById("irDsMagnifyBtn");
      if (legacyImg) legacyImg.classList.add("ir-magnify__img");
      if (legacyLoupe) legacyLoupe.classList.add("ir-magnify__loupe");
      if (legacyBtn) legacyBtn.classList.add("ir-magnify__btn");
    }
  }

  document.querySelectorAll(".ir-magnify").forEach(bindViewer);
})();
