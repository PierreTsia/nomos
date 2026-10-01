import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Alert } from '@nomos/components/alert/alert'

/** Le bandeau se rend à partir de ses seules props, sans provider d'app. */
describe('Alert', () => {
  it('renders the title and the content, without any application provider', () => {
    render(
      <Alert tone="success" title="enregistré">
        la donnée est à jour.
      </Alert>,
    )

    expect(screen.getByText('enregistré')).toBeInTheDocument()
    expect(screen.getByText('la donnée est à jour.')).toBeInTheDocument()
  })

  it('announces errors as alerts and the rest as status', () => {
    const { rerender } = render(<Alert tone="danger" title="échec" />)
    expect(screen.getByRole('alert')).toBeInTheDocument()

    rerender(<Alert tone="info" title="pour information" />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('shows a labelled close button only with onClose, and fires it', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const { rerender } = render(<Alert title="sans fermeture" />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()

    rerender(<Alert title="fermable" onClose={onClose} closeLabel="fermer" />)

    await user.click(screen.getByRole('button', { name: 'fermer' }))

    expect(onClose).toHaveBeenCalled()
  })

  it('lets the application merge its own classes', () => {
    render(<Alert title="ton" className="mb-2" />)

    expect(screen.getByRole('status')).toHaveClass('mb-2')
  })
})
