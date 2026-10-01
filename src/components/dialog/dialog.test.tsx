import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Dialog } from '@nomos/components/dialog/dialog'

/** La modale est un bloc du cœur : elle se rend seule, sans provider d'app. */
const base = {
  trigger: 'Ouvrir',
  title: 'Confirmer',
  description: 'Une action difficile à défaire.',
  body: 'Le contenu de la modale.',
  footer: 'Actions',
  closeLabel: 'Fermer',
}

describe('Dialog', () => {
  it('opens from the trigger and renders its parts, without any application provider', async () => {
    const user = userEvent.setup()
    render(<Dialog {...base} />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Ouvrir' }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Confirmer')).toBeInTheDocument()
    expect(screen.getByText('Une action difficile à défaire.')).toBeInTheDocument()
    expect(screen.getByText('Le contenu de la modale.')).toBeInTheDocument()
  })

  it('closes from the labelled close button', async () => {
    const user = userEvent.setup()
    render(<Dialog {...base} defaultOpen />)

    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Fermer' }))

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('lets the application merge its own classes on the surface', () => {
    render(<Dialog {...base} defaultOpen className="max-w-sm" />)

    expect(screen.getByRole('dialog')).toHaveClass('max-w-sm')
  })
})
