import { render, screen } from '@testing-library/react'

import { Conversation } from '@nomos/components/conversation/conversation'

describe('Conversation', () => {
  it('est une région `log` nommée qui rend ses enfants', () => {
    render(
      <Conversation label="Fil" scrollToBottomLabel="En bas">
        <p>un message</p>
      </Conversation>,
    )

    const log = screen.getByRole('log')
    expect(log).toHaveAttribute('aria-label', 'Fil')
    expect(screen.getByText('un message')).toBeInTheDocument()
  })

  it('montre l’état vide à la place des enfants quand il n’y a rien', () => {
    render(<Conversation empty={<span>rien pour l’instant</span>} />)

    expect(screen.getByText('rien pour l’instant')).toBeInTheDocument()
  })
})
