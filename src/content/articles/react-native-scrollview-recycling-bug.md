---
title: 'The bug that survived being recycled: automaticallyAdjustKeyboardInsets and Fabric view recycling on iOS'
description: 'An iOS ScrollView applied keyboard insets it never opted into. automaticallyAdjustKeyboardInsets survives Fabric view recycling. Traced, reproduced, filed.'
pubDate: 2026-08-03
group: 'production-engineering'
type: 'investigation'
tags: ['react-native', 'ios', 'debugging', 'fabric', 'scrollview']
ogImage: '/og/react-native-scrollview-recycling-bug.png'
draft: false
---

After logging a meal in my app, every modal still opened correctly and the
content was there. Then the first scroll ran past the end of it into empty space
below, and no amount of scrolling brought the content back. The only way out was
to restart the app.

It was not every modal, and not every time. It was any modal opened after the
meal logging flow, which is the one flow with a text input in it. This surfaced
in the last round of testing before submitting the app for review, which is the
worst possible time to find a bug that produces no error, no crash and no failed
request.

The trail ends at a React Native framework issue and a public reproducer.

> **Scope.** iOS only, New Architecture only. The code involved is the Fabric
> iOS scroll view, so the old architecture and Android use different paths.
> Reproduced on 0.81.4 and on 0.86.2, the latest stable at the time of writing,
> and the relevant code is unchanged on the default branch. If you are here
> because your own app is doing this, skip to
> [If you think you have this](#if-you-think-you-have-this).

## The evidence that was missing

The server was fine. Every request in the sequence returned what it should, in
the time it should. Nothing failed, nothing timed out, and nothing appeared in
the logs at the moment things went wrong. The app had not crashed and was not in
an error state. It was rendering a screen that was mostly empty.

Healthy logs are usually read as the absence of a finding. Here they were the
finding, because they ruled out the entire category I had been searching in.
That is what made the next detail significant instead of incidental.

The next detail was the keyboard. On the broken screens it flickered, briefly,
at the moment the modal appeared, on a screen with no text input and nothing
focused.

A keyboard reacting on a screen with nothing to type into is not a rendering
bug. Something was still listening.

## What the framework does with a view you stop using

React Native's new architecture recycles native views. Instead of tearing down a
component's native view and building a fresh one, it resets the existing view
and hands it to the next component that needs the same kind. On iOS, the reset
happens in `prepareForRecycle`.

Recycling is only safe if the reset is complete. Anything left behind on the
native view becomes the inheritance of a component that never asked for it.

### One flag, and an observer that trusts it

Two pieces of `RCTScrollViewComponentView.mm` matter here. The first is the
`_automaticallyAdjustKeyboardInsets` flag, which records whether this scroll
view opted into keyboard inset handling. The second is a
`UIKeyboardWillChangeFrame` observer, registered for the whole lifetime of the
native view and gated only by that flag. When the flag is on, the observer
writes keyboard geometry into the scroll view's content inset and offset.

The observer is not itself a fault. A subscription that costs nothing while a
flag tells it to stand down is a reasonable design. It becomes a fault the
moment the flag can be wrong, because at that point nothing else is checking.

`prepareForRecycle` does not clear the flag.

So a view can go back into the pool still marked as one that wants keyboard
insets, with a live subscription to prove it. And a pooled view is not inert
while it waits. It is an allocated scroll view with a registered observer, and
the keyboard machinery has no idea that the component which asked for it is
gone. A keyboard event arriving in that window has the handler write keyboard
geometry into a view that currently belongs to nobody.

That window is what the reproducer aims at, by closing the modal while the
keyboard animation is still running. The next component to take that view out of
the pool inherits the result, because the reset ran before the write, not after.

That matched the shape of the failure. It only happened after the flow with the
input, it only affected screens mounted later, and it looked like blank space
rather than an error, because the content was still there. It had been pushed
somewhere the viewport was not.

### What I can show, and what I cannot

One thing here is unresolved. The assignment that sets the flag is guarded by a
comparison against the previous owner's props, which suggests it should be
cleared when the next component mounts, while the agitator test below shows the
keyboard machinery still live on a view that has already mounted. I have not
instrumented the mount path, so I cannot say which reading is incomplete.

Take the mechanism as far as the evidence goes and no further. What is
demonstrated is that a view returns to the pool armed and subscribed, and that
the next owner pays for it. I will update this once I have logged the flag on a
device.

### Why the values look clean

There is a version of this story that is simply a stale value surviving a reset,
and it is worth ruling out, because it changes what a fix would have to do.

On React Native 0.86.2, `prepareForRecycle` resets both `contentOffset` and
`contentInset`. So the insets I was seeing could not have been inherited: they
were being written after the reset, by an observer that was never disarmed.

> The values are cleaned. The behaviour is not.

That distinction is the whole finding, and it is what the rest of the work had
to establish rather than assert.

## Building something that fails on demand

An explanation that only reproduces inside a nutrition app is not much use to
anyone else, and it is not something a framework maintainer can act on. The next
step was to strip it to the smallest thing that still fails.

### The three files

The reproducer has no dependencies beyond React Native itself:

- A **poison modal**: a scroll view with keyboard inset adjustment enabled and a
  focused input, closed while the keyboard is still animating in.
- A **victim**: a freshly mounted plain scroll view with no inputs and no
  keyboard props, which reports its own content inset and offset as it scrolls.
- A **detector**: on-screen counters that decide whether the victim ended up
  somewhere it should not have.

The race is closed deliberately. The modal is killed roughly 120ms after mount,
while the keyboard show animation is still in flight, because that is the window
in which a view gets pooled with its keyboard machinery still active.

### The detector that cried wolf

Getting the detector right took longer than finding the bug.

The first version reported failures that were not failures. A scroll view
settling after a bounce moves on its own, and sampling at the wrong moment
records that jitter as displacement. Several iterations went into separating
"this view is still settling" from "this view has been moved by something else":
range checks only on settled readings, then a widened tolerance once it became
clear that bounce jitter was flagging otherwise clean runs.

> A detector that reports a bug which is not there is worse than no detector,
> because it makes the real signal unfalsifiable.

Everything after it, including the controls below, would have been noise
interpreted as evidence.

## What the reproducer reports

<figure>
  <a href="/media/react-native-scrollview-recycling-bug/harness-pool-dirty.png">
    <img
      src="/media/react-native-scrollview-recycling-bug/harness-pool-dirty.png"
      alt="Reproducer running on React Native 0.86.2, showing three cycles, three rogue keyboard events, 203 corrupt readings, a maximum insetB of 217.3, a POOL DIRTY banner, and a victim scroll view reporting insetB 217.3 with content 840 and viewport 234."
      loading="lazy"
    />
  </a>
  <figcaption>
    Physical iPhone, iOS 26.5.2, Release build, React Native 0.86.2, New
    Architecture. Keyboard inset adjustment on, keyboard not dismissed before
    close, close-after delay set to 0ms, which in practice kills the modal about
    120ms after it mounts.
  </figcaption>
</figure>

The victim's own geometry is on screen: content 840pt inside a 234pt viewport,
so the furthest legitimate scroll offset is 606. Add a bottom inset of 217.3
that it never asked for, with the keyboard hidden, and it can now be scrolled to
823.3. The reading in the screenshot, 810.3, is simply where that particular
scroll came to rest inside the space that should not exist.

That extra 217.3 is the blank space. Scrolling into it does not bounce back,
because as far as the scroll view is concerned, the space is real.

| Run | Configuration | Result |
|---|---|---|
| Positive | Inset flag on, modal closed mid-keyboard | Phantom `contentInset.bottom` of 217.3 with the keyboard hidden; scroll parks at `maxOffset + 217` in blank space, no bounce-back |
| Control A | Inset flag off, fresh process | 0 corrupt readings, 0 rogue keyboard events |
| Control B | Keyboard dismissed before close, fresh process | 0 corrupt readings, 0 rogue keyboard events |
| Persistence | Further cycles in any configuration | Contamination lasts until the process is killed; the inset re-stamps at the same value and never grows |

## The controls are the argument

> A reproducer that fails is a claim. A reproducer that fails, and stops failing
> when you remove exactly one ingredient, is evidence.

Both controls came back at zero, each from a force-quit fresh process. Remove the
flag and the failure stops. Leave the flag in place but dismiss the keyboard
before the screen unmounts, and the failure stops. Each ingredient is necessary,
and neither is sufficient on its own: the inset flag alone does nothing, and a
keyboard event alone does nothing. The failure needs a view configured for
keyboard insets to be recycled while its observer is still live.

The persistence row is the one that matches the original complaint most closely.
Once a process has a poisoned view in its pool, no later configuration change
cleans it. Restarting the app was the only cure in production for the same
reason.

## Proving it is a live listener, not a stale value

Controls prove which ingredients matter. They do not prove the mechanism.

So: leave a poisoned victim mounted, then trigger a keyboard somewhere else
entirely, on an unrelated input the victim has nothing to do with. The victim's
content offset moves in response.

<figure>
  <video controls muted playsinline preload="metadata">
    <source src="/media/react-native-scrollview-recycling-bug/reproducer.mp4" type="video/mp4" />
    Your browser does not support embedded video.
  </video>
  <figcaption>
    Four poison cycles, then a scroll up into the blank space that should not
    exist, then three taps on the agitator input, which sits outside the victim
    and belongs to nothing the victim renders. Nothing in the app touches the
    victim after it mounts, and it never enabled keyboard inset adjustment.
  </figcaption>
</figure>

That is the difference between values and behaviour. A stale inset read off a
recycled view would be a leak, fixable by zeroing more fields. A view that
responds to a keyboard belonging to a different input is a live subscription
that outlived the component which created it.

The bottom inset itself stays constant during that test, at 217.3, because the
handler assigns the geometric overlap between the scroll view and the keyboard
absolutely on every event rather than adding to what is there. That explains two
things at once: why the value never accumulates, and why a full-screen scroll
view in the real app showed a full keyboard height instead of 217.

It also explains the part of the original symptom that a phantom inset alone
does not. Extra space at the bottom would let you scroll back up to the content.
In the app you could not: the content stayed out of reach until the process was
killed. A view being shoved by every keyboard event, rather than one carrying a
stale number, is what that feels like from the outside.

## Checking it against the current release

Before filing anything, it had to be checked against the current release rather
than the version my app happens to run. I reproduced it unchanged on React
Native 0.86.2, the latest stable at the time, by copying the harness files into
a bare app at that version.

It is filed as
[react-native#57755](https://github.com/facebook/react-native/issues/57755), and
the reproducer is public at
[PragathiJ/rn-aaki-recycle-repro](https://github.com/PragathiJ/rn-aaki-recycle-repro).

There is a lesson in how nearly I got that step wrong. I first checked whether
the reset code existed by searching the repository, and it appeared to be there.
It was not there in the release I was running. It was on the default branch. A
substring match across a checkout tells you nothing about the version your users
are on. Verify at the version tag, which for this article means
[`RCTScrollViewComponentView.mm` at v0.86.2](https://github.com/facebook/react-native/blob/v0.86.2/packages/react-native/React/Fabric/Mounting/ComponentViews/ScrollView/RCTScrollViewComponentView.mm#L363-L365),
not the version of that file you get by searching GitHub.

## What happened after filing

Four days later, another contributor opened
[react-native#57791](https://github.com/facebook/react-native/pull/57791), which
references the issue. It removes the conditional around the flag assignment so
the flag tracks props on every update, sets the flag to `NO` in
`prepareForRecycle`, cancels in-flight scroll view animations before the reset,
and restores the vertical indicator insets that the reset had been leaving
behind.

Note which of those changes is load bearing. Given the open question above, the
one that matters is clearing the flag in `prepareForRecycle`, because that closes
the window while the view sits in the pool. Removing the conditional is
defensive, and cancelling animations addresses a write that lands after the reset
has already run.

It is worth being exact about its status. The pull request is an open draft. It
has no reviewers, no review comments, and its author notes that the iOS native
tests were not run locally because that environment had command line tools but
not Xcode. Nobody has built it or run it against a reproducer. I intend to do
that on the harness and the device that produced the results above, and I will
update this article with whatever comes back.

The useful part, for now, is smaller and more durable than a fix: the report was
specific enough that someone could act on it without asking a single clarifying
question.

## If you think you have this

### Confirm it

The first sign is not the blank scroll. It is a keyboard reacting on a screen
with nothing focused. That flicker means the pool is already dirty and the next
freshly mounted scroll view is the one that will break.

The flicker is a hint. This is the test. Put it on a screen that sets no
keyboard props at all, scroll it with the keyboard hidden, and watch the console:

```tsx
const reported = React.useRef(false);

<ScrollView
  scrollEventThrottle={16}
  onScroll={(e) => {
    // contentInset is iOS-only; on Android nativeEvent has no such field.
    const bottom = e.nativeEvent.contentInset?.bottom ?? 0;
    if (bottom > 0 && !reported.current) {
      reported.current = true;
      console.warn('phantom bottom inset', bottom);
    }
  }}
>
  <View style={{ height: 2000 }} />
</ScrollView>;
```

Two details matter. The scroll view needs content taller than itself, or it will
not scroll and `onScroll` will never fire, and you will conclude you are clean
when you have not tested anything. And the reading has to be gated, because at a
16ms throttle an ungated `console.warn` will bury the rest of your log.

A scroll view that never opted into keyboard insets should report zero. Anything
else means it is sitting on a native view that came out of the pool still armed.
This is what the victim in the reproducer does, and it is how the 217.3 above was
measured.

### Find it

Audit with two searches, not one:

```bash
grep -rn "automaticallyAdjustKeyboardInsets" src/
grep -rn "contentInset" src/   # also catches contentInsetAdjustmentBehavior
```

The second one is the search I nearly skipped. Any prop that writes native
insets belongs to the native view and therefore to the recycling pool, so a
static `contentInset` combined with an automatic
`contentInsetAdjustmentBehavior` is the same class of risk even though it has
nothing to do with keyboards. In my own sweep it turned up one grid component
that the first search had missed.

Then run both again against `node_modules`. The recycle pool is per process, not
per module, so a scroll view inside a dependency arms the pool exactly as well as
one of yours does. This is the uncomfortable part of the audit: you can clean
your own code completely and still be handed a poisoned view by a library you
did not write.

### Fix it

**Option 1, the one I shipped.** Stop relying on the flag and handle keyboard
layout explicitly.

```tsx
// Before: the flag does the layout, and the native view keeps listening
<Modal visible={visible}>
  <ScrollView automaticallyAdjustKeyboardInsets>
    <TextInput autoFocus />
  </ScrollView>
</Modal>
```

```tsx
// After: explicit layout, nothing left armed on the native view
<Modal visible={visible}>
  <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
      <TextInput autoFocus={visible} />
    </ScrollView>
  </KeyboardAvoidingView>
</Modal>
```

The `autoFocus={visible}` change matters more than it looks. Focusing on mount
is what starts a keyboard animation during modal presentation, which is exactly
the window the race needs.

One caveat. `KeyboardAvoidingView` with `behavior="padding"` inside a `Modal`
behaves differently depending on presentation style, and often wants a
`keyboardVerticalOffset` before it sits correctly, so treat this as a shape to
adapt rather than a drop-in.

**Option 2, if you need to keep the flag.** Dismiss the keyboard and let it
settle before the screen unmounts. That is Control B, and it came back at zero in
the same harness. It is narrower than option 1, because it depends on every exit
path from that screen doing the same thing.

**Option 3, patch the framework locally.** If neither fits, the native change is
small enough to carry as a `patch-package` patch in your own repo until the
upstream fix lands. In `RCTScrollViewComponentView.mm`, assign the flag on every
update rather than only when it changes, and clear it on recycle:

```objc
// updateProps: drop the old-vs-new condition around the assignment
_automaticallyAdjustKeyboardInsets = newScrollViewProps.automaticallyAdjustKeyboardInsets;

// prepareForRecycle: disarm before the view goes back in the pool
_automaticallyAdjustKeyboardInsets = NO;
```

That is the substance of the pull request above, which I have not yet run
against the reproducer. Patching a framework you do not maintain is a debt you
carry through every upgrade, so prefer options 1 and 2 unless the flag is load
bearing for you.

### What does not work

Scrolling a modal back to the top when it opens. I shipped that early, and it
does clear the wrong opening position, which is enough to make it look like a
cure. It does not remove the phantom inset, so the blank space is still waiting
at the bottom.

## What I would take from this

**Instrument the absence of evidence.** The healthy logs were the finding. They
eliminated a whole category, which is what promoted a keyboard flicker from
background noise to the only lead.

**Controls before claims.** Any bug can be explained by a plausible story. The
question is which single ingredient you can remove to make it stop, and whether
you have actually tried removing it.

**A detector that lies is worse than no detector.** Most of the reproducer work
went into eliminating false positives rather than into finding the failure.

**Verify at the version tag, not the default branch.** The fix you are reading
may not exist in the code your users are running.

**Distinguish stale values from live behaviour.** They present identically in a
screenshot and require completely different fixes. One is a field somebody
forgot to zero. The other is a subscription still running.
