---
title: Frontend overview
---

The frontend is a single-page dashboard built with **Vite + React 19 +
TypeScript + Tailwind CSS v4**. It lives at the repository root.

## Entry points

- **`index.html`** — the HTML shell. Sets `class="dark"` and a `dark`
  `color-scheme`, an inline pink SVG favicon, and loads the Geist / Geist Mono
  web fonts from Google Fonts (with `preconnect` hints). Mounts the app into
  `#root`.
- **`src/main.tsx`** — creates the React root and renders `<App />` inside
  `<StrictMode>`.
- **`src/index.css`** — imports Tailwind and declares the design tokens. See
  [Styling](/sdlc-sample-worflow/frontend/styling/).

## Layout

`src/App.tsx` composes the whole dashboard:

```tsx
<div className="flex h-screen overflow-hidden">
  <Sidebar />
  <div className="flex min-w-0 flex-1 flex-col">
    <TopBar />
    <main className="flex-1 overflow-y-auto">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-5">
        <KpiStrip />
        <FeaturedAgent agent={featured} />
        <PipelinesPanel />
        <AgentGrid agents={rest} />
      </div>
    </main>
    <PromptBar />
  </div>
</div>
```

A fixed-width `Sidebar` sits to the left. The right column is a flex stack: a
`TopBar` header, a scrollable `main` region, and a `PromptBar` pinned to the
bottom.

`App` picks the featured agent from the local catalogue:

```ts
const featured = AGENTS.find((a) => a.id === FEATURED_AGENT_ID) ?? AGENTS[0]
const rest = AGENTS.filter((a) => a.id !== featured.id)
```

The featured agent (PR Reviewer) is rendered on its own card; the remaining
agents are passed to `AgentGrid`.

## Source structure

| Path             | Contents                                              |
| ---------------- | ----------------------------------------------------- |
| `src/components/` | UI components and their tests                         |
| `src/lib/`        | Pure logic, the API client and React hooks            |
| `src/data/`       | Local seed data and the `Agent` / `Kpi` types         |
| `src/test/`       | Vitest setup (`setup.ts`)                             |

## Build tooling

`vite.config.ts` registers the React and Tailwind plugins and configures
Vitest:

```ts
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})
```

Tests run in a `jsdom` environment with globals enabled. See
[Testing](/sdlc-sample-worflow/testing/).

## See also

- [Components](/sdlc-sample-worflow/frontend/components/)
- [Library: hooks & logic](/sdlc-sample-worflow/frontend/lib/)
- [Data & types](/sdlc-sample-worflow/frontend/data/)
- [Styling](/sdlc-sample-worflow/frontend/styling/)
