(function () {
  var FOOTER_HTML =
    '<footer class="site-footer" id="contact">' +
      '<div class="wrap">' +
        '<div class="contact-band">' +
          '<div class="contact-band__intro">' +
            '<p class="eyebrow">Contact</p>' +
            '<h2>Get in touch</h2>' +
            '<p class="contact-band__lead">Open to B2B SaaS and fintech roles — happy to talk product, systems, and AI-assisted design.</p>' +
            '<p class="contact-band__meta">Chennai, India · Open to remote</p>' +
          '</div>' +
          '<div class="contact-band__channels" aria-label="Contact channels">' +
            '<a href="mailto:kaushikdmdes6015@gmail.com" class="contact-action">' +
              '<span class="contact-action__label">Email</span>' +
              '<span class="contact-action__value">kaushikdmdes6015@gmail.com</span>' +
            '</a>' +
            '<a href="tel:+919176611530" class="contact-action">' +
              '<span class="contact-action__label">Phone</span>' +
              '<span class="contact-action__value">+91 9176611530</span>' +
            '</a>' +
          '</div>' +
          '<div class="contact-band__social">' +
            '<p class="contact-action__label">Elsewhere</p>' +
            '<div class="social-links">' +
              '<a href="https://www.linkedin.com/in/kaushik-dayalan-306a31121/" class="social-link" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">' +
                '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a1.948 1.948 0 1 1-.001-3.896 1.948 1.948 0 0 1 .001 3.896zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>' +
                '<span>LinkedIn</span>' +
              '</a>' +
              '<a href="https://www.behance.net/kaushikdmdes" class="social-link" target="_blank" rel="noopener noreferrer" aria-label="Behance">' +
                '<svg viewBox="0 0 448 512" fill="currentColor" aria-hidden="true"><path d="M155.3 318.4c17.2 0 31.2-6.1 31.2-25.4c0-19.7-11.7-27.4-30.3-27.5h-46v52.9zm-5.4-129.6h-39.6v44.8H153c15.1 0 25.8-6.6 25.8-22.9c0-17.7-13.7-21.9-28.9-21.9m129.5 74.8h62.2c-1.7-18.5-11.3-29.7-30.5-29.7c-18.3 0-30.5 11.4-31.7 29.7M384 32H64C28.7 32 0 60.7 0 96v320c0 35.3 28.7 64 64 64h320c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64m-34.5 153h-77.8v-18.9h77.8zm-155.8 58.7c23.6 6.7 35 27.5 35 51.6c0 39-32.7 55.7-67.6 55.9H68v-192h90.5c32.9 0 61.4 9.3 61.4 47.5c0 19.3-9 28.8-26.2 37m118.7-38.6c43.5 0 67.6 34.3 67.6 75.4c0 1.6-.1 3.3-.2 5c0 .8-.1 1.5-.1 2.2H279.5c0 22.2 11.7 35.3 34.1 35.3c11.6 0 26.5-6.2 30.2-18.1h33.7c-10.4 31.9-31.9 46.8-65.1 46.8c-43.8 0-71.1-29.7-71.1-73c0-41.8 28.7-73.6 71.1-73.6"/></svg>' +
                '<span>Behance</span>' +
              '</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="site-footer__bar">' +
          '<p>© 2025 Kaushik Dayalan — UX Designer · Designed &amp; built in Chennai</p>' +
        '</div>' +
      '</div>' +
    '</footer>';

  var existing = document.querySelector('footer.site-footer');
  if (existing) {
    if (existing.querySelector('.contact-band')) return;
    existing.remove();
  }

  var wrap = document.createElement('div');
  wrap.innerHTML = FOOTER_HTML;
  var footer = wrap.firstElementChild;

  var anchor =
    document.querySelector('script[src*="system-theme"]') ||
    document.querySelector('script[src*="site-footer"]') ||
    document.querySelector('script[src*="music"]');
  if (anchor) {
    anchor.parentNode.insertBefore(footer, anchor);
  } else {
    document.body.appendChild(footer);
  }
})();
