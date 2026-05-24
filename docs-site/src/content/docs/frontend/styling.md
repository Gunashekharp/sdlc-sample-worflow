---
title: Styling — design tokens
---

**File:** `src/index.css`

The application uses **Tailwind CSS v4** with a custom `@theme` block that declares all design tokens as CSS custom properties. The visual style is intentionally dark, dense, and "Linear-grade", with a single brand accent — Snabbit pink.

## Setup — Tailwind CSS v4

```css
@import "tailwindcss";

@theme {
  /* tokens */
}

@layer base {
  /* global resets */
}
```

### `@import "tailwindcss"`

In Tailwind CSS v4, importing `"tailwindcss"` replaces the v3 `@tailwind base`, `@tailwind components`, and `@tailwind utilities` directives. It injects the full utility class set and processes the `@theme` block below it.

The import is processed by the `@tailwindcss/vite` plugin declared in `vite.config.ts`. No separate `postcss.config.js` is required — the Vite plugin hooks Tailwind's CSS engine directly into Vite's transform pipeline.

### `@theme` block (Tailwind CSS v4)

The `@theme` block is a Tailwind v4 construct that replaces the `theme.extend` section of `tailwind.config.js`. Every custom property declared inside `@theme` is:

1. Emitted as a CSS variable on `:root` (e.g. `--color-accent: #f70f79`).
2. Registered as a Tailwind utility value, so you can write `bg-accent`, `text-accent`, `border-accent`, etc.

The mapping follows the Tailwind v4 naming convention: `--color-<name>` → `bg-<name>`, `text-<name>`, `border-<name>`, `ring-<name>`, and so on. `--font-<name>` → `font-<name>`.

## Color tokens

All color tokens in the application:

| CSS variable | Value | Role |
|---|---|---|
| `--color-bg` | `#0a0a0b` | Page background — the outermost surface |
| `--color-surface` | `#141416` | Card and panel surfaces, one step above the background |
| `--color-surface-2` | `#1c1c1f` | Raised surfaces; also used for hover states on interactive cards |
| `--color-surface-3` | `#242428` | Active tab indicator background; avatar backgrounds |
| `--color-border` | `#2a2a2e` | Default borders and horizontal dividers |
| `--color-border-strong` | `#3a3a40` | Hover and focus-ring borders; thin scrollbar thumb color |
| `--color-text` | `#ededef` | Primary text — headings, labels, values |
| `--color-text-muted` | `#9a9aa3` | Secondary text — descriptions, sub-labels |
| `--color-text-faint` | `#6a6a72` | Tertiary text — timestamps, hints, disabled labels |
| `--color-accent` | `#f70f79` | **Snabbit pink** — the single brand accent color |
| `--color-accent-hover` | `#ff3d96` | Lightened accent for hover states on accent-colored elements |
| `--color-accent-subtle` | `#2a0a1c` | Very dark pink wash; used as the gradient background in `FeaturedAgent` |
| `--color-ok` | `#3fb950` | Success / positive delta — green |
| `--color-warn` | `#d29922` | "Needs attention" agent status — amber |
| `--color-err` | `#f85149` | Failure / negative delta / error state — red |

### The "Snabbit pink" accent — `#f70f79`

`--color-accent` is the only brand color in the palette. It is used sparingly but consistently:

- Button backgrounds (`FeaturedAgent` "Run agent" button, `PromptBar` send button)
- Active navigation icon tint in `Sidebar`
- Selected-agent ring on `AgentCard`
- `'running'` status `StatusDot` (the pulsing animation uses the accent color)
- Text selection highlight (`::selection`)
- Gradient wash in `FeaturedAgent` (`--color-accent-subtle` as the start color)

The `--color-accent-hover` (`#ff3d96`) is a slightly lighter, more saturated version used on `:hover` to provide tactile feedback without jarring contrast.

### Semantic status colors

`--color-ok`, `--color-warn`, and `--color-err` are reserved for **small status indicators only**. They must not be used for large surfaces such as card backgrounds or panel fills. Their usage:

