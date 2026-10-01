import { render, screen } from '@testing-library/react'

import { Skeleton } from '@nomos/components/skeleton/skeleton'

/** Le squelette se rend seul, sans provider d'app. */
describe('Skeleton', () => {
  it('renders a pulsing surface, without any application provider', () => {
    render(<Skeleton data-testid="squelette" />)

    expect(screen.getByTestId('squelette')).toHaveClass('animate-pulse')
  })

  it('lets the application merge its own classes', () => {
    render(<Skeleton className="h-8 w-72" data-testid="squelette" />)

    expect(screen.getByTestId('squelette')).toHaveClass('h-8', 'w-72')
  })
})
