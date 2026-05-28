---
title: chat-worker
description: Cloudflare Worker that answers questions about the docs via an indexed corpus.
---

**Section root:** `chat-worker/src`

> Cloudflare Worker that answers questions about the docs via an indexed corpus.

<!-- fill:overview:summary -->
The chat-worker subsystem is a self-contained Cloudflare Worker that powers the "Ask AI" assistant on the docs site. The only runtime module is [`index.js`](./index), which on every POST tokenises the question, keyword-scores chunks from a bundled `docs-index.json`, picks the top six, and asks Claude Haiku 4.5 (via the Anthropic Messages API) to answer using only those excerpts. The Worker is stateless — chat history is held by the browser and replayed with each request — and the Anthropic API key lives only as a Wrangler secret so it never reaches the client. The corpus itself is produced offline by `build-index.mjs`, which walks `docs-site/src/content/docs/` and emits the JSON bundle the Worker imports at build time. The single sequence diagram on the [`index.js`](./index) page traces the full request lifecycle from inbound POST through grounding search to the JSON response.
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
**Answering a question.** The browser POSTs `{ question, history }` to the Worker's `fetch` handler in [`index.js`](./index). The handler validates the method, parses JSON, trims the question, clamps history to the last six turns, then calls the internal `search` function which scores every chunk in `docs-index.json` (title/heading matches weighted 4×) and returns the top six. Those chunks become a `DOCUMENTATION EXCERPTS:` block appended to the system prompt; the user/assistant turns plus the new question form the `messages` array sent to `https://api.anthropic.com/v1/messages`. The Worker reads `result.content[0].text`, de-duplicates source URLs preserving relevance order, and returns `{ answer, sources }`.

**Empty-result short-circuit.** If `search` returns no hits (either the question tokenised to nothing after stop-word filtering, or no chunk matched), the Worker skips the Anthropic call entirely and returns a canned "couldn't find it" answer with an empty sources array — saving a model call and avoiding ungrounded responses.

**Offline index build.** `chat-worker/build-index.mjs` (run via `npm run index`) walks `docs-site/src/content/docs/`, parses frontmatter for the title, splits each Markdown body on `## ` headings, strips Mermaid fences, slices anything over 1500 characters, and writes the resulting array to `docs-index.json` — which `index.js` then imports as a static bundle at deploy time.
<!-- /fill:overview:flows -->

## When to add code here

<!-- fill:overview:when-to-add -->
Add code here only if it runs **inside the Cloudflare Worker** that answers docs questions: changes to retrieval (the tokenizer, scoring, `TOP_K`), the prompt template, the Anthropic call, or the request/response shape all belong in [`index.js`](./index). Changes to how the corpus is produced — chunking rules, frontmatter handling, which directories are walked, `MAX_CHUNK` — belong in `chat-worker/build-index.mjs`. Anything that needs durable state (conversation persistence, rate limits per user, analytics) does **not** belong here as written: the Worker is intentionally stateless and the browser owns chat history, so introducing state means also introducing a KV/D1 binding and revisiting the CORS model. UI for the assistant (the chat panel, message rendering, history persistence) lives in the frontend package, not here. Server-side business logic for agents/pipelines lives in the backend package — keep those concerns out of the Worker so it can stay a small edge function with a single secret.
<!-- /fill:overview:when-to-add -->
