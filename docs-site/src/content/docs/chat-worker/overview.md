---
title: chat-worker
description: Cloudflare Worker that answers questions about the docs via an indexed corpus.
---

**Section root:** `chat-worker/src`

> Cloudflare Worker that answers questions about the docs via an indexed corpus.

<!-- fill:overview:summary -->
`chat-worker/` is a single Cloudflare Worker (`src/index.js`) that powers the docs chatbot embedded on this Starlight site. It is stateless: each `POST` carries a `question` plus the last few conversation turns, the worker keyword-searches the bundled `docs-index.json` (produced offline by `build-index.mjs`), and asks Claude Haiku 4.5 via the Anthropic Messages API to answer using only the matched excerpts. The runtime boundary is browser-in / Anthropic-out; the Anthropic key lives only as a Wrangler secret on the Worker and never reaches the client. Conversation memory is held by the browser and resent each request, so this subsystem owns no persistent state.
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
- **Answer a question:** `fetch` handler validates the `POST` body, tokenises the question via `tokenize` (lowercase, dropping stop words and single characters), scores every chunk in `INDEX` against those terms — title/heading matches counted ×4 — and keeps the top `TOP_K` (6).
- **Ground and call Claude:** the matched chunks are concatenated into the `system` prompt under "DOCUMENTATION EXCERPTS:", the last 6 browser-supplied turns are sanitised so the conversation starts with a user message, and the request is sent to `https://api.anthropic.com/v1/messages` with `model: claude-haiku-4-5-20251001` and `max_tokens: 600`.
- **Respond:** the answer plus a de-duplicated list of source `{title, url}` is returned as JSON with permissive CORS headers; if no chunks match at all the worker short-circuits with a "couldn't find anything" message and an empty `sources` array.
<!-- /fill:overview:flows -->

## When to add code here

<!-- fill:overview:when-to-add -->
Add code here only if it's part of the chatbot serving path that needs to run on a Cloudflare Worker — for example, tuning the retrieval scoring, swapping models, or changing the response shape. The docs corpus itself is built offline by `build-index.mjs` from the Starlight content tree, so changing what the bot can see usually means editing the docs under [`frontend`](../frontend/overview/), [`backend`](../backend/overview/), or the hand-curated pages, not editing the worker. UI for the embedded chat lives in the Starlight site, and any code that needs a database, long-running compute, or stored state belongs in [`backend`](../backend/overview/) instead.
<!-- /fill:overview:when-to-add -->
