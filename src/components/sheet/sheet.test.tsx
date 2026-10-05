import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@nomos/components/sheet/sheet'

/** Le panneau est un bloc du cœur : il se rend seul, sans provider d'app. */
describe('Sheet', () => {
  it('opens from the trigger and renders its parts, without any application provider', async () => {
    const user = userEvent.setup()
    render(
      <Sheet>
        <SheetTrigger>Ouvrir</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Panneau</SheetTitle>
            <SheetDescription>Une description courte.</SheetDescription>
          </SheetHeader>
          Le contenu du panneau.
        </SheetContent>
      </Sheet>,
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Ouvrir' }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Panneau')).toBeInTheDocument()
    expect(screen.getByText('Le contenu du panneau.')).toBeInTheDocument()
  })

  it('renders the drawer as the bottom side of the same panel', () => {
    render(
      <Sheet defaultOpen>
        <SheetContent side="bottom">
          <SheetTitle>Drawer</SheetTitle>
        </SheetContent>
      </Sheet>,
    )

    expect(screen.getByRole('dialog')).toHaveClass(
      'data-[state=open]:animate-slide-in-bottom',
    )
  })

  it('turns the bottom side into a bottom-sheet', () => {
    render(
      <Sheet defaultOpen>
        <SheetContent side="bottom">
          <SheetTitle>Drawer</SheetTitle>
        </SheetContent>
      </Sheet>,
    )

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveClass('rounded-t-lg')
    expect(dialog.className).toContain('safe-area-inset-bottom')
  })

  it('lets the application merge its own classes on the surface', () => {
    render(
      <Sheet defaultOpen>
        <SheetContent className="max-w-sm">
          <SheetTitle>titre</SheetTitle>
        </SheetContent>
      </Sheet>,
    )

    expect(screen.getByRole('dialog')).toHaveClass('max-w-sm')
  })
})
