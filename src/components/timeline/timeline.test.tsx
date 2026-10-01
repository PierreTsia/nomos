import { render, screen } from '@testing-library/react'

import { Timeline, type TimelineItem } from '@nomos/components/timeline/timeline'

const items: TimelineItem[] = [
  { id: 'a', at: '2026-10-01 09:12', label: 'sync health', detail: '0 gap' },
  { id: 'b', at: '2026-10-01 08:40', label: 'sync prs' },
]

describe('Timeline', () => {
  it('rend une liste ordonnée d’événements, labellisée', () => {
    render(<Timeline items={items} ariaLabel="Activité" />)

    expect(screen.getByRole('list', { name: 'Activité' })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByText('sync health')).toBeInTheDocument()
    expect(screen.getByText('0 gap')).toBeInTheDocument()
    expect(screen.getByText('2026-10-01 08:40')).toBeInTheDocument()
  })

  it('n’affiche le détail que lorsqu’il existe', () => {
    render(<Timeline items={items} />)

    expect(screen.queryByText('3 PR routées')).toBeNull()
  })
})
