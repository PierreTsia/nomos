import { render, screen } from '@testing-library/react'

import { Freshness } from '@nomos/components/freshness/freshness'

/**
 * L'indicateur de fraîcheur se rend à partir de ses seules props, sans provider d'app :
 * l'âge lui est injecté, déjà formaté.
 */
describe('Freshness', () => {
  it('renders the age, without any application provider', () => {
    render(<Freshness label="il y a 2 heures" />)

    expect(screen.getByText('il y a 2 heures')).toBeInTheDocument()
  })

  it('marks a stale datum differently from a fresh one', () => {
    const { container: fresh } = render(<Freshness label="x" />)
    const { container: stale } = render(<Freshness label="x" stale />)

    expect(fresh.firstElementChild?.className).not.toEqual(stale.firstElementChild?.className)
  })

  it('passes the absolute timestamp as the tooltip', () => {
    render(<Freshness label="il y a 2 heures" title="30/09/2026 17:00 (Paris)" />)

    expect(screen.getByTitle('30/09/2026 17:00 (Paris)')).toBeInTheDocument()
  })

  it('lets the application merge its own classes', () => {
    render(<Freshness label="x" className="mt-1" />)

    expect(screen.getByText('x')).toHaveClass('mt-1')
  })
})
