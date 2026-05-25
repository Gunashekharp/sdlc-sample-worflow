---
title: chat-worker
description: Cloudflare Worker that answers questions about the docs via an indexed corpus.
---

**Section root:** `chat-worker/src`

> Cloudflare Worker that answers questions about the docs via an indexed corpus.

<!-- fill:overview:summary -->
The chat-worker is a stateless Cloudflare Worker that powers the docs-site assistant. It receives a question (plus recent chat history) over an HTTP POST, keyword-searches a bundled documentation index (`docs-index.json`), and asks the Anthropic Messages API (Claude Haiku 4.5) to answer using only the matched excerpts — returning the answer and deduplicated source links. As noted under **Module dependency graph**, it is a single-file Worker (`index.js`) with no internal modules. It owns no persistence: the conversation lives in the browser and is replayed on each request, and the Anthropic API key exists only as a Wrangler secret on the Worker, never reaching the client.
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
- **Ask flow:** [`index.js`](./index)'s `fetch` handler parses the POST body, validates the `question`, runs `search()` to keyword-score the bundled index and take the top 6 chunks, builds a grounding `system` prompt from them, and calls the Anthropic API; it returns the model's answer plus deduplicated `sources`.
- **No-match short-circuit:** when `search()` finds no scoring chunks, the handler skips the model call entirely and returns a canned "couldn't find anything" message with empty `sources`.
- **CORS / method guard:** `OPTIONS` requests get the CORS preflight headers and non-`POST` methods return `405`, so the browser can call the Worker cross-origin.
<!-- /fill:overview:flows -->

## When to add code here

<!-- fill:overview:when-to-add -->
Add code here only for the docs chatbot's request/response path — retrieval over the bundled index, prompt construction, the Anthropic call, or CORS/validation. This Worker is deliberately stateless and dependency-light; keep secrets as Wrangler secrets, not in code. The product API (agents, KPIs, pipelines) belongs in the backend (`server/`), and dashboard UI belongs in the frontend (`src/`) — neither should be added to this Worker.
<!-- /fill:overview:when-to-add -->
