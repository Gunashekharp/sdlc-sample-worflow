---
title: index
description: Reference for `chat-worker/src/index.js`
---

**File:** `chat-worker/src/index.js` · **Lines:** 157

> Cloudflare Worker — the chatbot backend for the Snabbit docs site.
> Stateless: it receives a question (plus recent chat history for context),
> keyword-searches the bundled docs index, asks the Anthropic API (Claude
> Haiku 4.5) to answer using only the matched docs, and returns the answer +
> source links.
> The conversation is NOT stored here — the browser keeps it (session memory)
> and sends recent turns with each request. The Anthropic API key lives only
> as a Wrangler secret on the Worker; it never reaches the browser.

## Imports

This file pulls in the following modules. Relative imports point to other documented files; external imports are libraries from `node_modules`.

| Module | Imports | Kind |
| --- | --- | --- |
| `../docs-index.json` | `default as INDEX` | internal |


:::note
No exported symbols detected by the AST. This file is a side-effect entrypoint, a re-export barrel, or a runtime bootstrap — open `chat-worker/src/index.js` directly to read the source.
:::

## Diagrams

<!-- fill:file:diagrams -->
The `fetch` handler's request lifecycle, from inbound POST to grounded answer:

```mermaid
sequenceDiagram
  participant Browser
  participant Worker as Worker (fetch)
  participant Index as docs-index.json
  participant Anthropic as Anthropic API

  Browser->>Worker: POST { question, history }
  alt method OPTIONS
    Worker-->>Browser: 200 (CORS headers)
  else not POST
    Worker-->>Browser: 405 POST only
  end
  Worker->>Worker: parse JSON, validate question
  Worker->>Index: search(question) → top TOP_K chunks
  alt no hits
    Worker-->>Browser: canned "couldn't find it" answer
  else hits found
    Worker->>Worker: build system prompt + message turns
    alt missing ANTHROPIC_API_KEY
      Worker-->>Browser: 500
    else
      Worker->>Anthropic: POST /v1/messages (system, messages)
      alt response not ok / throws
        Worker-->>Browser: 502
      else
        Anthropic-->>Worker: answer text
        Worker->>Worker: dedupe sources by URL
        Worker-->>Browser: { answer, sources }
      end
    end
  end
```
<!-- /fill:file:diagrams -->

:::caution
The bundled source (`chat-worker/src/index.js`) calls the **Anthropic Messages API (Claude Haiku 4.5)**, which requires an `ANTHROPIC_API_KEY` Wrangler secret. Note that a later revert commit describes switching the chatbot to free Cloudflare Workers AI; if that change lands, this page should be regenerated to match.
:::
