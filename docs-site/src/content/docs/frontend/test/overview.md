---
title: test
description: Files under src/test/
---

**Folder:** `src/test/`

<!-- fill:folder:summary -->
`src/test/` holds global Vitest setup that runs before every test file, not the tests themselves. Its single module, `setup.ts`, registers `@testing-library/jest-dom` matchers and clears `localStorage` after each case so persisted UI state (e.g. `AgentGrid`'s saved tab/sort via `usePersistentState`) never leaks between tests. Individual `*.test.ts(x)` specs live next to the code they cover, not here — this folder is only for cross-cutting test configuration referenced by `vite.config.ts`'s `setupFiles`.
<!-- /fill:folder:summary -->

## Files

| File | Hint |
| --- | --- |
| [`setup.ts`](../test/setup) | Global test setup: imports jest-dom matchers and clears localStorage after each test for isolation. |

## Dependencies

### Module dependency subgraph

:::note
No internal dependencies detected for this folder.
:::

## Key flows

<!-- fill:folder:flows -->
- **Per-suite bootstrap:** Vitest loads `setup.ts` once per test file (via `setupFiles`), so the jest-dom matchers (`toBeInTheDocument`, etc.) are available everywhere and `localStorage.clear()` runs in an `afterEach`, resetting persisted state between cases.
<!-- /fill:folder:flows -->
