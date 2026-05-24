---
title: vite.config.ts
---

**File:** `vite.config.ts`

Configures Vite for both development/production builds and the Vitest test suite. The configuration is intentionally minimal — two plugins and four test options.

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

This directive adds Vitest's TypeScript declarations to the `defineConfig` call so the compiler knows about the `test` key. Without it, `test: { ... }` produces a TypeScript error because Vite's own `UserConfig` type does not include test configuration — that key is added by `vitest/config`.

The directive is placed in the file itself (not in `tsconfig.node.json`) because it must affect the specific import of `defineConfig` in this file.

## Plugins

### `react()`

`@vitejs/plugin-react` integrates the official React support for Vite. It provides:

- **Fast Refresh** — Vite's hot module replacement (HMR) for React components. When you save a `.tsx` file, only the changed component is re-evaluated; component state is preserved across saves.
- **Automatic JSX runtime** — Uses the React 17+ automatic JSX transform, so `import React from 'react'` is not required in every file.
- **TypeScript stripping** — During development, Babel strips TypeScript annotations for fast iteration. Full type-checking is done separately via `tsc -b` in the `build` script.

### `tailwindcss()`

`@tailwindcss/vite` is the official Tailwind CSS v4 Vite plugin. It integrates Tailwind's CSS engine directly into Vite's transform pipeline:

- **No separate PostCSS step** — `postcss.config.js` is not needed. The plugin processes `@import "tailwindcss"` and the `@theme` block in `index.css` at transform time.
- **Scans JSX/TSX for class names** — Tailwind scans transformed component files and includes only the utility classes actually used in the output bundle.
- **Works in tests** — When `css: true` is set in the `test` block, the plugin processes CSS during Vitest runs, enabling style-dependent assertions.

## Test configuration (`test` block)

All Vitest options live under the `test` key (provided by the `vitest/config` type declarations). Vitest reads this key when it detects a `vite.config.ts` in the project root.

### `environment: 'jsdom'`

```ts
environment: 'jsdom'
```

Runs tests inside **jsdom** — a pure-JavaScript implementation of the browser DOM. This is required for React component tests that interact with:

- `document` (querying elements, `getElementById`)
- `window` (event listeners, `window.location`)
- `localStorage` (used by `usePersistentState`)
- User interaction simulation (React Testing Library's `userEvent` and `fireEvent`)

Without a DOM environment, any test that renders a React component and queries the resulting DOM would throw `ReferenceError: document is not defined`.

The alternative to `jsdom` is `happy-dom` (lighter) or `node` (no DOM at all). This project uses `jsdom` because React Testing Library's test utilities are built and tested against it.

### `globals: true`

```ts
globals: true
```

Injects Vitest's test globals (`describe`, `it`, `test`, `expect`, `vi`, `beforeEach`, `afterEach`, `beforeAll`, `afterAll`) as global names in every test file. Without this, each test file would need:

```ts
import { describe, it, expect, vi, afterEach } from 'vitest'
```

With `globals: true`, those imports are unnecessary. The matching TypeScript types are provided by including `"types": ["vitest/globals"]` in `tsconfig.app.json`.

### `setupFiles: './src/test/setup.ts'`

```ts
setupFiles: './src/test/setup.ts'
```

Runs the specified module before each test file. The setup module:

1. Imports `@testing-library/jest-dom` to extend `expect` with DOM matchers (`toBeInTheDocument`, `toHaveAttribute`, etc.).
2. Registers an `afterEach` hook that calls `localStorage.clear()` to prevent state leakage between test cases.

See [Test setup](./test-setup) for a full walkthrough.

### `css: true`

```ts
css: true
```

Enables CSS processing during Vitest runs. When `true`, Vite processes CSS imports (including Tailwind utility classes) in the test environment. This allows tests that assert on rendered styles — for example, checking that a component has the correct Tailwind classes applied — to work correctly.

Without `css: true`, CSS imports are ignored in the test environment and Tailwind classes are not resolved.

## Build behaviour (defaults)

No custom `build` options are set; Vite's defaults apply:

- **Entry point:** `index.html` → `src/main.tsx`
- **Output directory:** `dist/`
- **Production mode:** Minified JavaScript, tree-shaken, content-hashed filenames for long-lived caching
- **Code splitting:** Vendor chunks are separated from application code automatically

TypeScript type-checking is a **separate step** run before `vite build` in the `build` npm script:

```
"build": "tsc -b && vite build"
```

`tsc -b` performs a full project-references build. If any `.ts` or `.tsx` file has a type error, the command exits non-zero and `vite build` never runs, preventing a broken build from reaching `dist/`.

## Related files

| File | Role |
|---|---|
| `src/main.tsx` | Vite entry point |
| `src/index.css` | CSS entry point processed by the Tailwind plugin |
| `src/vite-env.d.ts` | TypeScript augmentation for `import.meta.env` |
| `src/test/setup.ts` | Test setup module (referenced by `setupFiles`) |
| `tsconfig.json` | Root TypeScript project references config |
| `tsconfig.app.json` | TypeScript config for `src/` (browser lib) |
| `tsconfig.node.json` | TypeScript config for `vite.config.ts` (Node lib) |
