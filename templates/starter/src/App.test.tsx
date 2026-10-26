import { render, screen } from '@testing-library/react'
import { App } from './App'

describe('App', () => {
  it('renders the starter heading and a catalogued brick', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Nomos starter' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Get started' })).toBeInTheDocument()
  })
})
