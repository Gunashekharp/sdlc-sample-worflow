---
title: seed
description: Reference for `server/src/seed.ts`
---

**File:** `server/src/seed.ts` · **Lines:** 218

<!-- fill:file:summary -->
<FILL: 2-4 sentence plain-language summary of what `seed.ts` is responsible for, what other files it integrates with, and what calls into it.>
<!-- /fill:file:summary -->

## Imports

This file pulls in the following modules. Relative imports point to other documented files; external imports are libraries from `node_modules`.

| Module | Imports | Kind |
| --- | --- | --- |
| `./domain` | `Agent`, `Kpi` | type-only · internal |


## Symbols

This file exports 2 symbols. Every export is documented below, in declaration order.

| Name | Kind | Default |
| --- | --- | --- |
| SEED_AGENTS | const | no |
| SEED_KPIS | const | no |

## SEED_AGENTS

**Kind:** `const`

```ts
const SEED_AGENTS: Agent[]
```

<!-- fill:sym:SEED_AGENTS:summary -->
<FILL: 2-4 sentences explaining what SEED_AGENTS does and why it exists. Ground every claim in the signature and source.>
<!-- /fill:sym:SEED_AGENTS:summary -->

### Used by

- `server/src/__tests__/api.test.ts`
- `server/src/db/setup.ts`

## SEED_KPIS

**Kind:** `const`

```ts
const SEED_KPIS: Kpi[]
```

<!-- fill:sym:SEED_KPIS:summary -->
<FILL: 2-4 sentences explaining what SEED_KPIS does and why it exists. Ground every claim in the signature and source.>
<!-- /fill:sym:SEED_KPIS:summary -->

### Used by

- `server/src/__tests__/api.test.ts`
- `server/src/db/setup.ts`

## Diagrams

<!-- fill:file:diagrams -->
<FILL: if this file has non-trivial control flow, async sequences, or state transitions, include a Mermaid diagram here. Use `flowchart`, `sequenceDiagram`, or `stateDiagram-v2`. Skip this section entirely — do not write "no diagram" — if the file is trivial.>
<!-- /fill:file:diagrams -->
