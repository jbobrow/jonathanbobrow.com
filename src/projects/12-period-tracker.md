---
title: "Period Tracker"
slug: "period-tracker"
order: 13
featured: false
role: "Developer"
year: "2022"
heroImage: "/images/projects/period-tracker/hero.jpg"
heroAlt: "Period Tracker home screen widget showing cycle progress"
externalLink: "https://github.com/jbobrow/Period-Tracker"
---

A home screen widget for tracking menstrual cycles, built for the Scriptable app on iOS. The display shows cycle progress at a glance — where you are, how long until the next period, averages calculated from your history.

![Period tracking widget for iOS](/images/projects/period-tracker/period-widgets-01.jpg)

The data lives in a CSV file in iCloud Drive. No app, no account, no server — just a file you own, visible in the Files app, importable anywhere. The two-script architecture keeps concerns separate: one script for the widget display, one for logging a new period start date.

Privacy by design, not by policy. The same philosophy that runs through Cookbo and other tools: if the data is yours, it should actually be yours — stored as plain text, in a folder you can see, portable to whatever comes next.

Built in JavaScript, entirely within Scriptable's sandbox.
