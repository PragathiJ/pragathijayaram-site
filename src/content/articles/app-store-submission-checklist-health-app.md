---
title: 'What Apple actually checks: an App Store submission checklist for a health app'
description: 'The submission requirements in dependency order, from the multi-week clocks you cannot compress down to the last thing you verify before you tag. Every rule sourced to Apple, not to one submission.'
pubDate: 2026-10-08T09:00:00Z
group: 'building-in-a-regulated-space'
type: 'guide'
tags: ['app-store', 'app-review', 'ios', 'compliance', 'submission']
ogImage: '/og/app-store-submission-checklist-health-app.png'
draft: false
---

Most App Store submission checklists are flat lists. They tell you what has to
be true, in roughly the order Apple numbers its guidelines, which is not the
order you can do the work in.

This one is ordered by dependency. First the items with multi-week clocks that
block everything downstream, then the things that live in the build, then the
things that live in the listing, then the things that can only be checked on the
build you are actually going to ship. If you follow it top to bottom, you should
not find yourself blocked by something you could have started a month earlier.

It comes out of getting a nutrition app with subscriptions, health data and a
third-party AI path
[through review on the first submission](/articles/approved-on-the-first-submission/).
That account is the story version. This is the part that generalises: every
requirement below links to Apple's own published rule, so you can check me. Where
something is my judgment rather than Apple's requirement, it says so.

It is written Apple-first, for a small team or one person, and it assumes you
are shipping something with an account, a subscription and some data you would
rather not get wrong.

## The clocks you cannot compress

Almost everything else on this list is work you control. These are not. Start
them first, because no amount of effort later makes them go faster.

**Developer Program enrollment, and which kind.** Individual or Organization.
Organization requires a D-U-N-S number and verification of the legal entity,
which takes time and can stall if your business is not registered in a form the
process expects. Individual enrollment is immediate by comparison. The visible
difference to users is the developer name on the listing. If you are a sole
trader, Individual may also be the honest description of the legal reality. You
can transfer later.

**Paid Apps Agreement, plus tax and banking.** This is the one that catches
people, because it does not only gate getting paid. Apple's guidance is explicit
that the Paid Apps Agreement must be signed and **Active** before in-app
purchase products are available in the sandbox, which means you cannot test your
purchase flow at all until it is done. Behind it sit a bank account and tax
forms, and behind those, in most countries, a business registration and a tax
number that arrive on somebody else's timetable.

Chain it out and the sequence for a new business is roughly: register the
business, file for a tax number, wait weeks, open a business bank account,
complete Agreements Tax and Banking, wait for Active, and only then run your
first sandbox purchase. Plan for that to be the longest pole in the whole
project.

