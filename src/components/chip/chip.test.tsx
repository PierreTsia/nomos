import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Chip } from '@nomos/components/chip/chip'

/** La puce se rend à partir de ses seules props, sans provider d'app. */
describe('Chip', () => {
  it('renders its label, without any application provider', () => {
    render(<Chip>domaine : ui</Chip>)

    expect(screen.getByText('domaine : ui')).toBeInTheDocument()
  })

  it('shows a labelled remove button only with onRemove, and fires it', async () => {
    const user = userEvent.setup()
    const onRemove = vi.fn()
    const { rerender } = render(<Chip>filtre</Chip>)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()

    rerender(
      <Chip onRemove={onRemove} removeLabel="retirer le filtre">
        filtre
      </Chip>,
    )

    await user.click(screen.getByRole('button', { name: 'retirer le filtre' }))

    expect(onRemove).toHaveBeenCalled()
  })

  it('lets the application merge its own classes', () => {
    render(<Chip className="max-w-xs">filtre</Chip>)

    expect(screen.getByText('filtre').closest('.max-w-xs')).not.toBeNull()
  })
})