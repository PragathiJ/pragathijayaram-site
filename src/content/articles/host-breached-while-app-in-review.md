---
title: 'My hosting provider was breached while my app was in review: what happened, and what I checked'
description: 'A security email in the middle of the night, an API key alert the next morning, and two days later the news that my host had been breached. How that week unfolded for me as a solo developer, what was already in place, and what I took away from it.'
pubDate: 2026-10-26T09:00:00Z
group: 'production-engineering'
type: 'investigation'
tags: ['security', 'incident-response', 'secrets', 'backend', 'solo-founder']
draft: false
---

I want to share what happened during one week in October, because I think it
can help other solo developers who run their apps on a managed hosting
platform.

On the Friday of that week, I submitted an update of my app to the App Store
and Google Play. The plan was to take a few days afterwards for personal
projects and for a marketing campaign I had been holding until the release was
out. That evening, I found out that my hosting provider, Railway, had been
breached, and that my workspace was one of the ones the attacker had been
interested in.

In this article I walk through how the week unfolded, what I checked, what was
already in place in my project, and what I took away from it. I have also
written a [practical guide](/articles/hosting-provider-breach-incident-checklist/)
with the full checklist: how to investigate each service, how to decide whether
it is a personal-data breach under GDPR, and how to rotate and verify every key.

<figure>
<svg viewBox="0 0 680 190" role="img" aria-labelledby="hb-tl-title" style="width:100%;height:auto;font-family:var(--font-sans)">
<title id="hb-tl-title">Timeline from Wednesday to Saturday. Wednesday evening a scanner probes the API and every request gets 404. Thursday at 1:27 at night Railway's first email arrives and is missed. Thursday morning a second scan asks for AI configuration files, and Anthropic sends an API key alert. Friday evening a spending-limit email and Railway's follow-up arrive. Saturday every credential is rotated.</title>
<line x1="40" y1="95" x2="640" y2="95" stroke="var(--accent)" stroke-width="3" />
<circle cx="40" cy="95" r="4" fill="var(--accent)" />
<circle cx="190" cy="95" r="4" fill="var(--accent)" />
<circle cx="340" cy="95" r="4" fill="var(--accent)" />
<circle cx="490" cy="95" r="5" fill="var(--accent)" />
<circle cx="640" cy="95" r="7" fill="none" stroke="var(--accent)" stroke-width="2.5" />
<circle cx="640" cy="95" r="2.5" fill="var(--accent)" />
<text x="40" y="50" text-anchor="start" font-size="12.5" font-weight="600" fill="var(--ink)">Wed evening</text>
<text x="40" y="66" text-anchor="start" font-size="11" fill="var(--muted)">scan of my API</text>
<text x="40" y="80" text-anchor="start" font-size="11" fill="var(--muted)">all 404</text>
<text x="190" y="50" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Thu 1:27</text>
<text x="190" y="66" text-anchor="middle" font-size="11" fill="var(--muted)">Railway email</text>
<text x="190" y="80" text-anchor="middle" font-size="11" fill="var(--muted)">missed overnight</text>
<text x="340" y="50" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Thu morning</text>
<text x="340" y="66" text-anchor="middle" font-size="11" fill="var(--muted)">AI-config scan</text>
<text x="340" y="80" text-anchor="middle" font-size="11" fill="var(--muted)">Anthropic alert</text>
<text x="490" y="50" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Fri evening</text>
<text x="490" y="66" text-anchor="middle" font-size="11" fill="var(--muted)">spending limit hit</text>
<text x="490" y="80" text-anchor="middle" font-size="11" fill="var(--muted)">Railway follow-up</text>
<text x="640" y="50" text-anchor="end" font-size="12.5" font-weight="600" fill="var(--ink)">Sat</text>
<text x="640" y="66" text-anchor="end" font-size="11" fill="var(--muted)">every credential</text>
<text x="640" y="80" text-anchor="end" font-size="11" fill="var(--muted)">rotated</text>
<text x="415" y="135" text-anchor="middle" font-size="11" fill="var(--muted)">Thursday to Friday: an old key is used by someone else</text>
<line x1="300" y1="115" x2="510" y2="115" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="3 5" opacity="0.8" />
<text x="340" y="170" text-anchor="middle" font-size="11.5" font-weight="600" fill="var(--ink)">I only saw the whole picture on Friday evening</text>
</svg>
<figcaption>How the week looked in the order it happened. At the time, I only knew about the Thursday morning alert; the rest came together on Friday evening.</figcaption>
</figure>

