---
title: "Pointer Pals"
slug: "pointer-pals"
order: 9
featured: false
role: "Founder & Developer"
year: "2023"
heroImage: "/images/projects/pointer-pals/hero.jpg"
heroAlt: "Pointer Pals app showing remote cursors on a Mac desktop"
externalLink: "https://pointerpals.jonbobrow.com/"
---

Remote work flattened presence into a series of video calls and status dots. Pointer Pals is a quieter experiment: what if you could just see where your collaborators' cursors were, right on your screen, without any meeting or notification?

The app renders remote cursors as a transparent, always-on-top overlay. They show up, labeled with a name, move in real time at 30 FPS, and fade after five seconds of inactivity. They don't block anything. They don't ask for attention. They're just there — a peripheral signal that someone else is working too.

The architecture uses normalized coordinates so cursor positions translate correctly across different screen sizes. A WebSocket server running on Google Cloud handles the pub/sub layer. The macOS client is Swift/SwiftUI; a Windows client exists in C#/WPF for cross-platform pairs.

The marketing site demonstrates the idea without any installation — two animated cursors trace paths across the page, showing exactly what the experience feels like before you commit to downloading anything.

The name came easily. They follow you around. They're your pals.
