---
title: Getting started
description: Run the Snabbit Agent Console locally — frontend, backend, and chat worker.
---

The project has three packages that run independently: the frontend at the repository root, the backend in `server/`, and the chat worker in `chat-worker/`. The dashboard runs on its own; the CI/CD pipelines panel shows an error state until the backend is up.

## Frontend

From the repository root:

```bash
npm install
npm run dev          # dashboard on http://localhost:5173
```

By default the frontend calls the API at `http://localhost:3001`. Override the base URL at build time with the `VITE_API_URL` environment variable.

### Frontend npm scripts

All scripts are defined in the root `package.json`:

| Script | Command | Does |
|--------|---------|------|
| `npm run dev` | `vite` | Start the Vite dev server on port 5173 |
| `npm run build` | `tsc -b && vite build` | Type-check then produce a production bundle |
| `npm run preview` | `vite preview` | Serve the production build locally |
| `npm run lint` | `eslint .` | Run ESLint across all source files |
| `npm test` | `vitest run` | Run the Vitest suite once and exit |
| `npm run test:watch` | `vitest` | Run Vitest in interactive watch mode |
| `npm run typecheck` | `tsc -b` | Type-check without emitting output |

:::tip
`npm test` runs in jsdom with `globals: true` and the setup file `src/test/setup.ts` — no browser, no database, no network required.
:::

## Backend

Requires a running PostgreSQL instance.

```bash
cd server
npm install
export DATABASE_URL="postgres://localhost:5432/snabbit_dash"
npm run db:setup     # create tables + load seed data
npm run dev          # API on http://localhost:3001
```

### Backend npm scripts

All scripts are defined in `server/package.json`:

| Script | Command | Does |
|--------|---------|------|
| `npm run dev` | `tsx watch src/index.ts` | Start the API with auto-reload on file changes |
| `npm start` | `tsx src/index.ts` | Start the API once (production-style) |
| `npm run db:setup` | `tsx src/db/setup.ts` | Create tables and upsert seed data into PostgreSQL |
| `npm test` | `vitest run` | Run the Vitest suite once against the in-memory store |
| `npm run typecheck` | `tsc --noEmit` | Type-check without emitting output |

### Configuration

Runtime config (`server/src/config.ts`) is read from environment variables, with local-friendly defaults so development is zero-config:

| Field | Env var | Default | Notes |
|-------|---------|---------|-------|
| `port` | `PORT` | `3001` | Port the Express server listens on |
| `databaseUrl` | `DATABASE_URL` | `postgres://localhost:5432/snabbit_dash` | PostgreSQL connection string |
| `githubToken` | `GITHUB_TOKEN` | `''` | Personal access token (repo + actions:read scope) |
| `githubRepo` | `GITHUB_REPO` | `''` | Repository in `owner/repo` format |

### Going live with the CI/CD integration

By default the CI/CD adapter returns deterministic mock data — no credentials needed. To pull real GitHub Actions runs, set **both** variables before starting the server:

```bash
export GITHUB_TOKEN="<a token with repo + actions:read scope>"
export GITHUB_REPO="owner/repo"
npm run dev
```

When both are present the adapter switches from the mock to the live GitHub Actions provider. The `provider` field in `GET /api/pipelines` responses reports which backend is active (`'mock'` or `'github-actions'`). See [CI/CD integration](/sdlc-sample-worflow/backend/cicd-integration/) for full details.

:::note
The backend's test suite uses the in-memory store and the mock CI/CD provider, so **no database and no network access are required to run the tests** — only to run the live server. See [Testing](/sdlc-sample-worflow/testing/).
:::

## Chat worker

The "Ask the docs" chatbot is a Cloudflare Worker that calls the **Anthropic API** (Claude Haiku 4.5). It is deployed independently of the frontend and backend.

### Setup and deployment

```bash
cd chat-worker
npm install
```

**Build the search index** — this must be run whenever the documentation content changes:

```bash
npm run index        # node build-index.mjs → writes docs-index.json
```

**Set the Anthropic API key** as a Wrangler secret (required once per deployment target):

```bash
npx wrangler secret put ANTHROPIC_API_KEY
# Wrangler will prompt for the key value — paste it and press Enter
```

:::caution
The worker uses `ANTHROPIC_API_KEY` — a Wrangler secret pointing to an Anthropic API key. This is **not** a Cloudflare Workers AI binding. Do not set `AI` or any Workers AI binding; the worker calls `https://api.anthropic.com/v1/messages` directly.
:::

**Deploy to Cloudflare:**

```bash
npm run deploy       # wrangler deploy
```

**Run locally for development:**

```bash
npm run dev          # wrangler dev
```

### Chat worker npm scripts

| Script | Command | Does |
|--------|---------|------|
| `npm run index` | `node build-index.mjs` | Read all docs Markdown, chunk by heading, write `docs-index.json` |
| `npm run dev` | `wrangler dev` | Run the Worker locally via Miniflare |
| `npm run deploy` | `wrangler deploy` | Bundle and push the Worker to Cloudflare |

### Required secret

| Secret name | How to set | Purpose |
|-------------|-----------|---------|
| `ANTHROPIC_API_KEY` | `npx wrangler secret put ANTHROPIC_API_KEY` | Authenticates calls to `https://api.anthropic.com/v1/messages` |

The key is stored only on the Cloudflare Worker — it never appears in source code, `wrangler.toml`, or the browser.

## Running the tests

| Package | Command | Environment |
|---------|---------|-------------|
| Frontend | `npm test` (repo root) | jsdom, no network, no database |
| Backend | `cd server && npm test` | Node, in-memory store, mock CI/CD |

Both test suites are completely self-contained. See [Testing](/sdlc-sample-worflow/testing/) for the full per-suite breakdown of all 49 tests.
