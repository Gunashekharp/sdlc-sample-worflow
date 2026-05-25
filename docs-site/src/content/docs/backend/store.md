---
title: store
description: Reference for `server/src/store.ts`
---

**File:** `server/src/store.ts` · **Lines:** 33

<!-- fill:file:summary -->
<FILL: 2-4 sentence plain-language summary of what `store.ts` is responsible for, what other files it integrates with, and what calls into it.>
<!-- /fill:file:summary -->

## Imports

This file pulls in the following modules. Relative imports point to other documented files; external imports are libraries from `node_modules`.

| Module | Imports | Kind |
| --- | --- | --- |
| `./domain` | `Agent`, `Kpi` | type-only · internal |


## Symbols

This file exports 4 symbols. Every export is documented below, in declaration order.

| Name | Kind | Default |
| --- | --- | --- |
| createMemoryStore | function | no |
| AgentStore | interface | no |
| KpiStore | interface | no |
| Store | type | no |

## createMemoryStore

**Kind:** `function`

```ts
export function createMemoryStore(agents: Agent[], kpis: Kpi[]): Store { ... }
```

> In-memory store. Used by the test suite (so `npm test` needs no database)
> and as a fallback for quick local runs.

### Parameters

| Name | Type | Default | Required | Purpose |
| --- | --- | --- | --- | --- |
| agents | `Agent[]` | — | yes | <FILL: purpose of agents> |
| kpis | `Kpi[]` | — | yes | <FILL: purpose of kpis> |

**Returns:** `Store`

<!-- fill:sym:createMemoryStore:return -->
<FILL: describe the return value of createMemoryStore — what it represents, when it can be null/undefined, units.>
<!-- /fill:sym:createMemoryStore:return -->

### Line-by-line walkthrough

Each top-level statement of `createMemoryStore`, in execution order. The line numbers reference the source file as it appears today.

**Line 21 — `ReturnStatement`**

```ts
return {
    async listAgents() {
      return [...agents]
    },
    async getAgent(id: string) {
      return agents.find((a) => a.id === id) ?? null
    },
    async listKpis() {
      return [...kpis]
    },
  }
```

<!-- fill:sym:createMemoryStore:walk:0 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:createMemoryStore:walk:0 -->

### Examples

<!-- fill:sym:createMemoryStore:example -->
<FILL: at least one concrete input → output example. For components, a JSX usage snippet. For functions, an input + return value. Pull from tests when available so the example is real.>
<!-- /fill:sym:createMemoryStore:example -->

### Used by

- `server/src/__tests__/api.test.ts`

## AgentStore

**Kind:** `interface`

```ts
export interface AgentStore { ... }
```

> Read access to the agent catalogue.

## KpiStore

**Kind:** `interface`

```ts
export interface KpiStore { ... }
```

> Read access to the KPI list.

## Store

**Kind:** `type`

```ts
export type Store = AgentStore & KpiStore
```

<!-- fill:sym:Store:summary -->
<FILL: 2-4 sentences explaining what Store does and why it exists. Ground every claim in the signature and source.>
<!-- /fill:sym:Store:summary -->

### Used by

- `server/src/app.ts`
- `server/src/postgresStore.ts`

## Diagrams

<!-- fill:file:diagrams -->
<FILL: if this file has non-trivial control flow, async sequences, or state transitions, include a Mermaid diagram here. Use `flowchart`, `sequenceDiagram`, or `stateDiagram-v2`. Skip this section entirely — do not write "no diagram" — if the file is trivial.>
<!-- /fill:file:diagrams -->
