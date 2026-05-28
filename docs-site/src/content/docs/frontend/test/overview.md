---
title: test
description: Files under src/test/
---

**Folder:** `src/test/`

<!-- fill:folder:summary -->
Test scaffolding for the Vitest + jsdom suite. The only file is `setup.ts`, wired in by `vite.config.ts` so it runs once before every test file: it loads `@testing-library/jest-dom` matchers and clears `localStorage` after each test to keep `usePersistentState`-backed UI from leaking between cases. Actual test files live next to the source they cover (`*.test.ts(x)`) — they do not belong in this folder.
<!-- /fill:folder:summary -->

## Files

| File | Hint |
| --- | --- |
| [`setup.ts`](../test/setup) | Vitest global setup — registers `@testing-library/jest-dom` matchers and clears `localStorage` after each test. |

## Dependencies

### Module dependency subgraph

:::note
No internal dependencies detected for this folder.
:::

## Key flows

<!-- fill:folder:flows -->
- **Vitest boot.** `vite.config.ts` lists this file under `test.setupFiles`, so Vitest imports it once before any spec runs.
- **Per-test cleanup.** The `afterEach` callback clears `localStorage` so tests that exercise `usePersistentState` (e.g. `AgentGrid` remembering its category) start from a clean slate.
<!-- /fill:folder:flows -->
