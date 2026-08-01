---
title: 'When not to use an LLM'
description: 'A decision matrix for choosing between a language model and deterministic logic, with the failure modes that follow when the choice goes the wrong way.'
pubDate: 2026-08-01T10:00:00Z
group: 'ai-that-has-to-be-right'
type: 'guide'
tags: ['ai', 'llm', 'architecture', 'system-design']
draft: false
---

Most companies are adopting AI backwards.

The moment a team hears "AI", they reach for an LLM. Somewhere along the way the question itself flipped. It used to be: we have this problem, is AI the right fix? Now the mandate comes first, and teams go hunting for problems to attach it to.

That is the golden hammer fallacy at company scale.

AI was always a toolbox. An LLM is one tool in it: powerful, expensive, and highly specialised. The question I keep coming back to is simple. **Is this problem actually made of language, or does it only look that way in the meeting?**

## The matrix

Read each row and decide which column your problem sits in.

| Property of the problem | Language model | Deterministic logic |
|---|---|---|
| Input shape | Open-ended text, messy human context | Structured fields, enums, numbers |
| Correct answer | Several phrasings are acceptable | Exactly one answer is correct |
| Constraints | Soft preferences, ranked by taste | Hard rules that must not break |
| Cost of being wrong | A worse answer, recoverable | A policy violation, a bad number, a compliance event |
| Auditability | An explanation is sufficient | The decision must be reproducible and traceable |
| Volume and latency | Dozens of calls per user action | Thousands per second on a tight budget |
| Rate of change | Requirements shift with language and context | Rules are stable and specified |

**How to read it.** If two or more rows land in the right-hand column, the LLM does not belong in the decision. It belongs in the layer that explains the decision to a person. That distinction, deciding versus explaining, is the whole argument.

## What it looks like by domain

**Health and health tech.** Do not let a model generate unsupported nutritional, medical or wellness claims. Ground claims in verified sources, structured data and rules. Use the model to explain facts, never to create them.

**Finance.** Do not ask a model to decide eligibility, risk or fees. Use deterministic logic, validated models and audit trails. Let the model explain the decision, not make it.

**Customer support.** Do not send every ticket to a model. Route with rules, metadata, history and classifiers first. Use the model where it earns its place: summarising context, drafting a reply for review.

**Operations and supply chain.** Do not ask a model to optimise inventory from a prompt. Use forecasting models, constraints and solvers. Let the model explain the trade-offs, not replace the engine.

## The cost of getting it wrong

This is not a rounding error. In many well-defined classification tasks, a fine-tuned classifier or an embedding-based approach matches or beats a prompted LLM at a fraction of the cost and latency.

And money is only the visible cost. Force a probabilistic model into a deterministic job and you get a confidently wrong number, a policy violation hidden inside fluent text, or a missing citation that still sounds authoritative.

In a dashboard, that is an annoyance. In health, it is misinformation in a clean font.

## One distinction worth naming

I use AI agents heavily to build. Using AI to build a product and forcing AI into the product interface are two different engineering decisions. One is a tool for me. The other is an architecture choice my users have to live with.

Name the problem first. If it does not genuinely involve open-ended language, ambiguity or messy human context, the most responsible AI decision might be no LLM at all.

This is part two. Part one covers the bottlenecks that get mistaken for model problems: [Scaling the model is rarely the fix](/articles/scaling-the-model-is-rarely-the-fix/).
