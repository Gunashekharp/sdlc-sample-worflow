---
title: PromptBar
description: Reference for `src/components/PromptBar.tsx`
---

**File:** `src/components/PromptBar.tsx` · **Lines:** 58

<FILL: 2-4 sentence plain-language summary of what `components/PromptBar.tsx` is responsible for, what other files it integrates with, and what calls into it.>

## Imports

This file pulls in the following modules. Relative imports point to other documented files; external imports are libraries from `node_modules`.

| Module | Imports | Kind |
| --- | --- | --- |
| `react` | `useState` | external |
| `./icons` | `IconArrowUp`, `IconChevronDown`, `IconSparkle` | internal |


## Symbols

This file exports 1 symbol. Every export is documented below, in declaration order.

| Name | Kind | Default |
| --- | --- | --- |
| PromptBar | component | yes |

## PromptBar (default export)

**Kind:** `component`

```ts
export default function PromptBar() { ... }
```

<FILL: 2-4 sentences explaining what PromptBar does and why it exists. Ground every claim in the signature and source.>

### Line-by-line walkthrough

Each top-level statement of `PromptBar`, in execution order. The line numbers reference the source file as it appears today.

**Line 5 — `FirstStatement`**

```ts
const [value, setValue] = useState('')
```

<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>

**Line 6 — `FirstStatement`**

```ts
const canSend = value.trim().length > 0
```

<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>

**Line 8 — `FunctionDeclaration`**

```ts
function submit() {
    if (!canSend) return
    // Backend wiring is tracked in BACKLOG.md; for now this clears the input.
    console.log('Prompt submitted:', value.trim())
    setValue('')
  }
```

<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>

**Line 15 — `ReturnStatement`**

```ts
return (
    <div className="shrink-0 border-t border-border bg-bg px-4 py-3">
      <div className="rounded-lg border border-border bg-surface focus-within:border-border-strong">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              submit()
            }
          }}
          rows={2}
          placeholder="Ask an agent or describe a task…"
          aria-label="Prompt input"
          className="block w-full resize-none bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-text-faint"
        />
        <div className="flex items-center gap-2 px-2.5 py-2">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-xs text-text-muted hover:border-border-strong hover:text-text"
          >
            <IconSparkle className="h-3.5 w-3.5 text-accent" />
            Opus 4.7
            <IconChevronDown className="h-3.5 w-3.5" />
          </button>
          <span className="hidden text-xs text-text-faint sm:inline">
            Enter to send · Shift+Enter for newline
          </span>
          <button
            type="button"
            onClick={submit}
            disabled={!canSend}
            aria-label="Send prompt"
            className="ml-auto grid h-7 w-7 place-items-center rounded-md bg-accent text-white hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            <IconArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
```

<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>

### Examples

<FILL: at least one concrete input → output example. For components, a JSX usage snippet. For functions, an input + return value. Pull from tests when available so the example is real.>

### Used by

- `src/App.tsx`

## Diagrams

<FILL: if this file has non-trivial control flow, async sequences, or state transitions, include a Mermaid diagram here. Use `flowchart`, `sequenceDiagram`, or `stateDiagram-v2`. Skip this section entirely — do not write "no diagram" — if the file is trivial.>

## Source

Full file source for `src/components/PromptBar.tsx` (58 lines). The line-by-line walkthroughs above reference these line numbers.

<details>
<summary>View source (58 lines)</summary>

````tsx
import { useState } from 'react'
import { IconArrowUp, IconChevronDown, IconSparkle } from './icons'

export default function PromptBar() {
  const [value, setValue] = useState('')
  const canSend = value.trim().length > 0

  function submit() {
    if (!canSend) return
    // Backend wiring is tracked in BACKLOG.md; for now this clears the input.
    console.log('Prompt submitted:', value.trim())
    setValue('')
  }

  return (
    <div className="shrink-0 border-t border-border bg-bg px-4 py-3">
      <div className="rounded-lg border border-border bg-surface focus-within:border-border-strong">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              submit()
            }
          }}
          rows={2}
          placeholder="Ask an agent or describe a task…"
          aria-label="Prompt input"
          className="block w-full resize-none bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-text-faint"
        />
        <div className="flex items-center gap-2 px-2.5 py-2">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-xs text-text-muted hover:border-border-strong hover:text-text"
          >
            <IconSparkle className="h-3.5 w-3.5 text-accent" />
            Opus 4.7
            <IconChevronDown className="h-3.5 w-3.5" />
          </button>
          <span className="hidden text-xs text-text-faint sm:inline">
            Enter to send · Shift+Enter for newline
          </span>
          <button
            type="button"
            onClick={submit}
            disabled={!canSend}
            aria-label="Send prompt"
            className="ml-auto grid h-7 w-7 place-items-center rounded-md bg-accent text-white hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            <IconArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

````

</details>
