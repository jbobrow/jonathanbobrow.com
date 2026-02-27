document.addEventListener('DOMContentLoaded', () => {

  // --- Scroll Reveal (Featured page) ---
  const projects = document.querySelectorAll('.project');

  if (projects.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -8% 0px'
    });

    projects.forEach(project => revealObserver.observe(project));
  }

  // --- Featured: Expand / Collapse ---
  function closeProject(section) {
    const detail = section.querySelector('.project-detail');
    const hero = section.querySelector('.project-hero');
    detail.setAttribute('aria-hidden', 'true');
    hero.setAttribute('aria-expanded', 'false');
    section.classList.remove('is-open');
  }

  function closeAllDetails(except) {
    document.querySelectorAll('.project.is-open').forEach(section => {
      if (section !== except) {
        closeProject(section);
      }
    });
  }

  function openProject(section) {
    const detail = section.querySelector('.project-detail');
    const hero = section.querySelector('.project-hero');

    closeAllDetails(section);

    detail.setAttribute('aria-hidden', 'false');
    hero.setAttribute('aria-expanded', 'true');
    section.classList.add('is-open');

    setTimeout(() => {
      const heroRect = hero.getBoundingClientRect();
      const targetTop = window.scrollY + heroRect.top - 60;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    }, 200);
  }

  function toggleProject(hero) {
    const section = hero.closest('.project');
    const isOpen = section.classList.contains('is-open');

    if (isOpen) {
      const heroRect = hero.getBoundingClientRect();
      const targetTop = window.scrollY + heroRect.top - 60;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
      setTimeout(() => {
        closeProject(section);
      }, 350);
    } else {
      openProject(section);
    }
  }

  document.querySelectorAll('.project-hero').forEach(hero => {
    hero.addEventListener('click', () => toggleProject(hero));

    hero.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleProject(hero);
      }
    });
  });

  // --- Featured: Close Buttons ---
  document.querySelectorAll('.project-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const section = btn.closest('.project');
      const hero = section.querySelector('.project-hero');

      const heroRect = hero.getBoundingClientRect();
      const targetTop = window.scrollY + heroRect.top - 60;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
      setTimeout(() => {
        closeProject(section);
      }, 350);
    });
  });

  // ===== Archive Page =====
  const archiveYears = document.querySelectorAll('.archive-year');
  const archiveRows = document.querySelectorAll('.archive-row');
  if (!archiveRows.length) return;

  // --- Staggered fade-in for archive year sections ---
  archiveYears.forEach((section, i) => {
    setTimeout(() => {
      section.classList.add('is-visible');
    }, i * 100);
  });

  // --- Desktop: Cursor-based horizontal scrolling ---
  const isDesktop = window.matchMedia('(min-width: 769px)');

  function setupCursorScroll(row) {
    if (row.scrollWidth <= row.clientWidth) {
      return;
    }

    row.classList.add('is-scrollable');

    row.addEventListener('mousemove', (e) => {
      if (!isDesktop.matches) return;
      const rect = row.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const ratio = x / rect.width;
      // Ease the edges so content isn't clipped at extremes
      const eased = Math.max(0, Math.min(1, (ratio - 0.1) / 0.8));
      const maxScroll = row.scrollWidth - row.clientWidth;
      row.scrollLeft = eased * maxScroll;
    });
  }

  archiveRows.forEach(setupCursorScroll);

  // Re-check scrollable state on resize
  window.addEventListener('resize', () => {
    archiveRows.forEach(row => {
      if (row.scrollWidth > row.clientWidth) {
        row.classList.add('is-scrollable');
      } else {
        row.classList.remove('is-scrollable');
      }
    });
  });

  // --- Archive: Expand / Collapse project detail ---
  function closeArchiveDetail(yearSection) {
    const detail = yearSection.querySelector('.archive-detail');

    // Remove active state from items immediately
    yearSection.querySelectorAll('.archive-item.is-active').forEach(item => {
      item.classList.remove('is-active');
    });

    // Trigger the grid collapse animation
    detail.setAttribute('aria-hidden', 'true');

    // Hide panels after transition — guarded so a reopen in the
    // meantime won't have its panel nuked by a stale handler
    detail.addEventListener('transitionend', function handler(e) {
      if (e.propertyName !== 'grid-template-rows') return;
      detail.removeEventListener('transitionend', handler);
      if (detail.getAttribute('aria-hidden') === 'true') {
        detail.querySelectorAll('.archive-detail-content').forEach(panel => {
          panel.hidden = true;
        });
      }
    });
  }

  function closeAllArchiveDetails(except) {
    document.querySelectorAll('.archive-year').forEach(section => {
      if (section !== except) {
        closeArchiveDetail(section);
      }
    });
  }

  function openArchiveProject(item) {
    const slug = item.dataset.slug;
    const yearSection = item.closest('.archive-year');
    const detail = yearSection.querySelector('.archive-detail');
    const panel = document.getElementById('archive-detail-' + slug);

    if (!panel) return;

    // Close other year sections
    closeAllArchiveDetails(yearSection);

    // Swap content within this year: hide other panels, clear active
    detail.querySelectorAll('.archive-detail-content').forEach(p => {
      p.hidden = true;
    });
    yearSection.querySelectorAll('.archive-item.is-active').forEach(i => {
      i.classList.remove('is-active');
    });

    // Show this panel and mark item active
    panel.hidden = false;
    item.classList.add('is-active');

    const wasAlreadyOpen = detail.getAttribute('aria-hidden') === 'false';
    detail.setAttribute('aria-hidden', 'false');

    // Scroll detail into view (skip delay if already open — content just swapped)
    if (wasAlreadyOpen) {
      const detailRect = detail.getBoundingClientRect();
      const targetTop = window.scrollY + detailRect.top - 80;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    } else {
      setTimeout(() => {
        const detailRect = detail.getBoundingClientRect();
        const targetTop = window.scrollY + detailRect.top - 80;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      }, 200);
    }
  }

  // Click archive thumbnails
  document.querySelectorAll('.archive-item').forEach(item => {
    item.addEventListener('click', () => {
      const isActive = item.classList.contains('is-active');

      if (isActive) {
        const yearSection = item.closest('.archive-year');
        closeArchiveDetail(yearSection);
      } else {
        openArchiveProject(item);
      }
    });
  });

  // Archive close buttons
  document.querySelectorAll('.archive-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const yearSection = btn.closest('.archive-year');
      const row = yearSection.querySelector('.archive-row');

      // Start closing immediately — CSS handles the smooth animation
      closeArchiveDetail(yearSection);

      // Scroll back to the row
      const rowRect = row.getBoundingClientRect();
      const targetTop = window.scrollY + rowRect.top - 80;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });

});
