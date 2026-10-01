import { fireEvent, render, screen } from '@testing-library/react'

import { Avatar } from '@nomos/components/avatar/avatar'

/** L'avatar est un atome du cœur : il se rend seul, sans provider d'app. */
describe('Avatar', () => {
  it('renders the image with its source and alt text', () => {
    render(<Avatar src="/me.png" alt="Photo de profil" fallback="PT" />)

    expect(screen.getByRole('img', { name: 'Photo de profil' })).toHaveAttribute('src', '/me.png')
  })

  it('shows the fallback when there is no source', () => {
    render(<Avatar alt="Photo de profil" fallback="PT" />)

    expect(screen.getByText('PT')).toBeInTheDocument()
  })

  it('falls back when the image fails to load', () => {
    render(<Avatar src="/broken.png" alt="Photo de profil" fallback="PT" />)

    fireEvent.error(screen.getByRole('img', { name: 'Photo de profil' }))

    expect(screen.getByText('PT')).toBeInTheDocument()
  })
})
