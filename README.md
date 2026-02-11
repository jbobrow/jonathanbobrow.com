# jonathanbobrow.com

Minimal portfolio site built with [Eleventy](https://www.11ty.dev/). Hosted on GitHub Pages.

## Local Development

```
npm install
npm run dev
```

Open http://localhost:8080

## Adding a Project

Create a new markdown file in `src/projects/`:

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

Add hero and detail images to `src/images/projects/project-name/`.

Push to `main` and GitHub Actions will deploy automatically.

## Image Guidelines

- Hero images: 2400px wide, JPEG, ~200-400KB
- Detail images: 1600px wide
- Use descriptive `heroAlt` text for accessibility
