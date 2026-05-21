# Styling & design tokens

The frontend is styled with **Tailwind CSS v4**, wired through the
`@tailwindcss/vite` plugin in `vite.config.ts`. There is no `tailwind.config.js`
— the theme is defined entirely in CSS using Tailwind v4's `@theme` block in
`src/index.css`.

## Aesthetic

Dark, dense, "Linear-grade". **Snabbit pink (`#f70f79`)** is the single brand
accent; the semantic ok/warn/err colors are reserved for small status
indicators only. The document is forced dark: `index.html` sets
`<html class="dark">` and `<meta name="color-scheme" content="dark">`.

## Design tokens (`src/index.css`)

Tokens are declared as CSS custom properties inside `@theme`, which makes them
available both as Tailwind color utilities (e.g. `bg-surface`, `text-text-muted`)
and as raw `var(--color-…)` values (used by `Sparkline` and the `FeaturedAgent`
gradient).

### Surfaces & borders

| Token                   | Value     | Usage                          |
| ----------------------- | --------- | ------------------------------ |
| `--color-bg`            | `#0a0a0b` | App background                 |
| `--color-surface`       | `#141416` | Cards, panels                  |
| `--color-surface-2`     | `#1c1c1f` | Raised / hover surfaces        |
| `--color-surface-3`     | `#242428` | Active tabs, avatars           |
| `--color-border`        | `#2a2a2e` | Default borders                |
| `--color-border-strong` | `#3a3a40` | Hover / focus borders          |

### Text

| Token                | Value     | Usage                  |
| -------------------- | --------- | ---------------------- |
| `--color-text`       | `#ededef` | Primary text           |
| `--color-text-muted` | `#9a9aa3` | Secondary text         |
| `--color-text-faint` | `#6a6a72` | Tertiary / hints       |

### Accent (Snabbit pink)

| Token                    | Value     | Usage                        |
| ------------------------ | --------- | ---------------------------- |
| `--color-accent`         | `#f70f79` | Brand accent, running status |
| `--color-accent-hover`   | `#ff3d96` | Hover state of accent buttons|
| `--color-accent-subtle`  | `#2a0a1c` | Featured-agent gradient      |

### Semantic status

| Token          | Value     | Usage                    |
| -------------- | --------- | ------------------------ |
| `--color-ok`   | `#3fb950` | Passing / good / idle-ok |
| `--color-warn` | `#d29922` | Needs attention          |
| `--color-err`  | `#f85149` | Failing / bad delta      |

### Fonts

| Token         | Stack                                                            |
| ------------- | --------------------------------------------------------------- |
| `--font-sans` | `"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", …`     |
| `--font-mono` | `"Geist Mono", ui-monospace, "SF Mono", Menlo, Consolas, …`     |

Geist and Geist Mono are loaded from Google Fonts in `index.html`.

## Base layer

The `@layer base` block in `src/index.css`:

- Stretches `html`, `body`, and `#root` to full height (the app uses an
  `h-screen` flex shell).
- Sets the body background, text color, sans font, `14px` base size, `1.5` line
  height, and font smoothing.
- Styles text `::selection` to the accent color.
- Applies thin, unobtrusive scrollbars globally (`scrollbar-width: thin`).

!!! note "Vitest processes CSS"
    `vite.config.ts` sets `test.css: true`, so the stylesheet is processed in the
    jsdom test environment as well.
