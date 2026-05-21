# Getting started

How to run the Snabbit Agent Console locally. The frontend and backend are two
separate npm packages — the frontend at the repository root, the backend under
`server/`.

## Prerequisites

- **Node.js** — the toolchain targets current LTS. The packages use ESM
  (`"type": "module"` in both `package.json` files).
- **PostgreSQL** — only required to run the backend against real data. Tests and
  the mock CI/CD provider need no database.

## Frontend

```bash
npm install
npm run dev          # dashboard on http://localhost:5173
```

The dashboard runs entirely on its own seed data for the agent grid and KPIs, so
it is usable with no backend. The **CI/CD pipelines panel** calls the backend on
mount; until the API is running it shows an inline error
("Could not reach the API … Is the server running on port 3001?").

!!! tip "Pointing the frontend at a different API"
    The API base URL defaults to `http://localhost:3001`. Override it at build
    time with the `VITE_API_URL` environment variable (read in `src/lib/api.ts`).

### Frontend scripts

| Script              | Command            | Purpose                                  |
| ------------------- | ------------------ | ---------------------------------------- |
| `npm run dev`       | `vite`             | Start the dev server with HMR.           |
| `npm run build`     | `tsc -b && vite build` | Type-check then produce a production build. |
| `npm run preview`   | `vite preview`     | Serve the production build locally.      |
| `npm run lint`      | `eslint .`         | Lint the project.                        |
| `npm test`          | `vitest run`       | Run the test suite once.                 |
| `npm run test:watch`| `vitest`           | Run tests in watch mode.                 |
| `npm run typecheck` | `tsc -b`           | Type-check without emitting.             |

## Backend

The backend serves the agent catalogue, KPIs, and CI/CD pipeline data. The
running server uses PostgreSQL; the test suite uses an in-memory store instead.

```bash
cd server
npm install
export DATABASE_URL="postgres://localhost:5432/snabbit_dash"
npm run db:setup     # create tables and load seed data
npm run dev          # API on http://localhost:3001
```

!!! warning "db:setup requires a reachable database"
    `npm run db:setup` connects with `DATABASE_URL` (default
    `postgres://localhost:5432/snabbit_dash`), runs the schema, and upserts the
    seed rows. It exits with a non-zero status if the connection fails.

### Going live with the CI/CD integration

By default the CI/CD adapter returns deterministic **mock** data — no credentials
needed. To pull real **GitHub Actions** runs, set both variables and restart:

```bash
export GITHUB_TOKEN="<a token with repo + actions:read>"
export GITHUB_REPO="owner/repo"
```

When both are present the server selects the live GitHub Actions provider on
startup and logs which provider is active. See
[CI/CD integration](backend/cicd-integration.md).

### Backend scripts

| Script              | Command               | Purpose                              |
| ------------------- | --------------------- | ------------------------------------ |
| `npm run dev`       | `tsx watch src/index.ts` | Start the API with reload on change. |
| `npm run start`     | `tsx src/index.ts`    | Start the API once.                  |
| `npm run db:setup`  | `tsx src/db/setup.ts` | Create tables and upsert seed data.  |
| `npm test`          | `vitest run`          | Run the test suite once.             |
| `npm run typecheck` | `tsc --noEmit`        | Type-check without emitting.         |

## Tests

=== "Frontend"

    ```bash
    npm test
    ```

    37 tests across 7 files, using Vitest and React Testing Library in a jsdom
    environment. See [Frontend testing](frontend/testing.md).

=== "Backend"

    ```bash
    cd server && npm test
    ```

    12 tests across 2 files, using Vitest and supertest. See
    [Backend testing](backend/testing.md).

!!! note "No database needed for tests"
    The backend tests run against the in-memory store and the mock CI/CD
    provider, so no PostgreSQL instance is required.
