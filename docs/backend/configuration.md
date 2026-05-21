# Configuration

All backend runtime configuration is read from environment variables in
`server/src/config.ts`. Sensible defaults keep local development zero-config; no
`.env` loader is used, so variables must be present in the process environment.

```ts
export const config = {
  port: Number(process.env.PORT ?? 3001),
  databaseUrl:
    process.env.DATABASE_URL ?? 'postgres://localhost:5432/snabbit_dash',
  githubToken: process.env.GITHUB_TOKEN ?? '',
  githubRepo: process.env.GITHUB_REPO ?? '',
}
```

## Variables

| Variable        | Default                                   | Used by                                  |
| --------------- | ----------------------------------------- | ---------------------------------------- |
| `PORT`          | `3001`                                     | `index.ts` — the port the API listens on. Coerced with `Number(...)`. |
| `DATABASE_URL`  | `postgres://localhost:5432/snabbit_dash`   | The `pg` `Pool` in `index.ts` and `db/setup.ts`. |
| `GITHUB_TOKEN`  | `''` (empty)                               | `getCicdProvider` — selects the live provider. |
| `GITHUB_REPO`   | `''` (empty)                               | `getCicdProvider` — `owner/repo`, e.g. `snabbit/changelog-automation`. |

## CI/CD provider selection

`getCicdProvider` chooses the live GitHub Actions provider **only when both**
`githubToken` and `githubRepo` are non-empty; otherwise it returns the mock
provider. So with the defaults the server starts against deterministic mock data
and needs no credentials.

```bash
# Live GitHub Actions data:
export GITHUB_TOKEN="<token with repo + actions:read>"
export GITHUB_REPO="owner/repo"
```

See [CI/CD integration](cicd-integration.md) for what each provider returns.

!!! warning "The frontend has its own base URL"
    `PORT` only affects the backend. The frontend's API base URL is configured
    separately via `VITE_API_URL` at build time (default `http://localhost:3001`,
    in `src/lib/api.ts`). If you change `PORT`, set `VITE_API_URL` to match.
