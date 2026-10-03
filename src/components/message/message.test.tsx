import { render, screen } from '@testing-library/react'

import { Message } from '@nomos/components/message/message'
import type { ChatPart } from '@nomos/features/chat/types'

describe('Message', () => {
  it('rend un part de texte et aligne l’utilisateur à droite', () => {
    const { container } = render(
      <Message role="user" parts={[{ type: 'text', text: 'salut' }]} />,
    )

    expect(screen.getByText('salut')).toBeInTheDocument()
    expect(container.querySelector('[data-role="user"]')).toHaveClass('flex-row-reverse')
  })

  it('rend un part d’outil avec son état', () => {
    render(
      <Message
        role="assistant"
        parts={[{ type: 'tool', name: 'create_program', state: 'success', label: 'Programme' }]}
      />,
    )

    const tool = screen.getByText('Programme')
    expect(tool).toHaveAttribute('data-tool-state', 'success')
  })

  it('laisse renderPart primer sur le rendu par défaut', () => {
    const parts: ChatPart[] = [{ type: 'data', name: 'ready', payload: { ok: true } }]
    render(<Message role="assistant" parts={parts} renderPart={() => <em>artefact</em>} />)

    expect(screen.getByText('artefact')).toBeInTheDocument()
    expect(document.querySelector('[data-part="data"]')).toBeNull()
  })
})