<figure>
<svg viewBox="0 0 680 230" role="img" aria-labelledby="dep-title" style="width:100%;height:auto;font-family:var(--font-sans)">
<title id="dep-title">Two tracks converging on submission. The critical path runs business and tax registration, bank account, Agreements Tax and Banking, then Paid Apps Agreement active, at which point the first sandbox purchase becomes testable. The parallel track, which blocks nothing, runs developer enrollment, toolchain, binary work and listing work.</title>
<defs><marker id="dep-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--muted)" /></marker></defs>
<text x="16" y="30" font-size="10.5" font-weight="600" letter-spacing="0.08em" fill="var(--accent)">CRITICAL PATH &#183; WEEKS, MOSTLY WAITING</text>
<rect x="16" y="44" width="108" height="44" rx="4" fill="none" stroke="var(--accent)" stroke-width="1.5" />
<rect x="141" y="44" width="108" height="44" rx="4" fill="none" stroke="var(--accent)" stroke-width="1.5" />
<rect x="266" y="44" width="108" height="44" rx="4" fill="none" stroke="var(--accent)" stroke-width="1.5" />
<rect x="391" y="44" width="108" height="44" rx="4" fill="none" stroke="var(--accent)" stroke-width="1.5" />
<text x="70" y="62" text-anchor="middle" font-size="10.5" fill="var(--ink)">Business +<tspan x="70" dy="13">tax number</tspan></text>
<text x="195" y="62" text-anchor="middle" font-size="10.5" fill="var(--ink)">Bank<tspan x="195" dy="13">account</tspan></text>
<text x="320" y="62" text-anchor="middle" font-size="10.5" fill="var(--ink)">Agreements,<tspan x="320" dy="13">Tax &amp; Banking</tspan></text>
<text x="445" y="62" text-anchor="middle" font-size="10.5" fill="var(--ink)">Paid Apps<tspan x="445" dy="13">Agreement ACTIVE</tspan></text>
<line x1="124" y1="66" x2="137" y2="66" stroke="var(--muted)" stroke-width="1.2" marker-end="url(#dep-arrow)" />
<line x1="249" y1="66" x2="262" y2="66" stroke="var(--muted)" stroke-width="1.2" marker-end="url(#dep-arrow)" />
<line x1="374" y1="66" x2="387" y2="66" stroke="var(--muted)" stroke-width="1.2" marker-end="url(#dep-arrow)" />
<text x="70" y="104" text-anchor="middle" font-size="10" fill="var(--muted)">2&#8211;6 weeks</text>
<text x="445" y="104" text-anchor="middle" font-size="10" font-weight="600" fill="var(--accent)">first purchase testable</text>
<text x="16" y="146" font-size="10.5" font-weight="600" letter-spacing="0.08em" fill="var(--muted)">PARALLEL &#183; DAYS, ENTIRELY YOURS</text>
<rect x="16" y="160" width="108" height="44" rx="4" fill="none" stroke="var(--hairline)" stroke-width="1.5" />
<rect x="141" y="160" width="108" height="44" rx="4" fill="none" stroke="var(--hairline)" stroke-width="1.5" />
<rect x="266" y="160" width="108" height="44" rx="4" fill="none" stroke="var(--hairline)" stroke-width="1.5" />
<rect x="391" y="160" width="108" height="44" rx="4" fill="none" stroke="var(--hairline)" stroke-width="1.5" />
<text x="70" y="178" text-anchor="middle" font-size="10.5" fill="var(--muted)">Developer<tspan x="70" dy="13">enrollment</tspan></text>
<text x="195" y="178" text-anchor="middle" font-size="10.5" fill="var(--muted)">Toolchain<tspan x="195" dy="13">SDK minimum</tspan></text>
<text x="320" y="178" text-anchor="middle" font-size="10.5" fill="var(--muted)">Binary +<tspan x="320" dy="13">release hygiene</tspan></text>
<text x="445" y="178" text-anchor="middle" font-size="10.5" fill="var(--muted)">Listing +<tspan x="445" dy="13">assets</tspan></text>
<line x1="124" y1="182" x2="137" y2="182" stroke="var(--muted)" stroke-width="1.2" marker-end="url(#dep-arrow)" />
<line x1="249" y1="182" x2="262" y2="182" stroke="var(--muted)" stroke-width="1.2" marker-end="url(#dep-arrow)" />
<line x1="374" y1="182" x2="387" y2="182" stroke="var(--muted)" stroke-width="1.2" marker-end="url(#dep-arrow)" />
<path d="M499,66 C532,66 524,118 552,118" fill="none" stroke="var(--muted)" stroke-width="1.2" marker-end="url(#dep-arrow)" />
<path d="M499,182 C532,182 524,130 552,130" fill="none" stroke="var(--muted)" stroke-width="1.2" marker-end="url(#dep-arrow)" />
<rect x="556" y="102" width="108" height="44" rx="4" fill="var(--surface)" stroke="var(--accent)" stroke-width="2" />
<text x="610" y="129" text-anchor="middle" font-size="12" font-weight="700" letter-spacing="0.06em" fill="var(--ink)">SUBMIT</text>
</svg>
<figcaption>The top row sets your date. The bottom row is the part most people think of as the work.</figcaption>
</figure>

> If your app has subscriptions, the date you can first test a purchase is set
> by paperwork, not by engineering. Find that date early and work backwards from
> it.

