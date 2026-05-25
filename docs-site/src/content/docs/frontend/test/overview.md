---
title: test
description: Files under src/test/
---

**Folder:** `src/test/`

<!-- fill:folder:summary -->
`src/test/` holds the shared Vitest setup that runs before the suites across the app. Its single file, `setup.ts`, registers `@testing-library/jest-dom` matchers and clears `localStorage` after each test so persisted UI state never leaks between cases. This folder is for global test configuration only — the actual test suites live alongside the code they cover (for example `App.test.tsx` and the `lib/*.test.ts` files), not here.
<!-- /fill:folder:summary -->

## Files

| File | Hint |
| --- | --- |
| [`setup.ts`](../test/setup) | Global Vitest setup: loads jest-dom matchers and clears localStorage after each test. |

## Dependencies

### Module dependency subgraph

:::note
No internal dependencies detected for this folder.
:::

## Key flows

<!-- fill:folder:flows -->
- Vitest loads `setup.ts` once before any suite runs (configured as a global setup file), so its `@testing-library/jest-dom` import extends every test's `expect` with DOM matchers.
- After each individual test, the registered `afterEach` hook calls `localStorage.clear()`, ensuring state persisted via `usePersistentState` does not leak from one case into the next.
<!-- /fill:folder:flows -->
