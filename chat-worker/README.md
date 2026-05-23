# Docs chatbot — Cloudflare Worker backend

The backend for the "Ask the docs" chat widget on the documentation site.

It is a stateless Cloudflare Worker: it receives a question, keyword-searches
the bundled docs index, asks **Cloudflare Workers AI** to answer using only the
matched docs, and returns the answer plus source links. The conversation itself
lives in the visitor's browser (session memory) — nothing is stored here.

## What's in here

| File | Purpose |
|------|---------|
| `build-index.mjs` | Reads the docs Markdown and produces `docs-index.json` |
| `docs-index.json` | The search index the Worker uses (generated) |
| `src/index.js` | The Worker — search + AI call + response |
| `wrangler.toml` | Worker config, including the Workers AI binding |
| `package.json` | Scripts: `index`, `dev`, `deploy` |

## Cost

- **Hosting** — Cloudflare Workers free plan (100,000 requests/day).
- **AI** — Cloudflare Workers AI free allowance (10,000 Neurons/day).
- **No API key** — the AI is reached through the `AI` binding, which uses your
  Cloudflare account directly. There is no key to manage or hide.

Beyond the free daily allowance you'd need Cloudflare's paid plan.

## Deploy — one time

You need a free [Cloudflare account](https://dash.cloudflare.com/sign-up) and
Node 18+.

```bash
cd chat-worker

# 1. Build the search index from the current docs
npm run index

# 2. Install Wrangler (Cloudflare's CLI) and log in
npm install
npx wrangler login

# 3. Deploy the Worker
npm run deploy
```

Wrangler prints the deployed URL, e.g.
`https://snabbit-docs-chatbot.<your-subdomain>.workers.dev`.

## Connect the widget

Open `docs-site/src/components/ChatWidget.astro`, find `WORKER_URL` near the top
of the `<script>` block, and replace the placeholder with the URL Wrangler
printed:

```js
const WORKER_URL = 'https://snabbit-docs-chatbot.your-subdomain.workers.dev';
```

Commit, then let the docs site rebuild and deploy. The chat button appears at
the bottom-right of every docs page.

## Keeping the bot up to date

The index is a snapshot of the docs taken when you last ran `npm run index`.
When the documentation changes, refresh it:

```bash
npm run index   # rebuild docs-index.json
npm run deploy  # redeploy the Worker with the new index
```

To automate this, run those two commands from a GitHub Action whenever
`docs-site/` changes (it needs a `CLOUDFLARE_API_TOKEN` secret).

## Notes

- **Model** — set by `MODEL` in `src/index.js`
  (`@cf/meta/llama-3.1-8b-instruct`). Swap it for any other Workers AI text
  model if you want.
- **CORS** is open (`*`) so the docs site can call the Worker. To lock it to
  your site only, set `Access-Control-Allow-Origin` in `src/index.js` to your
  Pages origin.
- **Retrieval** is keyword-based — simple and dependency-free. For sharper
  results on a large docs set, upgrade to embeddings later.
