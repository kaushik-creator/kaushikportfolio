/* Keep case-study screenshots at ≤1 device pixel per source pixel (no upscaling). */
(function () {
  const SEL = [
    ".ir-iter__media img",
    ".ir-ai__media img",
    ".ir-ai__table img",
    ".ir-insp img",
    ".ir-situations img",
    ".section.cs-hero .cs-hero__cover img",
    "#irDsImg",
  ].join(",");

  function fit(img) {
    if (!img || !img.naturalWidth) return;
    // Full-bleed AI / iteration / stack frames: fill column width.
    if (
      img.closest(".ir-ai") ||
      img.closest(".ir-iters") ||
      img.closest(".ir-iter--stack") ||
      img.closest(".ir-situations") ||
      img.id === "irDsImg" ||
      img.closest(".ir-ds-scroll")
    ) {
      img.style.width = "100%";
      img.style.maxWidth = "100%";
      img.style.height = "auto";
      return;
    }
    const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 3));
    const ideal = Math.round(img.naturalWidth / dpr);
    img.style.width = ideal + "px";
    img.style.maxWidth = "100%";
    img.style.height = "auto";
  }

  function fitAll() {
    document.querySelectorAll(SEL).forEach(fit);
  }

  document.querySelectorAll(SEL).forEach((img) => {
    if (img.complete) fit(img);
    else img.addEventListener("load", () => fit(img), { once: true });
  });

  window.addEventListener("resize", fitAll, { passive: true });
})();
