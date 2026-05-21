# Backend

The backend is an Express API in the `server/` folder.

## Stack

- Express
- TypeScript
- PostgreSQL
- A CI/CD integration adapter (GitHub Actions / Jenkins)

## Layout

| Folder           | Contents                          |
| ---------------- | --------------------------------- |
| `server/src/`    | App, routes, stores, integrations |
| `server/src/db/` | Database schema and seed script   |

## CI/CD integration

By default the CI/CD adapter returns deterministic mock data — no credentials
are needed. To pull real GitHub Actions runs, set these environment variables:

```bash
export GITHUB_TOKEN="<a token with repo + actions:read>"
export GITHUB_REPO="owner/repo"
```

## Tests

The backend has 12 tests using Vitest and supertest. They run against the
in-memory store, so no database is required — run them with
`cd server && npm test`.
