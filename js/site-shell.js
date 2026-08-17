(function () {
  var RESUME_SRC = 'Kaushik_Resume_Updated_v5.pdf?v=20260808';

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

  var MORE_WORK = [
    {
      href: 'msc-dashboard.html',
      name: 'One Dashboard for MSP Partners',
      desc: 'See backup failures, storage, and security risk in one place instead of 15+ screens.',
      type: 'Professional',
      tags: ['B2B', 'Dashboard'],
      img: 'project-tiles/msc-800.png',
      alt: 'MSC Operational Dashboard'
    },
    {
      href: 'identity-resilience.html',
      name: 'Identity Activity Graph',
      desc: 'See what a compromised account did, without reading a long log table.',
      type: 'Professional',
      tags: ['Security', 'Data viz'],
      img: 'identity-resilience/design-frame.png?v=8',
      alt: 'Identity Resilience final activity analysis swimlane graph'
    },
    {
      href: 'security-readiness.html',
      name: 'Security Score',
      desc: 'Fix all missed security settings from one widget.',
      type: 'Professional',
      tags: ['Security', 'Cyber Resiliency'],
      img: 'project-tiles/security-800.png',
      alt: 'Security Readiness Score'
    },
    {
      href: 'druva.html',
      name: 'Self-Serve Provisioning',
      desc: 'Let partners turn on new products without filing a support ticket.',
      type: 'Professional',
      tags: ['Workflow', 'MSP'],
      img: 'project-tiles/druva-800.png',
      alt: 'Druva provisioning workflow',
      diagram: true
    },
    {
      href: 'harmoney.html',
      name: 'B2B Bond Trading Platform',
      desc: 'Move bond trading from phone calls to an online platform.',
      type: 'Professional',
      tags: ['Fintech', '0→1'],
      img: 'project-tiles/harmoney-800.png',
      alt: 'Harmoney bond trading dashboard'
    },
    {
      href: 'mason.html',
      name: 'Shopify Badge Automation',
      desc: 'Let sellers add promo badges without a developer.',
      type: 'Professional',
      tags: ['App Design', 'Shopify'],
      img: 'project-tiles/mason-800.png',
      alt: 'ModeMagic Shopify badge automation'
    },
    {
      href: 'dashboard.html',
      name: 'Dashboard Design for Drone Operations',
      desc: 'Patterns for tracking many drones at once.',
      type: 'Strategy and Research',
      tags: ['SaaS', 'Framework'],
      label: 'Dashboard design for drone operations'
    },
    {
      href: 'theraxis.html',
      name: 'Clinic Management Platform',
      desc: 'Scheduling, billing, and patients in one tool.',
      type: 'Ai Projects',
      tags: ['PRD', 'Cursor'],
      label: 'Child therapy software'
    }
  ];

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderMoreWorkCard(item) {
    var media;
    if (item.label) {
      media = '<div class="mw-card__media mw-card__media--label" aria-hidden="true">' + escapeHtml(item.label) + '</div>';
    } else {
      var mediaClass = 'mw-card__media' + (item.diagram ? ' mw-card__media--diagram' : '');
      media =
        '<div class="' + mediaClass + '">' +
          '<img src="' + escapeHtml(item.img) + '" alt="' + escapeHtml(item.alt || item.name) + '" loading="lazy" width="800" height="600"/>' +
        '</div>';
    }

    return (
      '<a class="mw-card" href="' + escapeHtml(item.href) + '">' +
        media +
        '<div class="mw-card__body">' +
          '<span class="mw-card__name">' + escapeHtml(item.name) + '</span>' +
          '<span class="mw-card__desc">' + escapeHtml(item.desc) + '</span>' +
          '<span class="proj-show__cta">View →</span>' +
        '</div>' +
      '</a>'
    );
  }

  var currentPage = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  var moreWorkHasIrFinal = false;
  document.querySelectorAll('[data-more-work]').forEach(function (host) {
    var cards = MORE_WORK.filter(function (item) {
      return item.href.toLowerCase() !== currentPage;
    });
    moreWorkHasIrFinal = moreWorkHasIrFinal || cards.some(function (item) {
      return /identity-resilience\/(design-frame|final)\.png/i.test(item.img || '');
    });
    host.innerHTML = cards.map(renderMoreWorkCard).join('');
    host.setAttribute('role', 'list');
    host.classList.add('more-work__scroller');

    var section = host.closest('.more-work');
    if (section) {
      var eyebrow = section.querySelector('.more-work__head .eyebrow');
      if (eyebrow) eyebrow.textContent = 'Next up';
      var all = section.querySelector('.more-work__all');
      if (all) all.textContent = 'View all projects';
    }
  });

  // Protect IR final frames in Next up cards on every case-study page.
  if (moreWorkHasIrFinal && !document.querySelector('script[data-ir-nda-gate]')) {
    if (!document.querySelector('link[data-ir-nda-gate]')) {
      var ndaCss = document.createElement('link');
      ndaCss.rel = 'stylesheet';
      ndaCss.href = 'identity-resilience/nda-gate.css?v=3';
      ndaCss.setAttribute('data-ir-nda-gate', '');
      document.head.appendChild(ndaCss);
    }
    try {
      if (localStorage.getItem('ir_final_unlocked_v1') === '1' || localStorage.getItem('ir_cover_unlocked_v1') === '1') {
        document.documentElement.classList.add('ir-nda-unlocked');
      }
    } catch (e) {}
    var ndaJs = document.createElement('script');
    ndaJs.src = 'identity-resilience/nda-gate.js?v=2';
    ndaJs.setAttribute('data-ir-nda-gate', '');
    document.body.appendChild(ndaJs);
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

