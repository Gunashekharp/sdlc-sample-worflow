import { IconChevronDown, IconSearch } from './icons'

export default function TopBar() {
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
}
