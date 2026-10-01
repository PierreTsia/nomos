import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Toggle } from '@nomos/components/toggle/toggle'

/** La bascule se rend et se presse à partir de ses seules props, sans provider d'app. */
describe('Toggle', () => {
  it('renders a pressable button, without any application provider', () => {
    render(<Toggle>compact</Toggle>)

    expect(screen.getByRole('button', { name: 'compact' })).toBeInTheDocument()
  })

  it('toggles on click when left uncontrolled', async () => {
    const user = userEvent.setup()
    render(<Toggle defaultPressed={false}>compact</Toggle>)

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('data-state', 'off')

    await user.click(button)

    expect(button).toHaveAttribute('data-state', 'on')
  })

  it('lets the application merge its own classes', () => {
    render(<Toggle className="w-24">compact</Toggle>)

    expect(screen.getByRole('button')).toHaveClass('w-24')
  })
})
