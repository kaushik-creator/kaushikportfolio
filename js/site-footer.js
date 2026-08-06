(function () {
  var FOOTER_HTML =
    '<footer class="site-footer" id="contact">' +
      '<div class="wrap">' +
        '<div class="contact-card">' +
          '<p class="eyebrow">Contact</p>' +
          '<h2>Get in touch</h2>' +
          '<p>Open to B2B SaaS and fintech roles.</p>' +
          '<div class="contact-links">' +
            '<a href="mailto:kaushikdmdes6015@gmail.com" class="contact-link">kaushikdmdes6015@gmail.com</a>' +
            '<a href="tel:+919176611530" class="contact-link">+91 9176611530</a>' +
          '</div>' +
          '<div class="social-links">' +
            '<a href="https://www.linkedin.com/feed/" class="social-link" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">' +
              '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a1.948 1.948 0 1 1-.001-3.896 1.948 1.948 0 0 1 .001 3.896zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>' +
            '</a>' +
            '<a href="https://www.behance.net/kaushikdmdes" class="social-link" target="_blank" rel="noopener noreferrer" aria-label="Behance">' +
              '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 7h-7V5h7v2zm1.726 10c-.442 2.391-2.607 4.008-4.726 4.008-2.833 0-4.726-2.174-4.726-5.012 0-2.925 1.792-5.088 4.558-5.088 2.496 0 4.312 1.708 4.312 4.322 0 .342-.027.684-.082 1.022h-7.244c.164 1.468 1.242 2.438 2.708 2.438 1.066 0 1.816-.533 2.146-1.416h3.432zm-7.028-2.772h-4.478c.192-1.348 1.178-2.228 2.386-2.228 1.316 0 2.092.936 2.092 2.228zm-9.698 2.772H0V5.024h5.228c2.496 0 4.176 1.572 4.176 3.954 0 1.708-.958 2.814-2.3 3.216 1.708.342 2.958 1.572 2.958 3.564 0 2.496-1.926 4.122-4.386 4.122-1.98 0-3.564-.936-4.122-2.352l3.42-.684c.246.684.81 1.122 1.674 1.122.978 0 1.542-.63 1.542-1.674 0-1.152-.81-1.854-2.214-1.854H4.998v3.078z"/></svg>' +
            '</a>' +
          '</div>' +
        '</div>' +
        '<div class="site-footer__bar">' +
          '<p>© 2025 Kaushik Dayalan — UX Designer · Designed &amp; built in Chennai</p>' +
        '</div>' +
      '</div>' +
    '</footer>';

  var existing = document.querySelector('footer.site-footer');
  if (existing && existing.querySelector('.contact-card')) return;
  if (existing) existing.remove();

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
