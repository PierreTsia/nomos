import { render, screen, within } from '@testing-library/react'
import { App } from './App'

describe('App', () => {
  it('renders the shell with the dashboard as the default page', () => {
    window.location.hash = ''
    render(<App />)
    expect(within(screen.getByRole('banner')).getByText('Nomos Starter')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
  })
})
