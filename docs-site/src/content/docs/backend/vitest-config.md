---
title: server/vitest.config.ts
---

**File:** `server/vitest.config.ts`

A minimal, self-contained Vitest configuration for the backend test suite. It is intentionally separate from the frontend's `vite.config.ts` so the two suites run in different environments with different setup files.

## Full source

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
```

## Configuration options

### `environment: 'node'`

Tests run in a plain Node.js environment — no JSDOM, no `document` global, no `window`, no `navigator`. The backend tests only need Node.js APIs: `process.env`, network (via `supertest`), and standard JavaScript objects.

Setting `environment: 'node'` explicitly:
- Prevents Vitest from loading JSDOM, which speeds up test startup.
- Ensures that any accidental DOM usage in backend code surfaces as a clear `ReferenceError` rather than silently passing against a simulated browser.

### `include: ['src/**/*.test.ts']`

Restricts test discovery to TypeScript test files anywhere under `server/src/`. Without this, Vitest uses its default glob (`**/*.{test,spec}.{js,mjs,cjs,jsx,ts,tsx,mts,cts}`) which could accidentally pick up test files from `node_modules` or other directories.

## Why a separate config?

The frontend's Vite/Vitest configuration (at the project root) sets:

```ts
test: {
  environment: 'jsdom',
  setupFiles: ['src/test/setup.ts'],
}
```

The frontend setup file (`src/test/setup.ts`) imports `@testing-library/jest-dom` (which extends `expect` with DOM matchers like `toBeInTheDocument`) and calls `localStorage.clear()`.

Neither is appropriate for backend tests:

| Frontend setup | Why it breaks backend tests |
|---|---|
| `environment: 'jsdom'` | The backend runs in Node and has no DOM. JSDOM would simulate one unnecessarily. |
| `@testing-library/jest-dom` | Adds DOM-specific matchers to `expect`. These don't make sense for API response assertions. |
| `localStorage.clear()` | `localStorage` does not exist in Node — this call would throw `ReferenceError: localStorage is not defined`. |

Using a separate config file means:
- Running `vitest` from `server/` picks up `server/vitest.config.ts` automatically.
- Running `vitest` from the project root picks up the root `vite.config.ts`.
- Neither suite contaminates the other's environment or setup.

## Running the backend tests

```bash
cd server

# Run all tests once (CI mode):
npm test

# Run in watch mode:
npm run test:watch
```

The `test` script in `server/package.json` is `"vitest run"`. The `run` flag executes all tests once and exits with a non-zero code on failure, suitable for CI pipelines.

## Test files covered

All files matching `src/**/*.test.ts` under `server/`:

| File | Description |
|---|---|
| `src/__tests__/api.test.ts` | REST endpoint integration tests via `supertest`. Injects `createMemoryStore(SEED_AGENTS, SEED_KPIS)` and `createMockCicdProvider()`. 6 tests covering all 5 endpoints plus the 404 path. |
| `src/__tests__/cicd.test.ts` | Unit tests for `summarizePipelines`, `getCicdProvider` selection logic, and the mock provider. 6 tests. |

:::tip
Both test files require no running Postgres instance and no GitHub credentials. `npm test` works on any machine with Node.js installed.
:::
