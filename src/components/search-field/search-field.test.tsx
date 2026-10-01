import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { SearchField } from '@nomos/components/search-field/search-field'

/** Le champ se rend et s'efface à partir de ses seules props, sans provider d'app. */
describe('SearchField', () => {
  it('renders a search input, without any application provider', () => {
    render(<SearchField value="" onChange={() => {}} clearLabel="Effacer" placeholder="rechercher" />)

    const field = screen.getByPlaceholderText('rechercher')
    expect(field).toHaveAttribute('type', 'search')
    expect(screen.queryByRole('button', { name: 'Effacer' })).not.toBeInTheDocument()
  })

  it('fires onChange as the user types', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<SearchField value="" onChange={onChange} clearLabel="Effacer" placeholder="rechercher" />)

    await user.type(screen.getByPlaceholderText('rechercher'), 'a')

    expect(onChange).toHaveBeenCalledWith('a')
  })

  it('shows the clear button when filled, and clears through onChange', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<SearchField value="terme" onChange={onChange} clearLabel="Effacer" />)

    await user.click(screen.getByRole('button', { name: 'Effacer' }))

    expect(onChange).toHaveBeenCalledWith('')
  })
})
