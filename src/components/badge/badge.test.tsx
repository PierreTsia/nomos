import { render, screen } from '@testing-library/react'

import { Badge } from '@nomos/components/badge/badge'

/**
 * Le Badge est le premier composant du cœur, donc le premier à devoir prouver la
 * contrainte des trois contextes : il se rend à partir de ses seules props, sans
 * aucun provider d'app autour de lui.
 */
describe('Badge', () => {
  it('renders its content', () => {
    render(<Badge>triage:hitl</Badge>)

    expect(screen.getByText('triage:hitl')).toBeInTheDocument()
  })

  it('renders without any application provider around it', () => {
    render(<Badge>sans provider</Badge>)

    expect(screen.getByText('sans provider')).toBeInTheDocument()
  })

  it('lets the application merge its own classes', () => {
    render(<Badge className="status-ok">ok</Badge>)

    expect(screen.getByText('ok')).toHaveClass('status-ok')
  })

  it('changes appearance with the variant', () => {
    const { container: filled } = render(<Badge variant="default">plein</Badge>)
    const { container: outline } = render(<Badge variant="outline">contour</Badge>)

    expect(filled.firstElementChild?.className).not.toEqual(
      outline.firstElementChild?.className,
    )
  })

  it('never recolours on hover — a badge is a non-interactive label', () => {
    // The manifest says "non-interactive label": a `hover:` background flips the
    // tone under the caller's custom colour, leaving text on same-hue background.
    for (const variant of ['default', 'secondary', 'destructive', 'outline'] as const) {
      const { container } = render(<Badge variant={variant}>label</Badge>)
      expect(container.firstElementChild?.className).not.toMatch(/(^|\s)hover:bg-/)
    }
  })

  it('exposes size, shape and the subtle tone', () => {
    const { container: subtle } = render(<Badge variant="subtle">x</Badge>)
    const { container: xs } = render(<Badge size="xs">x</Badge>)
    const { container: square } = render(<Badge shape="square">x</Badge>)

    expect(subtle.firstElementChild).toHaveClass('text-primary')
    expect(xs.firstElementChild).toHaveClass('text-micro')
    expect(square.firstElementChild).toHaveClass('rounded')
  })

  it('shows the default cursor, not the text caret', () => {
    render(<Badge>label</Badge>)

    expect(screen.getByText('label')).toHaveClass('cursor-default')
  })
})
