---
title: app
description: Reference for `server/src/app.ts`
---

**File:** `server/src/app.ts` · **Lines:** 33

<!-- fill:file:summary -->
<FILL: 2-4 sentence plain-language summary of what `app.ts` is responsible for, what other files it integrates with, and what calls into it.>
<!-- /fill:file:summary -->

## Imports

This file pulls in the following modules. Relative imports point to other documented files; external imports are libraries from `node_modules`.

| Module | Imports | Kind |
| --- | --- | --- |
| `express` | `default as express` | external |
| `express` | `NextFunction`, `Request`, `Response` | type-only · external |
| `cors` | `default as cors` | external |
| `./store` | `Store` | type-only · internal |
| `./integrations/cicd` | `CicdProvider` | type-only · internal |
| `./routes` | `registerRoutes` | internal |


## Symbols

This file exports 2 symbols. Every export is documented below, in declaration order.

| Name | Kind | Default |
| --- | --- | --- |
| createApp | function | no |
| AppDeps | interface | no |

## createApp

**Kind:** `function`

```ts
export function createApp(deps: AppDeps) { ... }
```

> Build the Express app from injected dependencies.
> Tests pass an in-memory store + mock CI/CD provider; the running server
> passes the Postgres store and the configured provider.

### Parameters

| Name | Type | Default | Required | Purpose |
| --- | --- | --- | --- | --- |
| deps | `AppDeps` | — | yes | <FILL: purpose of deps> |

**Returns:** `any`

<!-- fill:sym:createApp:return -->
<FILL: describe the return value of createApp — what it represents, when it can be null/undefined, units.>
<!-- /fill:sym:createApp:return -->

### Line-by-line walkthrough

Each top-level statement of `createApp`, in execution order. The line numbers reference the source file as it appears today.

**Line 19 — `FirstStatement`**

```ts
const app = express()
```

<!-- fill:sym:createApp:walk:0 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:createApp:walk:0 -->

**Line 20 — `ExpressionStatement`**

```ts
app.use(cors())
```

<!-- fill:sym:createApp:walk:1 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:createApp:walk:1 -->

**Line 21 — `ExpressionStatement`**

```ts
app.use(express.json())
```

<!-- fill:sym:createApp:walk:2 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:createApp:walk:2 -->

**Line 23 — `ExpressionStatement`**

```ts
registerRoutes(app, deps)
```

<!-- fill:sym:createApp:walk:3 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:createApp:walk:3 -->

**Line 26 — `ExpressionStatement`**

```ts
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled API error:', err)
    res.status(500).json({ error: 'Internal server error' })
  })
```

<!-- fill:sym:createApp:walk:4 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:createApp:walk:4 -->

**Line 31 — `ReturnStatement`**

```ts
return app
```

<!-- fill:sym:createApp:walk:5 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:createApp:walk:5 -->

### Examples

<!-- fill:sym:createApp:example -->
<FILL: at least one concrete input → output example. For components, a JSX usage snippet. For functions, an input + return value. Pull from tests when available so the example is real.>
<!-- /fill:sym:createApp:example -->

### Used by

- `server/src/index.ts`
- `server/src/__tests__/api.test.ts`

## AppDeps

**Kind:** `interface`

```ts
export interface AppDeps { ... }
```

<!-- fill:sym:AppDeps:summary -->
<FILL: 2-4 sentences explaining what AppDeps does and why it exists. Ground every claim in the signature and source.>
<!-- /fill:sym:AppDeps:summary -->

### Shape

| Name | Type | Description |
| --- | --- | --- |
| store | `Store` | <FILL: store> |
| cicd | `CicdProvider` | <FILL: cicd> |

### Used by

- `server/src/routes.ts`

## Diagrams

<!-- fill:file:diagrams -->
<FILL: if this file has non-trivial control flow, async sequences, or state transitions, include a Mermaid diagram here. Use `flowchart`, `sequenceDiagram`, or `stateDiagram-v2`. Skip this section entirely — do not write "no diagram" — if the file is trivial.>
<!-- /fill:file:diagrams -->

## Source

Full file source for `server/src/app.ts` (33 lines). The line-by-line walkthroughs above reference these line numbers.

<details>
<summary>View source (33 lines)</summary>

````ts
import express from 'express'
import type { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import type { Store } from './store'
import type { CicdProvider } from './integrations/cicd'
import { registerRoutes } from './routes'

export interface AppDeps {
  store: Store
  cicd: CicdProvider
}

/**
 * Build the Express app from injected dependencies.
 * Tests pass an in-memory store + mock CI/CD provider; the running server
 * passes the Postgres store and the configured provider.
 */
export function createApp(deps: AppDeps) {
  const app = express()
  app.use(cors())
  app.use(express.json())

  registerRoutes(app, deps)

  // Catch-all error handler so a failed route returns JSON, not a crash.
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled API error:', err)
    res.status(500).json({ error: 'Internal server error' })
  })

  return app
}

````

</details>
