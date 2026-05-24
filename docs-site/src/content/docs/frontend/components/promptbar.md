---
title: PromptBar
---

`PromptBar` is the pinned-bottom prompt input bar. It renders a controlled `<textarea>`, a model-selector button, a keyboard-shortcut hint, and a send button. Pressing Enter (without Shift) or clicking the send button submits the current value.

**File:** `src/components/PromptBar.tsx`

:::caution
Submission currently logs to the browser console and clears the textarea. The component is not wired to any agent or backend. Backend integration is a future implementation task.
:::

## Dependencies

| Import | Source | Purpose |
|--------|--------|---------|
| `useState` | `react` | Controlled textarea value |
| `IconArrowUp` | `./icons` | Send button icon (upward arrow) |
| `IconChevronDown` | `./icons` | Model picker chevron |
| `IconSparkle` | `./icons` | Model picker sparkle decoration |

## Component signature

```ts
export default function PromptBar(): JSX.Element
```

**Parameters:** None.

**Returns:** A `<div>` element forming the bottom bar.

**Side effects:** On submit, calls `console.log('Prompt submitted:', value.trim())` and resets `value` to `''`.

## State

```ts
const [value, setValue] = useState('')
const canSend = value.trim().length > 0
```

| Variable | Kind | Type | Default | Purpose |
|----------|------|------|---------|---------|
| `value` | State | `string` | `''` | Controlled textarea value; updated on every keystroke |
| `canSend` | Derived (not state) | `boolean` | `false` | `true` when `value.trim()` is non-empty; gates the send button and the `submit` function |

`canSend` is recalculated on every render from the current `value`. It is not a `useMemo` call because the boolean derivation is trivial.

## `submit()` function

```ts
function submit(): void {
  if (!canSend) return
  console.log('Prompt submitted:', value.trim())
  setValue('')
}
```

**Parameters:** None (closure over `value` and `canSend`).

**Side effects:**
1. Logs the trimmed prompt string to `console.log`.
2. Resets `value` to `''`, which clears the textarea via React's controlled input mechanism.

The `if (!canSend) return` guard makes `submit` safe to call from keyboard event handlers without pre-checking the state. The keyboard handler calls `submit()` unconditionally after matching the key.

## Keyboard handling

```ts
onKeyDown={(e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    submit()
  }
}}
```

| Key combination | Behaviour |
|----------------|-----------|
| **Enter** | `e.preventDefault()` suppresses the default textarea newline; `submit()` is called |
| **Shift+Enter** | Not intercepted; browser inserts a newline character into the textarea |
| Any other key | Not intercepted |

`e.preventDefault()` is called before `submit()` to ensure the newline is never inserted even if `submit` throws.

## Rendered structure

```
<div shrink-0 border-t border-border bg-bg px-4 py-3>
  └── <div rounded-lg border border-border focus-within:border-border-strong>
        ├── <textarea rows=2 placeholder aria-label>
        └── <div>  Footer toolbar  (px-2.5 py-2 flex items-center gap-2)
              ├── <button>  Model picker  "✦ Opus 4.7  ˅"
              ├── <span>    Hint text  [hidden sm:inline]
              └── <button>  Send button  (disabled={!canSend})  [ml-auto]
```

## Textarea

```tsx
<textarea
  value={value}
  onChange={(e) => setValue(e.target.value)}
  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() } }}
  rows={2}
  placeholder="Ask an agent or describe a task…"
  aria-label="Prompt input"
  className="block w-full resize-none bg-transparent px-3 py-2.5 text-sm outline-none
             placeholder:text-text-faint"
/>
```

| Attribute | Value | Purpose |
|-----------|-------|---------|
| `value` | `value` state | Controlled input — React owns the value |
| `onChange` | `setValue` | Updates state on every keystroke |
| `rows` | `2` | Initial visible height (2 lines); taller input possible by typing |
| `placeholder` | `"Ask an agent or describe a task…"` | Placeholder text when empty |
| `aria-label` | `"Prompt input"` | Accessible name for screen readers (no visible `<label>` present) |

**Styling classes:**
- `resize-none` — disables the browser's drag-to-resize handle
- `bg-transparent` — inherits the container's surface colour
- `outline-none` — removes the default browser focus outline; the parent container provides focus feedback via `focus-within:border-border-strong`
- `placeholder:text-text-faint` — dims the placeholder text

## Model picker button

