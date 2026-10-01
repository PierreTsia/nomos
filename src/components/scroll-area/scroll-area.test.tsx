import { render, screen } from '@testing-library/react'

import { ScrollArea } from '@nomos/components/scroll-area/scroll-area'

/** La zone défilante est un atome du cœur : elle se rend seule, sans provider d'app. */
describe('ScrollArea', () => {
  it('renders its content inside the viewport, without any application provider', () => {
    render(<ScrollArea className="h-24 w-48">Un contenu plus grand que la surface.</ScrollArea>)

    expect(screen.getByText('Un contenu plus grand que la surface.')).toBeInTheDocument()
  })

  it('lets the application merge its own classes on the surface', () => {
    const { container } = render(<ScrollArea className="h-64">Contenu</ScrollArea>)

    expect(container.querySelector('.h-64')).not.toBeNull()
  })
})
