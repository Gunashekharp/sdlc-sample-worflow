---
title: chat-worker
description: Cloudflare Worker that answers questions about the docs via an indexed corpus.
---

**Section root:** `chat-worker/src`

> Cloudflare Worker that answers questions about the docs via an indexed corpus.

<!-- fill:overview:summary -->
The `chat-worker/src` subsystem is a single stateless Cloudflare Worker (`index.js`) that powers the documentation site's "ask the docs" chatbot. It owns no persistent state: each request carries the user's question plus recent chat history from the browser, the Worker keyword-searches a bundled `docs-index.json` corpus for the most relevant chunks, calls the Anthropic Messages API (Claude Haiku 4.5) with those chunks as grounding context, and returns the generated answer plus deduplicated source links. The Anthropic API key never reaches the browser — it lives only as a Wrangler secret on the Worker. As the note under Architecture explains, there is no internal module graph here; the corpus is the worker's only "dependency", imported at build time. Its runtime boundaries are the browser (inbound questions over CORS-enabled POST) and the Anthropic API (outbound completion request).
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
- **Answering a question:** A browser POSTs `{ question, history }` to the Worker ([`index.js`](./index)); it tokenizes the question, scores every chunk in `docs-index.json` (weighting title/heading matches), takes the top `TOP_K` chunks, builds a grounding system prompt, calls the Anthropic API, and returns `{ answer, sources }`.
- **CORS preflight:** An `OPTIONS` request short-circuits to a bare 200 with the CORS headers so the cross-origin browser fetch is allowed.
- **Failure handling:** Missing/empty question → 400; no matching docs → a canned "couldn't find it" answer; missing `ANTHROPIC_API_KEY` → 500; a non-OK Anthropic response or thrown error → 502.
<!-- /fill:overview:flows -->

## When to add code here

<!-- fill:overview:when-to-add -->
Add code here only for the docs chatbot's request handling — retrieval scoring, prompt construction, the Anthropic call, or response shaping. This Worker is deliberately self-contained and stateless, so keep new logic free of persistent storage and per-user sessions (the browser owns conversation memory). Application data endpoints for the dashboard belong in the `server/` backend, and anything that renders UI belongs in the frontend `src/`; this subsystem's sole job is grounding answers in the bundled docs corpus.
<!-- /fill:overview:when-to-add -->
