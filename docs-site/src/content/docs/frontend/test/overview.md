---
title: test
description: Files under src/test/
---

**Folder:** `src/test/`

<!-- fill:folder:summary -->
`src/test/` holds the shared setup that runs before the frontend test suite, not the tests themselves. Its single module, `setup.ts`, is registered as Vitest's global setup file: it pulls in the `@testing-library/jest-dom` matchers and registers an `afterEach` hook that clears `localStorage` so persisted UI state cannot leak between cases. Only cross-cutting test bootstrap belongs here — individual `*.test.ts(x)` files live next to the source they exercise.
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
- Vitest loads `setup.ts` once before the suite (via its `setupFiles` config), so every test gets the jest-dom matchers without importing them.
- The `afterEach` hook in `setup.ts` runs after each test case to clear `localStorage`, keeping persisted UI state from leaking between tests.
<!-- /fill:folder:flows -->