```tsx
<button
  type="button"
  className="flex items-center gap-1.5 rounded-md border border-border
             px-2 py-1 text-xs text-text-muted hover:border-border-strong hover:text-text"
>
  <IconSparkle className="h-3.5 w-3.5 text-accent" />
  Opus 4.7
  <IconChevronDown className="h-3.5 w-3.5" />
</button>
```

A button displaying the current model name (`"Opus 4.7"`) with a filled sparkle icon (accent pink) and a down chevron. The button is a visual stub — it has no `onClick` handler and does not open a model-selection dropdown.

`IconSparkle` uses `text-accent` to show the accent pink colour, contrasting with the `text-text-muted` label.

## Keyboard shortcut hint

```tsx
<span className="hidden text-xs text-text-faint sm:inline">
  Enter to send · Shift+Enter for newline
</span>
```

A discovery hint for keyboard users. Hidden on mobile (`hidden`) to conserve horizontal space; visible on ≥ 640px viewports (`sm:inline`).

## Send button

```tsx
<button
  type="button"
  onClick={submit}
  disabled={!canSend}
  aria-label="Send prompt"
  className="ml-auto grid h-7 w-7 place-items-center rounded-md bg-accent
             text-white hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
>
  <IconArrowUp className="h-4 w-4" />
</button>
```

| Attribute | Value | Purpose |
|-----------|-------|---------|
| `type="button"` | static | Prevents form submission |
| `onClick` | `submit` | Triggers submission |
| `disabled` | `!canSend` | Disabled when textarea is empty or whitespace-only |
| `aria-label` | `"Send prompt"` | Accessible name — the button contains only an icon |

**Disabled styling:**
- `disabled:cursor-not-allowed` — shows a "not-allowed" cursor on hover when disabled
- `disabled:opacity-40` — dims the button to 40% opacity, providing a clear visual disabled state

`ml-auto` pushes the send button to the far right of the toolbar row.

## Container focus handling

```tsx
<div className="rounded-lg border border-border bg-surface focus-within:border-border-strong">
```

`focus-within:border-border-strong` upgrades the container border from the neutral colour to a stronger colour whenever any descendant (the `<textarea>`) has focus. This provides a visible focus indicator without needing a JavaScript focus/blur handler, and works for both mouse and keyboard navigation.

## Outer wrapper

```tsx
<div className="shrink-0 border-t border-border bg-bg px-4 py-3">
```

`shrink-0` prevents the bar from being compressed when the parent flex column does not have enough height. `border-t` adds a top separator between the scrollable content area and the prompt bar. `bg-bg` matches the page background.

## Accessibility

| Attribute | Element | Value | Purpose |
|-----------|---------|-------|---------|
| `aria-label` | `<textarea>` | `"Prompt input"` | Accessible name for the textarea |
| `aria-label` | Send `<button>` | `"Send prompt"` | Accessible name for the icon-only button |
| `disabled` | Send `<button>` | `!canSend` | Prevents activation when empty; announced by screen readers |

## Styling notes

| Token / class | Element | Purpose |
|---------------|---------|---------|
| `bg-bg` | Outer wrapper | Page background colour |
| `border-border` | Outer wrapper, container | Neutral border colour |
| `bg-surface` | Container | Slightly elevated surface |
| `focus-within:border-border-strong` | Container | Focus indicator via border upgrade |
| `bg-accent` | Send button | Accent pink background |
| `hover:bg-accent-hover` | Send button | Darker accent on hover |
| `text-white` | Send button | White icon on accent background |
| `text-accent` | `IconSparkle` | Accent colour for model icon |
| `text-text-muted` | Model picker label | Secondary text colour |
| `text-text-faint` | Hint span, placeholder | Tertiary text colour |

## Edge cases and assumptions

- **Whitespace-only input:** `value.trim().length > 0` correctly treats `"   "` (spaces only) as empty, so `canSend` is `false` and the button remains disabled.
- **Very long input:** The `<textarea>` does not have a `maxLength` attribute or character counter. Long prompts will be submitted verbatim.
- **Multi-line input (Shift+Enter):** The textarea allows newlines. `submit()` logs `value.trim()` which preserves internal newlines but strips leading/trailing whitespace.
- **Rapid Enter keystrokes:** Each Enter press calls `submit()` independently. If `setValue('')` has not caused a re-render before the next keydown event, `canSend` will still be `true` from the previous render's closure. In practice React batches state updates synchronously within event handlers so this is not an issue.
- **`console.log` in production:** The submit handler logs to the console even in production builds. If this is undesired, the log call should be guarded by `import.meta.env.DEV` or replaced with a proper handler.
