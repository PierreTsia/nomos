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

  it('lets the application merge its own classes', () => {
    render(<Card className="shadow-none">contenu</Card>)

    expect(screen.getByText('contenu')).toHaveClass('shadow-none')
  })
})
