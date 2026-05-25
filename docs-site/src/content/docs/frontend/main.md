---
title: main
description: Reference for `src/main.tsx`
---

**File:** `src/main.tsx` · **Lines:** 11

<!-- fill:file:summary -->
`main.tsx` is the React entrypoint that bootstraps the application. It imports the global `./index.css` stylesheet for its side effects, creates a root on the `#root` DOM element via `createRoot`, and renders `App` wrapped in React's `StrictMode`. It is the file Vite loads first and is not imported by any other module.
<!-- /fill:file:summary -->

## Imports

This file pulls in the following modules. Relative imports point to other documented files; external imports are libraries from `node_modules`.

| Module | Imports | Kind |
| --- | --- | --- |
| `react` | `StrictMode` | external |
| `react-dom/client` | `createRoot` | external |
| `./index.css` | _side-effect only_ | internal |
| `./App.tsx` | `default as App` | internal |


:::caution
No exported symbols detected by the AST. This file is likely a side-effect entrypoint, re-export barrel, or runtime bootstrap. The source appendix below contains the full file.
:::

## Diagrams

<!-- fill:file:diagrams -->

<!-- /fill:file:diagrams -->

## Source

Full file source for `src/main.tsx` (11 lines). The line-by-line walkthroughs above reference these line numbers.

<details>
<summary>View source (11 lines)</summary>

````tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

````

</details>
