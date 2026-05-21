import { describe, it, expect } from 'vitest'
import { filterAgents } from './filterAgents'
import type { Agent } from '../data/agents'

function make(over: Partial<Agent>): Agent {
  return {
    id: 'x',
    name: 'X',
    category: 'Quality',
    description: '',
    status: 'idle',
    runsPerWeek: 0,
    successRate: 100,
    avgDuration: '1m',
    lastRun: 'now',
    lastRunMinutes: 0,
    popular: false,
    ...over,
  }
}

const agents: Agent[] = [
  make({
    id: 'a',
    name: 'PR Reviewer',
    category: 'Review',
    description: 'reviews pull requests',
    popular: true,
  }),
  make({
    id: 'b',
    name: 'Deploy Bot',
    category: 'Deploy',
    description: 'ships code to production',
    popular: true,
  }),
  make({
    id: 'c',
    name: 'RCA Analyst',
    category: 'Reliability',
    description: 'drafts a root cause analysis',
    popular: false,
  }),
]

describe('filterAgents', () => {
  it('returns every agent for the All category and empty query', () => {
    expect(filterAgents(agents, { category: 'All', query: '' })).toHaveLength(3)
  })

  it('filters by an exact category', () => {
    const result = filterAgents(agents, { category: 'Review', query: '' })
    expect(result.map((a) => a.id)).toEqual(['a'])
  })

  it('filters by the Popular pseudo-category', () => {
    const result = filterAgents(agents, { category: 'Popular', query: '' })
    expect(result.map((a) => a.id)).toEqual(['a', 'b'])
  })

  it('matches the query against the agent name', () => {
    const result = filterAgents(agents, { category: 'All', query: 'deploy' })
    expect(result.map((a) => a.id)).toEqual(['b'])
  })

  it('matches the query against the description', () => {
    const result = filterAgents(agents, { category: 'All', query: 'root cause' })
    expect(result.map((a) => a.id)).toEqual(['c'])
  })

  it('is case-insensitive', () => {
    const result = filterAgents(agents, { category: 'All', query: 'REVIEWER' })
    expect(result.map((a) => a.id)).toEqual(['a'])
  })

  it('ignores surrounding whitespace in the query', () => {
    const result = filterAgents(agents, { category: 'All', query: '  bot  ' })
    expect(result.map((a) => a.id)).toEqual(['b'])
  })

  it('applies category and query together', () => {
    const result = filterAgents(agents, { category: 'Popular', query: 'reviewer' })
    expect(result.map((a) => a.id)).toEqual(['a'])
  })

  it('returns an empty array when nothing matches', () => {
    expect(filterAgents(agents, { category: 'All', query: 'nonexistent' })).toEqual([])
  })

  it('does not mutate the input array', () => {
    const copy = [...agents]
    filterAgents(agents, { category: 'Review', query: 'pr' })
    expect(agents).toEqual(copy)
  })
})
