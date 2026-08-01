---
title: 'The bug that survived being recycled'
description: 'A keyboard flicker on a screen with no text input led to a React Native framework issue, a three-file reproducer, and react-native#57755.'
pubDate: 2026-08-01
group: 'production-engineering'
type: 'investigation'
tags: ['react-native', 'ios', 'debugging', 'fabric']
ogImage: '/og/react-native-scrollview-recycling-bug.png'
draft: true
---

After logging a meal in my app, every modal still opened correctly. The first
scroll inside one did not. It ran into blank space, and no amount of scrolling
brought the content back. The only way out was to restart the app.

It was not every modal, and not every time. It was any modal opened after the
meal logging flow, which is the flow with a text input in it.

## What made it misleading

The server was fine. Every request in the sequence returned what it should,
in the time it should. There was no error to chase, no failed fetch, nothing in
the logs that marked the moment things went wrong. The application had not
crashed and had not entered an error state. It was rendering a screen that was
mostly empty.

The tell was somewhere I was not looking. On the broken screens, the keyboard
flickered. Briefly, at the moment the modal appeared, on a screen that had no
text input at all and nothing focused.

A keyboard reacting on a screen with nothing to type into is not a rendering
bug. It means something is still listening.

## Finding it in the framework

React Native's new architecture recycles native views. Rather than tearing down
a component's native view and building a new one, it resets the existing view
and hands it to the next component that needs one. `prepareForRecycle` is where
that reset happens.

Reading `RCTScrollViewComponentView.mm`, two things stood out. The
`automaticallyAdjustKeyboardInsets` state and the keyboard observer registered
alongside it are not cleared there. They belong to the native view, and the
native view outlives the component that configured them.

So a scroll view that had been configured for keyboard insets, inside a screen
with a text input, gets recycled into a modal that has neither. The new modal
inherits a listener it never asked for. When the keyboard appears or dismisses
anywhere in the app, that listener adjusts the modal's content inset, and the
content moves out of view.

That explained the shape of the failure. It only happened after the flow with
the input, it only affected screens that came later, and it looked like blank
space rather than an error, because the content was still there. It had been
pushed somewhere the viewport was not.

## Making it reproducible

An explanation that only reproduces inside a nutrition app is not much use to
anyone else. So the next step was to strip it to the smallest thing that still
fails.

The reproducer is three files with no dependencies beyond React Native itself:

- A **poison modal** that mounts a scroll view with keyboard inset adjustment
  enabled and a focused input, then dismisses.
- An **instrumented victim** modal with neither, which records its own content
  offset over time.
- A **detector** that decides whether the victim ended up somewhere it should
  not have.

Getting the detector right took longer than finding the bug. The first version
reported failures that were not failures: a scroll view settling after a bounce
moves on its own, and if you sample at the wrong moment you record that jitter
as displacement. Several iterations went into separating "this view is still
settling" from "this view has been moved by something else".

That is the part worth stating plainly. A detector that reports a bug that is
not there is worse than no detector, because it makes the real signal
unfalsifiable.

## The controls

A reproducer that fails is a claim. A reproducer that fails, and stops failing
when you remove one ingredient, is evidence.

Two controls:

- **Keyboard inset adjustment off in the poison modal**: zero failures.
- **Dismissing the keyboard before the poison modal closes**: zero failures.

Both ingredients are required. The inset flag alone does nothing. A keyboard
event alone does nothing. The failure needs a view configured for keyboard
insets to be recycled while its observer is still live.

## Testing whether the listener is really live

Controls prove which ingredients matter. They do not prove the mechanism.

So: open the victim modal, then trigger a keyboard somewhere else entirely, on
a screen the victim has nothing to do with. The victim's content offset moves
in response.

That is the difference between values and behaviour. Reading a stale inset
value off a recycled view would be a leak. A view that responds to a foreign
keyboard is a live subscription that outlived the component that created it.

## Checking the current version

Before filing anything, it had to be checked against the current release rather
than the version my app happens to run.

I reproduced it unchanged on React Native 0.86.2, the latest stable at the time,
and filed it as [react-native#57755](https://github.com/facebook/react-native/issues/57755).
The reproducer is public at
[PragathiJ/rn-aaki-recycle-repro](https://github.com/PragathiJ/rn-aaki-recycle-repro).

There is a lesson in how nearly I got that step wrong. I first checked whether
the reset code existed by searching the repository. It appeared to be there. It
was not there in the release I was running, it was on the default branch. A
substring match across a checkout tells you nothing about the version your users
are on. Verify at the version tag.

## What I changed in the app

The app-level fix was to stop relying on the flag. I removed
`automaticallyAdjustKeyboardInsets` across the app and handled keyboard layout
explicitly instead, then re-armed the original trigger to confirm the failure
was gone.

> TODO: paste the two workaround snippets here, the before and after, plus the
> screenshot and a gif made from the 1.1MB recording.

For anyone on 0.81.x or Expo SDK 54, the same workaround applies: either avoid
the flag on scroll views that live inside recycled screens, or ensure the
keyboard is dismissed before such a screen is torn down.

## What I would take from this

**Instrument the absence of evidence.** The healthy logs were the finding. They
ruled out the entire category I was searching in, which is what made the
keyboard flicker significant instead of incidental.

**Controls before claims.** Any bug can be explained by a plausible story. The
question is which single ingredient you can remove to make it stop.

**A detector that lies is worse than no detector.** Most of the reproducer work
went into eliminating false positives, not into finding the failure.

**Verify at the version tag, not on the default branch.** The fix you are
reading may not exist in the code your users are running.
