import { render, screen } from '@testing-library/react'

import { TypingIndicator } from '@nomos/components/typing-indicator/typing-indicator'

describe('TypingIndicator', () => {
  it('expose une région de statut vivante portant le libellé injecté', () => {
    render(<TypingIndicator label="L’assistant écrit" />)

    const status = screen.getByRole('status')
    expect(status).toHaveAttribute('aria-live', 'polite')
    expect(status).toHaveTextContent('L’assistant écrit')
  })
})
