---
title: Styling
description: Tailwind CSS v4 with Snabbit design tokens.
---

**File:** `src/index.css`

The UI uses **Tailwind CSS v4** with a custom `@theme` block that declares all
design tokens. The look is deliberately dark, dense and "Linear-grade", with a
single brand accent (Snabbit pink).

## Setup

`src/index.css` is the sole CSS entry point:

```css
@import "tailwindcss";

@theme { /* tokens */ }

@layer base { /* global resets */ }
```

Tailwind v4 is integrated via the `@tailwindcss/vite` plugin in `vite.config.ts`
(no separate PostCSS step). `index.html` sets `class="dark"` and
`color-scheme: dark` on `<html>` and loads the Geist / Geist Mono fonts from
Google Fonts with `preconnect` hints.

## Color tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#0a0a0b` | Page background |
| `--color-surface` | `#141416` | Card / panel surfaces |
| `--color-surface-2` | `#1c1c1f` | Raised surfaces, hover states |
| `--color-surface-3` | `#242428` | Active tab, avatar backgrounds |
| `--color-border` | `#2a2a2e` | Default borders and dividers |
| `--color-border-strong` | `#3a3a40` | Hover / focus borders |
| `--color-text` | `#ededef` | Primary text |
| `--color-text-muted` | `#9a9aa3` | Secondary text |
| `--color-text-faint` | `#6a6a72` | Tertiary text, labels |
| `--color-accent` | `#f70f79` | **Snabbit pink** — the single brand accent |
| `--color-accent-hover` | `#ff3d96` | Accent hover state |
| `--color-accent-subtle` | `#2a0a1c` | Accent gradient wash (FeaturedAgent) |
| `--color-ok` | `#3fb950` | Success / positive delta |
| `--color-warn` | `#d29922` | "Needs attention" status |
| `--color-err` | `#f85149` | Failure / negative delta |

### Color semantics

The semantic `ok` / `warn` / `err` colors are reserved for **small status
indicators only** (status dots, delta text, sparkline lines). They are not used
for large surfaces.

`--color-accent` (`#f70f79`) is the only brand color. It appears as:
- Button backgrounds (FeaturedAgent, PromptBar send)
- Active nav icon tint (Sidebar)
- Ring on selected AgentCard
- Running StatusDot (pulsing)
- Selection highlight (`::selection`)
- Accent gradient (FeaturedAgent)

## Typography tokens

| Token | Stack (primary) | Usage |
|-------|----------------|-------|
| `--font-sans` | Geist | Body and UI text |
| `--font-mono` | Geist Mono | Numbers, stats, branch chips, keyboard hints |

## Base layer

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
    -moz-osx-font-smoothing: grayscale;
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

- `height: 100%` on `html/body/#root` allows `h-screen` in `App.tsx` to work.
- 14px base font — dense, matching Linear / Notion aesthetics.
- `antialiased` rendering keeps text crisp on high-DPI screens.
- Pink `::selection` reinforces the brand accent on text selection.
- `scrollbar-width: thin` and `scrollbar-color` produce thin, unobtrusive
  scrollbars that match the dark palette without custom scrollbar CSS.