| Color | Token | Used for |
|---|---|---|
| Green | `--color-ok` | Positive KPI delta text and sparkline; `'running'` pulse ring (combined with accent) |
| Amber | `--color-warn` | `'attention'` `StatusDot`; negative but cautionary states |
| Red | `--color-err` | `'failing'` pipeline row indicator; negative KPI delta text |

## Font tokens

| CSS variable | Primary font | Fallback stack | Usage |
|---|---|---|---|
| `--font-sans` | Geist | `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` | All body and UI text |
| `--font-mono` | Geist Mono | `ui-monospace, "SF Mono", Menlo, Consolas, monospace` | Numbers, stats, branch name chips, keyboard shortcut hints |

Geist and Geist Mono are loaded from Google Fonts via `<link rel="preconnect">` in `index.html`. The fonts are declared before the body reset so they are available from the first paint.

## `@layer base` rules

```css
@layer base {
  html, body, #root { height: 100%; }

  body {
    margin: 0;
    background-color: var(--color-bg);
    color: var(--color-text);
    font-family: var(--font-sans);
    font-size: 14px;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  ::selection {
    background: var(--color-accent);
    color: #ffffff;
  }

  * {
    scrollbar-width: thin;
    scrollbar-color: var(--color-border-strong) transparent;
  }
}
```

### `height: 100%` on `html`, `body`, `#root`

The full-height chain is required for `h-screen` in `App.tsx` to work. `h-screen` resolves to `height: 100vh`, but the `#root` div and its ancestors must also be `height: 100%` (or a fixed height) for the flex layout inside `App` — particularly `flex-1 overflow-y-auto` on `<main>` — to function correctly. Without these rules, `<main>` has no height to fill and the scroll region collapses.

### Body reset

- `margin: 0` — removes the browser default 8px body margin.
- `background-color: var(--color-bg)` — sets the page background to the darkest surface token so any flash before React hydrates is invisible.
- `color: var(--color-text)` — sets the base text color; all components inherit from this.
- `font-family: var(--font-sans)` — applies Geist as the default font.
- `font-size: 14px` — establishes a 14 px base. This is deliberately smaller than the browser default (16 px) to achieve the dense, information-rich aesthetic used by tools like Linear and Notion.
- `line-height: 1.5` — comfortable line spacing for 14 px text.
- `-webkit-font-smoothing: antialiased` — subpixel font smoothing on macOS and iOS; keeps text crisp on high-DPI screens.

### Selection highlight

```css
::selection {
  background: var(--color-accent);
  color: #ffffff;
}
```

Text selected with the cursor shows a Snabbit pink (`#f70f79`) background with white text. This reinforces the brand accent at a micro-interaction level.

### Thin scrollbars

```css
* {
  scrollbar-width: thin;
  scrollbar-color: var(--color-border-strong) transparent;
}
```

- `scrollbar-width: thin` — Firefox: narrow scrollbar (no custom track width on Chrome/Safari without `::-webkit-scrollbar`).
- `scrollbar-color: var(--color-border-strong) transparent` — Firefox: the thumb uses `--color-border-strong` (`#3a3a40`); the track is transparent.

The result is unobtrusive, dark-themed scrollbars in both Firefox and Chromium-based browsers without requiring custom `::-webkit-scrollbar` rules.

## How tokens map to Tailwind class names

Tailwind CSS v4 derives utility class names directly from CSS variable names declared in `@theme`. The pattern is:

```
--color-<name>  →  bg-<name>  /  text-<name>  /  border-<name>  /  ring-<name>
--font-<name>   →  font-<name>
```

Examples:

| CSS variable | Tailwind utility classes |
|---|---|
| `--color-bg` | `bg-bg`, `text-bg`, `border-bg` |
| `--color-accent` | `bg-accent`, `text-accent`, `border-accent`, `ring-accent` |
| `--color-surface-2` | `bg-surface-2`, `border-surface-2` |
| `--color-ok` | `bg-ok`, `text-ok` |
| `--font-sans` | `font-sans` |
| `--font-mono` | `font-mono` |

:::tip
Because the tokens live in `@theme` (not in a `tailwind.config.js`), IntelliSense for `bg-accent` etc. works automatically in editors that support the Tailwind CSS IntelliSense extension with v4 support enabled.
:::