## The first email arrived in the middle of the night

Railway's first email reached me on Thursday at 1:27 at night. It was a notice
to all customers: they had detected unusual activity on the systems that store
environment variables, someone may have obtained some of the decrypted values,
and everyone should rotate their credentials straight away.

I was asleep. On my phone it looked like any other notification, and by the
morning it had disappeared among the rest. I only found it later.

I mention it first because it turned out to be the most important lesson of
the week. When you work alone, nobody else is watching the inbox for you.

## Thursday morning: an alert from Anthropic

The email I did see came that morning, from Anthropic's User Safety team. It
said that one of my API keys "may have been exposed or used without your
authorization". In my app, that key is only used as a backup for AI meal
logging, when the main model isn't available.

I didn't know why it had come. I learned later that Railway had told AI
providers about the possible leak so they could revoke keys, which is why many
developers received a similar email. At the time, I treated it as a question
about my own setup and went through it step by step.

First, I checked that the email was genuine. The sender address looked odd, a
random string in front of Anthropic's mail domain, but that is normal for
automated email. What mattered more: the reply address was on Anthropic's main
domain, the masked key matched mine, and the email didn't ask me to log in
through a link. I opened the console by typing the address myself.

Next, I checked what would break if I switched the key off. Because it was only
the backup, nothing would. Meal logging kept working.

Then, money. That account runs on prepaid credit with automatic top-up switched
off, so a stolen key could only use what was left, and nothing had been used.

Finally, I looked for any way the key could have leaked from my side. It had
never been committed to my code repository. The key files on my laptop live
outside the project and only my user can read them. And I opened the logs on
Railway.

## What I found in the logs

The logs showed something I hadn't expected. On Wednesday evening, a scanner
had sent hundreds of requests to my API within about a second. It was asking
for every file a careless deployment might expose: `.env` files in every
possible folder, the process environment through path tricks, cloud credential
files, SSH keys, deployment configs, and known weak spots in popular tools. One
request even had my API's own domain in the path, so it was aimed at my app,
not a random sweep.

Early on Thursday morning a second, shorter wave came. This one asked only for
AI configuration: files with names like `anthropic/config.json`,
`claude/config.json`, LiteLLM and Bedrock configs, and `llm/credentials`.

Every single request was answered with 404. My API only serves data: it has no
static files, no route that reads a file path from a request, and its
documentation pages are switched off in production. There was nothing for those
requests to find.

I also checked the project's activity on Railway: deployments, variable changes
and logins. Everything there was my own.

I was relieved. The measures I had taken were doing their job. I switched off
the flagged key, created a new one, wrote to Anthropic to ask what they had
seen, and went back to the release. I still didn't know that the host itself
had been breached.

## Friday evening: two more emails

The update went into review on Friday. That evening, two emails arrived close
together.

The first was from Google: the spending limit on one of my old Gemini projects
had been reached.

The second was a follow-up from Railway, written to me directly. My workspace
contained environment variables that matched what the attacker had been
searching for, AI and cloud provider keys, and Railway couldn't confirm whether
my values had been decrypted. They asked me to rotate everything.

