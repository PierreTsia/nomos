import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ToggleGroup, ToggleGroupItem } from '@nomos/components/toggle-group/toggle-group'

/** Le groupe se rend et se choisit à partir de ses seules props, sans provider d'app. */
describe('ToggleGroup', () => {
  it('renders its items, without any application provider', () => {
    render(
      <ToggleGroup type="single" defaultValue="un">
        <ToggleGroupItem value="un">un</ToggleGroupItem>
        <ToggleGroupItem value="deux">deux</ToggleGroupItem>
      </ToggleGroup>,
    )

    expect(screen.getByRole('radio', { name: 'un' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'deux' })).toBeInTheDocument()
  })

  it('fires onValueChange when the selection changes', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <ToggleGroup type="single" defaultValue="un" onValueChange={onValueChange}>
        <ToggleGroupItem value="un">un</ToggleGroupItem>
        <ToggleGroupItem value="deux">deux</ToggleGroupItem>
      </ToggleGroup>,
    )

    await user.click(screen.getByRole('radio', { name: 'deux' }))

    expect(onValueChange).toHaveBeenCalledWith('deux')
  })
})
