import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Button } from '@nomos/components/button/button'

/** Le Bouton se rend à partir de ses seules props, sans provider d'app. */
describe('Button', () => {
  it('renders its label, without any application provider', () => {
    render(<Button>Valider</Button>)

    expect(screen.getByRole('button', { name: 'Valider' })).toBeInTheDocument()
  })

  it('changes appearance with the variant', () => {
    const { container: primary } = render(<Button variant="default">x</Button>)
    const { container: outline } = render(<Button variant="outline">x</Button>)

    expect(primary.firstElementChild?.className).not.toEqual(outline.firstElementChild?.className)
  })

  it('lets the application merge its own classes', () => {
    render(<Button className="w-full">x</Button>)

    expect(screen.getByRole('button')).toHaveClass('w-full')
  })

  it('fires the onClick it is given', async () => {
    const user = userEvent.setup()
    let clicked = false
    render(
      <Button
        onClick={() => {
          clicked = true
        }}
      >
        x
      </Button>,
    )

    await user.click(screen.getByRole('button'))

    expect(clicked).toBe(true)
  })
})
