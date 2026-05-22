---
title: vitest.config.ts
description: Vitest configuration for the backend test suite.
---

**File:** `server/vitest.config.ts`

A minimal, self-contained Vitest configuration for the backend. It intentionally
avoids inheriting the frontend's `vite.config.ts` so the two suites remain
independent — different environments, different setup files.

## Full source

```ts
import { defineConfig } from 'vitest/config'

// Own config so the server suite does not inherit the frontend's
// jsdom environment or setup files.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
```

## Configuration options

| Option | Value | Effect |
|--------|-------|--------|
| `environment` | `'node'` | Tests run in a plain Node.js environment — no JSDOM, no `document`, no `window`. The backend tests only need `process`, `Buffer`, and network APIs. |
| `include` | `['src/**/*.test.ts']` | Restricts test discovery to TypeScript test files under `server/src/`. Without this, Vitest might pick up `.test.js` files from `node_modules` or other directories. |

## Why a separate config?

The frontend's `vite.config.ts` sets `environment: 'jsdom'` and runs
`src/test/setup.ts` (which imports `@testing-library/jest-dom` and clears
`localStorage`). Neither is appropriate for backend tests:

- `jsdom` is a browser simulation — the backend runs in Node and has no DOM.
- `@testing-library/jest-dom` adds DOM-specific matchers that would pollute
  the backend's `expect` scope.
- `localStorage.clear()` would throw in Node (no `localStorage` global).

Using a separate config file means running `vitest` from `server/` picks up
`server/vitest.config.ts` automatically, while the frontend's `vitest` run
picks up the root `vite.config.ts`.

## Running

```bash
cd server
npm test          # run once
```

The `server/package.json` `test` script: `"test": "vitest run"`. The `run` flag
executes once and exits (CI mode), rather than watching for changes.

## Covered by

All test files matching `src/**/*.test.ts`:

| File | Tests |
|------|-------|
| `src/__tests__/api.test.ts` | 6 REST endpoint tests via supertest |
| `src/__tests__/cicd.test.ts` | 6 CI/CD adapter and `summarizePipelines` tests |
