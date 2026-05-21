# Getting started

How to run the Snabbit Agent Console locally.

## Frontend

```bash
npm install
npm run dev          # dashboard on http://localhost:5173
```

The dashboard runs on its own. The CI/CD panel shows an error state until the
backend is running.

## Backend

The backend requires a running PostgreSQL instance.

```bash
cd server
npm install
export DATABASE_URL="postgres://localhost:5432/snabbit_dash"
npm run db:setup     # create tables and load seed data
npm run dev          # API on http://localhost:3001
```

## Tests

=== "Frontend"

    ```bash
    npm test
    ```

    37 tests, using Vitest and React Testing Library.

=== "Backend"

    ```bash
    cd server && npm test
    ```

    12 tests, using Vitest and supertest.

!!! note
    The backend tests run against an in-memory store, so no database is needed
    to run them.
