---
title: "config.ts — runtime configuration"
---

**File:** `server/src/config.ts`

Reads all runtime configuration from environment variables once at module load time, with safe local-development defaults for every field. All configuration is exported as a single immutable `config` object.

## Full source

```ts
export const config = {
  port: Number(process.env.PORT ?? 3001),
  databaseUrl: process.env.DATABASE_URL ?? 'postgres://localhost:5432/snabbit_dash',
  githubToken: process.env.GITHUB_TOKEN ?? '',
  githubRepo: process.env.GITHUB_REPO ?? '',
}
```

## Configuration fields

| Field | Env var | Default | Purpose |
|---|---|---|---|
| `port` | `PORT` | `3001` | TCP port the Express server binds to |
| `databaseUrl` | `DATABASE_URL` | `postgres://localhost:5432/snabbit_dash` | Full PostgreSQL connection string, passed to `pg.Pool` |
| `githubToken` | `GITHUB_TOKEN` | `''` | GitHub Personal Access Token for the Actions API |
| `githubRepo` | `GITHUB_REPO` | `''` | GitHub repository in `owner/repo` format |

### `port`

```ts
port: Number(process.env.PORT ?? 3001)
```

The `??` operator provides the fallback `3001` when `PORT` is `undefined` or `null` — but not when it is an empty string. If `PORT` is set to a non-numeric string, `Number()` returns `NaN`, and Express will fail to bind at startup. Validate the environment variable if deploying to a platform that sets `PORT` automatically.

### `databaseUrl`

```ts
databaseUrl: process.env.DATABASE_URL ?? 'postgres://localhost:5432/snabbit_dash'
```

Passed directly to `new Pool({ connectionString: config.databaseUrl })` in `index.ts`. The default assumes a local Postgres instance with:
- Host: `localhost`
- Port: `5432`
- No username, no password
- Database name: `snabbit_dash`

For production deployments, set `DATABASE_URL` to a full connection string including credentials:

```
DATABASE_URL=postgres://user:password@hostname:5432/dbname
```

### `githubToken`

```ts
githubToken: process.env.GITHUB_TOKEN ?? ''
```

A GitHub Personal Access Token (PAT) or Actions token with `repo` and `actions:read` scopes. Defaults to the empty string. An empty string is falsy — `getCicdProvider` checks `if (env.githubToken && env.githubRepo)`, so the mock provider is selected when this is not set.

### `githubRepo`

```ts
githubRepo: process.env.GITHUB_REPO ?? ''
```

The target repository in `owner/repo` format (for example, `'snabbit/app'`). Defaults to the empty string. Both `githubToken` and `githubRepo` must be non-empty for the live GitHub Actions provider to activate.

## Zero-config local development

All four fields have defaults that allow the server to start without any environment configuration:

```bash
# No .env file needed — just start Postgres and run:
npm run db:setup   # create tables and seed data
npm run dev        # start server on :3001 with mock CI/CD provider
```

:::note
Running without `GITHUB_TOKEN` and `GITHUB_REPO` is expected during local development. The mock CI/CD provider returns eight deterministic pipelines and requires no credentials.
:::

## CI/CD provider activation logic

```mermaid
flowchart TD
    T{"GITHUB_TOKEN\nnon-empty?"}
    R{"GITHUB_REPO\nnon-empty?"}
    M["Mock provider\n(name: 'mock')"]
    L["GitHub Actions provider\n(name: 'github-actions')"]

    T -->|No| M
    T -->|Yes| R
    R -->|No| M
    R -->|Yes| L
```

## Used by

- **`server/src/index.ts`** — reads `config.port`, `config.databaseUrl`, `config.githubToken`, `config.githubRepo` at startup.
- **`server/src/db/setup.ts`** — reads `config.databaseUrl` to create the `pg.Pool` for table setup.