That was when the week made sense. Railway's
[public disclosure](https://thehackernews.com/2026/10/railway-says-intruder-may-have-accessed.html)
describes an attacker who reached the systems storing customer environment
variables, and Railway's own notice called it part of "a series of attacks
recently targeting platform companies with the aim of compromising AI inference
providers". The Anthropic email, the AI-focused scan and the Google alert all
fit that picture.

I still think the scans on my API and the breach may be connected, but I can't
be sure. What I do know is that the scans tried to reach my keys through my
app and failed, while the breach reached them through the platform underneath
it.

## The one key that was used

The Gemini project with the spending limit had an old API key from an earlier
setup. My code no longer used it, but it was still among my variables on
Railway, so the attacker could read it.

The usage page showed weeks of nothing, then a sudden burst of requests in a
single day.

<figure>
<a href="/media/host-breached-while-app-in-review/gemini-usage.png">
<img src="/media/host-breached-while-app-in-review/gemini-usage.png" alt="Gemini API usage for the project over 28 days. Requests stay at zero for weeks, then jump on a single day. The error chart shows many responses with status 429 Too Many Requests on the same day, and the token charts spike at the same point." loading="lazy" />
</a>
<figcaption>Weeks of nothing, then one day of heavy use. Most of the errors on the right are the spending limit refusing further requests.</figcaption>
</figure>

The billing page showed which models had been called: the newest and largest
Gemini models, which my app has never used. That alone told me the traffic
wasn't mine.

<figure>
<a href="/media/host-breached-while-app-in-review/billing-by-model.png">
<img src="/media/host-breached-while-app-in-review/billing-by-model.png" alt="Billing for the project grouped by model. Every row is a Gemini API model that the app does not use." loading="lazy" />
</a>
<figcaption>Every line is a model my app doesn't use.</figcaption>
</figure>

Because that key was no longer in use, I had kept only a minimal spending limit
on it. The limit stopped the misuse by itself, and most of the requests were
refused once it was reached.

One more thing stood out when I looked at the dates. The key was used on
Thursday and Friday, after Railway had already stopped the attack. Stopping the
attacker at the platform doesn't stop someone from using keys they have already
copied. Only rotating them does.

For this key, the fix wasn't a rotation. It was a deletion.

## What was already in place

Friday evening was stressful, but it wasn't chaotic, because most of the
answers already existed in my project.

- **Spending limits on the AI providers.** Prepaid credit without automatic
  top-up on one, spending limits and budget alerts on the other. A stolen key
  had a ceiling.
- **Public keys that can't do any harm.** Every mobile app ships with a public
  key for its backend services, and anyone can extract it. In my project, that
  key was set up so it can't read user data or change anything, so the one
  credential that is public by design was never part of the risk.
- **Logs I could read.** Within a few hours I could see who had used the
  privileged backend credentials, which connections had reached the database,
  and whether anyone had tried and failed to log in. Only my own backend and
  my own network showed up.
- **A breach runbook written before launch.** It lists every credential, where
  it lives and how to rotate it, and how to decide whether an incident is a
  personal-data breach. On Saturday I didn't have to work out what to do, only
  do it.

## Saturday: rotating everything

The weekend I had planned went into rotation. I worked in order of risk: first
anything that can spend money, then anything that can reach user data, then
integrations like payments and email, and then the tidying up.

For each key I followed the same pattern: create a new one, put it in place,
deploy, check that the app is really using the new one, and only then delete
the old one. I also used the day to tighten things, for example one email key
per system instead of one shared key, each with the narrowest permission it
needs.

By Saturday evening, everything the attacker could have read was worthless. The
[guide](/articles/hosting-provider-breach-incident-checklist/) covers each step,
the checks I used to prove each new key was live, and the traps that cost me
time.

## Not a personal-data breach

Exposed credentials are not automatically exposed personal data. The keys that
could reach user data had only been used by my own backend, and the logs showed
that directly. The key that was misused gave access to an AI model and nothing
else. So I recorded the incident as a near-miss, with what happened, what I
checked and what I changed. The guide explains how I made that decision under
GDPR, and why the logs were what made it possible.

## What I took from it

**Make sure warnings reach you.** The first email arrived a full day before I
knew anything was wrong, in the middle of the night, looking like any other
notification. As a solo developer, there is no colleague who sees it first.
Security and billing emails from your providers need a place where you will
actually notice them.

**You can't control your host's security, but you can control what a stolen key
can do.** Spending limits, narrow permissions and deleting keys you no longer
use decide how much damage a leak can cause.

**Your app and your platform are both part of the risk.** The scans failed
because my API had nothing to give them. The breach didn't need my API at all.

**Preparation pays off before you need it.** The limits, the locked-down public
key, the logs and the runbook didn't feel urgent when I set them up. They made
that weekend manageable.

Nothing I rotated needed a new build of the app, so the update waiting in review
was never affected.

If you have been through something similar, or handle these alerts differently,
I'd love to hear how.
