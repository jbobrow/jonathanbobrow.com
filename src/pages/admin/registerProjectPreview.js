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

import MarkdownIt from 'markdown-it';

// Same engine + options as src/lib/projects.ts, so headings, images, and
// raw HTML (our video component's <iframe data-src=...> block) render
// identically to the live site. Sveltia's own widgetFor('body') widget
// runs the body through a sanitizing renderer that silently drops raw
// HTML — fine for typed markdown, but it strips the video block entirely,
// which is why this renders the body directly instead of using widgetFor.
const md = new MarkdownIt({ html: true });

function renderBody(raw) {
  const html = md.render(raw || '');
  // The live site loads inline videos lazily via data-src, only swapping
  // in src once a user opens the project (see main.js). There's no such
  // interaction here, so surface the video immediately for a useful
  // editing preview instead of leaving a blank box.
  return html.replace(/<iframe data-src="/g, '<iframe src="');
}

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
        h('div', {
          className: 'project-description',
          dangerouslySetInnerHTML: { __html: renderBody(field(entry, 'body')) },
        }),
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
