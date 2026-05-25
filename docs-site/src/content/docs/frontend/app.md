---
title: App
description: Reference for `src/App.tsx`
---

**File:** `src/App.tsx` · **Lines:** 40

<!-- fill:file:summary -->
<FILL: 2-4 sentence plain-language summary of what `App.tsx` is responsible for, what other files it integrates with, and what calls into it.>
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
<FILL: 2-4 sentences explaining what App does and why it exists. Ground every claim in the signature and source.>
<!-- /fill:sym:App:summary -->

### Line-by-line walkthrough

Each top-level statement of `App`, in execution order. The line numbers reference the source file as it appears today.

**Line 11 — `FirstStatement`**

```ts
const featured = AGENTS.find((a) => a.id === FEATURED_AGENT_ID) ?? AGENTS[0]
```

<!-- fill:sym:App:walk:0 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:App:walk:0 -->

**Line 12 — `FirstStatement`**

```ts
const rest = AGENTS.filter((a) => a.id !== featured.id)
```

<!-- fill:sym:App:walk:1 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
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
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:App:walk:2 -->

### Examples

<!-- fill:sym:App:example -->
<FILL: at least one concrete input → output example. For components, a JSX usage snippet. For functions, an input + return value. Pull from tests when available so the example is real.>
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
<FILL: if this file has non-trivial control flow, async sequences, or state transitions, include a Mermaid diagram here. Use `flowchart`, `sequenceDiagram`, or `stateDiagram-v2`. Skip this section entirely — do not write "no diagram" — if the file is trivial.>
<!-- /fill:file:diagrams -->
