(function () {
  var FOOTER_HTML =
    '<footer class="site-footer" id="contact">' +
      '<div class="wrap">' +
        '<div class="contact-panel">' +
          '<div class="contact-band">' +
            '<div class="contact-band__intro">' +
              '<h2>Get in touch</h2>' +
              '<p class="contact-band__lead">Open to <strong>Senior Product Designer</strong> roles in enterprise SaaS and AI-powered products — happy to talk systems, security UX, and AI-assisted design.</p>' +
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
                  '<svg class="social-link__icon social-link__icon--behance" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8.84 10.87c.56-.3.9-.85.9-1.58 0-1.17-.92-1.95-2.39-1.95H4.54v7.29h2.95c1.55 0 2.62-.86 2.62-2.19 0-.91-.49-1.58-1.27-1.57zm-2.39-2.23h.85c.59 0 .98.34.98.84s-.39.85-.98.85h-.85v-1.69zm1.02 4.91h-.98v-1.86h.98c.68 0 1.08.37 1.08.93 0 .56-.4.93-1.08.93zM19 8.34h-3.66v1.02H19V8.34zm1.97 3.05c0-2.3-1.41-4.03-3.75-4.03-2.36 0-3.91 1.74-3.91 4.06 0 2.34 1.54 4.07 3.95 4.07 1.52 0 2.81-.61 3.45-1.68l-1.28-.66c-.41.66-1.19 1.02-2.12 1.02-1.36 0-2.29-.88-2.46-2.09h6.09c.03-.27.07-.56.07-.85zm-6.09-.34c.2-1.15 1.05-1.88 2.26-1.88 1.22 0 2.01.73 2.11 1.88h-4.37z"/></svg>' +
                  '<span>Behance</span>' +
                '</a>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="site-footer__bar">' +
            '<p>© 2025 Kaushik Dayalan — UX Designer · Designed &amp; built in Chennai</p>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</footer>';

  var existing = document.querySelector('footer.site-footer');
  if (existing) {
    if (existing.querySelector('.contact-panel')) return;
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
