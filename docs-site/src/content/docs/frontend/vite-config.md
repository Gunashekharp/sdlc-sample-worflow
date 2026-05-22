---
title: vite.config.ts
description: Vite build and test configuration for the frontend.
---

**File:** `vite.config.ts`

Configures Vite for both development/production builds and the Vitest test suite.
The configuration is intentionally minimal — two plugins and four test options.

## Full source

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})
```

## Triple-slash directive

```ts
/// <reference types="vitest/config" />
```

Adds Vitest's type definitions to the `defineConfig` call so TypeScript knows
about the `test` key. Without this, `test: { ... }` would produce a type error
because Vite's own `UserConfig` type does not include test configuration.

## Plugins

### `react()`

`@vitejs/plugin-react` integrates Babel-based JSX/TSX transformation. It
enables:

- Fast Refresh — hot module replacement that preserves React component state
  across file saves.
- JSX transform (React 17+) — no need to import React in every file.
- TypeScript stripping (via Babel) during development for fast rebuilds.

### `tailwindcss()`

`@tailwindcss/vite` (Tailwind CSS v4) hooks Tailwind's CSS engine directly into
Vite's transform pipeline. This replaces the traditional PostCSS plugin step:

- No separate `postcss.config.js` file is needed.
- CSS classes used in JSX/TSX are scanned at transform time and included in the
  output bundle.
- `css: true` in the `test` block ensures Tailwind classes are resolved during
  Vitest runs.

## Test configuration

All options live under the `test` key (provided by the `vitest/config` types).

| Option | Value | Effect |
|--------|-------|--------|
| `environment` | `'jsdom'` | Runs tests in a simulated browser DOM (JSDOM) rather than Node. Required for React component tests that access `document`, `window`, `localStorage`, etc. |
| `globals` | `true` | Injects `describe`, `it`, `expect`, `vi`, `beforeEach`, `afterEach` as global names. Without this, each test file would need to import them from `vitest`. |
| `setupFiles` | `'./src/test/setup.ts'` | Runs the setup module before each test file. Used to import `@testing-library/jest-dom` matchers and clear `localStorage`. |
| `css` | `true` | Enables CSS processing during tests. Allows `tailwindcss()` to process class names, which is needed for tests that assert on rendered styles. |

## Build behaviour

Vite's default build configuration (no custom overrides here):

- Entry point: `index.html` → `src/main.tsx`
- Output: `dist/` directory
- Production mode: minified, tree-shaken, hashed filenames
- TypeScript type-checking is a separate step (`tsc -b`) run before `vite build`
  via the `npm run build` script: `"build": "tsc -b && vite build"`

## Related files

| File | Role |
|------|------|
| `src/main.tsx` | Vite entry point |
| `src/index.css` | CSS entry point processed by the Tailwind plugin |
| `src/vite-env.d.ts` | TypeScript augmentation for `import.meta.env` |
| `src/test/setup.ts` | Test setup module |
| `tsconfig.app.json` | TypeScript config for `src/` |
| `tsconfig.node.json` | TypeScript config for `vite.config.ts` itself |
