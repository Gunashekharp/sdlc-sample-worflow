---
title: Styling
---

The UI uses **Tailwind CSS v4** with a custom set of design tokens. The look is
deliberately dark, dense and "Linear-grade", with a single brand accent.

## Setup

`src/index.css` imports Tailwind and declares the tokens in an `@theme` block:

```css
@import "tailwindcss";

@theme {
  --color-bg: #0a0a0b;
  /* … */
}
```

Tailwind v4 is wired in through the Vite plugin (`@tailwindcss/vite`) in
`vite.config.ts`. `index.html` sets `class="dark"` and `color-scheme: dark` on
the document, and loads the **Geist** / **Geist Mono** web fonts from Google
Fonts (with `preconnect` hints).

## Color tokens

| Token                    | Value     | Usage                                    |
| ------------------------ | --------- | ---------------------------------------- |
| `--color-bg`             | `#0a0a0b` | Page background                          |
| `--color-surface`        | `#141416` | Card / panel surfaces                    |
| `--color-surface-2`      | `#1c1c1f` | Raised surfaces, hover states            |
| `--color-surface-3`      | `#242428` | Active tab / avatar backgrounds          |
| `--color-border`         | `#2a2a2e` | Default borders / dividers               |
| `--color-border-strong`  | `#3a3a40` | Hover / focus borders                    |
| `--color-text`           | `#ededef` | Primary text                             |
| `--color-text-muted`     | `#9a9aa3` | Secondary text                           |
| `--color-text-faint`     | `#6a6a72` | Tertiary text, labels                    |
| `--color-accent`         | `#f70f79` | Snabbit pink — the single brand accent   |
| `--color-accent-hover`   | `#ff3d96` | Accent hover                             |
| `--color-accent-subtle`  | `#2a0a1c` | Accent gradient wash                     |
| `--color-ok`             | `#3fb950` | Success status / positive deltas         |
| `--color-warn`           | `#d29922` | "Needs attention" status                 |
| `--color-err`            | `#f85149` | Failure status / negative deltas         |

The semantic `ok` / `warn` / `err` colors are reserved for small status
indicators (status dots, deltas, sparklines), not for large surfaces. The pink
accent is the only brand color.

## Fonts

| Token         | Stack (head)         | Usage                          |
| ------------- | -------------------- | ------------------------------ |
| `--font-sans` | Geist                | Body and UI text               |
| `--font-mono` | Geist Mono           | Numbers, branch chips, stats   |

## Base layer

The `@layer base` block sets full-height `html/body/#root`, a 14px base font,
antialiased rendering, a pink `::selection` color, and thin scrollbars to match
the dense aesthetic.
