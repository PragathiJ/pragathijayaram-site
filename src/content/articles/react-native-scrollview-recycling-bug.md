---
title: 'The bug that survived being recycled'
description: 'A keyboard flicker on a screen with no text input led to a React Native framework issue, a three-file reproducer, and react-native#57755.'
pubDate: 2026-08-01
group: 'production-engineering'
type: 'investigation'
tags: ['react-native', 'ios', 'debugging', 'fabric']
draft: true
---

After logging a meal in my app, every modal still opened correctly. The first
scroll inside one did not. It ran into blank space, and no amount of scrolling
brought the content back. The only way out was to restart the app.

Server logs were healthy. Nothing had failed. The tell was somewhere else: a
keyboard flicker on a screen with no text input focused.
