---
title: Chat worker overview
---

The `chat-worker/` directory contains a stateless **Cloudflare Worker** that
powers the "Ask the docs" AI chatbot embedded on every page of this
documentation site. It also contains the build script that produces the search
index the worker uses.

## Architecture

```mermaid
flowchart TD
  subgraph Browser
    Widget["ChatWidget.astro\n(docs site)"]
  end

  subgraph Cloudflare["Cloudflare Edge"]
    Worker["chat-worker/src/index.js\nCloudflare Worker"]
    AI["Workers AI\n@cf/meta/llama-3.1-8b-instruct"]
  end

  subgraph Build["Build step (CI)"]
    Builder["build-index.mjs"]
    Docs["docs-site/src/content/docs/**/*.md"]
    Index["docs-index.json\n(bundled into Worker)"]
  end

  Widget -->|"POST { question, history }"| Worker
  Worker -->|"keyword search"| Index
  Worker -->|"AI.run(model, messages)"| AI
  AI -->>Worker: answer string
  Worker -->>Widget: "{ answer, sources }"

  Docs -->|"walk + chunk"| Builder
  Builder -->|"writes"| Index
```

## How it works

1. **Build time**: `build-index.mjs` reads every Markdown page in the docs,
   splits each into heading-level chunks, and writes a JSON search index
   (`docs-index.json`) into the worker directory. This index is bundled into
   the deployed Worker.

2. **Request time**: The browser sends `POST { question, history }` to the
   deployed Worker. The Worker:
   - Tokenizes the question and keyword-searches the index.
   - Selects the top-6 most relevant document chunks as grounding context.
   - Calls Cloudflare Workers AI (`llama-3.1-8b-instruct`) with a system
     prompt, the context, recent chat history, and the user's question.
   - Returns the AI answer plus deduplicated source links.

3. **Session memory**: The conversation history is kept entirely in the browser
   (session storage in `ChatWidget.astro`). The worker is fully stateless —
   recent turns are sent with each request (up to 6 turns) and not stored
   server-side.

## Why keyword search, not vector embeddings?

The worker intentionally uses a simple TF-style keyword scorer rather than
vector embeddings. The Cloudflare Workers AI free tier does not include an
embedding API, and the documentation corpus is small enough that keyword
matching over chunk titles and text gives acceptable relevance at zero extra
cost.

Title / heading matches are weighted 4× more than body text matches to prefer
on-topic pages over pages that merely mention a term in passing.

## Deployment

```bash
cd chat-worker
npm install
node build-index.mjs   # rebuild the search index from current docs
npm run deploy         # deploys via Wrangler
```

After deploying, set `WORKER_URL` in the docs site environment to the deployed
Worker's URL so `ChatWidget.astro` knows where to send requests.

See `chat-worker/README.md` for detailed wiring instructions.

## Source files

| File | Purpose |
|------|---------|
| `chat-worker/src/index.js` | Cloudflare Worker — the chatbot request handler |
| `chat-worker/build-index.mjs` | Build script — produces `docs-index.json` |
| `chat-worker/docs-index.json` | Generated search index (committed for deploy) |
| `chat-worker/wrangler.toml` | Wrangler deploy configuration |
| `chat-worker/package.json` | npm scripts and Wrangler dependency |

## Per-file reference

- [Worker (src/index.js)](/sdlc-sample-worflow/chat-worker/worker/) — request handler, search, AI call
- [build-index.mjs](/sdlc-sample-worflow/chat-worker/build-index/) — docs indexer
