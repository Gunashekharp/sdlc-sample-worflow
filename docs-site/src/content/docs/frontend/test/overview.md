---
title: test
description: Files under src/test/
---

**Folder:** `src/test/`

<!-- fill:folder:summary -->
`src/test/` holds the shared Vitest setup that runs before the suite, not the tests themselves. Its only file, `setup.ts`, registers `@testing-library/jest-dom` matchers and clears `localStorage` after each test so persisted UI state cannot leak between cases. Per-module specs (`*.test.ts` / `*.test.tsx`) live next to the code they cover, so only cross-cutting test bootstrapping belongs here.
<!-- /fill:folder:summary -->

## Files

| File | Hint |
| --- | --- |
| [`setup.ts`](../test/setup) | Global Vitest setup: imports jest-dom matchers and clears `localStorage` after each test. |

## Dependencies

### Module dependency subgraph

:::note
No internal dependencies detected for this folder.
:::

## Key flows

<!-- fill:folder:flows -->
- Vitest loads `setup.ts` once before the suite (via the `setupFiles` config), so its `@testing-library/jest-dom` import makes matchers like `toBeInTheDocument` available to every spec.
- After each test case, the registered `afterEach` hook calls `localStorage.clear()`, ensuring state persisted through `usePersistentState` does not carry over into the next test.
<!-- /fill:folder:flows -->
