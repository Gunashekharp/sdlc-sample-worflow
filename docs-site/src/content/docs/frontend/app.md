---
title: App
description: Reference for `src/App.tsx`
---

**File:** `src/App.tsx` · **Lines:** 40

<FILL: 2-4 sentence plain-language summary of what `App.tsx` is responsible for, what other files it integrates with, and what calls into it.>

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

<FILL: 2-4 sentences explaining what App does and why it exists. Ground every claim in the signature and source.>

### Line-by-line walkthrough

Each top-level statement of `App`, in execution order. The line numbers reference the source file as it appears today.

**Line 11 — `FirstStatement`**

```ts
const featured = AGENTS.find((a) => a.id === FEATURED_AGENT_ID) ?? AGENTS[0]
```

<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>

**Line 12 — `FirstStatement`**

```ts
const rest = AGENTS.filter((a) => a.id !== featured.id)
```

<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>

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

<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>

### Examples

<FILL: at least one concrete input → output example. For components, a JSX usage snippet. For functions, an input + return value. Pull from tests when available so the example is real.>

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

<FILL: if this file has non-trivial control flow, async sequences, or state transitions, include a Mermaid diagram here. Use `flowchart`, `sequenceDiagram`, or `stateDiagram-v2`. Skip this section entirely — do not write "no diagram" — if the file is trivial.>

## Source

Full file source for `src/App.tsx` (40 lines). The line-by-line walkthroughs above reference these line numbers.

<details>
<summary>View source (40 lines)</summary>

````tsx
import { AGENTS, FEATURED_AGENT_ID } from './data/agents'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import KpiStrip from './components/KpiStrip'
import FeaturedAgent from './components/FeaturedAgent'
import PipelinesPanel from './components/PipelinesPanel'
import AgentGrid from './components/AgentGrid'
import PromptBar from './components/PromptBar'

export default function App() {
  const featured = AGENTS.find((a) => a.id === FEATURED_AGENT_ID) ?? AGENTS[0]
  const rest = AGENTS.filter((a) => a.id !== featured.id)

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
}

// docs-agent test: trigger a docs rebuild

// docs-agent test: figma embed on App.tsx

// docs-agent auto-trigger re-test

// figma-gate test

````

</details>
