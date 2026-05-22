---
title: Getting started
---

How to run the Snabbit Agent Console locally. The frontend and backend are
two separate npm packages.

## Frontend

From the repository root:

```bash
npm install
npm run dev          # dashboard on http://localhost:5173
```

The dashboard runs on its own. The CI/CD pipelines panel shows an error state
until the backend is up and reachable on port 3001.

### Frontend scripts

| Script               | Description                                  |
| -------------------- | -------------------------------------------- |
| `npm run dev`        | Start the Vite dev server                    |
| `npm run build`      | Type-check (`tsc -b`) then build for production |
| `npm run preview`    | Preview the production build                 |
| `npm run lint`       | Run ESLint                                   |
| `npm test`           | Run the Vitest suite once                    |
| `npm run test:watch` | Run Vitest in watch mode                     |
| `npm run typecheck`  | Type-check without emitting                  |

## Backend

The running server requires a PostgreSQL instance. From the `server/`
directory:

```bash
cd server
npm install
export DATABASE_URL="postgres://localhost:5432/snabbit_dash"
npm run db:setup     # create tables + load seed data
npm run dev          # API on http://localhost:3001
```

### Backend scripts

| Script              | Description                                              |
| ------------------- | -------------------------------------------------------- |
| `npm run dev`       | Start the API with `tsx watch` (reloads on change)       |
| `npm start`         | Start the API once with `tsx`                            |
| `npm run db:setup`  | Create tables and upsert seed data into Postgres         |
| `npm test`          | Run the Vitest suite (uses the in-memory store)          |
| `npm run typecheck` | Type-check without emitting                              |

:::note
The backend test suite runs against an in-memory store and a mock CI/CD
provider, so **no database is needed to run the tests** — only to run the
server itself.
:::

## Going live with the CI/CD integration

By default the CI/CD adapter returns deterministic mock data and needs no
credentials. To pull real GitHub Actions runs, set both variables before
starting the server:

```bash
export GITHUB_TOKEN="<a token with repo + actions:read>"
export GITHUB_REPO="owner/repo"
```

When both are present the adapter switches to the live GitHub Actions provider
automatically. See [CI/CD integration](/sdlc-sample-worflow/backend/cicd-integration/)
for details.

## Configuration summary

The backend reads these environment variables (all optional, with defaults):

| Variable       | Default                                    | Purpose                                  |
| -------------- | ------------------------------------------ | ---------------------------------------- |
| `PORT`         | `3001`                                     | API listen port                          |
| `DATABASE_URL` | `postgres://localhost:5432/snabbit_dash`   | Postgres connection string               |
| `GITHUB_TOKEN` | _(empty)_                                  | Enables the live CI/CD provider          |
| `GITHUB_REPO`  | _(empty)_                                  | `owner/repo` for the live CI/CD provider |

The frontend reads one variable at build time:

| Variable       | Default                   | Purpose                          |
| -------------- | ------------------------- | -------------------------------- |
| `VITE_API_URL` | `http://localhost:3001`   | Base URL of the backend API      |
