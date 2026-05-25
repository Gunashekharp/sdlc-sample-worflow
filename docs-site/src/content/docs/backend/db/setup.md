---
title: setup
description: Reference for `server/src/db/setup.ts`
---

**File:** `server/src/db/setup.ts` · **Lines:** 68

<!-- fill:file:summary -->
<FILL: 2-4 sentence plain-language summary of what `db/setup.ts` is responsible for, what other files it integrates with, and what calls into it.>
<!-- /fill:file:summary -->

## Imports

This file pulls in the following modules. Relative imports point to other documented files; external imports are libraries from `node_modules`.

| Module | Imports | Kind |
| --- | --- | --- |
| `pg` | `Pool` | external |
| `../config` | `config` | internal |
| `./schema` | `SCHEMA_SQL` | internal |
| `../seed` | `SEED_AGENTS`, `SEED_KPIS` | internal |


:::note
No exported symbols detected by the AST. This file is a side-effect entrypoint, a re-export barrel, or a runtime bootstrap — open `server/src/db/setup.ts` directly to read the source.
:::

## Diagrams

<!-- fill:file:diagrams -->
<FILL: if this file has non-trivial control flow, async sequences, or state transitions, include a Mermaid diagram here. Use `flowchart`, `sequenceDiagram`, or `stateDiagram-v2`. Skip this section entirely — do not write "no diagram" — if the file is trivial.>
<!-- /fill:file:diagrams -->
