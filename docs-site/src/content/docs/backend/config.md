---
title: config
description: Reference for `server/src/config.ts`
---

**File:** `server/src/config.ts` · **Lines:** 14

<!-- fill:file:summary -->
This file centralizes the backend's runtime configuration, reading each value from an environment variable with a sensible default so local development is zero-config. It exposes a single `config` object with `port`, `databaseUrl`, `githubToken`, and `githubRepo`. `index.ts` reads `config.port` and the GitHub credentials to start the server and choose the CI/CD provider, and `db/setup.ts` reads `config.databaseUrl` to connect to Postgres.
<!-- /fill:file:summary -->

## Symbols

This file exports 1 symbol. Every export is documented below, in declaration order.

| Name | Kind | Default |
| --- | --- | --- |
| config | const | no |

## config

**Kind:** `const`

```ts
const config: { port: number; databaseUrl: any; githubToken: any; githubRepo: any; }
```

<!-- fill:sym:config:summary -->
A frozen-style object literal of resolved settings. `port` is `process.env.PORT` coerced with `Number`, defaulting to `3001`; `databaseUrl` falls back to `postgres://localhost:5432/snabbit_dash`; and `githubToken`/`githubRepo` default to empty strings. The empty-string defaults are deliberate: when both are set the CI/CD adapter goes live, and when either is blank `getCicdProvider` falls back to the mock provider.
<!-- /fill:sym:config:summary -->

### Used by

- `server/src/index.ts`
- `server/src/db/setup.ts`

## Diagrams

<!-- fill:file:diagrams -->

<!-- /fill:file:diagrams -->

## Source

Full file source for `server/src/config.ts` (14 lines). The line-by-line walkthroughs above reference these line numbers.

<details>
<summary>View source (14 lines)</summary>

````ts
/*
 * Runtime configuration, read from environment variables.
 * Sensible defaults keep local development zero-config.
 */
export const config = {
  port: Number(process.env.PORT ?? 3001),
  databaseUrl:
    process.env.DATABASE_URL ?? 'postgres://localhost:5432/snabbit_dash',
  /** When set together with githubRepo, the CI/CD adapter goes live. */
  githubToken: process.env.GITHUB_TOKEN ?? '',
  /** owner/repo, e.g. "snabbit/changelog-automation". */
  githubRepo: process.env.GITHUB_REPO ?? '',
}

````

</details>
