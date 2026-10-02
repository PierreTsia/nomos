import { render, screen } from '@testing-library/react'

import { Code } from '@nomos/components/code/code'

/** Le Code se rend à partir de ses seules props, sans provider d'app. */
describe('Code', () => {
  it('rend un <code> monospace et fusionne les classes de l’appelant', () => {
    render(<Code className="text-xs">npm install</Code>)

    const element = screen.getByText('npm install')
    expect(element.tagName).toBe('CODE')
    expect(element).toHaveClass('font-mono')
    expect(element).toHaveClass('text-xs')
  })
})
