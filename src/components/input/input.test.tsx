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

  it('exposes size, the flush variant and the leading-icon slot', () => {
    const { container: sm } = render(<Input size="sm" aria-label="a" />)
    const { container: flush } = render(<Input variant="flush" aria-label="b" />)
    const { container: icon } = render(<Input icon="leading" aria-label="c" />)

    expect(sm.querySelector('input')).toHaveClass('h-9')
    expect(flush.querySelector('input')).toHaveClass('border-0')
    expect(icon.querySelector('input')).toHaveClass('pl-9')
  })

  it('lets the application merge its own classes', () => {
    render(<Input aria-label="champ" className="h-8" />)

    expect(screen.getByLabelText('champ')).toHaveClass('h-8')
  })
})
