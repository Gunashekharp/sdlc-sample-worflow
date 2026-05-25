---
title: backend
description: Express + TypeScript API server. Serves agent, KPI, and pipeline data.
---

**Section root:** `server/src`

> Express + TypeScript API server. Serves agent, KPI, and pipeline data.

<FILL: 3-5 sentences on what this subsystem owns, the runtime boundaries, and the data it produces or consumes. Reference the diagrams below by name.>

## Top-level structure

| Folder | Purpose |
| --- | --- |
| [`db/`](./backend/db/overview/) | <FILL: one line on what lives in db/ and when to add a file here.> |
| [`integrations/`](./backend/integrations/overview/) | <FILL: one line on what lives in integrations/ and when to add a file here.> |

### Files at the root of this section

| File | Hint |
| --- | --- |
| [`app.ts`](./app) | <FILL: one-line purpose for app.ts> |
| [`config.ts`](./config) | Runtime configuration, read from environment variables. |
| [`domain.ts`](./domain) | Domain types for the Snabbit Agent Console API. |
| [`index.ts`](./index) | <FILL: one-line purpose for index.ts> |
| [`postgresStore.ts`](./postgresstore) | <FILL: one-line purpose for postgresStore.ts> |
| [`routes.ts`](./routes) | <FILL: one-line purpose for routes.ts> |
| [`seed.ts`](./seed) | <FILL: one-line purpose for seed.ts> |
| [`store.ts`](./store) | <FILL: one-line purpose for store.ts> |

## Architecture

### Module dependency graph

```mermaid
%% Module dependency graph for backend
%% Auto-generated from source by scripts/docs/extract-diagrams.ts. Do not edit by hand — changes will be overwritten on the next docs-agent run.
flowchart LR
  app_ts["app.ts"]
  config_ts["config.ts"]
  db_schema_ts["db/schema.ts"]
  db_setup_ts["db/setup.ts"]
  domain_ts["domain.ts"]
  index_ts["index.ts"]
  integrations_cicd_ts["integrations/cicd.ts"]
  postgresStore_ts["postgresStore.ts"]
  routes_ts["routes.ts"]
  seed_ts["seed.ts"]
  store_ts["store.ts"]
  app_ts --> store_ts
  app_ts --> integrations_cicd_ts
  app_ts --> routes_ts
  index_ts --> config_ts
  index_ts --> app_ts
  index_ts --> postgresStore_ts
  index_ts --> integrations_cicd_ts
  postgresStore_ts --> domain_ts
  postgresStore_ts --> store_ts
  routes_ts --> app_ts
  routes_ts --> integrations_cicd_ts
  seed_ts --> domain_ts
  store_ts --> domain_ts
  db_setup_ts --> config_ts
  db_setup_ts --> db_schema_ts
  db_setup_ts --> seed_ts
```

## Key flows

<FILL: 2-3 short flow descriptions — the most important runtime sequences in this subsystem. Reference symbols by their documented file (use relative links).>

## When to add code here

<FILL: practical guidance for someone deciding whether a new module belongs in this subsystem or somewhere else.>
