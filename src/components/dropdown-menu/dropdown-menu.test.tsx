import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@nomos/components/dropdown-menu/dropdown-menu'

/** Le menu est un atome du cœur : il se rend seul, sans provider d'app. */
describe('DropdownMenu', () => {
  it('opens from the trigger and reports the selected item', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={onSelect}>Renommer</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )

    await user.click(screen.getByRole('button', { name: 'Actions' }))
    await user.click(await screen.findByText('Renommer'))

    expect(onSelect).toHaveBeenCalled()
  })

  it('reports a checkbox item toggle, without closing on a plain item', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Colonnes</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem checked={false} onCheckedChange={onCheckedChange}>
            Nom
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )

    await user.click(screen.getByRole('button', { name: 'Colonnes' }))
    await user.click(await screen.findByText('Nom'))

    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })
})
