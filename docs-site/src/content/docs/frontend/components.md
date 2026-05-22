---
title: Components
---

All UI components live in `src/components/`. They are presentational React
function components; shared logic is delegated to `src/lib/`.

## Layout chrome

### Sidebar (`Sidebar.tsx`)

The left navigation column (fixed `w-60`). Contains:

- A workspace switcher button ("Snabbit · Agent Console").
- A **New session** button with a `⌘N` hint.
- A primary nav list — Dashboard (active), Sessions, Agents, Runs,
  Integrations, Settings — each backed by an icon from `icons.tsx`.
- A scrollable **Recent sessions** list (static labels).
- A user footer (`guna`, `int-gunashekhar.p@snabbit.com`).

The nav and recent-session entries are static arrays in the component; clicks
are not yet wired to navigation.

### TopBar (`TopBar.tsx`)

The header bar (`h-14`). Shows a breadcrumb ("Agent Console / Overview"), a
search button with a `⌘K` hint, and an environment switcher button labelled
"Production". The search and switcher are visual only.

### PromptBar (`PromptBar.tsx`)

The bottom prompt input. A controlled `<textarea>` with local state:

- **Enter** submits; **Shift+Enter** inserts a newline.
- Submit is disabled until the trimmed value is non-empty (`canSend`).
- A model-picker button ("Opus 4.7") and a send button.

```tsx
function submit() {
  if (!canSend) return
  // Backend wiring is tracked in BACKLOG.md; for now this clears the input.
  console.log('Prompt submitted:', value.trim())
  setValue('')
}
```

:::note
Submitting currently logs to the console and clears the input — there is no
backend call yet.
:::

## Dashboard panels

### KpiStrip (`KpiStrip.tsx`)

Renders the four headline metrics from `src/data/kpis.ts` in a responsive grid
(1 / 2 / 4 columns). Each `KpiCard` shows the label, value, a delta with an
up/down trend icon, a [Sparkline](#sparkline-sparklinetsx), and a hint.

The delta icon is chosen from the delta string's sign; the delta **color**
comes from `kpi.positive` — green (`text-ok`) when positive, red (`text-err`)
otherwise. This lets a falling metric (e.g. mean time to merge) still read as
"good".

### FeaturedAgent (`FeaturedAgent.tsx`)

A highlighted card for one `Agent`, passed in as a prop. Shows a "Featured
agent" eyebrow, the name with a status pill (`StatusDot` + label), the
description, a stat row (runs/7d, success %, avg run, last run) and a **Run
agent** button. Has a subtle accent gradient overlay.

### PipelinesPanel (`PipelinesPanel.tsx`)

The only panel wired to the backend. Calls `fetchPipelines` via the `useFetch`
hook and renders one of four states:

| State                    | Rendered output                                          |
| ------------------------ | -------------------------------------------------------- |
| `loading`                | "Loading pipelines…"                                     |
| `error`                  | "Could not reach the API (…). Is the server running on port 3001?" |
| empty (`pipelines == 0`) | "No recent pipeline runs."                               |
| populated                | A list of `PipelineRow`s                                 |

The header shows a summary line (`{passRate}% pass rate · {running} running ·
{provider}`) and a **Refresh** button that calls the hook's `reload()`.

Each `PipelineRow` shows a status dot (passing → green, failing → red, running
→ accent), the pipeline name, branch chip, formatted duration, and who
triggered it. `formatDuration` converts seconds into `Xm Ys` (or `Ys` under a
minute).

### AgentGrid (`AgentGrid.tsx`)

The filterable, sortable catalogue. Receives the non-featured agents as a prop
and manages:

- `category` and `sort` — persisted to `localStorage` via
  [`usePersistentState`](/sdlc-sample-worflow/frontend/lib/#usepersistentstate)
  under keys `snabbit.agentGrid.category` and `snabbit.agentGrid.sort`.
- `query` — transient search text (`useState`).
- `selectedId` — the currently selected card.

The visible list is derived with `useMemo`:

```ts
const visible = useMemo(
  () => sortAgents(filterAgents(agents, { query, category }), sort),
  [agents, query, category, sort],
)
```

Tabs are `['All', 'Popular', ...AGENT_CATEGORIES]`. A `<select>` exposes the
sort keys. When nothing matches, a dashed empty state names the active query or
filter.

### AgentCard (`AgentCard.tsx`)

A single agent tile used inside the grid. A `<button>` with `aria-pressed`
reflecting selection; selected cards get an accent border + ring. Shows a
`StatusDot`, name, category chip, two-line description, and a footer with
runs/wk, success %, and last-run time. Calls `onSelect(agent.id)` on click.

## Primitives

### StatusDot (`StatusDot.tsx`)

A small colored status indicator driven by `AgentStatus`. The `running` state
renders a pulsing accent (pink) dot using a ping animation; `attention` is
amber (`bg-warn`) and `idle` is faint grey. Exports `STATUS_LABEL`, a map from
status to human label (`Running` / `Idle` / `Needs attention`).

### Sparkline (`Sparkline.tsx`)

A tiny, axis-free trend line for KPI cards. Takes `points` (oldest first) and a
`positive` flag. Returns `null` for fewer than two points. Normalizes the
series into a `100×28` viewBox `<polyline>`, stroked green (`--color-ok`) when
positive or red (`--color-err`) otherwise, with a non-scaling stroke so the
line stays crisp when stretched.

### icons.tsx

A dependency-free set of 16px, stroke-based SVG icons sharing a common `Svg`
wrapper (`stroke="currentColor"`, `strokeWidth="1.5"`). Exports: `IconDashboard`,
`IconSessions`, `IconAgents`, `IconRuns`, `IconIntegrations`, `IconSettings`,
`IconSearch`, `IconPlus`, `IconArrowUp`, `IconSparkle`, `IconChevronDown`,
`IconTrendUp`, `IconTrendDown`.
