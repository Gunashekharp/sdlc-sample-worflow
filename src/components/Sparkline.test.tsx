import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Sparkline from './Sparkline'

describe('<Sparkline />', () => {
  it('renders a polyline with one coordinate per value', () => {
    const { container } = render(<Sparkline points={[1, 2, 3, 4]} positive />)
    const polyline = container.querySelector('polyline')
    expect(polyline).not.toBeNull()
    const coords = polyline!.getAttribute('points')!.trim().split(/\s+/)
    expect(coords).toHaveLength(4)
  })

  it('renders nothing when given fewer than two points', () => {
    const { container } = render(<Sparkline points={[1]} positive />)
    expect(container.querySelector('polyline')).toBeNull()
  })

  it('uses the error color when not positive', () => {
    const { container } = render(<Sparkline points={[3, 2, 1]} positive={false} />)
    expect(container.querySelector('polyline')!.getAttribute('stroke')).toContain(
      'color-err',
    )
  })
})
