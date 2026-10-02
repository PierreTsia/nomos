import { render, screen } from '@testing-library/react'

import { Navbar } from '@nomos/components/navbar/navbar'

/** La barre se rend à partir de ses seuls slots, sans provider d'app. */
describe('Navbar', () => {
  it('renders the injected brand, nav and actions', () => {
    render(
      <Navbar
        brand={<span>Nomos</span>}
        nav={<a href="/docs">Docs</a>}
        actions={<button type="button">Sign in</button>}
      />,
    )

    expect(screen.getByText('Nomos')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Docs' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument()
  })

  it('renders nothing broken when slots are absent', () => {
    const { container } = render(<Navbar />)

    expect(container.querySelector('header')).not.toBeNull()
  })

  it('lets the application merge its own classes', () => {
    render(<Navbar className="bg-red-500" />)

    expect(screen.getByRole('banner')).toHaveClass('bg-red-500')
  })
})
