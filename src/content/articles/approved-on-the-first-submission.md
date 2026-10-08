---
title: 'Approved on the first submission: what it took to get a wellness app through App Review'
description: 'A nutrition app with subscriptions, health data and a third-party AI path, approved on the first attempt. The audit, the test pass, the metadata fortnight, and what the reviewer actually touched.'
pubDate: 2026-10-08T10:00:00Z
group: 'building-in-a-regulated-space'
type: 'investigation'
tags: ['app-store', 'app-review', 'ios', 'compliance', 'gdpr']
ogImage: '/og/approved-on-the-first-submission.png'
draft: false
---

[Anovi](/portfolio/) went into App Review on 27 July and came out approved on
6 August. First submission, no rejection, nothing in Resolution Center.

It is a nutrition app, which means it carries three things App Review looks at
closely and carries them at the same time: auto-renewing subscriptions, health
data, and an AI path that sends what you ate to a model somebody else operates.
After about a decade of shipping software through other channels, it was the
first app I had put in front of a consumer app store.

The approval is not the interesting part. What produced it is. There was an
audit written before submission was on the calendar, a test plan run against a
real purchase on the first day that was legally possible, and a fortnight of
metadata work where being careless and being wrong look identical from the
outside.

This is the account of one submission. The
[companion piece](/articles/app-store-submission-checklist-health-app/) is the
same material in checklist form, where every requirement traces back to Apple's
published rules rather than to one submission.

<figure>
<svg viewBox="0 0 680 170" role="img" aria-labelledby="tl-title" style="width:100%;height:auto;font-family:var(--font-sans)">
<title id="tl-title">Timeline from 17 May to 6 August 2026. Preparation work runs densely from 17 May to submission on 27 July, followed by ten days in the review queue with no activity, then approval on 6 August.</title>
<line x1="30" y1="90" x2="560" y2="90" stroke="var(--accent)" stroke-width="3" />
<line x1="560" y1="90" x2="633" y2="90" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="3 5" opacity="0.7" />
<circle cx="30" cy="90" r="3.5" fill="var(--accent)" />
<circle cx="217" cy="90" r="3.5" fill="var(--accent)" />
<circle cx="261" cy="90" r="3.5" fill="var(--accent)" />
<circle cx="276" cy="90" r="3.5" fill="var(--accent)" />
<circle cx="381" cy="90" r="3.5" fill="var(--accent)" />
<circle cx="455" cy="90" r="3.5" fill="var(--accent)" />
<circle cx="560" cy="90" r="4.5" fill="var(--accent)" />
<circle cx="640" cy="90" r="7" fill="none" stroke="var(--accent)" stroke-width="2.5" />
<circle cx="640" cy="90" r="2.5" fill="var(--accent)" />
<line x1="30" y1="83" x2="30" y2="68" stroke="var(--hairline)" stroke-width="1" />
<line x1="261" y1="83" x2="261" y2="68" stroke="var(--hairline)" stroke-width="1" />
<line x1="560" y1="82" x2="560" y2="68" stroke="var(--hairline)" stroke-width="1" />
<text x="30" y="44" text-anchor="start" font-size="12.5" font-weight="600" fill="var(--ink)">17 May</text>
<text x="30" y="60" text-anchor="start" font-size="11" fill="var(--muted)">audit written</text>
<text x="261" y="44" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">17 Jun</text>
<text x="261" y="60" text-anchor="middle" font-size="11" fill="var(--muted)">first purchase testable</text>
<text x="560" y="44" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">27 Jul</text>
<text x="560" y="60" text-anchor="middle" font-size="11" fill="var(--muted)">submitted</text>
<text x="600" y="116" text-anchor="middle" font-size="11" fill="var(--muted)">ten days queued</text>
<text x="675" y="145" text-anchor="end" font-size="11.5" font-weight="600" fill="var(--ink)">6 Aug, 07:01 UTC &#183; approved that morning</text>
</svg>
<figcaption>Markers are placed by actual date. The stretch to 27 July holds business registration, Apple's contract clocks, the build, the audit, the test pass and the listing, with waiting stacked between them. Everything that decided the outcome sits to the left of that date.</figcaption>
</figure>

## The audit came first, and then the audit needed auditing

