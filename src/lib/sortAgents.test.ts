import { describe, it, expect } from 'vitest'
import { sortAgents } from './sortAgents'
import type { Agent } from '../data/agents'

function make(over: Partial<Agent>): Agent {
  return {
    id: 'x',
    name: 'X',
    category: 'Quality',
    description: '',
    status: 'idle',
    runsPerWeek: 0,
    successRate: 0,
    avgDuration: '1m',
    lastRun: 'now',
    lastRunMinutes: 0,
    popular: false,
    ...over,
  }
}

const agents: Agent[] = [
  make({ id: 'a', name: 'Charlie', runsPerWeek: 50, successRate: 90, lastRunMinutes: 30 }),
  make({ id: 'b', name: 'Alpha', runsPerWeek: 300, successRate: 80, lastRunMinutes: 5 }),
  make({ id: 'c', name: 'Bravo', runsPerWeek: 100, successRate: 99, lastRunMinutes: 120 }),
]

describe('sortAgents', () => {
  it('sorts by runs, descending', () => {
    expect(sortAgents(agents, 'runs').map((a) => a.id)).toEqual(['b', 'c', 'a'])
  })

  it('sorts by success rate, descending', () => {
    expect(sortAgents(agents, 'success').map((a) => a.id)).toEqual(['c', 'a', 'b'])
  })

  it('sorts by name, ascending', () => {
    expect(sortAgents(agents, 'name').map((a) => a.id)).toEqual(['b', 'c', 'a'])
  })

  it('sorts by most recent run first', () => {
    expect(sortAgents(agents, 'recent').map((a) => a.id)).toEqual(['b', 'a', 'c'])
  })

  it('does not mutate the input array', () => {
    const order = agents.map((a) => a.id)
    sortAgents(agents, 'runs')
    expect(agents.map((a) => a.id)).toEqual(order)
  })
})