**Toolchain minimums.** Apple publishes
[SDK minimum requirements](https://developer.apple.com/news/upcoming-requirements/)
with hard dates. Since 28 April 2026, uploads must be built with Xcode 26 or
later against an iOS 26 SDK or later. These deadlines arrive without a grace
period, so check the current requirement before you plan a release, not after a
failed upload.

**Age rating questionnaire.** Apple
[replaced the age rating system](https://developer.apple.com/news/?id=ks775ehf)
in 2025. The tiers are 4+, 9+, 13+, 16+ and 18+; the old 12+ and 17+ are gone.
The questionnaire added required questions on in-app controls, app capabilities,
medical or wellness topics, and violent themes, and apps that had not answered it
by 31 January 2026 were blocked from submitting new apps or updates. If you are
returning to an app you have not touched in a while, check this before anything
else, because it silently blocks submission.

## Why one checklist for everything stalls

This is method rather than requirement, and it is the single change that made
the rest tractable.

A single list stalls because it is usually ordered by guideline number, and
guideline order has nothing to do with what you can do today. You reach an item
that needs a build you have not made, or a store agreement that is not active
yet, and the list stops there while a dozen items you could have finished sit
below it.

Submission work splits into three kinds, separated by what unblocks them and by
what makes a finished result worthless again.

| Kind | Example | Unblocked by | Invalidated by |
|---|---|---|---|
| **Verify state** | No debug logging in release; every permission string localised; no secrets in the package | Nothing. Start today with only the repository open | The next commit |
| **Device tests** | Cold launch on a real device; purchase, cancel, expire, restore | A build. Anything involving purchases also needs an active Paid Apps Agreement | A new build |
| **Form filling** | Listing copy, screenshots, privacy labels, age rating | The console. Some fields will not accept anything until a build is uploaded | Nothing. It persists |

Write them as three documents, because they have three different lifecycles.
Keep them in one and you will either redo work that did not need redoing, or
trust a check whose build no longer exists.

One warning from experience: your audit will go stale. Apple's guidelines are a
living document and rules move. Re-read the actual guideline text before you
trust your own summary of it.

## What has to be true in the build

**Privacy manifest.** Apps must include a
[privacy manifest](https://developer.apple.com/documentation/bundleresources/privacy-manifest-files),
a `PrivacyInfo.xcprivacy` file declaring the data types your app collects and
your reasons for calling certain APIs that could otherwise be used to fingerprint
users. Third-party SDKs ship their own manifests and Xcode consolidates them.

The practical point: find out what your toolchain generates for you before you
hand-write anything. If you are on a managed framework, the SDK-contributed
portion may already be handled, and the piece you actually have to declare is
your own first-party data collection and tracking status. Check the merged file
in a real build once rather than assuming either way.

**Permission strings.** Every permission you request needs a usage description
that explains *why*, and it needs to exist in every language you ship. A string
that says "This app needs camera access" is worse than useless; say what the
camera is for. Also confirm you are not requesting permissions you no longer
use, which happens quietly when a feature gets cut but its dependency does not.

**Release hygiene.** Console logging stripped. Developer-only switches compiled
out rather than merely hidden. No environment or secrets files inside the
shipped package. Confirm all of these on a release build, because every one of
them behaves differently in debug.

## What has to be true in the listing

Apple's [accurate metadata](https://developer.apple.com/app-store/review/guidelines/)
rules under 2.3 are more prescriptive than most people expect.

- **App names are limited to 30 characters** (2.3.7), and metadata must not be
  packed with trademarked terms, popular app names, pricing information or
  irrelevant phrases.
- **Every localization is a complete listing.** If you add a language, you owe it
  its own name, subtitle, keywords, description, screenshots. This roughly
  doubles the work per language, and it is not a place to paste machine
  translation, particularly if your app makes any claim about health.
- **Field limits are enforced by the form, not documented in one place.** Apple
  publishes the 30-character name limit in the guidelines but does not publish
  every field's ceiling there. The description limit was 4,000 characters when I
  submitted. Treat the form as the authority, write to the limit deliberately,
  and leave yourself headroom, because a translation that fits today may not fit
  after an edit.
- **Legal URLs must be live at submission**, and if you ship more than one
  language, make them locale-explicit rather than relying on a single URL to
  guess. A privacy policy URL that 404s is an instant rejection and an easy one
  to avoid.
- **Subscription terms belong in the description.** Guideline 3.1.2(c) requires
  that before asking someone to subscribe you clearly describe what they get for
  the price. In the EU, price-indication law wants the same information, so
  write it once and satisfy both.
- **Encoding surprises are real.** App Store Connect rejected `✓` (U+2713) in my
  description as an invalid character while accepting German umlauts without
  complaint. If the form refuses your text and does not say why, suspect a
  non-ASCII decoration before you suspect anything clever.

**Age rating.** Answer the questionnaire against what your app actually does.
One trap worth naming: if there is a mitigation checkbox about social media
being disabled for under-13s, do not tick it reflexively. It asserts an
integration you may not have, and it only applies if you declared a social
surface in the first place.

**App privacy details.** The
[nutrition label](https://developer.apple.com/app-store/app-privacy-details/) is
required to submit, must cover data collected by third-party code you integrate,
and you are responsible for its accuracy. Inaccurate disclosures can get an app
rejected or removed.

Do this from a written inventory rather than from memory, and reconcile it
against your privacy manifest so the two cannot contradict each other later.
Working out what your analytics, crash reporting and payment SDKs each collect
is the actual task; filling the form afterwards takes an hour.

## Assets fail on spec, not on taste

The most mechanical section, and the one where rejections feel most stupid.

**No alpha channel.** Apple's
[screenshot specifications](https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications/)
state that images cannot include alpha channels or transparency. The check is
per-pixel, so an image that looks completely opaque but was exported with an
alpha channel still fails. The same applies to the 1024×1024 App Store icon.
Design tools export with alpha by default, so flatten deliberately.

**Screenshots must show the app in use.** Guideline 2.3.3 says they should not
be merely title art, a login page or a splash screen. Overlaid text and images
are allowed. My own opinion, not Apple's rule: use real screens rather than
marketing renders, because a reviewer comparing your screenshots to your app is
doing exactly the comparison you want to survive.

**Metadata must suit a 4+ audience** regardless of your app's rating (2.3.8),
which constrains screenshots as well as text.

**Do not reference other platforms** in your app or metadata (2.3.10). Scrub
mentions of Android or other marketplaces from screenshots and copy.

The same section as a checklist:

| Asset | Requirement | Stated in |
|---|---|---|
| App icon, 1024×1024 | Flattened, no alpha channel, no transparency | Screenshot specifications |
| Screenshots | No alpha channel or transparency, checked per pixel | Screenshot specifications |
| Screenshots | Show the app in use, not title art, a login page or a splash screen | Guideline 2.3.3 |
| App name | 30 characters | Guideline 2.3.7 |
| All metadata | Suitable for a 4+ audience regardless of the app's own rating | Guideline 2.3.8 |
| App and metadata | No names, icons or imagery of other mobile platforms or marketplaces | Guideline 2.3.10 |
| Description, keywords, review notes | Ceilings enforced by the form and not published in the guidelines; read them off App Store Connect | — |

## What the reviewer needs in order to do the job

Guideline 2.1(a) is direct about this:

> Make sure your app has been tested on-device for bugs and stability before you
> submit it, and include demo account info (and turn on your back-end service!)
> if your app includes a login.

Read past the obvious. What it asks for is an account through which the reviewer
can see the whole app.

- **One account per state you gate on.** If your app has free and paid tiers,
  a free account alone will not show a reviewer the paid features. Provision one
  per state, and seed each one with realistic data, because empty states
  demonstrate nothing.
- **Seed the data.** A reviewer opening a populated app can evaluate it. A
  reviewer opening an empty one is evaluating your empty states.
- **Review notes must be specific.** Guideline 2.3.1 requires new features and
  changes to be described with specificity in the Notes for Review, and states
  plainly that generic descriptions will be rejected. Write the notes as a route
  map: where each gated feature is, which account reaches it, what to tap. Check
  every label in the notes against the actual strings in the build, because a
  note describing a screen that does not exist costs a review cycle.
- **In-app purchases must be visible and functional to the reviewer**, and
  2.1(b) says that if a configured purchase cannot be found or reviewed in your
  app, you must explain why in the notes.
- **Freeze once submitted.** Editing an item that is in review pulls it out of
  the queue. Decide what is going in, put it in, then leave it alone. That
  includes the demo accounts: do not sign into them, do not change their state.

## The rules that bite health and wellness apps

**Third-party AI consent.** Apple
[revised 5.1.2(i) on 13 November 2025](https://developer.apple.com/news/?id=ey6d8onl)
to say you must clearly disclose where personal data will be shared with third
parties, **including with third-party AI**, and obtain explicit permission
before doing so.

Three things follow that people get wrong. Disclosure in a privacy policy is not
permission; the permission has to exist in the product, before the first
transmission. Name the provider rather than saying "third parties". And do not
bundle it into your terms acceptance, because that is not explicit permission
for this specific purpose.

My own design position, not a rule: build the decline path so that declining
costs the user the AI feature and nothing else. Consent that costs you the app is
not meaningfully a choice, and under the GDPR it is unlikely to be freely given.

If you process health data in the EU, there is a second layer. Health data is
[Article 9](https://eur-lex.europa.eu/eli/reg/2016/679/oj) special-category data
under the GDPR and needs explicit consent in its own right, and the existence of
a decline path may move your lawful basis for that feature from contract to
consent, with document consequences. That is a separate piece of work from the
Apple rule and it does not go away if you satisfy Apple.

**No medical claims.** Guideline 1.4.1 says medical apps that could provide
inaccurate information, or be used to diagnose or treat, may be reviewed with
greater scrutiny, that accuracy claims about health measurements must be
supported by disclosed data and methodology, and that apps should remind users to
check with a doctor. If you are wellness rather than medical, the posture has to
be visible in the product and not only in your terms: disclaimers on generated
output, no diagnostic language, no claim you cannot substantiate.

In the EU there is a parallel constraint on what you may say about food and
health at all. Permitted health claims are listed in
[Regulation (EU) No 432/2012](https://eur-lex.europa.eu/eli/reg/2012/432/oj),
and wording outside that list is a regulatory problem independent of Apple.

**Account deletion.** Guideline 5.1.1(v) requires that if your app supports
account creation, you must also offer account deletion within the app. Build it
so it completes without contacting support, and test it end to end on a real
account: authentication record gone, application data gone, and any external
processor holding a record of that user cleaned up too. If the user has an
active subscription, tell them deletion does not cancel it and where to cancel.

**Minimum functionality and saturated categories.** 4.2 asks for something more
than a repackaged website. 4.3(b) says Apple will not accept new submissions in
well-established categories unless they offer a meaningfully different or
improved experience. If you are entering a crowded space, your listing has to
make the difference legible.

## Payments, and the requirement most people miss

Unlocking features inside the app means in-app purchase (3.1.1). Beyond that:

- **Restore has to work, and has to be reachable.** 3.1.1 says you should make
  sure you have a restore mechanism for restorable purchases. The failure mode I
  hit, and the one worth checking today: restore that lives only on the paywall,
  which is the screen non-subscribers see. A subscribed user then has no route to
  it, including the paying demo account you gave the reviewer. Put restore
  somewhere reachable in every subscription state.
- **Prices and periods must match your configured products exactly**, in every
  language and currency you display them in.
- **Describe what the subscription buys before asking for it** (3.1.2(c)).
- **Test the whole lifecycle, not the happy path.** Purchase, upgrade, downgrade,
  cancel, expire, confirm the app re-gates, restore while active, restore with
  nothing to restore, restore after signing out and back in. Every purchase bug I
  found lived in one of the paths that is not "buy it once and it works".

## The last gate, and what happens after you pass it

**Re-verify on the exact binary.** Production signing and production purchase
configuration are not the same as development. A test that passed on a
development build is evidence about that build. At minimum, run a cold launch
and a real sandbox purchase on the binary you are submitting, then tag that
commit, so the tag records what was verified rather than what was intended.

**Choose your release option deliberately.** After approval you can have the
version go live automatically, on a date, or
[manually](https://developer.apple.com/help/app-store-connect/manage-your-apps-availability/select-an-app-store-version-release-option/).
Manual leaves the approved version at **Pending Developer Release** until you
click Release This Version, which decouples "Apple approved it" from "it is
live". For a first launch I would take manual every time: it gives you a window
to do go-live work with the approval already in hand. Releasing can take up to
24 hours to appear on the store, so released is not the same as findable.

**For updates, consider phased release.** App Store Connect can
[roll an update out over seven days](https://developer.apple.com/help/app-store-connect/update-your-app/release-a-version-update-in-phases/)
to users with automatic updates on, while anyone can still download it manually,
and you can release to everyone at any point. Useful for anything with a
regression risk.

**If it comes back.** Rejections arrive in Resolution Center with the guideline
cited. Answer the guideline you were given, in that thread, and resubmit; do not
guess at what else might have been wrong.

---

Two things I would tell anyone starting this. The first is that the schedule is
set by the clocks you cannot compress and nothing else, so find those dates before you
plan anything. The second is that almost none of the outcome is decided during
review. It is decided in the weeks before, which is entirely the part you
control.

The account of doing all of the above for one app, including the bugs it turned
up and what the reviewer actually touched, is
[here](/articles/approved-on-the-first-submission/).

No checklist survives contact with a different app. This one is as general as I
could make it, which means yours will still raise something it does not answer.
When it does, write to me at
[hello@pragathijayaram.com](mailto:hello@pragathijayaram.com) and say what you
are shipping and where the list runs out. I would rather work through one
specific case than add another general bullet.
