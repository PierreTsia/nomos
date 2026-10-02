import { render, screen } from '@testing-library/react'

import { Kicker } from '@nomos/components/kicker/kicker'

/** Le kicker se rend à partir de ses seules props, sans provider d'app. */
describe('Kicker', () => {
  it('renders its label, without any application provider', () => {
    render(<Kicker>section</Kicker>)

    expect(screen.getByText('section')).toBeInTheDocument()
  })

  it('shows a tone dot only with dot', () => {
    const { container, rerender } = render(<Kicker>section</Kicker>)

    expect(container.querySelector('[aria-hidden]')).toBeNull()

    rerender(<Kicker dot>section</Kicker>)

    expect(container.querySelector('[aria-hidden]')).not.toBeNull()
  })

  it('lets the tone change the rendering', () => {
    const { container, rerender } = render(<Kicker tone="neutral">section</Kicker>)
    const neutral = container.innerHTML

    rerender(<Kicker tone="danger">section</Kicker>)

    expect(container.innerHTML).not.toEqual(neutral)
  })
})
