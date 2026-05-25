---
title: routes
description: Reference for `server/src/routes.ts`
---

**File:** `server/src/routes.ts` · **Lines:** 37

<!-- fill:file:summary -->
<FILL: 2-4 sentence plain-language summary of what `routes.ts` is responsible for, what other files it integrates with, and what calls into it.>
<!-- /fill:file:summary -->

## Imports

This file pulls in the following modules. Relative imports point to other documented files; external imports are libraries from `node_modules`.

| Module | Imports | Kind |
| --- | --- | --- |
| `express` | `Express` | type-only · external |
| `./app` | `AppDeps` | type-only · internal |
| `./integrations/cicd` | `summarizePipelines` | internal |


## Symbols

This file exports 1 symbol. Every export is documented below, in declaration order.

| Name | Kind | Default |
| --- | --- | --- |
| registerRoutes | function | no |

## registerRoutes

**Kind:** `function`

```ts
export function registerRoutes(app: Express, deps: AppDeps): void { ... }
```

> Register all REST routes on the given Express app.

### Parameters

| Name | Type | Default | Required | Purpose |
| --- | --- | --- | --- | --- |
| app | `Express` | — | yes | <FILL: purpose of app> |
| deps | `AppDeps` | — | yes | <FILL: purpose of deps> |

**Returns:** `void`

<!-- fill:sym:registerRoutes:return -->
<FILL: describe the return value of registerRoutes — what it represents, when it can be null/undefined, units.>
<!-- /fill:sym:registerRoutes:return -->

### Line-by-line walkthrough

Each top-level statement of `registerRoutes`, in execution order. The line numbers reference the source file as it appears today.

**Line 7 — `ExpressionStatement`**

```ts
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() })
  })
```

<!-- fill:sym:registerRoutes:walk:0 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:registerRoutes:walk:0 -->

**Line 11 — `ExpressionStatement`**

```ts
app.get('/api/agents', async (_req, res) => {
    res.json(await deps.store.listAgents())
  })
```

<!-- fill:sym:registerRoutes:walk:1 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:registerRoutes:walk:1 -->

**Line 15 — `ExpressionStatement`**

```ts
app.get('/api/agents/:id', async (req, res) => {
    const agent = await deps.store.getAgent(req.params.id)
    if (!agent) {
      res.status(404).json({ error: 'Agent not found' })
      return
    }
    res.json(agent)
  })
```

<!-- fill:sym:registerRoutes:walk:2 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:registerRoutes:walk:2 -->

**Line 24 — `ExpressionStatement`**

```ts
app.get('/api/kpis', async (_req, res) => {
    res.json(await deps.store.listKpis())
  })
```

<!-- fill:sym:registerRoutes:walk:3 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:registerRoutes:walk:3 -->

**Line 28 — `ExpressionStatement`**

```ts
app.get('/api/pipelines', async (_req, res) => {
    const pipelines = await deps.cicd.listPipelines()
    res.json({
      provider: deps.cicd.name,
      summary: summarizePipelines(pipelines),
      pipelines,
    })
  })
```

<!-- fill:sym:registerRoutes:walk:4 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:registerRoutes:walk:4 -->

### Examples

<!-- fill:sym:registerRoutes:example -->
<FILL: at least one concrete input → output example. For components, a JSX usage snippet. For functions, an input + return value. Pull from tests when available so the example is real.>
<!-- /fill:sym:registerRoutes:example -->

### Used by

- `server/src/app.ts`

## Diagrams

<!-- fill:file:diagrams -->
<FILL: if this file has non-trivial control flow, async sequences, or state transitions, include a Mermaid diagram here. Use `flowchart`, `sequenceDiagram`, or `stateDiagram-v2`. Skip this section entirely — do not write "no diagram" — if the file is trivial.>
<!-- /fill:file:diagrams -->

## Source

Full file source for `server/src/routes.ts` (37 lines). The line-by-line walkthroughs above reference these line numbers.

<details>
<summary>View source (37 lines)</summary>

````ts
import type { Express } from 'express'
import type { AppDeps } from './app'
import { summarizePipelines } from './integrations/cicd'

/** Register all REST routes on the given Express app. */
export function registerRoutes(app: Express, deps: AppDeps): void {
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() })
  })

  app.get('/api/agents', async (_req, res) => {
    res.json(await deps.store.listAgents())
  })

  app.get('/api/agents/:id', async (req, res) => {
    const agent = await deps.store.getAgent(req.params.id)
    if (!agent) {
      res.status(404).json({ error: 'Agent not found' })
      return
    }
    res.json(agent)
  })

  app.get('/api/kpis', async (_req, res) => {
    res.json(await deps.store.listKpis())
  })

  app.get('/api/pipelines', async (_req, res) => {
    const pipelines = await deps.cicd.listPipelines()
    res.json({
      provider: deps.cicd.name,
      summary: summarizePipelines(pipelines),
      pipelines,
    })
  })
}

````

</details>
