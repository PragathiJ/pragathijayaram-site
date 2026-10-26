---
title: 'When your hosting provider is breached: a solo developer''s incident checklist'
description: 'What I did, step by step, after my hosting provider was breached: making sure the warning reaches you, checking every service for misuse, deciding whether it is a personal-data breach under GDPR, rotating and verifying every key, and what to keep watching afterwards. Written for any stack.'
pubDate: 2026-10-26T10:00:00Z
group: 'production-engineering'
type: 'guide'
tags: ['security', 'incident-response', 'secrets', 'gdpr', 'solo-founder']
draft: false
ogImage: '/og/hosting-provider-breach-incident-checklist.png'
---

When my hosting provider told me that my workspace matched what an attacker had
been searching for, the instruction was short: rotate every credential stored
in your environment variables. Rotating turned out to be only one part of the
work. Before that came finding out whether anything had actually been misused,
and deciding whether user data was affected. After it came checking that every
new key really worked, and keeping an eye on things for a while.

[The story of that week](/articles/host-breached-while-app-in-review/) is in a
separate article. This one is the practical side: everything I did, in order,
written so you can follow it with your own setup.

My stack is a mobile app, a Python backend hosted on Railway, a Supabase
database, AI providers, RevenueCat for payments and Resend for email. Yours is
probably different, so for each step I describe what to look for in general,
and then where I found it. This is one solo developer's run through one
incident, not a standard and not legal advice.

## Make sure the warning reaches you

The first warning about this breach reached me at 1:27 at night, as a general
notice to all customers. It looked like any other email and I didn't see it
until much later. When you work alone, there is nobody else who reads it first.

A few things that help:

- **Send provider alerts somewhere you will notice them.** Security, billing
  and spending-limit emails from your host, database, AI and payment providers
  should reach an inbox you check every day, ideally with a phone notification.
- **Make a mail filter** for words like "security", "unauthorized", "spend",
  "limit" and "incident" from your providers, so these emails stand out.
- **Keep the security contact up to date** in every provider's account
  settings.
- **Don't ignore or delete a security email because it looks automated.**
  Verify it instead: check that the reply address is on the provider's real
  domain, that any key it mentions matches yours, and that it doesn't ask you
  to log in through a link. Then open the provider's console by typing the
  address yourself.

## Contain first, with care

Before touching any key, I asked two questions: **what can someone do with
it**, and **what breaks if I switch it off right now?**

The first key flagged in my case was the backup for AI meal logging. Switching
it off removed a safety net and nothing else, so I did it straight away.

For keys that can spend money, contain fast: switch off the key, or set a hard
spending limit if you can't replace it immediately.

For keys your app depends on, like the database password, it depends on what
the logs show. If there is any sign that someone is using it, change it
immediately, even if the app is down for a few minutes; a short outage with a
notice in the app is much better than someone reading user data. If there is
no sign of misuse, rotate it carefully as described below, which usually means
only a few seconds of downtime while the app redeploys.

## Check every service for misuse

This is the step that decides everything that follows, and it has a deadline:
many providers keep detailed logs for only a few days. My database provider
keeps them for seven. If you look too late, the evidence that nothing happened
is gone, and you can no longer rule anything out.

Start from the list of variables on your host's dashboard, not from what you
remember setting up or from your local `.env` file. Both can miss an old key
from an earlier setup that is still sitting on the host. For every secret on
that list, ask: if someone had used this, where would it show? Then go and
look.

| Layer | What to ask | Where I looked | Where you might look |
|---|---|---|---|
| Host | Did anyone probe the app? Any deployments, variable changes or logins I didn't make? | Railway request logs and project activity | Vercel, Render, Fly.io, AWS or Google Cloud logs and audit trail |
| Database and auth | Who used the privileged backend key? Who connected? Any failed logins? | Supabase logs | Firebase, AWS CloudTrail and RDS logs, Neon, PlanetScale |
| Storage | Were files added, changed or deleted? | Supabase storage logs | S3, Google Cloud Storage, Firebase Storage |
| AI providers | Any usage I didn't make? Which models? | Anthropic console, Google Cloud usage and billing | OpenAI usage page, Azure, Bedrock |
| Payments | Customers or entitlements I didn't create? | RevenueCat | Stripe, Paddle |
| Email | Emails I didn't send? Which key was used last? | Resend | SendGrid, Postmark, Amazon SES |
| Code | New apps, tokens or deploy keys? Unusual activity? | GitHub security log and installed apps | GitLab, Bitbucket |
| Your laptop | Plain-text tokens or key files lying around? | My own machine | The same everywhere |

