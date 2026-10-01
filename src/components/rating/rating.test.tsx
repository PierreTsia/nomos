import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { Rating } from '@nomos/components/rating/rating'

describe('Rating', () => {
  it('affiche `max` étoiles et une seule cochée', () => {
    render(<Rating value={3} onValueChange={vi.fn()} ariaLabel="Note" />)

    const group = screen.getByRole('radiogroup', { name: 'Note' })
    expect(group).toBeInTheDocument()
    expect(screen.getAllByRole('radio')).toHaveLength(5)
    expect(screen.getAllByRole('radio').filter((r) => r.getAttribute('aria-checked') === 'true')).toHaveLength(1)
    expect(screen.getAllByRole('radio')[2]).toHaveAttribute('aria-checked', 'true')
  })

  it('est un simple affichage quand l’app ne fournit pas de rappel', () => {
    render(<Rating value={4} ariaLabel="Note" />)

    expect(screen.queryByRole('radiogroup')).toBeNull()
    expect(screen.getByRole('img', { name: 'Note' })).toBeInTheDocument()
  })

  it('reste un affichage si readOnly, même avec un rappel', () => {
    render(<Rating value={4} readOnly onValueChange={vi.fn()} ariaLabel="Note" />)

    expect(screen.queryByRole('radiogroup')).toBeNull()
  })

  it('change la note au clic et aux flèches par rappel', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Rating value={3} onValueChange={onValueChange} ariaLabel="Note" />)
    const radios = screen.getAllByRole('radio')
    radios[4].focus()

    await user.click(radios[4])
    expect(onValueChange).toHaveBeenCalledWith(5)

    onValueChange.mockClear()
    radios[2].focus()
    await user.keyboard('{ArrowRight}')
    expect(onValueChange).toHaveBeenCalledWith(4)

    onValueChange.mockClear()
    await user.keyboard('{Home}')
    expect(onValueChange).toHaveBeenCalledWith(1)
  })
})
