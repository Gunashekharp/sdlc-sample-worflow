---
title: test
description: Files under src/test/
---

**Folder:** `src/test/`

<!-- fill:folder:summary -->
This folder holds Vitest's global setup for the frontend suite — anything that needs to run once before every test file (custom matchers, environment cleanup). Today that's `setup.ts`, which extends `expect` with `@testing-library/jest-dom` matchers and clears `localStorage` after each test so `usePersistentState` cannot leak state between cases. Actual test files (`*.test.ts(x)`) live next to the source they cover, not here.
<!-- /fill:folder:summary -->

## Files

| File | Hint |
| --- | --- |
| [`setup.ts`](../test/setup) | Vitest global setup — registers jest-dom matchers and clears `localStorage` after every test. |

## Dependencies

### Module dependency subgraph

:::note
No internal dependencies detected for this folder.
:::

## Key flows

<!-- fill:folder:flows -->
Vitest loads `setup.ts` once before any frontend test runs (wired in via `vite.config.ts`'s `test.setupFiles`). The import of `@testing-library/jest-dom` augments `expect` with DOM-aware matchers like `toBeInTheDocument`; the `afterEach` hook then resets `localStorage` so tests that touch `usePersistentState` start from a clean slate.
<!-- /fill:folder:flows -->
