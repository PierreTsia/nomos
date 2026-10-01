import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Switch } from '@nomos/components/switch/switch'

/** L'interrupteur se rend seul, sans provider d'app. */
describe('Switch', () => {
  it('renders checked and reports toggles', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Switch aria-label="activer" checked onCheckedChange={onCheckedChange} />)

    const control = screen.getByRole('switch', { name: 'activer' })
    expect(control).toHaveAttribute('data-state', 'checked')

    await user.click(control)
    expect(onCheckedChange).toHaveBeenCalled()
  })

  it('lets the application merge its own classes', () => {
    render(<Switch aria-label="x" className="h-6" />)

    expect(screen.getByRole('switch', { name: 'x' })).toHaveClass('h-6')
  })
})
