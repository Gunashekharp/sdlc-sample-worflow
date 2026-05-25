---
title: db
description: Files under server/src/db/
---

**Folder:** `server/src/db/`

<FILL: 2-4 sentences on what this folder is for, what kinds of modules belong here, and what does NOT belong here.>

## Files

| File | Hint |
| --- | --- |
| [`schema.ts`](../db/schema) | Postgres schema for the Snabbit Agent Console. Idempotent. |
| [`setup.ts`](../db/setup) | One-shot database setup: create tables and upsert seed data. |

## Dependencies

### Module dependency subgraph

```mermaid
%% Subgraph for backend/db
%% Auto-generated from source by scripts/docs/extract-diagrams.ts. Do not edit by hand — changes will be overwritten on the next docs-agent run.
flowchart LR
  config_ts["external: config.ts"]
  db_schema_ts["db/schema.ts"]
  db_setup_ts["db/setup.ts"]
  seed_ts["external: seed.ts"]
  db_setup_ts --> config_ts
  db_setup_ts --> db_schema_ts
  db_setup_ts --> seed_ts
```

## Key flows

<FILL: 1-3 short descriptions of how modules in this folder cooperate at runtime.>
