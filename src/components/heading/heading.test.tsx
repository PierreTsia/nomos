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

  it('decouples the size from the level, keeping the tag', () => {
    const { container } = render(
      <Heading level={2} size="body">
        Titre visuellement discret
      </Heading>,
    )

    const heading = container.querySelector('h2')
    expect(heading).toHaveClass('text-body')
    expect(heading).not.toHaveClass('text-title')
  })

  it('reads its weight from the semantic scale, strong by default', () => {
    const { container: byDefault } = render(<Heading>Titre</Heading>)
    const { container: medium } = render(<Heading weight="medium">Titre</Heading>)

    expect(byDefault.querySelector('h2')).toHaveClass('font-strong')
    expect(medium.querySelector('h2')).toHaveClass('font-medium')
    expect(medium.querySelector('h2')).not.toHaveClass('font-strong')
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
