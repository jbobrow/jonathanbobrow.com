document.addEventListener('DOMContentLoaded', () => {

  // --- Scroll Reveal ---
  const projects = document.querySelectorAll('.project');

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

  // --- Expand / Collapse ---
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

    // Wait for the grid transition to start, then scroll detail into view
    setTimeout(() => {
      const heroRect = hero.getBoundingClientRect();
      const detailRect = detail.getBoundingClientRect();
      // Scroll so the hero bottom + detail are visible
      const targetTop = window.scrollY + heroRect.top - 60;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    }, 200);
  }

  function toggleProject(hero) {
    const section = hero.closest('.project');
    const isOpen = section.classList.contains('is-open');

    if (isOpen) {
      // Scroll to the hero top first, then collapse after scroll settles
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

  // --- Close Buttons ---
  document.querySelectorAll('.project-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const section = btn.closest('.project');
      const hero = section.querySelector('.project-hero');

      // Scroll to hero first, then collapse
      const heroRect = hero.getBoundingClientRect();
      const targetTop = window.scrollY + heroRect.top - 60;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
      setTimeout(() => {
        closeProject(section);
      }, 350);
    });
  });

});
