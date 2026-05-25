---
title: chat-worker
description: Cloudflare Worker that answers questions about the docs via an indexed corpus.
---

**Section root:** `chat-worker/src`

> Cloudflare Worker that answers questions about the docs via an indexed corpus.

<!-- fill:overview:summary -->
This subsystem is a stateless Cloudflare Worker ([`index.js`](./index)) that answers questions about the docs site. Its single `fetch` handler accepts a `POST` with a `question` and recent chat `history`, keyword-searches a bundled `docs-index.json` corpus for the top `TOP_K` (6) matching chunks, then calls the Anthropic Messages API (Claude Haiku 4.5) with those chunks as grounding context and returns the generated answer plus de-duplicated source links. It is independent of the Express `server/` subsystem — it does not query the database or share code, and (as the note above explains) no internal dependency graph is generated because there is only one module. The conversation is never persisted here: the browser keeps session memory and replays recent turns on each request. The Anthropic API key lives only as a Wrangler secret (`ANTHROPIC_API_KEY`) and never reaches the client.
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
**Request handling:** `fetch` in [`index.js`](./index) short-circuits `OPTIONS` (CORS preflight) and rejects non-`POST` methods with 405, parses the JSON body, and returns 400 if `question` is missing.

**Retrieval:** `search(question)` tokenizes the question (dropping stop words), scores every chunk in the bundled index by term frequency with title/heading matches weighted 4x, and returns the best `TOP_K` chunks; an empty result yields a canned "couldn't find it" answer.

**Answering:** The matched chunks are formatted into the system prompt, the last six history turns plus the question become the `messages`, and the Worker calls the Anthropic Messages API; on success it returns the answer with de-duplicated `sources`, and maps a missing key to 500 or an upstream failure to 502.
<!-- /fill:overview:flows -->

## When to add code here

<!-- fill:overview:when-to-add -->
Add code here only for the docs chatbot Worker: retrieval/scoring tweaks, prompt or model changes, or response shaping in `index.js`. It must stay a self-contained, stateless Worker with no dependency on the Express server or its database. API endpoints that serve agent, KPI, or pipeline data belong in the `server/` backend; site content and pages belong in the docs site itself, not here.
<!-- /fill:overview:when-to-add -->
