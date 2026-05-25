---
title: Sidebar
description: Reference for `src/components/Sidebar.tsx`
---

**File:** `src/components/Sidebar.tsx` · **Lines:** 117

<!-- fill:file:summary -->
<FILL: 2-4 sentence plain-language summary of what `components/Sidebar.tsx` is responsible for, what other files it integrates with, and what calls into it.>
<!-- /fill:file:summary -->

## Imports

This file pulls in the following modules. Relative imports point to other documented files; external imports are libraries from `node_modules`.

| Module | Imports | Kind |
| --- | --- | --- |
| `react` | `ComponentType`, `SVGProps` | type-only · external |
| `./icons` | `IconAgents`, `IconChevronDown`, `IconDashboard`, `IconIntegrations`, `IconPlus`, `IconRuns`, `IconSessions`, `IconSettings` | internal |


## Symbols

This file exports 1 symbol. Every export is documented below, in declaration order.

| Name | Kind | Default |
| --- | --- | --- |
| Sidebar | component | yes |

## Sidebar (default export)

**Kind:** `component`

```ts
export default function Sidebar() { ... }
```

<!-- fill:sym:Sidebar:summary -->
<FILL: 2-4 sentences explaining what Sidebar does and why it exists. Ground every claim in the signature and source.>
<!-- /fill:sym:Sidebar:summary -->

### Line-by-line walkthrough

Each top-level statement of `Sidebar`, in execution order. The line numbers reference the source file as it appears today.

**Line 37 — `ReturnStatement`**

```ts
return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-bg">
      <button
        type="button"
        className="flex h-14 items-center gap-2.5 border-b border-border px-3 text-left hover:bg-surface"
      >
        <span className="grid h-7 w-7 place-items-center rounded-md bg-accent text-sm font-bold text-white">
          S
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold leading-tight">Snabbit</span>
          <span className="block text-xs leading-tight text-text-faint">Agent Console</span>
        </span>
        <IconChevronDown className="text-text-faint" />
      </button>

      <div className="p-3">
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md border border-border-strong bg-surface-2 px-2.5 py-2 text-sm font-medium text-text-muted hover:border-accent hover:text-text"
        >
          <IconPlus className="text-accent" />
          New session
          <kbd className="ml-auto font-mono text-xs text-text-faint">⌘N</kbd>
        </button>
      </div>

      <nav className="flex flex-col gap-0.5 px-2">
        {NAV.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.label}
              type="button"
              aria-current={item.active ? 'page' : undefined}
              className={`flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm ${
                item.active
                  ? 'bg-surface-2 font-medium text-text'
                  : 'text-text-muted hover:bg-surface hover:text-text'
              }`}
            >
              <Icon className={item.active ? 'text-accent' : ''} />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="mt-5 min-h-0 flex-1 overflow-y-auto px-3">
        <p className="px-1 pb-1.5 text-[11px] font-medium uppercase tracking-wide text-text-faint">
          Recent sessions
        </p>
        <ul className="flex flex-col gap-0.5">
          {RECENT_SESSIONS.map((session) => (
            <li key={session}>
              <button
                type="button"
                className="block w-full truncate rounded px-2 py-1.5 text-left text-sm text-text-muted hover:bg-surface hover:text-text"
              >
                {session}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex h-14 items-center gap-2.5 border-t border-border px-3">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-surface-3 text-xs font-semibold uppercase">
          g
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium leading-tight">guna</span>
          <span className="block truncate text-xs leading-tight text-text-faint">
            int-gunashekhar.p@snabbit.com
          </span>
        </span>
      </div>
    </aside>
  )
```

<!-- fill:sym:Sidebar:walk:0 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:Sidebar:walk:0 -->

### Examples

<!-- fill:sym:Sidebar:example -->
<FILL: at least one concrete input → output example. For components, a JSX usage snippet. For functions, an input + return value. Pull from tests when available so the example is real.>
<!-- /fill:sym:Sidebar:example -->

### Used by

- `src/App.tsx`

## Diagrams

<!-- fill:file:diagrams -->
<FILL: if this file has non-trivial control flow, async sequences, or state transitions, include a Mermaid diagram here. Use `flowchart`, `sequenceDiagram`, or `stateDiagram-v2`. Skip this section entirely — do not write "no diagram" — if the file is trivial.>
<!-- /fill:file:diagrams -->
