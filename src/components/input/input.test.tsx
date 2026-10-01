import { render, screen } from '@testing-library/react'

import { Input } from '@nomos/components/input/input'

/** Le champ se rend à partir de ses seules props, sans provider d'app. */
describe('Input', () => {
  it('renders a search field, without any application provider', () => {
    render(<Input type="search" placeholder="rechercher" />)

    const field = screen.getByPlaceholderText('rechercher')
    expect(field).toBeInTheDocument()
    expect(field).toHaveAttribute('type', 'search')
  })

  it('lets the application merge its own classes', () => {
    render(<Input aria-label="champ" className="h-8" />)

    expect(screen.getByLabelText('champ')).toHaveClass('h-8')
  })
})