I wrote the rejection-risk audit on 17 May: about 175 checks across Apple
guidelines, Play guidelines, trust and data handling, functional resilience,
app-specific risks, and release-build hygiene. It went in before submission had
a date, which was deliberate. A checklist written under deadline pressure is a
checklist written to pass.

The first useful thing executing it did was invalidate part of it. Apple's
guidelines are not a fixed target, and neither is the EU regulation sitting
underneath them. Three of the requirements this checklist depended on had
changed, the most recent of them three weeks before I wrote it:

- Apple had rewritten **Guideline 5.1.2(i)** on
  [13 November 2025](https://developer.apple.com/news/?id=ey6d8onl) to cover
  third-party AI explicitly. A checklist written against the earlier text does
  not mention AI data sharing at all.
- The **age rating system had been replaced**. The tiers are now 4+, 9+, 13+,
  16+ and 18+, the old 12+ and 17+ are gone, and there is a new questionnaire
  covering in-app controls, app capabilities, violent themes and, relevant here,
  [medical or wellness topics](https://developer.apple.com/news/?id=ks775ehf).
- From **28 April 2026**, uploads must be built with Xcode 26 and an iOS 26 SDK
  or later, per Apple's
  [SDK minimum requirements](https://developer.apple.com/news/upcoming-requirements/).

So the first task was auditing the audit against what Apple actually publishes
today, then extending it. That pass added the AI section, rewrote the age-rating
items, added the SDK requirement, and added a section on health-app scrutiny
under 1.4.1.

> A submission checklist is a live document, because Apple's guidelines keep
> moving and the EU's do too, and nobody tells you when. Re-read the source
> before you trust your summary of it.

## Guideline 5.1.2(i): consent is not disclosure

The first finding was the one that mattered. Apple's
[App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
now read, under 5.1.2(i):

> You must clearly disclose where personal data will be shared with third
> parties, including with third-party AI, and obtain explicit permission before
> doing so.

Anovi hits this squarely. When you describe a meal in plain language, that text
goes to Google Gemini for ingredient and nutrition estimation, with Anthropic as
a fallback when Gemini is unavailable. Alongside the meal text goes any
modification you made and, so the estimate does not poison you, your recorded
food allergies.

The word doing the work in that guideline is **permission**. Naming Gemini and
Anthropic in a privacy policy is disclosure, and disclosure is only half of what
the rule asks for. The other half has to exist in the product, before the first
transmission, as something the user actively passes through.

There is a second layer underneath, because allergy information is health data.
Under the GDPR that is
[Article 9](https://eur-lex.europa.eu/eli/reg/2016/679/oj) special-category
data, which needs explicit consent in its own right. And because a decline path
exists, the AI feature is voluntary enrichment rather than something needed to
deliver the contract, which moved its lawful basis from Article 6(1)(b) to
Article 6(1)(a) and pulled a chain of documents along behind it.

What shipped:

- A **backend gate**. The AI routes return `403 ai_consent_required` before any
  model is called. The block is server-side, so it holds regardless of what the
  client does.
- A **just-in-time sheet** on the client. An interceptor catches that specific
  403, opens the consent sheet, and retries the original request if consent is
  granted, so the user's action is not lost.
- **Named providers and named data.** The sheet says Google Gemini and
  Anthropic, and it says meal description, modifications and allergy
  information. Not "service providers", not "third parties".
- **No identity travelling with it.** Nothing identifying the user is sent: no
  name, no email, no account. The allergy information goes on its own rather
  than attached to the rest, so what arrives at the provider is a constraint
  without a person behind it.
- **Withdrawal**, in settings, with each grant and withdrawal written to an
  audit table.

<figure>
<a href="/media/approved-on-the-first-submission/ai-consent-sheet.png">
<img src="/media/approved-on-the-first-submission/ai-consent-sheet.png" alt="The consent sheet, titled Allow AI nutrition analysis. It states which data is sent, names Google (Gemini) with Anthropic as a fallback, says no identifying information is sent and that allergy information is sent on its own, states the user can decline and still log meals manually, by barcode or from the catalogue, and can change the choice at any time in Settings. Buttons read Allow and Not now." loading="lazy" />
</a>
<figcaption>The gate as it ships. Providers named, data types named, the decline path stated on the sheet itself rather than buried in a policy.</figcaption>
</figure>

The part I would defend hardest is the decline path. Turning it down leaves
manual logging, barcode scanning and the whole catalogue fully working, which
the sheet says on its face rather than leaving the user to find out. That was a
design constraint, not a courtesy: consent that costs you the app is not freely
given, and an implementation that blocks the whole feature and calls the
resulting shrug "consent" is doing the paperwork rather than the thing.

None of the rest of it was required either. The block could have sat on the
client, where a modified build walks straight past it. The allergy list could
have travelled attached to everything else, because sending one object is
easier than sending two. The audit table of grants and withdrawals serves
nobody except someone checking up on me. Each of those was a choice to do the
more expensive thing, and the reason is what the data is. Someone tells you
what they eat, and then tells you what will hurt them, so that the app does
not hurt them. Forwarding that to a third party because a model performs
better with it is a decision about a person, not about a payload.

> Compliance tells you what you must not do. It does not tell you what you
> should not send.

## The payment layer, tested on the first day that was possible

The RevenueCat integration shipped on 11 June: purchase flow on both entry
points, webhook, tier sync, deletion cascade. It could not be tested against a
real purchase, because sandbox purchases require an active Paid Apps Agreement,
and that was waiting on a business bank account, which was waiting on a tax
number.

The agreement went active on 17 June. That same day I ran the full subscription
lifecycle in sandbox on the German storefront: buy monthly, buy yearly, manage,
upgrade, downgrade, cancel, let it expire, confirm the app re-gates, restore
while active, restore with nothing to restore, restore by logging out and back
in.

It found four defects and one decision I had made and then disagreed with. All
five were closed the same day.

**The paywall that could not load.** The RevenueCat App User ID was keyed off a field that
arrives with the user-profile request, and that request does not fire until
onboarding completes. So throughout onboarding, the payment SDK was never
configured, offerings came back empty, and the onboarding paywall could not
load. The fix took identity from the auth-session JWT instead, so the payment
layer configures the moment authentication resolves rather than waiting on a
profile that structurally does not exist yet.

**The paying user stuck in onboarding.** Buying from the paywall while inside onboarding only
dismissed the paywall. Onboarding never completed, which left a user who had
just paid stuck in a flow they could not exit. Onboarding and the paywall had
been built separately, and when they were wired together the completion handoff
was the join nobody made. A focus effect on the onboarding screen now completes
it when the screen regains focus already subscribed.

**The lapsed subscriber who could not re-subscribe.** Nothing was listening for
subscription changes made outside the app, so the flag went stale when a
subscription expired elsewhere. The
paywall would then read that stale value, tell a lapsed subscriber they were
still subscribed, and disable the purchase button. Somebody whose subscription
had genuinely ended could not start a new one. Adding the update listener keeps
the flag live and re-syncs the server-side tier with it.

**The restore button nobody who needed it could reach.** The guideline says you
[should make sure you have a restore mechanism](https://developer.apple.com/app-store/review/guidelines/)
for restorable purchases. Anovi had one. It lived on the paywall, and the
paywall is what you see when you are *not* subscribed. A subscribed user had no
route to it anywhere. That includes the demo account App Review would use, which
was provisioned as a paying account precisely so a reviewer could see the paid
features. The fix was a Subscriptions screen under the profile tab exposing
current plan, manage, upgrade and restore in every tier state.

<figure>
<a href="/media/approved-on-the-first-submission/subscriptions-hub-restore.png">
<img src="/media/approved-on-the-first-submission/subscriptions-hub-restore.png" alt="The Subscriptions screen shown while subscribed: a Current plan card reading Anovi Pro, a Manage Subscription row, and a Restore Purchases row described as recovering a subscription from a previous install or device." loading="lazy" />
</a>
<figcaption>The screen in the state that mattered. Restore is reachable here while subscribed, which is exactly where it was not reachable before.</figcaption>
</figure>

The fifth was not a defect. The onboarding upgrade button had been deliberately
wired to the annual plan, on the theory that fewer choices convert better. Seen
in the sandbox, next to a monthly price the user was never offered, the theory
did not survive looking at it. It now opens the full paywall and the plan choice
belongs to the user.

Two things worth being precise about. Every one of these lived in the payment
layer, which was six days old and had never been runnable against a real
transaction until that morning. And the one with direct guideline exposure, the
restore gap, was found by testing the reviewer's exact account state rather than
by reading the guideline again.

## Eighteen test areas, three of them not applicable

The rest of the plan ran over the following two days: fresh install and cold
launch, onboarding end to end, every tab in both empty and populated states,
session handling and cross-user leakage, network failure, offline degradation,
loading and error and partial-failure states, crash and memory under sustained
use, background and battery, subscription gating, AI quota exhaustion and
provider failure, the consent gate, domain edge cases, and a German-language
sweep across every legal, consent and disclaimer surface.

Three areas came back not applicable, and that is worth saying out loud. There
is no Sign in with Apple, because there is no third-party login at all, so
Guideline 4.8 is not triggered. Nothing routes into the app by deep link.
There is no push token at launch. The temptation with a test plan is to write
tests you can pass and mark the awkward ones green. Marking them not applicable,
with the reason recorded, is the version that survives someone checking.

## The worst things I found were not the ones Apple checks

Testing that hard turns up things the store does not care about, and several of
them were worse than the ones it does.

The API client's retry policy did not distinguish reads from writes, so a
network failure on a write could be retried and duplicated. Server errors still
retry; network failures on writes no longer do. Offline requests now
short-circuit to an offline state in about ten seconds, instead of spinning for
a minute towards a timeout that was already certain. Error states had drifted
into three different vocabularies across the app and were consolidated into one
component and one label.

On the backend, a sweep turned up the standard FastAPI trap: handlers declared
async while the database code inside them is synchronous, which blocks the
event loop. Meal-plan generation was
the worst case: one user generating a plan froze every other request for
seconds. Converting them freed the event loop and surfaced two further bug
classes during verification, including domain errors being re-wrapped as server
errors, which the client then dutifully retried.

And two iOS rendering bugs got their own investigations, both of which are
written up separately:
[a ScrollView that scrolled into empty space](/articles/react-native-scrollview-recycling-bug/)
and traced to a framework-level view-recycling defect, and
[the keyboard-inset leak behind it](/articles/react-native-keyboard-insets-leaking/).

None of this was on Apple's list. All of it is the difference between an app
that passes review and an app that survives its first thousand users.

## Metadata is where a good product gets rejected

This is the part I underestimated, and the part that took longest. Budget a
fortnight rather than an afternoon, because the listing is not a form. It is
two workstreams: a design deliverable with hard specifications, and a
compliance surface where the rules are not only Apple's.

**Every language you ship is a complete listing.** Name, subtitle, keywords,
description, screenshots, each one written rather than translated. Anovi ships
English and German, so the German is written natively: informal register,
German legal vocabulary, and the official phrasing for health claims under
[Regulation (EU) No 432/2012](https://eur-lex.europa.eu/eli/reg/2012/432/oj).
Machine translation is not available to you if your app makes any claim about
health, because the permitted wording is specified in law rather than chosen
for tone.

**Screenshots are a design job with a spec attached.** Two device sizes across
two languages is four sets, and every one has to survive rules that have
nothing to do with how it looks:

- **No alpha channel**, per Apple's
  [screenshot specifications](https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications/).
  The check is per pixel, so an image that looks entirely opaque but carries
  transparency still fails. Design tools export with alpha by default, so
  flatten deliberately. The same applies to the 1024×1024 icon. Mine carried
  one, and all four sets had to be re-exported.
- **They have to show the app in use** (2.3.3), not title art, a login screen
  or a splash. Overlaid text is allowed.
- **Everything has to suit a 4+ audience** (2.3.8) regardless of the app's own
  rating, which constrains the imagery as much as the copy.
- **No references to other platforms** (2.3.10). Scrub mentions of Android
  from screenshots and copy both.

**The compliance surfaces are the ones with dependencies you do not control.**

- **Legal URLs have to be live at the moment of submission**, and if you ship
  more than one language, make them locale-explicit rather than asking a single
  URL to guess at the reader.
- **Privacy labels have to agree with your privacy manifest.** Build both from
  a written inventory of what your app and every SDK inside it actually send,
  so the two declarations cannot contradict each other later. Working out what
  your analytics, crash reporting and payment SDKs collect is the real task.
  The form itself takes an hour.
- **The age-rating questionnaire has to be answered against what the app
  does.** One trap worth naming: the mitigation checkbox about social media
  being disabled for under-13s asserts an age-range integration you may not
  have, and it only applies if you declared a social surface in the first
  place.
- **The review notes are a product document**, not a formality. Where each
  gated feature is, which account reaches it, what to tap, with every label
  checked against the actual strings in the build.
- **Availability is a decision.** Anovi ships to twenty-nine EU and EEA
  countries with automatic addition of new territories switched off, which is a
  choice about which legal regimes you have agreed to operate under.

> A good product gets rejected for reasons that have nothing to do with the
> product. Metadata is where that happens.

## Account deletion is easy to claim and easy to half-build

Guideline 5.1.1(v) requires that an app supporting account creation must also
offer account deletion within the app. That is easy to claim and easy to half
build, particularly once a payment processor is holding a record of the user
too.

So it was run for real before submission, on a live account, through the
in-app flow rather than through a script. Afterwards: the authentication record
gone, twenty user-scoped tables at zero rows for that user, and the RevenueCat
subscriber deleted. The app also warns before deletion that removing the account
does not cancel an Apple subscription, because it cannot, and tells the user
where to do that.

## Re-verified on the exact binary that ships

Production signing and production purchase configuration are not the same as
development. A test that passed on a development build is evidence about that
build and nothing else.

So the gate before submission was narrow and specific: cold launch, and a real
sandbox purchase, on the exact binary going to Apple. Release hygiene was
checked on that binary too, that console output is stripped, that the
development-only tier switch is absent, that no environment file rides along
inside the package. The git tag went on afterwards, not before, so the tag means
the thing that was verified rather than the thing that was intended.

## The bug I shipped while waiting, because a reviewer would hit it

Submission was 27 July at 17:09. Four items go into review together: the binary,
the subscription group, and both subscription products. After that, hands off
App Store Connect entirely, because editing a submitted item pulls it back out
of the queue, and all three demo accounts frozen so nothing changes underneath a
reviewer.

Hands off the store is not hands off the work. The day after submitting, I
finished root-causing a logout bug that had been surfacing intermittently. The
cause was that signing out was revoking every session for that
user rather than the one on the device, so a sign-out in one place logged the
user out everywhere, including sessions that had nothing to do with it. The fix
scopes the revocation to the calling session.

That went to production immediately rather than waiting for the verdict. A
reviewer moving between a free demo account and a paid one is exactly the
pattern that triggers it, and a reviewer being mysteriously signed out mid-review
is not a thing you want to explain afterwards. A second contributing cause, a
keychain accessibility setting that made tokens unreadable when the app launched
into the background before first unlock, was fixed on the client shortly after.

## One session, and an approval

The app sat in "Waiting for Review" for ten days, and for nine of them nothing
happened at all.

On the morning of 6 August a reviewer signed in on the free demo account at
07:01 UTC and worked through the app in that single session. That it took one
session is the part the preparation paid for: the accounts were seeded so every
screen had real data in it, and the review notes routed a reader to each gated
surface in turn, so there was no need to come back for a second look at
something that had not been reachable the first time. The approval email arrived
the same morning.

What I have is the server's view, not the reviewer's. I know when they signed
in and that the verdict followed within hours, and the backend traced every
endpoint that session called. What it cannot show is what happened on screen
between those calls: what they tapped, what they lingered on, what they were
trying to break. I would rather say that than turn request logs into an
itinerary. Nothing came back through Resolution Center either: no rejection, no
questions, no request for clarification, no second build.

Ten days of waiting, and a review that began and finished inside one morning.
That ratio is the whole point. Almost none of the time an app spends in review
is review, which means almost none of the outcome is decided there. It is
decided in the weeks before, in a checklist you keep current, a purchase flow you
test on the first day you are allowed to, and a listing you check character by
character because the form will not tell you which of the four thousand is
wrong.

If you want the same material as a working checklist rather than a story, the
[companion piece](/articles/app-store-submission-checklist-health-app/) has it,
sourced to Apple's rules rather than to mine.

If you are heading into a submission yourself, you can write to me at
[hello@pragathijayaram.com](mailto:hello@pragathijayaram.com) and describe what
you are shipping. I am happy to go through it with you, whether you want a
checklist of your own or a second pair of eyes before you submit.
