---
title: Getting started
description: Run the Snabbit Agent Console locally.
---

The project has two packages that run independently: the frontend at the
repository root and the backend in `server/`. The dashboard runs on its own;
its CI/CD pipelines panel shows an error state until the backend is up.

## Frontend

From the repository root:

```bash
npm install
npm run dev          # dashboard on http://localhost:5173
```

Other scripts (from `package.json`):

| Script               | Does                                    |
| -------------------- | --------------------------------------- |
| `npm run dev`        | Start the Vite dev server               |
| `npm run build`      | `tsc -b` then `vite build`              |
| `npm run preview`    | Preview the production build            |
| `npm run lint`       | Run ESLint                              |
| `npm test`           | Run the Vitest suite once               |
| `npm run test:watch` | Vitest in watch mode                    |
| `npm run typecheck`  | `tsc -b` with no emit                   |

By default the frontend calls the API at `http://localhost:3001`. Override the
base URL at build time with the `VITE_API_URL` environment variable.

## Backend

Requires a running PostgreSQL instance.

```bash
cd server
npm install
export DATABASE_URL="postgres://localhost:5432/snabbit_dash"
npm run db:setup     # create tables + load seed data
npm run dev          # API on http://localhost:3001
```

Scripts (from `server/package.json`):

| Script              | Does                                          |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | `tsx watch src/index.ts` (auto-reload)        |
| `npm start`         | `tsx src/index.ts`                            |
| `npm run db:setup`  | Create tables and upsert seed data            |
| `npm test`          | Run the Vitest suite once                     |
| `npm run typecheck` | `tsc --noEmit`                                |

### Configuration

Runtime config (`server/src/config.ts`) is read from environment variables,
with local-friendly defaults so development is zero-config:

| Field         | Env var        | Default                                  |
| ------------- | -------------- | ---------------------------------------- |
| `port`        | `PORT`         | `3001`                                   |
| `databaseUrl` | `DATABASE_URL` | `postgres://localhost:5432/snabbit_dash` |
| `githubToken` | `GITHUB_TOKEN` | `''`                                     |
| `githubRepo`  | `GITHUB_REPO`  | `''`                                     |

### Going live with the CI/CD integration

By default the CI/CD adapter returns deterministic mock data — no credentials
needed. To pull real GitHub Actions runs, set **both** variables before
starting the server:

```bash
export GITHUB_TOKEN="<a token with repo + actions:read>"
export GITHUB_REPO="owner/repo"
```

When both are present the adapter switches from the mock to the live GitHub
Actions provider. See
[CI/CD integration](/sdlc-sample-worflow/backend/cicd-integration/) for details.

:::note
The backend's test suite uses the in-memory store and the mock CI/CD provider,
so **no database and no network access are required to run the tests** — only
to run the live server. See [Testing](/sdlc-sample-worflow/testing/).
:::

## Tests

- **Frontend** — `npm test` from the root (Vitest + React Testing Library).
- **Backend** — `cd server && npm test` (Vitest + supertest), against the
  in-memory store.
