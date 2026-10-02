import { render, screen } from '@testing-library/react'

import { Link } from '@nomos/components/link/link'

/** Le Lien se rend à partir de ses seules props, sans provider d'app. */
describe('Link', () => {
  it('renders an anchor with its href', () => {
    render(<Link href="/docs">Documentation</Link>)

    const link = screen.getByRole('link', { name: 'Documentation' })
    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', '/docs')
  })

  it('renders its content', () => {
    render(<Link href="/docs">Documentation</Link>)

    expect(screen.getByText('Documentation')).toBeInTheDocument()
  })

  it('lets the application merge its own classes', () => {
    render(
      <Link href="/docs" className="font-bold">
        x
      </Link>,
    )

    expect(screen.getByRole('link')).toHaveClass('font-bold')
  })

  it('renders the child when asChild is set', () => {
    render(
      <Link asChild>
        <a href="/docs">Documentation</a>
      </Link>,
    )

    const link = screen.getByRole('link', { name: 'Documentation' })
    expect(link.tagName).toBe('A')
    expect(link).toHaveClass('hover:underline')
  })
})
