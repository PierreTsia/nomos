import { render, screen } from '@testing-library/react'

import { NumberField } from '@nomos/components/number-field/number-field'

/** Le champ se rend à partir de ses seules props, sans provider d'app. */
describe('NumberField', () => {
  it('renders a number input, without any application provider', () => {
    render(<NumberField aria-label="quantité" min={0} max={10} step={2} />)

    const field = screen.getByLabelText('quantité')
    expect(field).toHaveAttribute('type', 'number')
    expect(field).toHaveAttribute('min', '0')
    expect(field).toHaveAttribute('max', '10')
    expect(field).toHaveAttribute('step', '2')
  })

  it('lets the application merge its own classes', () => {
    render(<NumberField aria-label="quantité" className="h-8" />)

    expect(screen.getByLabelText('quantité')).toHaveClass('h-8')
  })
})
