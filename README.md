# jonathanbobrow.com

Minimal portfolio site built with [Astro](https://astro.build/). Hosted on GitHub Pages.

## Local Development

```
npm install
npm run dev
```

Open http://localhost:4321

## Adding a Project

Create a new markdown file in `src/content/projects/`:

```markdown
---
title: "Project Name"
slug: "project-name"
order: 4
role: "Your Role"
year: "2024"
heroImage: "/images/projects/project-name/hero.jpg"
heroAlt: "Description for accessibility"
detailImages:
  - src: "/images/projects/project-name/detail-01.jpg"
    alt: "Image description"
video: "https://www.youtube.com/embed/VIDEO_ID"
externalLink: "https://example.com"
---

Project description in markdown. This appears when the project is expanded.
```

Add hero and detail images to `public/images/projects/project-name/`.

Push to `main` and GitHub Actions will deploy automatically.

## Image Guidelines

- Hero images: 2400px wide, JPEG, ~200-400KB
- Detail images: 1600px wide
- Use descriptive `heroAlt` text for accessibility
- Hero images named `hero.jpg`/`hero.png`/`hero.webp` are automatically
  converted to responsive WebP variants at build time; original files stay
  available at their `/images/...` URLs

## Performance Notes

The build is tuned for Core Web Vitals:

- All CSS is minified and inlined into the page (no render-blocking stylesheet request)
- Inter is self-hosted (no Google Fonts round-trip) and the above-the-fold weights are preloaded
- Hero images and archive thumbnails are served as responsive WebP `srcset` variants sized to their layout
- Images inside project descriptions are lazy-loaded and served as WebP capped at 1600px (they live in collapsed panels, so nothing loads until a project is opened); GIFs keep their original animated files
- HTML is minified by Astro's default compression
