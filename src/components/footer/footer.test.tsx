import { render, screen } from '@testing-library/react'

import { Footer } from '@nomos/components/footer/footer'

/** Le pied de page est un bloc du cœur : il se rend seul, sans provider d'app. */
describe('Footer', () => {
  it('renders the injected slots, without any application provider', () => {
    render(
      <Footer
        brand={<span>marque</span>}
        links={<a href="/docs">docs</a>}
        legal={<span>© 2026</span>}
      />,
    )

    expect(screen.getByText('marque')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'docs' })).toBeInTheDocument()
    expect(screen.getByText('© 2026')).toBeInTheDocument()
  })

  it('renders nothing broken when the slots are absent', () => {
    const { container } = render(<Footer />)

    expect(container.querySelector('footer')).toBeInTheDocument()
    expect(container.querySelector('nav')).toBeNull()
  })

  it('lets the application merge its own classes', () => {
    const { container } = render(<Footer className="bg-muted" />)

    expect(container.querySelector('footer')).toHaveClass('bg-muted')
  })
})
