---
title: index
description: Reference for `server/src/index.ts`
---

**File:** `server/src/index.ts` · **Lines:** 21

<FILL: 2-4 sentence plain-language summary of what `index.ts` is responsible for, what other files it integrates with, and what calls into it.>

## Imports

This file pulls in the following modules. Relative imports point to other documented files; external imports are libraries from `node_modules`.

| Module | Imports | Kind |
| --- | --- | --- |
| `pg` | `Pool` | external |
| `./config` | `config` | internal |
| `./app` | `createApp` | internal |
| `./postgresStore` | `createPostgresStore` | internal |
| `./integrations/cicd` | `getCicdProvider` | internal |


:::caution
No exported symbols detected by the AST. This file is likely a side-effect entrypoint, re-export barrel, or runtime bootstrap. The source appendix below contains the full file.
:::

## Diagrams

<FILL: if this file has non-trivial control flow, async sequences, or state transitions, include a Mermaid diagram here. Use `flowchart`, `sequenceDiagram`, or `stateDiagram-v2`. Skip this section entirely — do not write "no diagram" — if the file is trivial.>

## Source

Full file source for `server/src/index.ts` (21 lines). The line-by-line walkthroughs above reference these line numbers.

<details>
<summary>View source (21 lines)</summary>

````ts
import { Pool } from 'pg'
import { config } from './config'
import { createApp } from './app'
import { createPostgresStore } from './postgresStore'
import { getCicdProvider } from './integrations/cicd'

const pool = new Pool({ connectionString: config.databaseUrl })
const store = createPostgresStore(pool)
const cicd = getCicdProvider({
  githubToken: config.githubToken,
  githubRepo: config.githubRepo,
})

const app = createApp({ store, cicd })

app.listen(config.port, () => {
  console.log(
    `Snabbit API listening on http://localhost:${config.port}  ·  CI/CD provider: ${cicd.name}`,
  )
})

````

</details>
