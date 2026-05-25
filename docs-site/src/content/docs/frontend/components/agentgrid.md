---
title: AgentGrid
description: Reference for `src/components/AgentGrid.tsx`
---

**File:** `src/components/AgentGrid.tsx` · **Lines:** 100

<!-- fill:file:summary -->
<FILL: 2-4 sentence plain-language summary of what `components/AgentGrid.tsx` is responsible for, what other files it integrates with, and what calls into it.>
<!-- /fill:file:summary -->

## Imports

This file pulls in the following modules. Relative imports point to other documented files; external imports are libraries from `node_modules`.

| Module | Imports | Kind |
| --- | --- | --- |
| `react` | `useMemo`, `useState` | external |
| `../data/agents` | `Agent` | type-only · internal |
| `../data/agents` | `AGENT_CATEGORIES` | internal |
| `../lib/filterAgents` | `filterAgents` | internal |
| `../lib/sortAgents` | `sortAgents`, `SORT_LABELS` | internal |
| `../lib/sortAgents` | `SortKey` | type-only · internal |
| `../lib/usePersistentState` | `usePersistentState` | internal |
| `./AgentCard` | `default as AgentCard` | internal |
| `./icons` | `IconSearch` | internal |


## Symbols

This file exports 1 symbol. Every export is documented below, in declaration order.

| Name | Kind | Default |
| --- | --- | --- |
| AgentGrid | component | yes |

## AgentGrid (default export)

**Kind:** `component`

```ts
export default function AgentGrid({ agents }: { agents: Agent[] }) { ... }
```

<!-- fill:sym:AgentGrid:summary -->
<FILL: 2-4 sentences explaining what AgentGrid does and why it exists. Ground every claim in the signature and source.>
<!-- /fill:sym:AgentGrid:summary -->

### Props

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| agents | `Agent[]` | yes | <FILL: what does agents control?> |

### Line-by-line walkthrough

Each top-level statement of `AgentGrid`, in execution order. The line numbers reference the source file as it appears today.

**Line 14 — `FirstStatement`**

```ts
const [category, setCategory] = usePersistentState<string>(
    'snabbit.agentGrid.category',
    'All',
  )
```

<!-- fill:sym:AgentGrid:walk:0 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:AgentGrid:walk:0 -->

**Line 18 — `FirstStatement`**

```ts
const [sort, setSort] = usePersistentState<SortKey>(
    'snabbit.agentGrid.sort',
    'runs',
  )
```

<!-- fill:sym:AgentGrid:walk:1 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:AgentGrid:walk:1 -->

**Line 22 — `FirstStatement`**

```ts
const [query, setQuery] = useState('')
```

<!-- fill:sym:AgentGrid:walk:2 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:AgentGrid:walk:2 -->

**Line 23 — `FirstStatement`**

```ts
const [selectedId, setSelectedId] = useState<string | null>(null)
```

<!-- fill:sym:AgentGrid:walk:3 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:AgentGrid:walk:3 -->

**Line 25 — `FirstStatement`**

```ts
const visible = useMemo(
    () => sortAgents(filterAgents(agents, { query, category }), sort),
    [agents, query, category, sort],
  )
```

<!-- fill:sym:AgentGrid:walk:4 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:AgentGrid:walk:4 -->

**Line 30 — `ReturnStatement`**

```ts
return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <h2 className="text-sm font-semibold">
          Agents <span className="text-text-faint">{visible.length}</span>
        </h2>

        <div className="flex flex-wrap gap-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setCategory(tab)}
              aria-pressed={category === tab}
              className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                category === tab
                  ? 'bg-surface-3 text-text'
                  : 'text-text-muted hover:bg-surface hover:text-text'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          aria-label="Sort agents"
          className="ml-auto rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-text-muted outline-none hover:border-border-strong focus:border-border-strong"
        >
          {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
            <option key={key} value={key}>
              {SORT_LABELS[key]}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2 rounded-md border border-border bg-surface px-2.5 py-1.5 focus-within:border-border-strong">
          <IconSearch className="text-text-faint" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter agents…"
            aria-label="Filter agents"
            className="w-40 bg-transparent text-sm outline-none placeholder:text-text-faint"
          />
        </label>
      </div>

      {visible.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              selected={agent.id === selectedId}
              onSelect={setSelectedId}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border px-4 py-12 text-center text-sm text-text-faint">
          No agents match {query ? `“${query}”` : 'this filter'}.
        </div>
      )}
    </section>
  )
```

<!-- fill:sym:AgentGrid:walk:5 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:AgentGrid:walk:5 -->

### Examples

<!-- fill:sym:AgentGrid:example -->
<FILL: at least one concrete input → output example. For components, a JSX usage snippet. For functions, an input + return value. Pull from tests when available so the example is real.>
<!-- /fill:sym:AgentGrid:example -->

### Used by

- `src/App.tsx`
- `src/components/AgentGrid.test.tsx`

## Tests

| Suite | Test | Asserts |
| --- | --- | --- |
| <AgentGrid /> | renders a card for every agent | <FILL: assertion summary> |
| <AgentGrid /> | filters agents by the search query | <FILL: assertion summary> |
| <AgentGrid /> | shows an empty state when nothing matches | <FILL: assertion summary> |
| <AgentGrid /> | filters agents by category tab | <FILL: assertion summary> |
| <AgentGrid /> | marks a card as selected when clicked | <FILL: assertion summary> |
| <AgentGrid /> | keeps every agent visible after changing the sort | <FILL: assertion summary> |
| <AgentGrid /> | remembers the selected category across remounts | <FILL: assertion summary> |

## Diagrams

<!-- fill:file:diagrams -->
<FILL: if this file has non-trivial control flow, async sequences, or state transitions, include a Mermaid diagram here. Use `flowchart`, `sequenceDiagram`, or `stateDiagram-v2`. Skip this section entirely — do not write "no diagram" — if the file is trivial.>
<!-- /fill:file:diagrams -->
