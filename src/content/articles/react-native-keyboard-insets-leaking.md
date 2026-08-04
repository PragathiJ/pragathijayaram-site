---
title: 'automaticallyAdjustKeyboardInsets is leaking into your other screens: how to check and fix it'
description: 'A React Native iOS ScrollView can inherit keyboard insets from a recycled view it never configured. How to confirm it in your app, find every source, and the three fixes.'
pubDate: 2026-08-04
group: 'production-engineering'
type: 'guide'
tags: ['react-native', 'ios', 'debugging', 'fabric', 'scrollview']
ogImage: '/og/react-native-keyboard-insets-leaking.png'
draft: false
---

A screen opens normally, then scrolls past the end of its content into empty
space, and dragging in that space does nothing at all. Restarting the app is the
only way out.

If that sounds familiar, this is a React Native framework defect, not your code.
This page is the operational version: how to confirm it, how to find every source
in your project, and what to do. The investigation behind it, including why it
took a while to understand,
[is here](/articles/react-native-scrollview-recycling-bug/).

> **Scope.** iOS only, New Architecture only. The code involved is the Fabric iOS
> scroll view, so the old architecture and Android take different paths.
> Reproduced on React Native 0.81.4 and 0.86.2. Filed as
> [react-native#57755](https://github.com/facebook/react-native/issues/57755).

## What is going wrong

A scroll view that sets `automaticallyAdjustKeyboardInsets` keeps that behaviour
switched on when React Native recycles its native view. While the view sits in the
recycle pool it carries on receiving keyboard notifications and writing insets
onto itself. The next component to be handed that view inherits whatever value was
there, and nothing puts it back, because a component that never set the prop has
no inset of its own to assign.

The result is a scroll view with extra scrollable space below its content. That
space has no view underneath it, so it takes no touches, which is why you cannot
drag your way back out of it.

## Confirm it

The first sign is a keyboard appearing on a screen with nothing focused. That is
the tell, not the bug.

The test is to read the inset on a scroll view that should not have one. Put this
on a screen that sets no insets of its own, scroll it with the keyboard hidden,
and watch the console:

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

Two details decide whether this test is worth anything. The scroll view needs
content taller than itself, or it never scrolls, `onScroll` never fires, and you
will conclude you are clean without having tested anything. And the reading has to
be gated, because at a 16ms throttle an ungated `console.warn` buries your log.

A scroll view that never opted in should report zero. Anything else means it is
sitting on a view that came out of the pool still armed.

## Find every source

```bash
grep -rn "automaticallyAdjustKeyboardInsets" src/
grep -rn "contentInset" src/   # also catches contentInsetAdjustmentBehavior
```

The second search matters more than it looks. Any prop that writes native insets
belongs to the native view, and therefore to the recycling pool, so a static
`contentInset` combined with an automatic `contentInsetAdjustmentBehavior` is the
same class of risk even though it has nothing to do with keyboards. In my own
sweep that turned up a grid component the first search had missed.

Then run both again against `node_modules`. The pool is per process, not per
module, so a scroll view inside a dependency arms it exactly as well as one of
yours. You can clean your own code completely and still be handed a poisoned view
by a library you did not write.

## Fix it

**Option 1, remove the prop.** Handle keyboard layout explicitly instead. This is
what I shipped.

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

The `autoFocus={visible}` change matters more than it looks. Focusing on mount is
what starts a keyboard animation during modal presentation, which is exactly the
window the defect needs. Watch for the same shape anywhere a modal resets its
internal state as it closes: that can remount a focused field and open a keyboard
inside a screen that is already going away.

One caveat: `KeyboardAvoidingView` with `behavior="padding"` inside a `Modal`
behaves differently depending on presentation style and often wants a
`keyboardVerticalOffset`. Treat it as a shape to adapt, not a drop-in.

**Option 2, keep the prop but dismiss the keyboard first.** Dismiss it and let it
settle before the screen unmounts. This came back at zero in the reproducer. It is
narrower than option 1, because it depends on every exit path from that screen
doing the same thing.

**Option 3, patch the framework locally.** Until the upstream fix ships you can
carry it as a `patch-package` patch. In `RCTScrollViewComponentView.mm`, clear the
flag on recycle and assign it on every update instead of only when it changes:

```objc
// prepareForRecycle: disarm before the view goes back in the pool
_automaticallyAdjustKeyboardInsets = NO;

// updateProps: drop the old-vs-new condition around the assignment
_automaticallyAdjustKeyboardInsets = newScrollViewProps.automaticallyAdjustKeyboardInsets;
```

Both lines are needed. The first stops the leak. The second matters because
`prepareForRecycle` does not reset the stored props, so once the flag is cleared a
view being reused by another component that *also* wants keyboard insets would
skip the assignment and silently lose the behaviour.

This is the substance of
[react-native#57811](https://github.com/facebook/react-native/pull/57811), which a
Meta engineer has imported for internal review. I verified those changes against
the reproducer on a physical device: 49 cycles, zero failures, where the unpatched
build produced 36 failures in 10 cycles.

**If you are on 0.86.2 and patching the framework**, note that React core ships
prebuilt, so edits to `RCTScrollViewComponentView.mm` in `node_modules` never
reach the binary. You need `RCT_USE_PREBUILT_RNCORE=0` and a fresh `pod install`,
or the patch silently does nothing.

## What does not work

Scrolling the screen back to the top when it opens. I shipped that early and it
does clear the wrong opening position, which is enough to make it look like a
cure. It does not remove the phantom inset, so the dead space is still waiting at
the bottom.

## How to tell you have fixed it

Run the confirmation check again after the flow that used to break things. Zero
inset, and a scroll to the bottom that stops at the end of your content with
nothing beneath it.
