---
title: config
description: Reference for `server/src/config.ts`
---

**File:** `server/src/config.ts` · **Lines:** 14

<!-- fill:file:summary -->
<FILL: 2-4 sentence plain-language summary of what `config.ts` is responsible for, what other files it integrates with, and what calls into it.>
<!-- /fill:file:summary -->

## Symbols

This file exports 1 symbol. Every export is documented below, in declaration order.

| Name | Kind | Default |
| --- | --- | --- |
| config | const | no |

## config

**Kind:** `const`

```ts
const config: { port: number; databaseUrl: any; githubToken: any; githubRepo: any; }
```

<!-- fill:sym:config:summary -->
<FILL: 2-4 sentences explaining what config does and why it exists. Ground every claim in the signature and source.>
<!-- /fill:sym:config:summary -->

### Used by

- `server/src/index.ts`
- `server/src/db/setup.ts`

## Diagrams

<!-- fill:file:diagrams -->
<FILL: if this file has non-trivial control flow, async sequences, or state transitions, include a Mermaid diagram here. Use `flowchart`, `sequenceDiagram`, or `stateDiagram-v2`. Skip this section entirely — do not write "no diagram" — if the file is trivial.>
<!-- /fill:file:diagrams -->

## Source

Full file source for `server/src/config.ts` (14 lines). The line-by-line walkthroughs above reference these line numbers.

<details>
<summary>View source (14 lines)</summary>

````ts
/*
 * Runtime configuration, read from environment variables.
 * Sensible defaults keep local development zero-config.
 */
export const config = {
  port: Number(process.env.PORT ?? 3001),
  databaseUrl:
    process.env.DATABASE_URL ?? 'postgres://localhost:5432/snabbit_dash',
  /** When set together with githubRepo, the CI/CD adapter goes live. */
  githubToken: process.env.GITHUB_TOKEN ?? '',
  /** owner/repo, e.g. "snabbit/changelog-automation". */
  githubRepo: process.env.GITHUB_REPO ?? '',
}

````

</details>
