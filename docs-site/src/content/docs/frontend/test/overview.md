---
title: test
description: Files under src/test/
---

**Folder:** `src/test/`

<!-- fill:folder:summary -->
`src/test/` holds the shared Vitest setup that runs before the frontend test suite, not any tests themselves. Its single file, `setup.ts`, registers `@testing-library/jest-dom` matchers and clears `localStorage` after each test so persisted UI state never leaks between cases. Actual test files live alongside the code they cover (e.g. `components/AgentGrid.test.tsx`, `lib/filterAgents.test.ts`), so nothing belongs here except global, cross-suite test configuration.
<!-- /fill:folder:summary -->

## Files

| File | Hint |
| --- | --- |
| [`setup.ts`](../test/setup) | Global Vitest setup: registers jest-dom matchers and clears `localStorage` after each test. |

## Dependencies

### Module dependency subgraph

:::note
No internal dependencies detected for this folder.
:::

## Key flows

<!-- fill:folder:flows -->
- **Per-test isolation:** Vitest runs `setup.ts` before the suite; its `afterEach(() => localStorage.clear())` hook resets persisted state so hooks like `usePersistentState` start clean in every test.
<!-- /fill:folder:flows -->
