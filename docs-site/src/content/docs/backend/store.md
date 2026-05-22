---
title: store.ts
description: Store interface and in-memory implementation.
---

**File:** `server/src/store.ts`

Defines the `Store` abstraction for data access and provides the in-memory
implementation. The interface is the key seam that enables test isolation —
tests inject `createMemoryStore`; the running server injects `createPostgresStore`.

## Interfaces

### `AgentStore`

```ts
export interface AgentStore {
  listAgents(): Promise<Agent[]>
  getAgent(id: string): Promise<Agent | null>
}
```

| Method | Signature | Returns |
|--------|-----------|---------|
| `listAgents` | `() => Promise<Agent[]>` | All agents |
| `getAgent` | `(id: string) => Promise<Agent \| null>` | The agent with matching `id`, or `null` if not found |

### `KpiStore`

```ts
export interface KpiStore {
  listKpis(): Promise<Kpi[]>
}
```

| Method | Signature | Returns |
|--------|-----------|---------|
| `listKpis` | `() => Promise<Kpi[]>` | All KPIs |

### `Store`

```ts
export type Store = AgentStore & KpiStore
```

The combined store type. Both interfaces are always implemented together —
there is no scenario where agents and KPIs come from different sources.

All methods are `async` (return `Promise`) so the in-memory and Postgres
implementations share identical call sites, even though the memory store has
no I/O.

## `createMemoryStore`

```ts
export function createMemoryStore(agents: Agent[], kpis: Kpi[]): Store
```

**Parameters:**

| Param | Type | Purpose |
|-------|------|---------|
| `agents` | `Agent[]` | The agents to serve. Typically `SEED_AGENTS` from `seed.ts`. |
| `kpis` | `Kpi[]` | The KPIs to serve. Typically `SEED_KPIS` from `seed.ts`. |

**Returns:** A `Store` backed by the provided arrays.

**Side effects:** None.

### Implementation

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

`listAgents` and `listKpis` return **shallow copies** (`[...agents]`) so callers
cannot accidentally mutate the backing array. This prevents test cross-
contamination without requiring deep cloning.

`getAgent` uses `Array.find` and returns `null` (not `undefined`) on a miss,
matching the Postgres implementation's behavior.

## Store implementation comparison

```mermaid
classDiagram
  class Store {
    <<interface>>
    +listAgents() Promise~Agent[]~
    +getAgent(id) Promise~Agent|null~
    +listKpis() Promise~Kpi[]~
  }

  class MemoryStore {
    -agents: Agent[]
    -kpis: Kpi[]
    +listAgents() Promise~Agent[]~
    +getAgent(id) Promise~Agent|null~
    +listKpis() Promise~Kpi[]~
  }

  class PostgresStore {
    -pool: Pool
    +listAgents() Promise~Agent[]~
    +getAgent(id) Promise~Agent|null~
    +listKpis() Promise~Kpi[]~
  }

  Store <|.. MemoryStore : implements
  Store <|.. PostgresStore : implements
```

## Used by

- `server/src/__tests__/api.test.ts`:
  ```ts
  createApp({
    store: createMemoryStore(SEED_AGENTS, SEED_KPIS),
    cicd: createMockCicdProvider(),
  })
  ```
- `server/src/app.ts` — receives `Store` via `AppDeps`.
- `server/src/routes.ts` — calls `store.listAgents()`, `store.getAgent()`, `store.listKpis()`.
