import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Toast } from '@nomos/components/toast/toast'

/** La notification se rend à partir de ses seules props, sans provider d'app. */
describe('Toast', () => {
  it('renders the message and the description, without any application provider', () => {
    render(<Toast tone="success" message="réindexé" description="12 éléments" />)

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText('réindexé')).toBeInTheDocument()
    expect(screen.getByText('12 éléments')).toBeInTheDocument()
  })

  it('shows a labelled close button only with onClose, and fires it', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const { rerender } = render(<Toast message="sans fermeture" />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()

    rerender(<Toast message="fermable" onClose={onClose} closeLabel="fermer" />)

    await user.click(screen.getByRole('button', { name: 'fermer' }))

    expect(onClose).toHaveBeenCalled()
  })

  it('lets the application merge its own classes', () => {
    render(<Toast message="ton" className="mt-2" />)

    expect(screen.getByRole('status')).toHaveClass('mt-2')
  })
})