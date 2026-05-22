---
title: Architecture
description: How the Snabbit Agent Console fits together.
---

The console is split into a React frontend and an Express backend, connected
over a REST API, with a pluggable CI/CD integration. The two packages live in
one repository but build, test and run independently.

## High-level shape

```
Browser
  │
  │  React SPA (Vite dev server :5173)
  │  ── src/App.tsx composes the dashboard
  │
  │  fetch  GET /api/pipelines        (only live call today)
  ▼
Express API (:3001)  ── server/src/app.ts
  │
  ├── Store            ── agents + KPIs        ──▶ PostgreSQL
  └── CicdProvider     ── pipelines            ──▶ mock  | GitHub Actions API
```

The frontend is a self-contained single-page app. Of its four dashboard panels
only the **CI/CD pipelines panel** talks to the backend; the KPI strip,
featured agent and agent grid all render from local seed data in `src/data/`.
The backend exposes `/api/agents` and `/api/kpis` as well, and they are tested,
but the dashboard does not consume them yet.

## Frontend

A Vite + React 19 + TypeScript + Tailwind CSS v4 SPA at the repository root.

- **`index.html`** mounts the app into `#root`, sets a dark color scheme, and
  loads the Geist / Geist Mono fonts.
- **`src/main.tsx`** renders `<App />` inside `<StrictMode>`.
- **`src/App.tsx`** composes the layout: a fixed `Sidebar`, then a flex column
  of `TopBar`, a scrollable `main` (KPI strip, featured agent, pipelines panel,
  agent grid), and a pinned `PromptBar`.

Non-visual logic lives in `src/lib/`: a typed API client (`api.ts`), the
`useFetch` and `usePersistentState` hooks, and the pure `filterAgents` /
`sortAgents` functions. Keeping it out of components makes it directly
unit-testable. See the [frontend overview](/sdlc-sample-worflow/frontend/overview/).

## Backend

An Express 5 + TypeScript API run with `tsx`, in `server/`.

The app is built by a **dependency-injecting factory**,
`createApp({ store, cicd })` (`app.ts`). This is the key architectural choice:
the running server (`index.ts`) injects a Postgres-backed store and the
configured CI/CD provider, while the test suite injects an in-memory store and
the mock provider. As a result, `npm test` needs no database and no network.

Two abstractions are injected:

- **`Store`** (`store.ts`) — read access to agents and KPIs. Implemented by
  `createMemoryStore` (arrays, used in tests) and `createPostgresStore` (a `pg`
  pool, used by the server). See [stores & database](/sdlc-sample-worflow/backend/stores/).
- **`CicdProvider`** (`integrations/cicd.ts`) — `listPipelines()`. Implemented
  by `createMockCicdProvider` (deterministic, default) and
  `createGithubActionsProvider` (live). `getCicdProvider` picks the live one
  only when both `GITHUB_TOKEN` and `GITHUB_REPO` are set. See
  [CI/CD integration](/sdlc-sample-worflow/backend/cicd-integration/).

Routes (`routes.ts`) are thin: each reads from an injected dependency and
returns JSON. A catch-all error handler turns any unhandled error into
`500 { "error": "Internal server error" }`.

## The data boundary

The frontend and backend keep **structurally identical** `Agent` and `Kpi`
types (`src/data/` and `server/src/domain.ts`), maintained by hand — there is
no shared package. The seed data is duplicated too: `src/data/agents.ts` /
`kpis.ts` for the frontend, and `server/src/seed.ts` for the backend (loaded
into Postgres by `db:setup` and used by the in-memory store in tests).

In Postgres the columns are `snake_case`; `postgresStore.ts` maps rows back to
the camelCase domain types, and the KPI `trend` array is stored as JSONB. See
the [data model](/sdlc-sample-worflow/backend/data-model/).

## Request flow: the pipelines panel

The one end-to-end path in the app today:

1. `PipelinesPanel` calls `useFetch(fetchPipelines)` on mount.
2. `fetchPipelines` issues `GET /api/pipelines` to `VITE_API_URL`
   (default `http://localhost:3001`).
3. The route asks `cicd.listPipelines()`, runs `summarizePipelines()` over the
   result, and returns `{ provider, summary, pipelines }`.
4. The panel renders one of four states — loading, error, empty, or a list of
   pipeline rows — and a **Refresh** button re-runs the fetch.

If the backend is down, the panel shows an error state ("Could not reach the
API…") rather than breaking the rest of the dashboard, which runs entirely on
local data.

## CORS and ports

The API enables CORS for all origins so the Vite dev server (port 5173) can
call it (port 3001). Both ports are configurable — the API port via `PORT`, the
frontend's API base via `VITE_API_URL`.
