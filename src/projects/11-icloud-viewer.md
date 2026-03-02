---
title: "iCloud Viewer"
slug: "icloud-viewer"
order: 12
featured: false
role: "Founder & Developer"
year: "2024"
heroImage: "/images/projects/icloud-viewer/hero.jpg"
heroAlt: "iCloud Viewer showing a photo grid from a shared album"
externalLink: "https://icloudviewer.com/"
---

Shared iCloud albums are useful until you want to do anything with them — bulk download, browse on a non-Apple device, or just see everything in a proper grid. iCloud Viewer fills that gap: paste a share link, get a full gallery.

No Apple ID required. No installation. The entire frontend is a single React HTML file with no build step — JSX in a `<script>` tag, dependencies loaded from CDN, ready to fork or self-host. A lean Express backend proxies requests to the iCloud Shared Streams API, which doesn't support CORS from the browser directly.

The gallery adjusts from 2 to 20 columns, filters by photo or video and by contributor, sorts by date, and exports a ZIP of everything or just one type. The full-resolution viewer supports keyboard arrows and touch swipes. Videos play inline with poster frames. The whole thing is deployed on Google Cloud Run's free tier.

The design takes cues from Apple's own aesthetic — smooth transitions, clean grid, nothing in the way of the photos themselves.
