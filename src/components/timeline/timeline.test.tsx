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

  it('rend un point primaire par défaut et un point grisé pour `past`', () => {
    const { container } = render(
      <Timeline
        items={[
          { id: 'a', at: '2026-10-01 09:12', label: 'done' },
          { id: 'b', at: '2026-10-01 08:40', label: 'past', state: 'past', stateLabel: 'passé' },
        ]}
      />,
    )

    const dots = container.querySelectorAll('[data-state]')
    expect(dots[0]).toHaveClass('bg-primary')
    expect(dots[1]).toHaveClass('bg-muted-foreground')
    expect(dots[1]).not.toHaveClass('bg-primary')
  })

  it('transmet l’état non-visuellement, pas par la couleur seule', () => {
    render(
      <Timeline
        items={[
          { id: 'a', at: '2026-10-01 09:12', label: 'sync health' },
          { id: 'b', at: '2026-10-01 08:40', label: 'sync prs', state: 'past', stateLabel: 'passé' },
        ]}
      />,
    )

    expect(screen.getByText('passé')).toBeInTheDocument()
  })

  it('joint les points d’un rail continu, sans queue au dernier item', () => {
    const { container } = render(<Timeline items={items} />)

    // Un rail entre chaque paire de points consécutifs, et rien après le dernier.
    expect(container.querySelectorAll('[data-rail]')).toHaveLength(items.length - 1)
    expect(container.querySelectorAll('li')[items.length - 1].querySelector('[data-rail]')).toBeNull()
  })
})
