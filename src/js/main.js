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
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });

    projects.forEach(p => revealObserver.observe(p));
  }

  // ===== Featured: expand / collapse =====
  const work = document.querySelector('#work');

  if (work) {
    const GRID_DUR = 600;
    const EASE = 'cubic-bezier(0.4,0,0.2,1)';

    function headerH() {
      const h = document.querySelector('.site-header');
      return h ? h.offsetHeight : 0;
    }

    function getContext(section) {
      const all    = [...work.querySelectorAll('.project')];
      const idx    = all.indexOf(section);
      const isLeft = idx % 2 === 0;
      const sibIdx = isLeft ? idx + 1 : idx - 1;
      const sibling = (sibIdx >= 0 && sibIdx < all.length) ? all[sibIdx] : null;
      const others  = all.filter(p => p !== section && p !== sibling);
      return { isLeft, sibling, others };
    }

    function openProject(section) {
      if (section.classList.contains('is-open')) return;

      const { isLeft, sibling, others } = getContext(section);
      const hero   = section.querySelector('.project-hero');
      const detail = section.querySelector('.project-detail');
      const desktop = window.matchMedia('(min-width: 769px)').matches;

      // Scroll hero to top of viewport
      window.scrollTo({
        top: window.scrollY + hero.getBoundingClientRect().top - headerH(),
        behavior: 'smooth'
      });

      if (desktop && sibling) {
        const sibW = sibling.getBoundingClientRect().width;
        sibling.querySelector('.project-hero').style.width = sibW + 'px';
        sibling._savedWidth = sibW;

        // Left sibling (right-col selected) can't slide via grid position —
        // column 1 always starts at 0. Use translateX to slide it off-left.
        if (!isLeft) {
          sibling.style.transition = `transform ${GRID_DUR}ms ${EASE}`;
          sibling.style.transform = `translateX(-${sibW}px)`;
        }
      }

      if (desktop) {
        work.classList.toggle('open-left',  isLeft);
        work.classList.toggle('open-right', !isLeft);
      }

      // Open detail simultaneously with the horizontal expansion
      detail.setAttribute('aria-hidden', 'false');
      hero.setAttribute('aria-expanded', 'true');
      section.classList.add('is-open');

      // After animation: hide cells (use visibility to keep sibling in grid
      // flow — display:none would cause the selected project to re-place into
      // the collapsed 0fr column and vanish)
      setTimeout(() => {
        if (desktop) {
          if (sibling) {
            sibling.querySelector('.project-hero').style.width = '';
            sibling.style.visibility = 'hidden';
            if (!isLeft) {
              sibling.style.transition = '';
              sibling.style.transform = '';
            }
          }
          others.forEach(p => { p.hidden = true; });
        }
      }, GRID_DUR);
    }

    function closeProject(section) {
      if (!section.classList.contains('is-open')) return;

      const { isLeft, sibling, others } = getContext(section);
      const hero   = section.querySelector('.project-hero');
      const detail = section.querySelector('.project-detail');
      const desktop = window.matchMedia('(min-width: 769px)').matches;

      // Collapse detail simultaneously with grid shrinking back
      detail.setAttribute('aria-hidden', 'true');
      hero.setAttribute('aria-expanded', 'false');
      section.classList.remove('is-open');

      if (desktop) {
        if (sibling) {
          const savedW = sibling._savedWidth || work.clientWidth / 2;
          // Left sibling: position it off-screen left before making visible,
          // so it slides back in (mirroring how it slid out)
          if (!isLeft) {
            sibling.style.transform = `translateX(-${savedW}px)`;
          }
          sibling.style.visibility = '';
          sibling.querySelector('.project-hero').style.width = savedW + 'px';
        }

        others.forEach(p => { p.hidden = false; });
        work.offsetHeight; // force reflow — sibling starts from its off-screen state

        // Start both animations simultaneously
        if (sibling && !isLeft) {
          sibling.style.transition = `transform ${GRID_DUR}ms ${EASE}`;
          sibling.style.transform = '';
        }
        work.classList.remove('open-left', 'open-right');

        // After animation: remove frozen widths and transform
        setTimeout(() => {
          if (sibling) {
            sibling.querySelector('.project-hero').style.width = '';
            sibling.style.transition = '';
            sibling.style.transform = '';
          }
        }, GRID_DUR);
      }
    }

    work.querySelectorAll('.project-hero').forEach(hero => {
      hero.addEventListener('click', () => openProject(hero.closest('.project')));
      hero.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openProject(hero.closest('.project'));
        }
      });
    });

    work.querySelectorAll('.project-back').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        closeProject(btn.closest('.project'));
      });
    });
  }

  // ===== Archive Page =====
  const archiveDetail = document.querySelector('.archive-detail');

  if (archiveDetail) {
    function closeArchiveDetail() {
      document.querySelectorAll('.archive-item.is-active').forEach(i => i.classList.remove('is-active'));
      archiveDetail.setAttribute('aria-hidden', 'true');
      archiveDetail.addEventListener('transitionend', function h(e) {
        if (e.propertyName !== 'grid-template-rows') return;
        archiveDetail.removeEventListener('transitionend', h);
        if (archiveDetail.getAttribute('aria-hidden') === 'true') {
          archiveDetail.querySelectorAll('.archive-detail-content').forEach(p => { p.hidden = true; });
        }
      });
    }

    function openArchiveProject(item) {
      const panel = document.getElementById('archive-detail-' + item.dataset.slug);
      if (!panel) return;

      archiveDetail.querySelectorAll('.archive-detail-content').forEach(p => { p.hidden = true; });
      document.querySelectorAll('.archive-item.is-active').forEach(i => i.classList.remove('is-active'));

      panel.hidden = false;
      item.classList.add('is-active');

      const wasOpen = archiveDetail.getAttribute('aria-hidden') === 'false';
      archiveDetail.setAttribute('aria-hidden', 'false');

      const scroll = () => window.scrollTo({
        top: window.scrollY + archiveDetail.getBoundingClientRect().top - 80,
        behavior: 'smooth'
      });
      wasOpen ? scroll() : setTimeout(scroll, 200);
    }

    document.querySelectorAll('.archive-item').forEach(item => {
      item.addEventListener('click', () => {
        item.classList.contains('is-active') ? closeArchiveDetail() : openArchiveProject(item);
      });
    });

    document.querySelectorAll('.archive-close').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        closeArchiveDetail();
        const grid = document.querySelector('.archive-grid');
        window.scrollTo({
          top: window.scrollY + grid.getBoundingClientRect().top - 80,
          behavior: 'smooth'
        });
      });
    });
  }

  // ===== About toggle =====
  const aboutToggles = document.querySelectorAll('[data-about-toggle]');
  const aboutSection = document.getElementById('about');

  if (aboutToggles.length && aboutSection) {
    aboutToggles.forEach(toggle => {
      toggle.addEventListener('click', e => {
        e.preventDefault();
        const isHidden = aboutSection.getAttribute('aria-hidden') === 'true';
        aboutSection.setAttribute('aria-hidden', isHidden ? 'false' : 'true');
        aboutToggles.forEach(t => t.classList.toggle('is-active', isHidden));
        if (isHidden) window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

});
