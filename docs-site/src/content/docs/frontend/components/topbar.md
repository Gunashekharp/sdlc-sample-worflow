---
title: TopBar
description: Reference for `src/components/TopBar.tsx`
---

**File:** `src/components/TopBar.tsx` · **Lines:** 32

<!-- fill:file:summary -->
<FILL: 2-4 sentence plain-language summary of what `components/TopBar.tsx` is responsible for, what other files it integrates with, and what calls into it.>
<!-- /fill:file:summary -->

## Imports

This file pulls in the following modules. Relative imports point to other documented files; external imports are libraries from `node_modules`.

| Module | Imports | Kind |
| --- | --- | --- |
| `./icons` | `IconChevronDown`, `IconSearch` | internal |


## Symbols

This file exports 1 symbol. Every export is documented below, in declaration order.

| Name | Kind | Default |
| --- | --- | --- |
| TopBar | component | yes |

## TopBar (default export)

**Kind:** `component`

```ts
export default function TopBar() { ... }
```

<!-- fill:sym:TopBar:summary -->
<FILL: 2-4 sentences explaining what TopBar does and why it exists. Ground every claim in the signature and source.>
<!-- /fill:sym:TopBar:summary -->

### Line-by-line walkthrough

Each top-level statement of `TopBar`, in execution order. The line numbers reference the source file as it appears today.

**Line 4 — `ReturnStatement`**

```ts
return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-bg px-4">
      <div className="flex items-center gap-2 text-sm">
        <span className="font-semibold">Agent Console</span>
        <span className="text-text-faint">/</span>
        <span className="text-text-muted">Overview</span>
      </div>

      <button
        type="button"
        className="ml-auto flex w-72 items-center gap-2 rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm text-text-faint hover:border-border-strong"
      >
        <IconSearch />
        <span className="flex-1 text-left">Search agents, runs, sessions…</span>
        <kbd className="font-mono text-xs">⌘K</kbd>
      </button>

      <button
        type="button"
        className="flex items-center gap-2 rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm hover:border-border-strong"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-ok" />
        Production
        <IconChevronDown className="text-text-faint" />
      </button>
    </header>
  )
```

<!-- fill:sym:TopBar:walk:0 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:TopBar:walk:0 -->

### Examples

<!-- fill:sym:TopBar:example -->
<FILL: at least one concrete input → output example. For components, a JSX usage snippet. For functions, an input + return value. Pull from tests when available so the example is real.>
<!-- /fill:sym:TopBar:example -->

### Used by

- `src/App.tsx`

## Diagrams

<!-- fill:file:diagrams -->
<FILL: if this file has non-trivial control flow, async sequences, or state transitions, include a Mermaid diagram here. Use `flowchart`, `sequenceDiagram`, or `stateDiagram-v2`. Skip this section entirely — do not write "no diagram" — if the file is trivial.>
<!-- /fill:file:diagrams -->
