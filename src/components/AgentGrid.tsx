import { useMemo, useState } from 'react'
import type { Agent } from '../data/agents'
import { AGENT_CATEGORIES } from '../data/agents'
import { filterAgents } from '../lib/filterAgents'
import { sortAgents, SORT_LABELS } from '../lib/sortAgents'
import type { SortKey } from '../lib/sortAgents'
import { usePersistentState } from '../lib/usePersistentState'
import AgentCard from './AgentCard'
import { IconSearch } from './icons'

const TABS: string[] = ['All', 'Popular', ...AGENT_CATEGORIES]

export default function AgentGrid({ agents }: { agents: Agent[] }) {
  const [category, setCategory] = usePersistentState<string>(
    'snabbit.agentGrid.category',
    'All',
  )
  const [sort, setSort] = usePersistentState<SortKey>(
    'snabbit.agentGrid.sort',
    'runs',
  )
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const visible = useMemo(
    () => sortAgents(filterAgents(agents, { query, category }), sort),
    [agents, query, category, sort],
  )

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <h2 className="text-sm font-semibold">
          Agents <span className="text-text-faint">{visible.length}</span>
        </h2>

        <div className="flex flex-wrap gap-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setCategory(tab)}
              aria-pressed={category === tab}
              className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                category === tab
                  ? 'bg-surface-3 text-text'
                  : 'text-text-muted hover:bg-surface hover:text-text'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          aria-label="Sort agents"
          className="ml-auto rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-text-muted outline-none hover:border-border-strong focus:border-border-strong"
        >
          {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
            <option key={key} value={key}>
              {SORT_LABELS[key]}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2 rounded-md border border-border bg-surface px-2.5 py-1.5 focus-within:border-border-strong">
          <IconSearch className="text-text-faint" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter agents…"
            aria-label="Filter agents"
            className="w-40 bg-transparent text-sm outline-none placeholder:text-text-faint"
          />
        </label>
      </div>

      {visible.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              selected={agent.id === selectedId}
              onSelect={setSelectedId}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border px-4 py-12 text-center text-sm text-text-faint">
          No agents match {query ? `“${query}”` : 'this filter'}.
        </div>
      )}
    </section>
  )
}
