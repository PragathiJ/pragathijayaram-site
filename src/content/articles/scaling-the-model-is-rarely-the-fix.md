---
title: 'Scaling the model is rarely the fix'
description: 'Four structural bottlenecks that look like model problems and are fixed entirely outside the model: state, constraints, data, and determinism.'
pubDate: 2026-08-01T09:00:00Z
group: 'ai-that-has-to-be-right'
type: 'guide'
tags: ['ai', 'llm', 'architecture', 'machine-learning']
ogImage: '/og/scaling-the-model-is-rarely-the-fix.png'
draft: false
---

"Can we just scale up the model?" is the most expensive sentence in AI right now.

It is the industry's default reflex, and usually a costly patch over an architectural gap. After years of building ML systems, I have learned to look almost anywhere else first.

Somewhere in the last two years, "AI" quietly became shorthand for "a few large language models". But the model is rarely the real problem.

Before consumer health tech, I built ML stacks in automotive and industrial settings: gaze, pose, real-time sensor processing. When a system underperformed in production, scaling the parameter count was rarely the fix. It was almost always one of four structural bottlenecks, and every one of them is fixed outside the model.

## 1. It is stateless when the problem is stateful

An LLM has no memory of its own. Every call starts from zero. Appending an ever-growing prompt history to fake memory is an anti-pattern: token cost balloons, latency rises, and recall degrades as the context fills with things that no longer matter.

**The fix.** Build a dedicated state layer, whether that is a key-value store or an explicit state machine, and pass only the context the current step requires. State belongs in a system designed to hold state, not in a prompt.

## 2. You are generating text instead of solving an optimisation problem

Picking a single meal under fifteen strict dietary constraints is not a writing task. It is constrained optimisation. Being probabilistic, an LLM offers no hard guarantees, and it will break strict boundaries often enough to matter.

**The fix.** Encode hard constraints in deterministic logic or a classical solver, mixed-integer linear programming among them. Let the solver own what must not be violated. Use the model for the soft layer: phrasing, explanation, the parts where several answers are acceptable.

## 3. The answer is not in your data

No model can surface an insight from data that was never ingested, indexed, or unified. You cannot prompt your way out of missing upstream fields or siloed infrastructure.

**The fix.** Recognise a data pipeline problem wearing an AI costume. Enforce entity schemas and fix ingestion first. The model can only reason over what reached it.

## 4. You are trusting probabilistic maths for deterministic values

In health tech, a confidently hallucinated micronutrient count is worse than an empty field. An empty field prompts a question. A wrong number gets believed. LLMs predict the next token; on their own they do not compute values or verify facts.

**The fix.** Route those queries through a grounding layer that pulls exact values from verified sources, food composition databases and curated literature among them. Never let a model produce a number out of thin air.

## What this means in practice

Usually the bug is one of those four, and no model upgrade closes any of them.

This is why, at Anovi, the layer I have spent the most on is not the model. It is the evidence and grounding architecture: structured nutrition databases, validated calculations, and peer-reviewed sources behind the claims. The numbers hold because the data holds, not because a model sounded confident.

The most honest fix is sometimes realising the feature never needed a language model at all. That decision deserves its own treatment, so I wrote it up separately in [When not to use an LLM](/articles/when-not-to-use-an-llm/).

Architecture beats size. It almost always has.
