---
title: 'The bug that survived being recycled: automaticallyAdjustKeyboardInsets and Fabric view recycling on iOS'
description: 'A screen that scrolled into empty space and would not scroll back. The trail led to a React Native framework defect, a public reproducer, and a fix now in review upstream.'
pubDate: 2026-08-03
updatedDate: 2026-08-04
group: 'production-engineering'
type: 'investigation'
tags: ['react-native', 'ios', 'debugging', 'fabric', 'scrollview']
ogImage: '/og/react-native-scrollview-recycling-bug.png'
draft: false
---

After logging a meal in [Anovi](/portfolio/), the nutrition app I build, the
next screen opened normally. The content was
there. Then the first scroll ran past the end of it, into empty space that should
not have existed, and stopped.

Dragging in that space did nothing. Not a slow scroll, not a bounce. Nothing
moved, because there was nothing under my finger. The content was somewhere above
me and there was no way to reach it. The only way out was to kill the app.

It was not every screen and not every time, which is what kept it alive through
earlier rounds of testing. It produced no crash, no error, and no failed request.

> **In short.** On iOS with the New Architecture, a scroll view that opted into
> keyboard inset handling can leave that behaviour switched on when React Native
> recycles it. The next screen to inherit that view gets a phantom inset it never
> asked for. Filed as
> [react-native#57755](https://github.com/facebook/react-native/issues/57755).
> If you just want to check and fix your own app, that is
> [a separate, shorter piece](/articles/react-native-keyboard-insets-leaking/).

## The evidence that was missing

Every request in the sequence returned what it should, in the time it should.
Nothing failed, nothing timed out, nothing appeared in the logs at the moment
things went wrong. The app had not crashed and was not in an error state.

Healthy logs are usually read as the absence of a finding. Here they were the
finding, because they eliminated the entire category I had been searching in.
That is what promoted the next detail from background noise to the only lead.

The next detail was the keyboard. On the broken screens it appeared, briefly, and
went away again. On a screen with no text input on it and nothing focused.

A keyboard reacting where there is nothing to type into is not a rendering bug.
Something was still listening.

## The screen that broke was not the screen at fault

React Native's new architecture recycles native views. Rather than destroying a
component's native view and building a fresh one, it resets the existing view and
hands it to the next component that needs the same kind. On iOS, that reset
happens in a method called `prepareForRecycle`.

Recycling is only safe if the reset is complete. Anything left behind belongs to
whoever inherits the view next.

A scroll view can opt into having iOS adjust its insets when the keyboard moves,
with a prop called `automaticallyAdjustKeyboardInsets`. Underneath, that sets a
flag on the native view and gates a keyboard observer that lives for as long as
the view does. `prepareForRecycle` does not clear that flag.

So the broken screen was innocent. It had no text input, no keyboard props, and
nothing to do with any of this. It had simply been handed a view that came out of
the pool still holding someone else's settings.

### Where the keyboard came from

The view came from the meal logging modal, which does have a scroll view with the
prop set and a search field that focuses itself.

The interesting part is what happened when I closed it. Tapping Done dismissed
the keyboard, reset the modal's internal flow back to its search step, and hid the
modal, all in the same render batch. Resetting the flow remounted the search
field, its `autoFocus` fired, and **the app opened a keyboard inside a modal that
was already closing.**

That is the flicker. Not a leftover from typing, but a keyboard my own code
summoned into a dying screen. Its scroll view then went into the recycle pool
while that keyboard was still up.

None of that is a bug. A keyboard being up while a screen goes away is ordinary,
and the framework is meant to survive it. What it did instead was hand the next
screen a view that was still holding the last one's settings.

## Building something that fails on demand

An explanation that only reproduces inside a nutrition app is not much use to
anyone, and it is not something a framework maintainer can act on. So the next
step was the smallest thing that still fails: a modal with the prop and a focused
input that kills itself mid-animation, then a plain scroll view that mounts
straight afterwards and reports its own geometry.

### The detector that cried wolf

Getting the measurement right took longer than finding the bug.

The first version reported failures that were not failures. A scroll view settling
after a bounce moves on its own, and sampling at the wrong moment records that
jitter as displacement. Several iterations went into separating "this view is
still settling" from "this view has been moved by something else".

> A detector that reports a bug which is not there is worse than no detector,
> because it makes the real signal unfalsifiable.

Everything downstream of it, including the controls, would have been noise
interpreted as evidence.

Once it was honest, the numbers were unambiguous. A scroll view that never asked
for keyboard insets, with the keyboard hidden, reporting a bottom inset of 217.3
points. Its content was 840 points tall in a 234 point window, so the furthest it
should ever scroll is 606. It went to 823.

<figure>
  <a href="/media/react-native-scrollview-recycling-bug/harness-pool-dirty.png">
    <img
      src="/media/react-native-scrollview-recycling-bug/harness-pool-dirty.png"
      alt="The reproducer on React Native 0.86.2 showing a victim scroll view reporting a bottom inset of 217.3 with the keyboard hidden, content 840 and viewport 234, alongside counters for cycles, rogue keyboard events and corrupt readings."
      loading="lazy"
    />
  </a>
  <figcaption>
    Physical iPhone, iOS 26.5.2, Release build, React Native 0.86.2, New
    Architecture. The victim sets no keyboard props of any kind.
  </figcaption>
</figure>

## The controls are the argument

A reproducer that fails is a claim. A reproducer that fails, and stops failing
when you remove exactly one ingredient, is evidence.

Two controls, each from a freshly killed process. Turn off the inset prop:
nothing. Dismiss the keyboard and let it settle before the modal closes: nothing.
Each ingredient is necessary and neither is sufficient. The failure needs a view
configured for keyboard insets to be recycled while its observer is still live.

## Measuring it instead of reasoning about it

Everything so far was inference, from reading source and watching behaviour. The
mechanism deserved a measurement, so I instrumented the framework itself: every
keyboard delivery logged with the view's address and whether it was on screen or
in the recycle pool.

```
rec-in  view=0x108118c00 ivar=1          entering prepareForRecycle
rec-out view=0x108118c00 ivar=1          leaving it, flag still set
kbd     view=0x108118c00 ivar=1 POOLED
write   view=0x108118c00 bottom=217.3 POOLED    ← inset written while pooled
props   view=0x108118c00 old=1 new=0 ivar=0     ← next screen mounts, flag cleared
```

The write lands **while the view is sitting in the pool**, 105ms before anything
mounts on it. When a screen does mount, the flag is cleared immediately, so the
screen you can see is never written to at all.

That ruled out the explanation I had been carrying. An earlier test, where a
poisoned view's scroll position moved after I focused an unrelated text field, had
looked like proof that the recycled view was still listening while mounted. It was
not. The keyboard changed the layout, the window grew from 234 points to 299, the
furthest legal scroll position dropped by 65, and iOS pulled the offset back to
the new limit. Arithmetic, not a live listener.

## What is actually happening

The pooled view keeps receiving keyboard notifications and keeps writing insets
onto itself. It is not stale; it is current. It tracks the keyboard continuously,
taking a real value when a keyboard rises and zero when it falls.

Whatever value it happens to be holding at the moment someone inherits it is what
that screen is stuck with, because the inset is only reassigned when a component's
props change it, and a component that never set the prop has nothing to reassign.

Which means the whole thing turns on timing. Sweeping the delay before the modal
tears itself down, ten cycles each from a fresh process:

| modal torn down after | corrupt readings | phantom inset |
|---|---|---|
| ~120ms | 36 | 217.3 |
| ~220ms | 0 | 0.0 |
| ~320ms | 0 | 0.0 |
| ~520ms | 0 | 0.0 |
| keyboard dismissed first | 0 | 0.0 |

Only the earliest teardown reproduces. Wait longer and the keyboard's own
disappearance reaches the pooled view first, zeroes the inset, and the pool
quietly cleans itself. The bug needs a screen to mount during the narrow window
while a keyboard is up.

That is also why it was intermittent in production, and why it survived earlier
testing rounds. Most of the time nothing mounts inside that window.

### Why it could not be scrolled back

The phantom inset extends the scrollable range past the end of the content, and
that extra region has no view underneath it. So it takes no touches. A drag there
produces no scroll events at all.

In the reproducer a sliver of the last row stays visible, so you can grab that and
pull yourself back. In the app the scroll views were full screen. Once the content
had left the viewport there was nothing to grab, and no gesture in the app could
recover it.

<figure>
  <video controls muted playsinline preload="metadata">
    <source src="/media/react-native-scrollview-recycling-bug/reproducer.mp4" type="video/mp4" />
    Your browser does not support embedded video.
  </video>
  <figcaption>
    The reproducer on a physical device: several poison cycles, then a scroll up
    into the space that should not exist, then taps on an unrelated input.
  </figcaption>
</figure>

That is the difference between a layout glitch and a screen that is finished until
you kill the process.

## What happened after filing

I reproduced it unchanged on React Native 0.86.2, the latest release at the time,
and filed it as
[react-native#57755](https://github.com/facebook/react-native/issues/57755) with a
[public reproducer](https://github.com/PragathiJ/rn-aaki-recycle-repro).

Two pull requests followed, from people I have never met. The second carries a
regression test covering the whole lifecycle, and a Meta engineer imported it for
internal review the same morning it appeared.

Its two lines are small: clear the flag when the view is recycled, and stop
guarding the assignment behind a props comparison so a recycled view can be
re-armed properly. I applied them to the reproducer and ran it on the phone that
found the bug in the first place. Baseline immediately before: 36 corrupt readings
in 10 cycles. With the patch: 49 cycles, zero.

## What I would take from this

**The healthy logs were the finding.** They eliminated a whole category, which is
what turned a flicker into the only lead.

**Controls before claims.** Any bug can be explained by a plausible story. The
question is which single ingredient you can remove to make it stop, and whether
you have actually tried removing it.

**A detector that lies is worse than no detector.** Most of the reproducer work
went into eliminating false positives, not into finding the failure.

**Instrument the explanation, not just the bug.** A story that fits every
observation is not the same as a correct one. Mine was in the right place and the
wrong moment, and only logging the framework showed the difference.

---

If you think your own app has this, the checks and the three ways to fix it are in
[a shorter companion piece](/articles/react-native-keyboard-insets-leaking/).
