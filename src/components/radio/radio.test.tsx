import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { RadioGroup, RadioGroupItem } from '@nomos/components/radio/radio'

/** Le groupe radio se rend seul, sans provider d'app. */
describe('RadioGroup', () => {
  it('renders its items and reports the choice', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <RadioGroup value="a" onValueChange={onValueChange}>
        <RadioGroupItem value="a" aria-label="a" />
        <RadioGroupItem value="b" aria-label="b" />
      </RadioGroup>,
    )

    await user.click(screen.getByRole('radio', { name: 'b' }))

    expect(onValueChange).toHaveBeenCalledWith('b')
  })

  it('lets the application merge its own classes on the group', () => {
    render(
      <RadioGroup className="gap-4">
        <RadioGroupItem value="a" aria-label="a" />
      </RadioGroup>,
    )

    expect(screen.getByRole('radiogroup')).toHaveClass('gap-4')
  })
})
