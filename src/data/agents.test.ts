import { describe, it, expect } from 'vitest'
import { AGENTS, AGENT_CATEGORIES, FEATURED_AGENT_ID } from './agents'

describe('agent catalogue', () => {
  it('has at least one agent', () => {
    expect(AGENTS.length).toBeGreaterThan(0)
  })

  it('gives every agent a unique id', () => {
    const ids = AGENTS.map((a) => a.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('includes the featured agent', () => {
    expect(AGENTS.some((a) => a.id === FEATURED_AGENT_ID)).toBe(true)
  })

  it('only uses known categories', () => {
    for (const agent of AGENTS) {
      expect(AGENT_CATEGORIES).toContain(agent.category)
    }
  })

  it('keeps success rates between 0 and 100', () => {
    for (const agent of AGENTS) {
      expect(agent.successRate).toBeGreaterThanOrEqual(0)
      expect(agent.successRate).toBeLessThanOrEqual(100)
    }
  })

  it('gives every agent a non-empty name and description', () => {
    for (const agent of AGENTS) {
      expect(agent.name.trim().length).toBeGreaterThan(0)
      expect(agent.description.trim().length).toBeGreaterThan(0)
    }
  })
})
