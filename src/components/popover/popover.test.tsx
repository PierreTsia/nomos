import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Popover, PopoverContent, PopoverTrigger } from '@nomos/components/popover/popover'

/** La bulle est un atome du cœur : elle se rend seule, sans provider d'app. */
describe('Popover', () => {
  it('opens from the trigger and renders its content, without any application provider', async () => {
    const user = userEvent.setup()
    render(
      <Popover>
        <PopoverTrigger>Filtres</PopoverTrigger>
        <PopoverContent>Le contenu de la bulle.</PopoverContent>
      </Popover>,
    )

    expect(screen.queryByText('Le contenu de la bulle.')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Filtres' }))

    expect(await screen.findByText('Le contenu de la bulle.')).toBeInTheDocument()
  })

  it('lets the application merge its own classes on the surface', () => {
    render(
      <Popover defaultOpen>
        <PopoverTrigger>Filtres</PopoverTrigger>
        <PopoverContent className="max-w-xs">Contenu</PopoverContent>
      </Popover>,
    )

    expect(screen.getByText('Contenu')).toHaveClass('max-w-xs')
  })
})
