---
title: "Now Departing"
slug: "now-departing"
order: 10
featured: false
role: "Founder & Developer"
year: "2024"
heroImage: "/images/projects/now-departing/hero.gif"
heroAlt: "Now Departing Apple Watch app showing subway departure times"
externalLink: "https://nowdeparting.app/"
---

Know when your train is coming. That's it.

Now Departing started two years before the app existed, as a Scriptable widget — a few hundred lines of JavaScript living on a home screen, pulling live MTA data through an open API. It did one thing well enough that building something better felt worth the effort.

The native version runs on iPhone and Apple Watch. The watch app was the real motivation: a glance at the wrist while walking down the stairs, departure time visible before you reach the turnstile. Getting an Apple Watch as a gift turned into a watchOS project, built in collaboration with ChatGPT as an AI pair programmer — learning the platform's patterns and constraints through conversation rather than documentation alone.

The data comes from the MTA's GTFS Realtime feed via MTAPI, the same source that powers wheresthef***ingtrain.com. The UI is minimal black — departure times, line icons, nothing extra. Home screen widgets extend the same information without opening the app.

The original Scriptable version is still in the repository, a JavaScript artifact from before there was a native option.
