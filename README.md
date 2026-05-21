# Snabbit Agent Console

Internal AI workflow console for Snabbit's ops team — a dense, dark,
Linear-grade dashboard for running SDLC agents (PR review, deploys, RCAs,
alert triage), backed by a REST API and a live CI/CD integration.

## Architecture

- **Frontend** (repo root) — Vite + React 19 + TypeScript + Tailwind CSS v4.
- **Backend** (`server/`) — Express + TypeScript, PostgreSQL, and a CI/CD
  integration adapter (GitHub Actions / Jenkins, mock by default).

The dashboard's **CI/CD pipelines panel reads live from the backend**. The
agent grid and KPIs still use local seed data — finishing that migration is
the top item in `BACKLOG.md`.

## Run the frontend

```bash
npm install
npm run dev          # dashboard on http://localhost:5173
```

The dashboard runs on its own; the CI/CD panel shows an error state until the
backend is up.

## Run the backend

Requires a running PostgreSQL instance.

```bash
cd server
npm install
export DATABASE_URL="postgres://localhost:5432/snabbit_dash"
npm run db:setup     # create tables + load seed data
npm run dev          # API on http://localhost:3001
```

### Going live with the CI/CD integration

By default the CI/CD adapter returns deterministic mock data — no credentials
needed. To pull real GitHub Actions runs:

```bash
export GITHUB_TOKEN="<a token with repo + actions:read>"
export GITHUB_REPO="owner/repo"
```

## API

| Endpoint              | Description                                  |
| --------------------- | -------------------------------------------- |
| `GET /api/health`     | Liveness check                               |
| `GET /api/agents`     | Full agent catalogue                         |
| `GET /api/agents/:id` | A single agent (404 if unknown)              |
| `GET /api/kpis`       | KPI list                                     |
| `GET /api/pipelines`  | CI/CD pipelines + summary, via the adapter   |

## Tests

- **Frontend** — `npm test` — 49 tests (Vitest + React Testing Library).
- **Backend** — `cd server && npm test` — 12 tests (Vitest + supertest). Runs
  against the in-memory store, so **no database is needed for tests**.

## Project layout

```
.                  Frontend (Vite + React)
  src/components/   UI components + tests
  src/lib/          Pure logic, API client, hooks
  src/data/         Local seed data + types
server/            Backend (Express + Postgres)
  src/              app, routes, stores, integrations
  src/db/           schema + seed script
```

## Continuous improvement

- **`BACKLOG.md`** — prioritized, verifiable improvements.
- **`PROGRESS.md`** — append-only log of completed work.

Every change keeps `npm test` and `npm run typecheck` green on both packages.
