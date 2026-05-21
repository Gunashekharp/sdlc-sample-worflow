import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AgentGrid from './AgentGrid'
import { AGENTS } from '../data/agents'

describe('<AgentGrid />', () => {
  it('renders a card for every agent', () => {
    render(<AgentGrid agents={AGENTS} />)
    for (const agent of AGENTS) {
      expect(screen.getByText(agent.name)).toBeInTheDocument()
    }
  })

  it('filters agents by the search query', async () => {
    const user = userEvent.setup()
    render(<AgentGrid agents={AGENTS} />)
    await user.type(screen.getByLabelText('Filter agents'), 'deploy')
    expect(screen.getByText('Deploy Bot')).toBeInTheDocument()
    expect(screen.queryByText('PR Reviewer')).not.toBeInTheDocument()
  })

  it('shows an empty state when nothing matches', async () => {
    const user = userEvent.setup()
    render(<AgentGrid agents={AGENTS} />)
    await user.type(screen.getByLabelText('Filter agents'), 'zzznotanagent')
    expect(screen.getByText(/no agents match/i)).toBeInTheDocument()
  })

  it('filters agents by category tab', async () => {
    const user = userEvent.setup()
    render(<AgentGrid agents={AGENTS} />)
    await user.click(screen.getByRole('button', { name: 'Deploy' }))
    expect(screen.getByText('Deploy Bot')).toBeInTheDocument()
    expect(screen.queryByText('RCA Analyst')).not.toBeInTheDocument()
  })

  it('marks a card as selected when clicked', async () => {
    const user = userEvent.setup()
    render(<AgentGrid agents={AGENTS} />)
    const card = screen.getByText('Deploy Bot').closest('button')
    expect(card).not.toBeNull()
    expect(card).toHaveAttribute('aria-pressed', 'false')
    await user.click(card as HTMLButtonElement)
    expect(card).toHaveAttribute('aria-pressed', 'true')
  })

  it('keeps every agent visible after changing the sort', async () => {
    const user = userEvent.setup()
    render(<AgentGrid agents={AGENTS} />)
    await user.selectOptions(screen.getByLabelText('Sort agents'), 'name')
    for (const agent of AGENTS) {
      expect(screen.getByText(agent.name)).toBeInTheDocument()
    }
  })

  it('remembers the selected category across remounts', async () => {
    const user = userEvent.setup()
    const first = render(<AgentGrid agents={AGENTS} />)
    await user.click(screen.getByRole('button', { name: 'Deploy' }))
    first.unmount()

    render(<AgentGrid agents={AGENTS} />)
    expect(screen.getByRole('button', { name: 'Deploy' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })
})
