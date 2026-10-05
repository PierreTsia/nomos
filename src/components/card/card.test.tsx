import { render, screen } from '@testing-library/react'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@nomos/components/card/card'

/** La carte est un atome du cœur : elle se rend seule, sans provider d'app. */
describe('Card', () => {
  it('renders its parts, without any application provider', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>titre</CardTitle>
          <CardDescription>description</CardDescription>
        </CardHeader>
        <CardContent>corps</CardContent>
        <CardFooter>pied</CardFooter>
      </Card>,
    )

    expect(screen.getByText('titre')).toBeInTheDocument()
    expect(screen.getByText('corps')).toBeInTheDocument()
    expect(screen.getByText('pied')).toBeInTheDocument()
  })

  it('controls its padding, gap and border tone by variant', () => {
    const { container: flush } = render(<Card padding="flush">x</Card>)
    const { container: comfy } = render(<Card gap="comfy">x</Card>)
    const { container: muted } = render(<Card variant="muted">x</Card>)

    expect(flush.firstElementChild?.className).toContain('[--nomos-card-pad:0px]')
    expect(comfy.firstElementChild?.className).toContain(
      '[--nomos-card-gap:calc(var(--spacing)*4)]',
    )
    expect(muted.firstElementChild).toHaveClass('border-border/50')
  })

  it('lets the application merge its own classes', () => {
    render(<Card className="shadow-none">contenu</Card>)

    expect(screen.getByText('contenu')).toHaveClass('shadow-none')
  })
})
