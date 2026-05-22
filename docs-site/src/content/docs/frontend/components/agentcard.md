---
title: AgentCard
description: Individual agent tile in the filterable grid.
---

**File:** `src/components/AgentCard.tsx`

A single agent tile rendered inside `AgentGrid`. A `<button>` with selection
state exposed via `aria-pressed`. Displays the agent's status, name, category,
description, run statistics, and last-run time.

## Props

```ts
interface AgentCardProps {
  agent: Agent
  selected: boolean
  onSelect: (id: string) => void
}
```

| Prop | Type | Purpose |
|------|------|---------|
| `agent` | `Agent` | The agent data to display. See [`Agent`](/sdlc-sample-worflow/frontend/data/agents/) for the full type. |
| `selected` | `boolean` | Whether this card is currently selected. Controls the accent border and ring. |
| `onSelect` | `(id: string) => void` | Callback invoked with `agent.id` when the button is clicked. |

## Component

```ts
export default function AgentCard({ agent, selected, onSelect }: AgentCardProps)
```

**Returns:** A `<button>` element.

**Side effects:** None — calls `onSelect` on click but does not manage its own
selection state.

## Layout structure

```
<button aria-pressed={selected} onClick={() => onSelect(agent.id)}>
  <div row>
    ├── StatusDot (status)
    ├── <span name> (truncate)
    └── <span category chip>  (ml-auto)
  </div>
  <p description> (line-clamp-2)
  <div footer stats>
    ├── "342 runs/wk"
    ├── "96% ok"
    └── "3m ago"  (ml-auto)
  </div>
</button>
```

## Selection styles

```tsx
className={`flex h-full flex-col gap-2 rounded-lg border bg-surface p-3.5 text-left
  transition-colors ${
    selected
      ? 'border-accent ring-1 ring-accent'
      : 'border-border hover:border-border-strong hover:bg-surface-2'
  }`}
```

When `selected` is true: the border becomes `--color-accent` (pink) and a 1px
accent ring is added inside the border, creating a double-highlight effect.

When `selected` is false: normal border with hover-state upgrades to a stronger
border and slightly raised surface.

`transition-colors` ensures the border color change is animated smoothly.

## Accessibility

`aria-pressed={selected}` exposes the toggle semantics to assistive technology —
screen readers announce the button as "pressed" or "not pressed" based on
`selected`. The `text-left` class overrides the default button center alignment
so the content reads naturally.

## Stats row

```tsx
<div className="mt-auto flex items-center gap-3 pt-1 font-mono text-[11px] text-text-faint">
  <span>{agent.runsPerWeek.toLocaleString()} runs/wk</span>
  <span>{agent.successRate}% ok</span>
  <span className="ml-auto">{agent.lastRun}</span>
</div>
```

`mt-auto` pushes the stats row to the bottom of the card regardless of how tall
the description is, keeping cards in a grid row visually aligned at the bottom.
`toLocaleString()` formats `runsPerWeek` with thousands separators (e.g. `1,284`).

## Used by

`AgentGrid` — mapped over the visible agents after filtering and sorting.
`AgentGrid` owns the `selectedId` state and passes `selected={agent.id === selectedId}`
and `onSelect={setSelectedId}` to each card.
