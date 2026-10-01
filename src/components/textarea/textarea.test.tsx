import { render, screen } from '@testing-library/react'

import { Textarea } from '@nomos/components/textarea/textarea'

/** Le champ multiligne se rend seul, sans provider d'app. */
describe('Textarea', () => {
  it('renders a multiline field', () => {
    render(<Textarea placeholder="message" />)

    expect(screen.getByPlaceholderText('message').tagName).toBe('TEXTAREA')
  })

  it('lets the application merge its own classes', () => {
    render(<Textarea aria-label="note" className="min-h-32" />)

    expect(screen.getByLabelText('note')).toHaveClass('min-h-32')
  })
})
