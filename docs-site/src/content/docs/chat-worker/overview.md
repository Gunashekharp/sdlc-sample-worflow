---
title: chat-worker
description: Cloudflare Worker that answers questions about the docs via an indexed corpus.
---

**Section root:** `chat-worker/src`

> Cloudflare Worker that answers questions about the docs via an indexed corpus.

<!-- fill:overview:summary -->
The `chat-worker/` tree is a stateless Cloudflare Worker that powers the docs chatbot. It owns one endpoint (`POST /`) that takes `{ question, history }`, runs a keyword search over the bundled `docs-index.json` corpus, and asks Claude Haiku 4.5 via the Anthropic Messages API to answer using only the matching excerpts. The build-time script `build-index.mjs` produces the index from `docs-site/src/content/docs/`; the only secret, `ANTHROPIC_API_KEY`, lives as a Wrangler secret on the Worker and never reaches the browser. Conversation history is held by the browser and resent with each request — there is no per-session state on the Worker.
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
- **Index build.** `node build-index.mjs` walks `docs-site/src/content/docs/`, strips Mermaid blocks and frontmatter, splits each page on `## ` headings, and writes a flat array of `{ title, heading, url, text }` chunks to `chat-worker/docs-index.json`. The Worker imports this file at deploy time.
- **Question → answer.** [`fetch`](./index) tokenises the incoming question (lowercase, dropping stop words), scores every chunk in the index (4× weight on title/heading matches), and keeps the top `TOP_K = 6`. The chunks are interpolated into the system prompt and the Anthropic Messages API (Haiku 4.5) is called with the recent `history` plus the new user turn; the JSON response carries the model's `answer` and a de-duplicated `sources` array.
- **Empty result.** If no chunks score above zero, the Worker short-circuits before calling Anthropic and returns a "couldn't find anything" reply with `sources: []`.
<!-- /fill:overview:flows -->

## When to add code here

<!-- fill:overview:when-to-add -->
Only add code here if it has to run inside the Cloudflare Worker that backs the docs chatbot — search/retrieval over the docs index, the Anthropic API call, or the request/response shape exchanged with the browser widget. Anything that needs Node-only modules, the agent database, or the dashboard UI belongs in `server/` or `src/` instead. Re-run `npm run index` whenever the docs change so the corpus stays in sync, then redeploy.
<!-- /fill:overview:when-to-add -->
