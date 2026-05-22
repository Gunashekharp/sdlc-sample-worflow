---
title: PromptBar
description: The pinned bottom prompt input.
---

**File:** `src/components/PromptBar.tsx`

The prompt input bar pinned to the bottom of the main content column. Contains
a controlled `<textarea>`, a model selector, and a send button.

:::note
Submitting currently logs to the console and clears the input. Backend wiring
is tracked in `BACKLOG.md` and has not been implemented yet.
:::

## Component

```ts
export default function PromptBar()
```

**Parameters:** None.

**Returns:** A `<div>` wrapping the prompt UI.

**Side effects:** On submit, logs `'Prompt submitted: <value>'` to the console.

## State

```ts
const [value, setValue] = useState('')
const canSend = value.trim().length > 0
```

| State | Type | Purpose |
|-------|------|---------|
| `value` | `string` | Controlled textarea value |
| `canSend` | `boolean` (derived) | True when trimmed value is non-empty; gates the send button |

`canSend` is a derived boolean, not a separate state. It is recalculated on
every render from the current `value`.

## `submit()` function

```ts
function submit() {
  if (!canSend) return
  console.log('Prompt submitted:', value.trim())
  setValue('')
}
```

**Parameters:** None (closure over `value` and `canSend`).

**Side effects:** Logs to console, clears `value` to `''`.

The guard `if (!canSend) return` makes `submit` safe to call without checking
the button's `disabled` state first — the `onKeyDown` handler calls it
unconditionally after checking the key.

## Layout structure

```
<div border-t bg-bg px-4 py-3>
  └── <div rounded-lg border focus-within:border-strong>
        ├── <textarea rows=2 placeholder="Ask an agent…" />
        └── <div footer px-2.5 py-2>
              ├── Model picker button  "✦ Opus 4.7  ˅"
              ├── Hint text  "Enter to send · Shift+Enter for newline" [hidden sm:inline]
              └── Send button  (disabled when !canSend)
```

### Keyboard handling

```tsx
onKeyDown={(e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    submit()
  }
}}
```

**Enter** calls `e.preventDefault()` (to suppress the default textarea newline)
and then `submit()`. **Shift+Enter** is not intercepted, so the browser inserts
a newline normally.

### Send button disabled state

```tsx
<button
  disabled={!canSend}
  className="... disabled:cursor-not-allowed disabled:opacity-40"
>
```

`disabled` is controlled by `canSend`. The button uses `disabled:cursor-not-allowed`
and `disabled:opacity-40` to provide a visual disabled state without JavaScript.
`aria-label="Send prompt"` provides an accessible name since the button contains
only an icon.

### Model picker

```tsx
<button type="button" className="flex items-center gap-1.5 ...">
  <IconSparkle className="h-3.5 w-3.5 text-accent" />
  Opus 4.7
  <IconChevronDown className="h-3.5 w-3.5" />
</button>
```

A button showing the current model name ("Opus 4.7") with a sparkle icon and
chevron. Not wired to model selection logic.

## Used by

`App.tsx` — rendered as the last element inside the right-hand flex column,
after the scrollable `<main>` region. `shrink-0` prevents compression.
