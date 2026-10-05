import { render, screen } from '@testing-library/react'

import { Heading } from '@nomos/components/heading/heading'

/**
 * Le Titre : la balise suit le niveau, la taille suit l'échelle sémantique. Il se rend à
 * partir de ses seules props, sans provider d'app autour de lui.
 */
describe('Heading', () => {
  it('renders the tag matching the level', () => {
    const { container } = render(<Heading level={1}>Titre</Heading>)

    expect(container.querySelector('h1')).not.toBeNull()
    expect(screen.getByText('Titre')).toBeInTheDocument()
  })

  it('renders every level as its own tag', () => {
    for (const level of [1, 2, 3, 4, 5, 6] as const) {
      const { container } = render(<Heading level={level}>niveau {level}</Heading>)
      expect(container.querySelector(`h${level}`), `niveau ${level}`).not.toBeNull()
    }
  })

  it('defaults to level 2', () => {
    const { container } = render(<Heading>Titre</Heading>)

    expect(container.querySelector('h2')).not.toBeNull()
  })

  it('reads its size from the semantic scale', () => {
    const { container: display } = render(<Heading level={1}>grand</Heading>)
    const { container: title } = render(<Heading level={2}>moyen</Heading>)

    expect(display.querySelector('h1')).toHaveClass('text-display')
    expect(title.querySelector('h2')).toHaveClass('text-title')
  })

  it('reads its tone from the semantic palette', () => {
    const { container: muted } = render(<Heading tone="muted">secondaire</Heading>)
    const { container: danger } = render(<Heading tone="danger">erreur</Heading>)

    expect(muted.querySelector('h2')).toHaveClass('text-muted-foreground')
    expect(danger.querySelector('h2')).toHaveClass('text-destructive')
  })

  it('lets the application merge its own classes', () => {
    render(<Heading className="section-title">Titre</Heading>)

    expect(screen.getByText('Titre')).toHaveClass('section-title')
  })
})
