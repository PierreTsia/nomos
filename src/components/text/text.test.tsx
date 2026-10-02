import { render, screen } from '@testing-library/react'

import { Text } from '@nomos/components/text/text'

/**
 * Le Texte : un paragraphe par défaut, un `span` sur demande, à la taille sémantique
 * choisie. Il se rend à partir de ses seules props, sans provider d'app autour de lui.
 */
describe('Text', () => {
  it('renders a paragraph by default', () => {
    const { container } = render(<Text>corps</Text>)

    expect(container.querySelector('p')).not.toBeNull()
    expect(screen.getByText('corps')).toBeInTheDocument()
  })

  it('renders a span when asked', () => {
    const { container } = render(<Text as="span">inline</Text>)

    expect(container.querySelector('span')).not.toBeNull()
    expect(container.querySelector('p')).toBeNull()
  })

  it('reads its size from the semantic scale', () => {
    const { container: lead } = render(<Text size="lead">accroche</Text>)
    const { container: caption } = render(<Text size="caption">légende</Text>)

    expect(lead.querySelector('p')).toHaveClass('text-lead')
    expect(caption.querySelector('p')).toHaveClass('text-caption')
  })

  it('defaults to the body size', () => {
    const { container } = render(<Text>corps</Text>)

    expect(container.querySelector('p')).toHaveClass('text-body')
  })

  it('lets the application merge its own classes', () => {
    render(<Text className="prose">corps</Text>)

    expect(screen.getByText('corps')).toHaveClass('prose')
  })
})
