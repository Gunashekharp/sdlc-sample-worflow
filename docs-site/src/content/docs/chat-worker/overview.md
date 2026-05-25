---
title: chat-worker
description: Cloudflare Worker that answers questions about the docs via an indexed corpus.
---

**Section root:** `chat-worker/src`

> Cloudflare Worker that answers questions about the docs via an indexed corpus.

<!-- fill:overview:summary -->
This subsystem is a single stateless Cloudflare Worker, [`index.js`](./index), that powers the docs chatbot. On each `POST` it keyword-searches a bundled `docs-index.json` corpus for the most relevant chunks, builds a grounding context, and asks the Anthropic Messages API (Claude Haiku) to answer using only those excerpts. It owns no persistent state — the browser keeps the conversation and sends recent turns with every request — and the `ANTHROPIC_API_KEY` lives only as a Wrangler secret, never reaching the client. Its input is a JSON body (`question` plus optional `history`) and its output is JSON containing an `answer` and deduplicated `sources`. There is no module dependency graph because the Worker is a single file with one data import.
<!-- /fill:overview:summary -->

## Top-level structure

### Files at the root of this section

| File | Hint |
| --- | --- |
| [`index.js`](./index) | Cloudflare Worker — the chatbot backend for the Snabbit docs site. |

## Architecture

### Module dependency graph

:::note
Dependency graph could not be generated for chat-worker (no modules detected).
:::

## Key flows

<!-- fill:overview:flows -->
- Request handling: the `fetch` handler in [`index.js`](./index) answers `OPTIONS` with CORS headers, rejects non-`POST` methods, parses the JSON body, and validates that a non-empty `question` is present.
- Retrieval + answer: it `search`es the bundled index for the top chunks, returns a "couldn't find it" message if none match, otherwise composes the system prompt plus the user's `question` and trimmed `history` and calls the Anthropic Messages API.
- Response: it returns the model's `answer` together with a URL-deduplicated `sources` list, or a `502`/`500` error if the upstream call fails or the API key secret is missing.
<!-- /fill:overview:flows -->

## When to add code here

<!-- fill:overview:when-to-add -->
Add code here only for the docs chatbot Worker — retrieval/search tuning, prompt changes, the request/response contract, or Anthropic API wiring in [`index.js`](./index). This Worker is deployed independently via Wrangler and must stay stateless, so anything requiring a database, the agent/KPI API, or persistent state belongs in the backend instead. Browser-side chat UI and session storage live in the frontend, not here.
<!-- /fill:overview:when-to-add -->
