---
title: AgentCard
description: Reference for `src/components/AgentCard.tsx`
---

**File:** `src/components/AgentCard.tsx` · **Lines:** 38

<!-- fill:file:summary -->
<FILL: 2-4 sentence plain-language summary of what `components/AgentCard.tsx` is responsible for, what other files it integrates with, and what calls into it.>
<!-- /fill:file:summary -->

## Imports

This file pulls in the following modules. Relative imports point to other documented files; external imports are libraries from `node_modules`.

| Module | Imports | Kind |
| --- | --- | --- |
| `../data/agents` | `Agent` | type-only · internal |
| `./StatusDot` | `default as StatusDot` | internal |


## Symbols

This file exports 1 symbol. Every export is documented below, in declaration order.

| Name | Kind | Default |
| --- | --- | --- |
| AgentCard | component | yes |

## AgentCard (default export)

**Kind:** `component`

```ts
export default function AgentCard({ agent, selected, onSelect }: AgentCardProps) { ... }
```

<!-- fill:sym:AgentCard:summary -->
<FILL: 2-4 sentences explaining what AgentCard does and why it exists. Ground every claim in the signature and source.>
<!-- /fill:sym:AgentCard:summary -->

### Props

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| agent | `Agent` | yes | <FILL: what does agent control?> |
| selected | `boolean` | yes | <FILL: what does selected control?> |
| onSelect | `(id: string) => void` | yes | <FILL: what does onSelect control?> |

### Line-by-line walkthrough

Each top-level statement of `AgentCard`, in execution order. The line numbers reference the source file as it appears today.

**Line 11 — `ReturnStatement`**

```ts
return (
    <button
      type="button"
      onClick={() => onSelect(agent.id)}
      aria-pressed={selected}
      className={`flex h-full flex-col gap-2 rounded-lg border bg-surface p-3.5 text-left transition-colors ${
        selected
          ? 'border-accent ring-1 ring-accent'
          : 'border-border hover:border-border-strong hover:bg-surface-2'
      }`}
    >
      <div className="flex items-center gap-2">
        <StatusDot status={agent.status} />
        <span className="truncate text-sm font-semibold">{agent.name}</span>
        <span className="ml-auto shrink-0 rounded border border-border px-1.5 py-0.5 text-[11px] text-text-muted">
          {agent.category}
        </span>
      </div>
      <p className="line-clamp-2 text-xs text-text-muted">{agent.description}</p>
      <div className="mt-auto flex items-center gap-3 pt-1 font-mono text-[11px] text-text-faint">
        <span>{agent.runsPerWeek.toLocaleString()} runs/wk</span>
        <span>{agent.successRate}% ok</span>
        <span className="ml-auto">{agent.lastRun}</span>
      </div>
    </button>
  )
```

<!-- fill:sym:AgentCard:walk:0 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:AgentCard:walk:0 -->

### Examples

<!-- fill:sym:AgentCard:example -->
<FILL: at least one concrete input → output example. For components, a JSX usage snippet. For functions, an input + return value. Pull from tests when available so the example is real.>
<!-- /fill:sym:AgentCard:example -->

### Used by

- `src/components/AgentGrid.tsx`

## Diagrams

<!-- fill:file:diagrams -->
<FILL: if this file has non-trivial control flow, async sequences, or state transitions, include a Mermaid diagram here. Use `flowchart`, `sequenceDiagram`, or `stateDiagram-v2`. Skip this section entirely — do not write "no diagram" — if the file is trivial.>
<!-- /fill:file:diagrams -->

## Source

Full file source for `src/components/AgentCard.tsx` (38 lines). The line-by-line walkthroughs above reference these line numbers.

<details>
<summary>View source (38 lines)</summary>

````tsx
import type { Agent } from '../data/agents'
import StatusDot from './StatusDot'

interface AgentCardProps {
  agent: Agent
  selected: boolean
  onSelect: (id: string) => void
}

export default function AgentCard({ agent, selected, onSelect }: AgentCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(agent.id)}
      aria-pressed={selected}
      className={`flex h-full flex-col gap-2 rounded-lg border bg-surface p-3.5 text-left transition-colors ${
        selected
          ? 'border-accent ring-1 ring-accent'
          : 'border-border hover:border-border-strong hover:bg-surface-2'
      }`}
    >
      <div className="flex items-center gap-2">
        <StatusDot status={agent.status} />
        <span className="truncate text-sm font-semibold">{agent.name}</span>
        <span className="ml-auto shrink-0 rounded border border-border px-1.5 py-0.5 text-[11px] text-text-muted">
          {agent.category}
        </span>
      </div>
      <p className="line-clamp-2 text-xs text-text-muted">{agent.description}</p>
      <div className="mt-auto flex items-center gap-3 pt-1 font-mono text-[11px] text-text-faint">
        <span>{agent.runsPerWeek.toLocaleString()} runs/wk</span>
        <span>{agent.successRate}% ok</span>
        <span className="ml-auto">{agent.lastRun}</span>
      </div>
    </button>
  )
}

````

</details>
