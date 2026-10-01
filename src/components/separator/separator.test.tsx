import { render, screen } from '@testing-library/react'

import { Separator } from '@nomos/components/separator/separator'

/** Le séparateur se rend seul, sans provider d'app. */
describe('Separator', () => {
  it('renders a horizontal line, without any application provider', () => {
    render(<Separator data-testid="sep" />)

    expect(screen.getByTestId('sep')).toHaveAttribute('data-orientation', 'horizontal')
  })

  it('renders vertical on demand', () => {
    render(<Separator orientation="vertical" data-testid="sep" />)

    expect(screen.getByTestId('sep')).toHaveAttribute('data-orientation', 'vertical')
  })

  it('lets the application merge its own classes', () => {
    render(<Separator className="my-4" data-testid="sep" />)

    expect(screen.getByTestId('sep')).toHaveClass('my-4')
  })
})
