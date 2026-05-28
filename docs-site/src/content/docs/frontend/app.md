---
title: App
description: Reference for `src/App.tsx`
---

<!-- structure:5ef7b27a64d1 -->

**File:** `src/App.tsx` · **Lines:** 40

<!-- fill:file:summary -->
`App.tsx` is the root component of the dashboard: it lays out the full-screen Agent Console shell and wires together every top-level piece. It pulls `AGENTS` and `FEATURED_AGENT_ID` from `./data/agents`, picks out the featured agent, and renders `Sidebar`, `TopBar`, `KpiStrip`, `FeaturedAgent`, `PipelinesPanel`, `AgentGrid`, and `PromptBar` in a flex layout. It is mounted by `main.tsx` (inside `StrictMode`) and exercised by `App.test.tsx`.
<!-- /fill:file:summary -->

## Imports

This file pulls in the following modules. Relative imports point to other documented files; external imports are libraries from `node_modules`.

| Module | Imports | Kind |
| --- | --- | --- |
| `./data/agents` | `AGENTS`, `FEATURED_AGENT_ID` | internal |
| `./components/Sidebar` | `default as Sidebar` | internal |
| `./components/TopBar` | `default as TopBar` | internal |
| `./components/KpiStrip` | `default as KpiStrip` | internal |
| `./components/FeaturedAgent` | `default as FeaturedAgent` | internal |
| `./components/PipelinesPanel` | `default as PipelinesPanel` | internal |
| `./components/AgentGrid` | `default as AgentGrid` | internal |
| `./components/PromptBar` | `default as PromptBar` | internal |


## Symbols

This file exports 1 symbol. Every export is documented below, in declaration order.

| Name | Kind | Default |
| --- | --- | --- |
| App | component | yes |

## App (default export)

**Kind:** `component`

```ts
export default function App() { ... }
```

<!-- fill:sym:App:summary -->
`App` is the default-exported root component that composes the entire dashboard. It derives two values from the static catalogue — the featured agent and the remaining agents — then returns the page layout: a `Sidebar` beside a vertical column holding the `TopBar`, a scrollable `main` region with the `KpiStrip`, `FeaturedAgent`, `PipelinesPanel`, and `AgentGrid`, and a `PromptBar` pinned below. It holds no state of its own; its only logic is splitting `AGENTS` into the featured agent and the rest before delegating to child components.
<!-- /fill:sym:App:summary -->

### Line-by-line walkthrough

Each top-level statement of `App`, in execution order. The line numbers reference the source file as it appears today.

**Line 11 — `FirstStatement`**

```ts
const featured = AGENTS.find((a) => a.id === FEATURED_AGENT_ID) ?? AGENTS[0]
```

<!-- fill:sym:App:walk:0 -->
Looks up the featured agent by scanning `AGENTS` for the one whose `id` matches `FEATURED_AGENT_ID`. The `?? AGENTS[0]` fallback guarantees `featured` is always a defined `Agent` even if that id is ever removed from the catalogue, so the rest of the component never has to guard against `undefined`.
<!-- /fill:sym:App:walk:0 -->

**Line 12 — `FirstStatement`**

```ts
const rest = AGENTS.filter((a) => a.id !== featured.id)
```

<!-- fill:sym:App:walk:1 -->
Builds the `rest` array by filtering out the featured agent, comparing on `a.id !== featured.id`. This avoids showing the featured agent twice — once in the `FeaturedAgent` slot and again in the `AgentGrid` — and the result is what gets passed as the `agents` prop to the grid.
<!-- /fill:sym:App:walk:1 -->

**Line 14 — `ReturnStatement`**

```ts
return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-5">
            <KpiStrip />
            <FeaturedAgent agent={featured} />
            <PipelinesPanel />
            <AgentGrid agents={rest} />
          </div>
        </main>
        <PromptBar />
      </div>
    </div>
  )
```

