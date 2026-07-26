(function () {
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
  var resumeCloseBtn = document.getElementById('resumeCloseBtn');
  if (!resumeModal || !resumeCloseBtn) return;

  var resumeTriggers = document.querySelectorAll('[data-resume-trigger]');

  function openResumeModal(event) {
    event.preventDefault();
    resumeModal.hidden = false;
    resumeModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
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
