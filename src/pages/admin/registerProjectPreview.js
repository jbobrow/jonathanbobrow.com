// Mirrors the markup in src/pages/index.astro / src/pages/archive.astro
// (project-hero, project-hero-overlay, project-detail-inner,
// project-description, ...) so the preview pane — styled with the site's
// real stylesheet via registerPreviewStyle — looks like the actual project
// card instead of a plain field-by-field form dump.
//
// Sveltia bundles its own Preact instance privately and does not export it
// as an importable module, so a separately npm-installed React/Preact copy
// produces elements the CMS's internal renderer rejects ("Minified React
// error #525: multiple copies of react"). Sveltia exposes its own
// createElement as window.h specifically so preview/editor plugins can
// build compatible elements — this must be read at call time (after the
// CMS bundle has loaded and set it), not imported at module scope.

function field(entry, name) {
  return entry.getIn(['data', name]);
}

function ProjectPreview({ entry, widgetFor }) {
  const h = window.h;
  const title = field(entry, 'title') || 'Untitled Project';
  const role = field(entry, 'role');
  const year = field(entry, 'year');
  const heroSketch = field(entry, 'heroSketch');
  const detailImages = field(entry, 'detailImages');
  const video = field(entry, 'video');
  const externalLink = field(entry, 'externalLink');

  return h('div', { className: 'admin-preview' }, [
    h('div', { className: 'project-hero', style: { height: '50vh', minHeight: '280px' } }, [
      heroSketch
        ? h(
            'div',
            {
              className: 'project-hero-sketch is-ready',
              style: {
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#666',
                fontSize: '0.85rem',
              },
            },
            `p5.js sketch: "${heroSketch}" (not rendered in preview)`
          )
        : widgetFor('heroImage'),
      h('div', { className: 'project-hero-overlay' }, [
        h('h2', null, title),
        role || year
          ? h('p', { className: 'project-meta' }, [
              role,
              role && year ? h('span', { className: 'meta-sep' }, ' · ') : null,
              year,
            ])
          : null,
      ]),
    ]),
    // .project-detail-inner's children are opacity:0 by default — the real
    // site only reveals them once main.js sets aria-hidden="false" on this
    // wrapping .project-detail when a user opens the project. The preview
    // has no such interaction, so it's rendered already in the "open" state.
    h('div', { className: 'project-detail', 'aria-hidden': 'false' }, [
      h('div', { className: 'project-detail-inner', style: { padding: '2rem 2rem 4rem' } }, [
        h('div', { className: 'project-description' }, widgetFor('body')),
        detailImages && detailImages.size > 0
          ? h('div', { className: 'project-gallery' }, widgetFor('detailImages'))
          : null,
        video
          ? h(
              'div',
              { className: 'project-video' },
              h(
                'div',
                { className: 'video-embed' },
                h('iframe', { src: video, allowFullScreen: true, loading: 'lazy' })
              )
            )
          : null,
        externalLink
          ? h(
              'a',
              { className: 'project-link', href: externalLink, target: '_blank', rel: 'noopener' },
              'Visit Project →'
            )
          : null,
      ]),
    ]),
  ]);
}

export function registerProjectPreview(CMS) {
  CMS.registerPreviewTemplate('projects', ProjectPreview);
}
