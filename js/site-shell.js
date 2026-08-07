(function () {
  var RESUME_SRC = 'Kaushik_Resume_Updated_v2.pdf?v=20260807';

  var ham = document.getElementById('hamburger');
  var menu = document.getElementById('mobileMenu');

  window.closeMobileMenu = function closeMobileMenu() {
    if (menu) menu.classList.remove('open');
  };

  if (ham && menu) {
    ham.addEventListener('click', function () {
      menu.classList.toggle('open');
    });
  }

  var resumeModal = document.getElementById('resumeModal');
  if (!resumeModal) {
    var wrap = document.createElement('div');
    wrap.innerHTML =
      '<div class="resume-modal" id="resumeModal" hidden aria-hidden="true">' +
        '<div class="resume-modal-card" role="dialog" aria-modal="true" aria-label="Resume preview">' +
          '<div class="resume-modal-head">' +
            '<span class="resume-modal-title">Resume</span>' +
            '<div class="resume-modal-actions">' +
              '<a class="resume-download" href="' + RESUME_SRC + '" download target="_blank" rel="noopener noreferrer">Download</a>' +
              '<button type="button" class="resume-close" id="resumeCloseBtn" aria-label="Close resume popup">×</button>' +
            '</div>' +
          '</div>' +
          '<iframe class="resume-frame" src="' + RESUME_SRC + '" title="Kaushik Resume"></iframe>' +
        '</div>' +
      '</div>';
    document.body.appendChild(wrap.firstElementChild);
    resumeModal = document.getElementById('resumeModal');
  }

  var resumeCloseBtn = document.getElementById('resumeCloseBtn');
  if (!resumeModal || !resumeCloseBtn) return;

  var frame = resumeModal.querySelector('.resume-frame');
  if (frame && frame.getAttribute('src') !== RESUME_SRC) {
    frame.setAttribute('src', RESUME_SRC);
  }
  var download = resumeModal.querySelector('.resume-download');
  if (download) download.setAttribute('href', RESUME_SRC);

  // Promote plain Resume PDF links to modal triggers
  document.querySelectorAll('a[href*="resume"], a[href*="Resume"]').forEach(function (link) {
    var href = (link.getAttribute('href') || '').toLowerCase();
    if (href.indexOf('.pdf') === -1 && !link.hasAttribute('data-resume-trigger')) return;
    if (link.classList.contains('resume-download')) return;
    link.setAttribute('data-resume-trigger', '');
    if (href.indexOf('.pdf') !== -1) link.setAttribute('href', RESUME_SRC);
  });

  var resumeTriggers = document.querySelectorAll('[data-resume-trigger]');

  function openResumeModal(event) {
    event.preventDefault();
    resumeModal.hidden = false;
    resumeModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    resumeCloseBtn.focus();
  }

  function closeResumeModal() {
    resumeModal.hidden = true;
    resumeModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  resumeTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', openResumeModal);
  });
  resumeCloseBtn.addEventListener('click', closeResumeModal);
  resumeModal.addEventListener('click', function (event) {
    if (event.target === resumeModal) closeResumeModal();
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !resumeModal.hidden) closeResumeModal();
  });
})();
