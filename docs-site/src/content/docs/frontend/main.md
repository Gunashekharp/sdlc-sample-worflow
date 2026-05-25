---
title: main
description: Reference for `src/main.tsx`
---

<!-- structure:1808f9c05e8e -->

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


:::note
No exported symbols detected by the AST. This file is a side-effect entrypoint, a re-export barrel, or a runtime bootstrap — open `src/main.tsx` directly to read the source.
:::

## Diagrams

<!-- fill:file:diagrams -->
<FILL: if this file has non-trivial control flow, async sequences, or state transitions, include a Mermaid diagram here. Use `flowchart`, `sequenceDiagram`, or `stateDiagram-v2`. Skip this section entirely — do not write "no diagram" — if the file is trivial.>
<!-- /fill:file:diagrams -->