<!-- fill:sym:App:walk:2 -->
Returns the dashboard layout. The outer `div` is a full-height (`h-screen`), clipped flex row containing the `Sidebar` and a `min-w-0 flex-1` column. That column stacks the `TopBar`, a scrollable `main` region (`flex-1 overflow-y-auto`) whose centered, max-width inner `div` renders `KpiStrip`, `FeaturedAgent` (receiving the `featured` agent), `PipelinesPanel`, and `AgentGrid` (receiving `rest`), and finally a `PromptBar` fixed at the bottom of the column. Only `main` scrolls, keeping the sidebar, top bar, and prompt bar in view at all times.
<!-- /fill:sym:App:walk:2 -->

### Behavior

<!-- fill:sym:App:behavior -->
`App` is a pure layout component — it has no `useState`, no effects, no event handlers, and no conditional rendering. Its job is to wire static data into the right slots and let each child component own its own behavior.

- The outer `<div className="flex h-screen overflow-hidden">` makes the dashboard fill the viewport and clips overflow so the page never scrolls as a whole.
- `<Sidebar />` is a fixed-width column (`w-60` inside the component) docked on the left; `App` does not pass any props because the sidebar's nav and recent-sessions list are hardcoded in `components/Sidebar.tsx`.
- The right-hand column uses `flex min-w-0 flex-1 flex-col` — `min-w-0` is the standard fix that lets long content (such as agent names) truncate instead of pushing the layout wider than the viewport.
- `<TopBar />` and `<PromptBar />` sit at the top and bottom of that column and never scroll, because only the middle `<main className="flex-1 overflow-y-auto">` element owns the scrollbar.
- Inside `main`, the `mx-auto flex max-w-6xl flex-col gap-5 px-5 py-5` wrapper centres the content at `max-w-6xl` and stacks the dashboard sections with a uniform 20px gap.
- `<FeaturedAgent agent={featured} />` receives the `featured` agent picked in Line 11; `<AgentGrid agents={rest} />` receives the remaining agents from Line 12, so the featured agent is never rendered twice.
- No `aria-*` attributes or `role`s are added at this level — accessibility lives inside the children (e.g. `KpiStrip` sets `aria-label="Key metrics"`, `PromptBar` labels its textarea as `"Prompt input"`).
<!-- /fill:sym:App:behavior -->

### Examples

<!-- fill:sym:App:example -->
`App` takes no props and is rendered once at the application root. `main.tsx` mounts it like so:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

With the current catalogue, `featured` resolves to the `'pr-reviewer'` agent and the remaining eleven agents flow into `AgentGrid`, so the rendered page shows the PR Reviewer in the featured slot and the other agents in the grid below.
<!-- /fill:sym:App:example -->

### Used by

- `src/App.test.tsx`
- `src/main.tsx`

## Tests

| Suite | Test | Asserts |
| --- | --- | --- |
| <App /> | renders the featured agent | <FILL: assertion summary> |
| <App /> | renders the KPI strip | <FILL: assertion summary> |
| <App /> | renders agents in the grid | <FILL: assertion summary> |
| <App /> | renders the prompt input | <FILL: assertion summary> |

## Diagrams

<!-- fill:file:diagrams -->
The diagram below shows how `App` derives `featured`/`rest` from `AGENTS` and composes its child components, including which data each child receives.

```mermaid
flowchart TD
  AGENTS["AGENTS (data/agents)"]
  FID["FEATURED_AGENT_ID"]
  App["App"]
  featured["featured: Agent"]
  rest["rest: Agent[]"]
  Sidebar["Sidebar"]
  TopBar["TopBar"]
  KpiStrip["KpiStrip"]
  FeaturedAgent["FeaturedAgent"]
  PipelinesPanel["PipelinesPanel"]
  AgentGrid["AgentGrid"]
  PromptBar["PromptBar"]

  AGENTS --> App
  FID --> App
  App --> featured
  App --> rest
  App --> Sidebar
  App --> TopBar
  App --> KpiStrip
  App --> PipelinesPanel
  App --> PromptBar
  featured -->|agent prop| FeaturedAgent
  rest -->|agents prop| AgentGrid
  App --> FeaturedAgent
  App --> AgentGrid
```

:::caution
The Figma designs referenced in PRs #1–#4 for `App.tsx` could not be embedded because the Figma export token has expired (HTTP 403). Re-run the docs agent with a valid Figma token to attach them.
:::
<!-- /fill:file:diagrams -->
