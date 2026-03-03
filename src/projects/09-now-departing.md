---
title: "Now Departing"
slug: "now-departing"
order: 10
featured: true
role: "Founder & Developer"
year: "2024"
heroImage: "/images/projects/now-departing/hero.jpg"
heroAlt: "Now Departing Apple Watch app showing subway departure times"
externalLink: "https://nowdeparting.app/"
---

Know when your train is coming. That's it.

Available in the [iOS App Store](https://apps.apple.com/us/app/now-departing/id6740440448) (for iPhone and WatchOS).

## Design across scales
Designing for public signage versus designing for an individual, an iPhone, or a watch, comes with its own affordances and user needs. For example, a public subway sign doesn't care which train you are taking, it is going to prioritize the one that is next. With Now Departing, I made considered decisions about not just what to show, but how to show it. Since users can use Google Maps or similar to get detailed directions, Now Departing gets to focus on a different usecase: "I know where I'm going, I do this everyday, I just need to know when the train is coming."

## Javascript on iOS
Now Departing started two years before the app existed, as a Scriptable widget. I wrote the few hundred lines of JavaScript while riding the subway. The goal was to make sure I never enter a subway station, simply to find out I just missed a train and am now past the turnstyle instead of enjoying a matcha. I shared on Twitter, and lots of people asked where they could get it. This was reason enough to turn it into a native app.

<div style="width: 500px; margin: 0 auto; text-align: center;"><blockquote class="twitter-tweet"><p lang="en" dir="ltr">I’d love to get feedback on a widget I made for iOS this weekend. I made it as a little present to myself and any other New Yorkers that ride the same Subway everyday. <a href="https://t.co/ndvpnADOCY">pic.twitter.com/ndvpnADOCY</a></p>&mdash; Jonathan Bobrow (@JonathanBobrow) <a href="https://twitter.com/JonathanBobrow/status/1607868394996465665?ref_src=twsrc%5Etfw">December 27, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

## Native iOS (Swift)
The native version runs on iPhone and Apple Watch. The watch app was the real motivation: a glance at the wrist while walking down the stairs, departure time visible before you reach the turnstile. Getting an Apple Watch as a gift turned into a watchOS project, built in collaboration with ChatGPT as an AI pair programmer, learning the platform's patterns and constraints through conversation rather than documentation alone.

The data comes from the MTA's GTFS Realtime feed via MTAPI, the same source that powers wheresthef***ingtrain.com. The UI is directly inspired by Massimo Vignelli's clean black and white typography and lines — departure times, line icons, nothing extra. Home screen widgets extend the same information without opening the app.

The original Scriptable version is still in the repository, a JavaScript artifact from before there was a native option. The following is some explorations for how to have the widget show train direction.

![Scriptable widget process sketches](/images/projects/now-departing/process-1.jpg)
