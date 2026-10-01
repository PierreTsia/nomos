import { render, screen } from '@testing-library/react'

import { EmptyState } from '@nomos/components/empty-state/empty-state'

/** L'état vide se rend à partir de ses seules props, sans provider d'app. */
describe('EmptyState', () => {
  it('renders the title, description, detail and action, without any provider', () => {
    render(
      <EmptyState
        title="aucune donnée"
        description="le lot est vide"
        detail="flux : 404"
        action={<button type="button">réessayer</button>}
      />,
    )

    expect(screen.getByText('aucune donnée')).toBeInTheDocument()
    expect(screen.getByText('le lot est vide')).toBeInTheDocument()
    expect(screen.getByText('flux : 404')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'réessayer' })).toBeInTheDocument()
  })

  it('shows only the title when there is nothing else', () => {
    render(<EmptyState title="aucune donnée" />)

    expect(screen.getByText('aucune donnée')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(document.querySelector('pre')).toBeNull()
  })

  it('lets the application merge its own classes', () => {
    render(<EmptyState title="aucune donnée" className="max-w-sm" />)

    expect(screen.getByText('aucune donnée').closest('.max-w-sm')).not.toBeNull()
  })
})
