import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  DataTableToolbar,
  type DataTableToolbarProps,
} from '@nomos/components/data-table-toolbar/data-table-toolbar'

function renderToolbar(over: Partial<DataTableToolbarProps> = {}) {
  const props: DataTableToolbarProps = {
    globalFilter: '',
    onGlobalFilterChange: () => {},
    placeholder: 'rechercher',
    facets: [],
    shownLabel: '2 / 5 issues',
    canReset: true,
    resetLabel: 'Réinitialiser',
    clearFacetLabel: 'Effacer',
    onReset: () => {},
    ...over,
  }
  return render(<DataTableToolbar {...props} />)
}

/** La barre se rend seule, avec ses libellés injectés et sans provider d'app. */
describe('DataTableToolbar', () => {
  it('renders the search, the shown count and the reset, without any application provider', () => {
    renderToolbar()

    expect(screen.getByPlaceholderText('rechercher')).toBeInTheDocument()
    expect(screen.getByText('2 / 5 issues')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Réinitialiser/ })).toBeInTheDocument()
  })

  it('hides the reset when there is nothing to reset', () => {
    renderToolbar({ canReset: false })

    expect(screen.queryByRole('button', { name: /Réinitialiser/ })).not.toBeInTheDocument()
  })

  it('fires onReset', async () => {
    const user = userEvent.setup()
    const onReset = vi.fn()
    renderToolbar({ onReset })

    await user.click(screen.getByRole('button', { name: /Réinitialiser/ }))

    expect(onReset).toHaveBeenCalled()
  })
})
