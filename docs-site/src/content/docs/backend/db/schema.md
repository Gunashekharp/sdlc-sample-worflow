---
title: schema
description: Reference for `server/src/db/schema.ts`
---

**File:** `server/src/db/schema.ts` · **Lines:** 28

> Postgres schema for the Snabbit Agent Console. Idempotent.

## Symbols

This file exports 1 symbol. Every export is documented below, in declaration order.

| Name | Kind | Default |
| --- | --- | --- |
| SCHEMA_SQL | const | no |

## SCHEMA_SQL

**Kind:** `const`

```ts
const SCHEMA_SQL: "\nCREATE TABLE IF NOT EXISTS agents (\n id TEXT PRIMARY KEY,\n name TEXT NOT NULL,\n category TEXT NOT NULL,\n description TEXT NOT NULL,\n status TEXT NOT NULL,\n runs_per_week INTEGER NOT NULL,\n success_rate INTEGER NOT NULL,\n avg_duration TEXT NOT NULL,\n last_run TEXT NOT NULL,\n last_run_minutes INTEGER NOT NULL,\n popular BOOLEAN NOT NULL\n);\n\nCREATE TABLE IF NOT EXISTS kpis (\n id TEXT PRIMARY KEY,\n sort_order INTEGER NOT NULL,\n label TEXT NOT NULL,\n value TEXT NOT NULL,\n delta TEXT NOT NULL,\n positive BOOLEAN NOT NULL,\n hint TEXT NOT NULL,\n trend JSONB NOT NULL\n);\n"
```

> Postgres schema for the Snabbit Agent Console. Idempotent.

### Used by

- `server/src/db/setup.ts`

## Diagrams

<!-- fill:file:diagrams -->
<FILL: if this file has non-trivial control flow, async sequences, or state transitions, include a Mermaid diagram here. Use `flowchart`, `sequenceDiagram`, or `stateDiagram-v2`. Skip this section entirely — do not write "no diagram" — if the file is trivial.>
<!-- /fill:file:diagrams -->
