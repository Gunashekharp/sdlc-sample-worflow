---
title: config
description: Reference for `server/src/config.ts`
---

<!-- structure:c036d84c7653 -->

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
:::note
Single object literal reading env vars with defaults — no control flow or state transitions to diagram.
:::
<!-- /fill:file:diagrams -->
