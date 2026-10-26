import { render, screen } from '@testing-library/react'

import { ItemsPage } from './items-page'

describe('ItemsPage', () => {
  it('renders the faceted table with the dataset', () => {
    render(<ItemsPage />)
    expect(screen.getByRole('heading', { name: 'Items' })).toBeInTheDocument()
    expect(screen.getByText('Design review')).toBeInTheDocument()
    expect(screen.getByText('Billing migration')).toBeInTheDocument()
  })
})
