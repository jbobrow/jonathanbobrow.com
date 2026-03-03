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
      hero.addEventListener('click', () => {
        const section = hero.closest('.project');
        section.classList.contains('is-open') ? closeProject(section) : openProject(section);
      });
      hero.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const section = hero.closest('.project');
          section.classList.contains('is-open') ? closeProject(section) : openProject(section);
        }
      });
    });

    work.querySelectorAll('.project-back').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        closeProject(btn.closest('.project'));
      });
    });

    document.querySelector('.site-name').addEventListener('click', e => {
      e.preventDefault();
      const open = work.querySelector('.project.is-open');
      if (open) closeProject(open);
    });
  }

  // ===== Archive Page: row-by-row fade-in =====
  const archiveGrid = document.querySelector('.archive-grid');

  if (archiveGrid) {
    const archiveItems = [...archiveGrid.querySelectorAll('.archive-item')];

    // Group items by offsetTop — items sharing the same top are in the same row
    const rowMap = new Map();
    archiveItems.forEach(item => {
      const top = item.offsetTop;
      if (!rowMap.has(top)) rowMap.set(top, []);
      rowMap.get(top).push(item);
    });

    // Assign --reveal-delay per row (100ms between rows); CSS uses it for transition-delay
    [...rowMap.values()].forEach((rowItems, rowIndex) => {
      rowItems.forEach(item => {
        item.style.setProperty('--reveal-delay', (rowIndex * 100) + 'ms');
      });
    });

    const revealArchive = () => {
      archiveItems.forEach(item => item.classList.add('is-visible'));
    };

    // Wait for page load, then reveal
    if (document.readyState === 'complete') {
      revealArchive();
    } else {
      window.addEventListener('load', revealArchive);
    }
  }

  // ===== Archive Page: detail expand =====
  const archiveDetail = document.querySelector('.archive-detail');

  if (archiveDetail) {
    // Create tail element once
    const tail = document.createElement('div');
    tail.className = 'archive-detail-tail';
    archiveGrid.appendChild(tail);

    function positionTail(item) {
      const itemRect = item.getBoundingClientRect();
      const gridRect = archiveGrid.getBoundingClientRect();
      const detailRect = archiveDetail.getBoundingClientRect();
      tail.style.left = (itemRect.left + itemRect.width / 2 - gridRect.left) + 'px';
      tail.style.top = (detailRect.top - gridRect.top - 10) + 'px';
      tail.classList.add('is-visible');
    }

    function closeArchiveDetail() {
      const activeItem = archiveGrid.querySelector('.archive-item.is-active');
      document.querySelectorAll('.archive-item.is-active').forEach(i => i.classList.remove('is-active'));
      tail.classList.remove('is-visible');
      archiveDetail.setAttribute('aria-hidden', 'true');
      archiveDetail.addEventListener('transitionend', function h(e) {
        if (e.propertyName !== 'grid-template-rows') return;
        archiveDetail.removeEventListener('transitionend', h);
        if (archiveDetail.getAttribute('aria-hidden') === 'true') {
          archiveDetail.querySelectorAll('.archive-detail-content').forEach(p => { p.hidden = true; });
        }
        if (activeItem) {
          const header = document.querySelector('.site-header');
          const headerHeight = header ? header.offsetHeight : 0;
          window.scrollTo({
            top: window.scrollY + activeItem.getBoundingClientRect().top - headerHeight - 24,
            behavior: 'smooth'
          });
        }
      });
    }

    function openArchiveProject(item) {
      const panel = document.getElementById('archive-detail-' + item.dataset.slug);
      if (!panel) return;

      const wasOpen = archiveDetail.getAttribute('aria-hidden') === 'false';
      const activeItem = archiveGrid.querySelector('.archive-item.is-active');
      const sameRow = wasOpen && activeItem &&
        Math.abs(activeItem.getBoundingClientRect().top - item.getBoundingClientRect().top) < 5;

      if (sameRow) {
        // Fade out current content, swap, fade new content in
        const outEls = [...archiveDetail.querySelectorAll('.archive-detail-inner > *')];
        outEls.forEach(el => {
          el.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
          el.style.opacity = '0';
          el.style.transform = 'translateY(-0.25rem)';
        });

        setTimeout(() => {
          archiveDetail.querySelectorAll('.archive-detail-content').forEach(p => { p.hidden = true; });
          archiveGrid.querySelectorAll('.archive-item.is-active').forEach(i => i.classList.remove('is-active'));
          panel.hidden = false;
          item.classList.add('is-active');

          // Snap new content to start state, then let CSS transition take over
          const inEls = [...panel.querySelectorAll('.archive-detail-inner > *')];
          inEls.forEach(el => { el.style.transition = 'none'; el.style.opacity = '0'; el.style.transform = 'translateY(0.5rem)'; });
          archiveDetail.offsetHeight;
          inEls.forEach(el => { el.style.transition = ''; el.style.opacity = ''; el.style.transform = ''; });

          positionTail(item);
        }, 200);

        return;
      }

      // Different row or first open: close instantly if already open
      if (wasOpen) {
        const innerEls = [...archiveDetail.querySelectorAll('.archive-detail-inner > *')];
        archiveDetail.style.transition = 'none';
        innerEls.forEach(el => { el.style.transition = 'none'; });
        archiveDetail.setAttribute('aria-hidden', 'true');
        archiveDetail.offsetHeight; // force reflow — children snap to opacity:0
        archiveDetail.style.transition = '';
        innerEls.forEach(el => { el.style.transition = ''; });
      }

      // Swap content and active state
      archiveDetail.querySelectorAll('.archive-detail-content').forEach(p => { p.hidden = true; });
      archiveGrid.querySelectorAll('.archive-item.is-active').forEach(i => i.classList.remove('is-active'));
      panel.hidden = false;
      item.classList.add('is-active');

      // Find last item in the clicked row and insert panel after it
      const clickedTop = item.getBoundingClientRect().top;
      const allItems = [...archiveGrid.querySelectorAll('.archive-item')];
      const rowItems = allItems.filter(i => Math.abs(i.getBoundingClientRect().top - clickedTop) < 5);
      rowItems[rowItems.length - 1].after(archiveDetail);

      // Snap new panel children to opacity:0 so browser records the "from" state
      const inEls = [...panel.querySelectorAll('.archive-detail-inner > *')];
      inEls.forEach(el => { el.style.transition = 'none'; el.style.opacity = '0'; el.style.transform = 'translateY(1rem)'; });
      archiveDetail.offsetHeight; // force reflow
      inEls.forEach(el => { el.style.transition = ''; el.style.opacity = ''; el.style.transform = ''; });

      // Position tail to point at the selected item's thumbnail center
      positionTail(item);

      // Defer open to next frame so browser records children at opacity:0 before transitioning
      requestAnimationFrame(() => {
        archiveDetail.setAttribute('aria-hidden', 'false');
        setTimeout(() => window.scrollTo({
          top: window.scrollY + archiveDetail.getBoundingClientRect().top - 80,
          behavior: 'smooth'
        }), wasOpen ? 0 : 200);
      });
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
      });
    });

    document.querySelector('.site-name').addEventListener('click', e => {
      if (archiveDetail.getAttribute('aria-hidden') === 'false') {
        e.preventDefault();
        closeArchiveDetail();
      }
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

    document.querySelector('.site-name').addEventListener('click', () => {
      if (aboutSection.getAttribute('aria-hidden') === 'false') {
        aboutSection.setAttribute('aria-hidden', 'true');
        aboutToggles.forEach(t => t.classList.remove('is-active'));
      }
    });
  }

  // ===== YouTube facade =====
  document.querySelectorAll('iframe[src*="youtube.com/embed"]').forEach(iframe => {
    const match = iframe.src.match(/\/embed\/([^?&]+)/);
    if (!match) return;
    const id = match[1];
    const src = iframe.src;

    const facade = document.createElement('div');
    facade.className = 'youtube-facade';
    facade.setAttribute('role', 'button');
    facade.setAttribute('tabindex', '0');
    facade.setAttribute('aria-label', 'Play video');
    facade.innerHTML = `
      <img src="https://img.youtube.com/vi/${id}/maxresdefault.jpg"
           onerror="this.src='https://img.youtube.com/vi/${id}/hqdefault.jpg'"
           alt="" loading="lazy">
      <div class="youtube-play">
        <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="36" cy="36" r="36" fill="white" fill-opacity="0.92"/>
          <polygon points="29,22 29,50 54,36" fill="black"/>
        </svg>
      </div>`;

    const play = () => {
      const el = document.createElement('iframe');
      el.src = src + (src.includes('?') ? '&' : '?') + 'autoplay=1';
      el.allowFullscreen = true;
      el.allow = 'autoplay; encrypted-media';
      facade.replaceWith(el);
    };

    facade.addEventListener('click', play);
    facade.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play(); }
    });

    iframe.replaceWith(facade);
  });

});
