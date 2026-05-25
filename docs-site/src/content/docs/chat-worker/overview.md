---
title: chat-worker
description: Cloudflare Worker that answers questions about the docs via an indexed corpus.
---

**Section root:** `chat-worker/src`

> Cloudflare Worker that answers questions about the docs via an indexed corpus.

<!-- fill:overview:summary -->
The chat-worker is a stateless Cloudflare Worker that answers questions about the documentation. Its entry point `index.js` consumes a POST body containing a `question` and recent chat `history`, keyword-searches the bundled `docs-index.json` for the most relevant chunks, asks the Anthropic Messages API (Claude Haiku 4.5) to answer using only those excerpts, and produces a JSON response of `{ answer, sources }`. The build step `build-index.mjs` consumes the Markdown under `docs-site/src/content/docs/` and produces that `docs-index.json` of titled, URL-tagged chunks. As the Module dependency graph note below records, no internal module graph is generated for this subsystem — it is just the Worker plus its offline index builder. The conversation is never stored here; the browser keeps session memory and the `ANTHROPIC_API_KEY` lives only as a Wrangler secret, so it never reaches the client.
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
**Answering a question.** A POST reaches the `fetch` handler in [`index.js`](./index): it parses the body, runs `search()` to keyword-score every chunk of the bundled index and take the top `TOP_K` (6), and — if any match — builds a system prompt embedding those excerpts plus the recent `history` turns (trimmed so the first turn is from the user), calls the Anthropic API, and returns `{ answer, sources }` with sources de-duplicated by URL. If no chunk scores above zero, it short-circuits with a "couldn't find anything" answer and no sources.

**Building the index.** Offline, `build-index.mjs` walks every Markdown page under `docs-site/src/content/docs/` (skipping numbered version archives), strips frontmatter and mermaid blocks, splits each page into `## `-heading chunks capped at `MAX_CHUNK` characters, and writes `docs-index.json` — the corpus [`index.js`](./index) imports at build time.
<!-- /fill:overview:flows -->

## When to add code here

<!-- fill:overview:when-to-add -->
Add code here only if it serves the docs chatbot's request/response path or its offline index pipeline: retrieval scoring, prompt construction, the Anthropic call, source formatting, or how `build-index.mjs` chunks Markdown. Keep it stateless and free of secrets in source — credentials stay as Wrangler secrets. Backend REST endpoints, the agent/KPI data layer, and anything that needs the Postgres database belong in `server/`, not here; UI and the docs content itself belong in `docs-site/`.
<!-- /fill:overview:when-to-add -->
