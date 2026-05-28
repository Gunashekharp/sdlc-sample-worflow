---
title: AgentCard
description: Reference for `src/components/AgentCard.tsx`
---

<!-- structure:a5d720c7583a -->

**File:** `src/components/AgentCard.tsx` · **Lines:** 38

<!-- fill:file:summary -->
`AgentCard.tsx` renders a single agent as a clickable card showing its status, name, category, description, and a row of usage metrics. It consumes the `Agent` type from `../data/agents` and delegates the colored status indicator to `StatusDot`. It is rendered in a grid by `AgentGrid`, which supplies the `agent`, `selected`, and `onSelect` props for each item.
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
`AgentCard` is a presentational component that displays one `Agent` as a selectable button. It surfaces the agent's status dot, name, category badge, two-line clamped description, and a footer with weekly runs, success rate, and last-run time. Clicking the card invokes `onSelect(agent.id)`, and the `selected` flag toggles accent border/ring styling and the `aria-pressed` state so the active card is visually and assistively distinguished.
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
The component's single statement returns a `<button type="button">` whose `onClick` arrow calls `onSelect(agent.id)`, reporting the selection upward without managing any local state. `aria-pressed={selected}` exposes toggle state to assistive tech, and the template-literal `className` swaps between an accent border/ring when `selected` and a muted hover style otherwise. Inside, a header row places a `StatusDot` next to the truncated `agent.name` and a right-aligned `agent.category` badge; `agent.description` is shown with `line-clamp-2`; and a `mt-auto` footer pins the monospaced metrics — `agent.runsPerWeek.toLocaleString()` (thousands-separated), `agent.successRate`%, and `agent.lastRun` — to the bottom so equal-height cards align in the grid.
<!-- /fill:sym:AgentCard:walk:0 -->

### Behavior

<!-- fill:sym:AgentCard:behavior -->
- The root element is a `<button type="button">` (not a `div`), so the entire card is keyboard-focusable and reachable with Tab/Enter without any extra `tabIndex` or `role`.
- `onClick={() => onSelect(agent.id)}` lifts the selection upward — `AgentCard` itself stores nothing, which is what lets `AgentGrid.test.tsx`'s "marks a card as selected when clicked" assertion flip between `aria-pressed="false"` and `aria-pressed="true"`.
- The `aria-pressed={selected}` attribute is the accessible signal of toggle state; the className branch (`border-accent ring-1 ring-accent` vs the muted hover style) is the visual one.
- The header row uses `<StatusDot status={agent.status} />` for the live indicator, a `truncate` span for the name (long names ellipsize instead of wrapping), and an `ml-auto shrink-0` category badge pinned to the right.
- The description sits in a `<p className="line-clamp-2 text-xs text-text-muted">` so cards stay a consistent height even when descriptions differ in length.
- The footer uses `mt-auto` to glue itself to the bottom of the flex column, so the metrics line up across cards in the grid. `agent.runsPerWeek.toLocaleString()` formats with thousands separators (e.g. "1,284"), and the `ml-auto` on the last span pushes `agent.lastRun` to the right edge.
<!-- /fill:sym:AgentCard:behavior -->

### Examples

<!-- fill:sym:AgentCard:example -->
```tsx
<AgentCard
  agent={agent}
  selected={agent.id === selectedId}
  onSelect={setSelectedId}
/>
```

This mirrors how `AgentGrid` maps over its `visible` agents: each card receives one agent, marks itself selected when its `id` matches the grid's `selectedId`, and calls `setSelectedId` on click.
<!-- /fill:sym:AgentCard:example -->

### Used by

- `src/components/AgentGrid.tsx`

## Diagrams

<!-- fill:file:diagrams -->
:::note
Pure presentational component with a single return statement and one className branch — no control flow worth diagramming.
:::
<!-- /fill:file:diagrams -->
