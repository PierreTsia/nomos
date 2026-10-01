import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Checkbox } from '@nomos/components/checkbox/checkbox'

/** La case se rend seule, sans provider d'app. */
describe('Checkbox', () => {
  it('renders checked and reports toggles', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Checkbox aria-label="activer" checked onCheckedChange={onCheckedChange} />)

    const box = screen.getByRole('checkbox', { name: 'activer' })
    expect(box).toHaveAttribute('data-state', 'checked')

    await user.click(box)
    expect(onCheckedChange).toHaveBeenCalled()
  })

  it('lets the application merge its own classes', () => {
    render(<Checkbox aria-label="x" className="size-5" />)

    expect(screen.getByRole('checkbox', { name: 'x' })).toHaveClass('size-5')
  })
})
