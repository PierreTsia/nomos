import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { FacetFilter } from '@nomos/components/facet-filter/facet-filter'

const options = [
  { value: 'workout-app', label: 'workout-app', count: 3 },
  { value: 'mijote', label: 'mijote', count: 1 },
]

/** Le filtre se rend seul, sans provider d'app, et ses libellés sont injectés. */
describe('FacetFilter', () => {
  it('renders its label and the selected count, without any application provider', () => {
    render(
      <FacetFilter
        label="dépôt"
        options={options}
        selected={['mijote']}
        onChange={() => {}}
        clearLabel="Effacer"
      />,
    )

    expect(screen.getByRole('button', { name: /dépôt/ })).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('reports the new selection when an option is toggled', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <FacetFilter
        label="dépôt"
        options={options}
        selected={[]}
        onChange={onChange}
        clearLabel="Effacer"
      />,
    )

    await user.click(screen.getByRole('button', { name: /dépôt/ }))
    await user.click(await screen.findByText('mijote'))

    expect(onChange).toHaveBeenCalledWith(['mijote'])
  })
})