### What a scanner looks for

My host's request logs showed two waves of automated requests. The first was
hundreds of requests within about a second. The second, a few hours later,
asked only for AI configuration files. Grouped together, this is what they were
after:

| What it asked for | Examples |
|---|---|
| Environment files | `.env`, `.env.production`, `.env.local`, in every folder from `/api/` to `/backend/` |
| The process environment | `/proc/self/environ`, reached through path tricks like `../../` |
| Cloud credentials | AWS credentials, Google and Firebase service-account files |
| SSH keys and server secrets | `id_rsa`, `id_ed25519`, Kubernetes service tokens |
| Deployment and infrastructure configs | `railway.toml`, `vercel.json`, `fly.toml`, Terraform state, Docker Compose files |
| AI configuration | `anthropic/config.json`, `claude/config.json`, LiteLLM, Bedrock and OpenAI proxy configs |
| Known weak spots in popular tools | file-read bugs in development servers, low-code AI tools and dashboard plugins |

Every one of these requests got a 404 from my API, because it serves only data:
there are no static files, no route reads a file path from a request, and the
documentation pages are switched off in production.

When you read your own logs, look for:

- **bursts of 404s** in a short time, which is a scan; harmless if everything
  really is 404
- **any 200 on a path that isn't part of your app**, which needs a closer look
- **spikes of 401 or 403**, which can mean someone is trying stolen
  credentials

### Who used the privileged key

The most important question is who used the privileged backend key, the one
that can bypass your database's access rules. On Supabase, the Logs Explorer
can answer it directly: filter the API logs to requests made with that key, and
group them by user agent, IP address, method and path, with the first and last
time each one was seen.

What normal looks like: your backend's HTTP client as the user agent, your
host's addresses or your own connection as the IP, and only the actions your
backend actually performs. What would worry me: a user agent like `curl` or a
browser, an address that is neither your host nor you, or a request that lists
all users.

Whatever your stack, the idea is the same: filter your logs to the privileged
credential, and check that every use of it is one you recognise.

In my case, the result of this step was clear. Every privileged key had only
been used by my own backend, database connections came only from my backend,
my own network and the provider's services, and nobody had tried and failed to
log in. The only key that had been misused was an old AI key, used for model
calls.

## Decide: is it a personal-data breach?

If you process personal data of people in the EU, this question matters as much
as the technical one. I run a nutrition app that processes health data, so I
worked through it carefully.

GDPR defines a personal-data breach in
[Art. 4(12)](https://gdpr-info.eu/art-4-gdpr/) as a breach of security
"leading to the accidental or unlawful destruction, loss, alteration,
unauthorised disclosure of, or access to, personal data". The important words
are *leading to*. A database password or an API key is not personal data in
itself. Its exposure is a security incident. It becomes a personal-data breach
if it led to one of those outcomes for the data it protects, or if you can't
rule out that it did.

A few things I found useful to know:

- **The host's email is the processor's notice.** Your host processes data on
  your behalf, so it has to tell you about a breach
  ([Art. 33(2)](https://gdpr-info.eu/art-33-gdpr/)). From that point, the
  assessment is yours, because only you know what your credentials reach.
- **The 72 hours start when you are reasonably sure.** Under
  [Art. 33(1)](https://gdpr-info.eu/art-33-gdpr/), a controller notifies the
  supervisory authority within 72 hours of becoming aware of a breach, unless it
  is unlikely to result in a risk to people. The
  [EDPB guidelines](https://www.edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-92022-personal-data-breach-notification-under_en)
  describe "aware" as having a reasonable degree of certainty that personal data
  was affected, after a short investigation. That makes the log check urgent: it is
  what tells you whether the clock is running at all.

<figure>
<svg viewBox="0 0 680 270" role="img" aria-labelledby="bnm-title" style="width:100%;height:auto;font-family:var(--font-sans)">
<title id="bnm-title">Decision tree. Credentials exposed. First question: could they reach personal data? If no, it is a security incident only: log it as a near-miss. If yes, second question: do the logs show access? If they show access, it is a personal-data breach: assess the risk and notify within 72 hours where required. If the logs cannot rule access out, treat it as a likely breach and assess under uncertainty. If the logs show no access, it is a near-miss: document it.</title>
<rect x="250" y="10" width="180" height="34" rx="6" fill="none" stroke="var(--accent)" stroke-width="2" />
<text x="340" y="32" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">Credentials exposed</text>
<line x1="340" y1="44" x2="340" y2="66" stroke="var(--hairline)" stroke-width="1.5" />
<text x="340" y="82" text-anchor="middle" font-size="12" fill="var(--ink)">Could they reach personal data?</text>
<line x1="340" y1="90" x2="140" y2="118" stroke="var(--hairline)" stroke-width="1.5" />
<line x1="340" y1="90" x2="470" y2="118" stroke="var(--hairline)" stroke-width="1.5" />
<text x="225" y="104" text-anchor="middle" font-size="11" fill="var(--muted)">no</text>
<text x="420" y="104" text-anchor="middle" font-size="11" fill="var(--muted)">yes</text>
<rect x="30" y="120" width="220" height="44" rx="6" fill="none" stroke="var(--hairline)" stroke-width="1.5" />
<text x="140" y="139" text-anchor="middle" font-size="11.5" fill="var(--ink)">Security incident only</text>
<text x="140" y="155" text-anchor="middle" font-size="11" fill="var(--muted)">log as near-miss</text>
<text x="470" y="136" text-anchor="middle" font-size="12" fill="var(--ink)">Do the logs show access?</text>
<line x1="470" y1="144" x2="330" y2="190" stroke="var(--hairline)" stroke-width="1.5" />
<line x1="470" y1="144" x2="470" y2="190" stroke="var(--hairline)" stroke-width="1.5" />
<line x1="470" y1="144" x2="610" y2="190" stroke="var(--hairline)" stroke-width="1.5" />
<text x="380" y="170" text-anchor="middle" font-size="11" fill="var(--muted)">yes</text>
<text x="490" y="176" text-anchor="middle" font-size="11" fill="var(--muted)">cannot tell</text>
<text x="585" y="170" text-anchor="middle" font-size="11" fill="var(--muted)">no</text>
<rect x="250" y="192" width="160" height="60" rx="6" fill="none" stroke="var(--hairline)" stroke-width="1.5" />
<text x="330" y="212" text-anchor="middle" font-size="11.5" fill="var(--ink)">Personal-data breach</text>
<text x="330" y="228" text-anchor="middle" font-size="11" fill="var(--muted)">assess risk, notify</text>
<text x="330" y="242" text-anchor="middle" font-size="11" fill="var(--muted)">within 72 h if required</text>
<rect x="420" y="192" width="110" height="60" rx="6" fill="none" stroke="var(--hairline)" stroke-width="1.5" />
<text x="475" y="212" text-anchor="middle" font-size="11.5" fill="var(--ink)">Likely breach</text>
<text x="475" y="228" text-anchor="middle" font-size="11" fill="var(--muted)">assess under</text>
<text x="475" y="242" text-anchor="middle" font-size="11" fill="var(--muted)">uncertainty</text>
<rect x="540" y="192" width="130" height="60" rx="6" fill="none" stroke="var(--accent)" stroke-width="2" />
<text x="605" y="212" text-anchor="middle" font-size="11.5" font-weight="600" fill="var(--ink)">Near-miss</text>
<text x="605" y="228" text-anchor="middle" font-size="11" fill="var(--muted)">document it</text>
<text x="605" y="242" text-anchor="middle" font-size="11" fill="var(--muted)">(my case)</text>
</svg>
<figcaption>What decides the outcome is not whether credentials were exposed, but what the logs say about how they were used. "Cannot tell" is its own branch, and it is where you end up if the logs are gone.</figcaption>
</figure>

In my case, the keys that could reach personal data may have been exposed;
Railway couldn't confirm either way. The logs showed that only my own backend
had used them. The key that had been used
by someone else could reach an AI model and nothing more. So this was a
security incident, not a personal-data breach: no notification to the
supervisory authority, and no message to users.

If the logs had shown access to user data, it would have been a personal-data
breach involving health data. I would have notified my data protection
authority within 72 hours with what happened, who and what was affected, the
likely consequences and what I had done, in stages if the full picture wasn't
ready yet, and told users directly if the risk to them was high.

### Write it down, even if it is a near-miss

GDPR requires you to document every personal-data breach
([Art. 33(5)](https://gdpr-info.eu/art-33-gdpr/)). A near-miss isn't one, but
under [Art. 5(2)](https://gdpr-info.eu/art-5-gdpr/) you still need to be able
to show you assessed it properly, and "I looked and found nothing" only counts
if it is written down. I keep near-misses in a separate log, so the breach
register stays a record of real breaches. My entry covers:

- what happened, with dates, and how I learned about it
- which credentials were exposed
- what was actually misused, and what that credential could reach
- which logs I reviewed, and what they showed
- the conclusion, with the reason
- what I rotated and tightened
- the provider's notice, kept alongside

It contains no IP addresses, key values or other identifiers. The record has to
show the reasoning, not copy the logs.

One special case: if you store anything as salted hashes, such as IP addresses
in consent records, the salt is what keeps those hashes from being reversed.
If the salt was among the exposed variables, rotate it, so every new record is
protected. Older records stay hashed with the old salt; they are only at risk
if someone also gets your database, which is why the log check matters here
too. If you need to verify older records later, keep the old salt somewhere
safe and offline.

## Rotate everything, in order of risk

<figure>
<svg viewBox="0 0 680 150" role="img" aria-labelledby="rot-order-title" style="width:100%;height:auto;font-family:var(--font-sans)">
<title id="rot-order-title">Rotation order in four steps. One: stop spending, covering AI keys and cloud keys. Two: cut data access, covering database passwords and privileged backend keys. Three: integrations, covering payment secrets, webhook secrets and email keys. Four: tidy up, covering salts, unused variables, laptop tokens and third-party app access.</title>
<rect x="10" y="30" width="150" height="80" rx="6" fill="none" stroke="var(--accent)" stroke-width="2" />
<rect x="180" y="30" width="150" height="80" rx="6" fill="none" stroke="var(--accent)" stroke-width="2" />
<rect x="350" y="30" width="150" height="80" rx="6" fill="none" stroke="var(--accent)" stroke-width="2" />
<rect x="520" y="30" width="150" height="80" rx="6" fill="none" stroke="var(--hairline)" stroke-width="2" />
<text x="85" y="58" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">1 Stop spending</text>
<text x="85" y="78" text-anchor="middle" font-size="11" fill="var(--muted)">AI keys</text>
<text x="85" y="94" text-anchor="middle" font-size="11" fill="var(--muted)">cloud keys</text>
<text x="255" y="58" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">2 Cut data access</text>
<text x="255" y="78" text-anchor="middle" font-size="11" fill="var(--muted)">database password</text>
<text x="255" y="94" text-anchor="middle" font-size="11" fill="var(--muted)">privileged keys</text>
<text x="425" y="58" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">3 Integrations</text>
<text x="425" y="78" text-anchor="middle" font-size="11" fill="var(--muted)">payments, webhooks</text>
<text x="425" y="94" text-anchor="middle" font-size="11" fill="var(--muted)">email</text>
<text x="595" y="58" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">4 Tidy up</text>
<text x="595" y="78" text-anchor="middle" font-size="11" fill="var(--muted)">salts, unused vars</text>
<text x="595" y="94" text-anchor="middle" font-size="11" fill="var(--muted)">tokens, app access</text>
<text x="340" y="138" text-anchor="middle" font-size="11" fill="var(--muted)">money moves fastest · data matters most · integrations break visibly · the rest is hygiene</text>
</svg>
<figcaption>The order I used. Each step started only when the previous one was checked, not just deployed.</figcaption>
</figure>

1. **Stop spending.** A stolen AI or cloud key costs money by the minute, even
   if nobody touches your data. In my case it was also the only key that had
   actually been used.
2. **Cut data access.** The database password and any privileged backend keys
   come next, even if the logs look clean.
3. **Integrations.** Payment secrets, webhook secrets and email keys. They
   involve a second service, so a mistake breaks something you can see, like
   purchases not unlocking or emails not sending.
4. **Tidy up.** Hashing salts, variables nothing uses any more, tokens on your
   own laptop, third-party apps with access to your code.

For every key I used the same five steps:

1. **Create the new key** next to the old one, so both work for now.
2. **Test it locally first**, where a mistake costs nothing.
3. **Put it on the host and deploy.**
4. **Check that the new key is really the one in use.** A successful deploy
   only tells you the app started, not which key it is using.
5. **Delete the old key, then test again.** If everything still works with the
   old key gone, the new one is what your app runs on.

Step 4 needs a different check for each kind of key. These are the ones I used:

| Key | How I checked the new one was live |
|---|---|
| Cloud key for AI calls | My backend records which provider answered each AI request. After the swap, a test meal was still answered by the main provider, not the backup. |
| Database password | The old password is refused, the new one connects, and the app loads data on a real phone after the redeploy. |
| Payment provider key | Looking up an existing test customer returns the expected subscription. |
| Webhook secret | The provider's "send test event" button, and my backend's response to it. |
| Email keys | One real email through each path that sends mail, then the "last used" date on each new key. |
| Hashing salt | I created a new consent record from my own network and recomputed the hash of my IP address locally with the new salt. It matched. |

When pasting secrets, I used a small script that reads the value from a hidden
prompt or puts it straight on the clipboard, so it never appears on screen or
in my shell history.

## Traps that cost me time

- **Some dashboards never show the saved value.** The webhook field in my
  payment provider's settings looked empty; the grey text was only an example.
  The only reliable check was a real test event.
- **One key can live in more places than you remember.** My email key was also
  used by my website's contact form and by my sign-in emails. The "last used"
  date shows it: if an old key is still being used, you haven't replaced it
  everywhere.
- **Billing lags behind usage.** The billing report showed almost nothing while
  the usage page already showed the limit reached. During an incident, trust the
  usage page.
- **Renaming variables doesn't help once values are readable.** Most keys can be
  recognised by their format alone.

## Tighten afterwards

Rotating makes the stolen values worthless. Tightening makes the next stolen
value worth less.

- **One key per system.** Three systems sharing one email key became three keys,
  each only able to send, and only from my own domain.
- **The narrowest permission that does the job.** My AI service account can call
  AI models and nothing else.
- **Spending limits on every paid API**, plus a budget alert for the whole
  account.
- **Delete what nothing uses.** Old keys, leftover variables, a cloud project
  from an earlier setup.
- **Limit access to your code.** I reduced the third-party apps on my code
  repository to the three I use, each limited to the one repository it needs.
- **No plain-text tokens on your laptop**, and two-factor sign-in with passkeys
  where available on every account that can reach production.

## Keep watching for a while

For a few weeks after an incident, I check the same logs once a week: who used
the privileged key, whether anything changed in storage, and who connected to
the database. It takes a few minutes, and with a seven-day log window, a weekly
check means nothing falls through the gap.

## The checklist

1. Make sure provider security and billing emails reach you, and verify them
   before acting.
2. Contain anything that can spend money first.
3. Check every service for misuse while the logs still exist.
4. Decide whether personal data was affected, and write down why.
5. Rotate in order of risk: spending, data access, integrations, tidying up.
6. For each key: create, test locally, deploy, check it is live, delete the old
   one, test again.
7. Tighten: one key per system, narrowest permission, spending limits, nothing
   unused.
8. Check the logs weekly for a few weeks.

If you have been through something similar, or have a step I've missed, I'd
love to hear about it.
