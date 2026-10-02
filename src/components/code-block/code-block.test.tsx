import { act, fireEvent, render, screen } from '@testing-library/react'

import { CodeBlock } from '@nomos/components/code-block/code-block'

/** Le CodeBlock se rend à partir de ses seules props, sans provider d'app. */
describe('CodeBlock', () => {
  it('rend un bloc <pre><code> monospace scrollable', () => {
    render(<CodeBlock code="npm install" />)

    const code = screen.getByText('npm install')
    expect(code.tagName).toBe('CODE')
    expect(code.closest('pre')).toHaveClass('overflow-x-auto')
    expect(code.closest('pre')).toHaveClass('font-mono')
  })

  it('affiche le bouton de copie et copie le code', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    })

    render(<CodeBlock code="npm install" copyLabel="Copier" copiedLabel="Copié" />)

    fireEvent.click(screen.getByRole('button', { name: 'Copier' }))
    await act(async () => {})

    expect(writeText).toHaveBeenCalledWith('npm install')
    expect(screen.getByRole('button', { name: 'Copié' })).toBeInTheDocument()
  })

  it('masque le bouton de copie quand showCopy est faux', () => {
    render(<CodeBlock code="x" showCopy={false} />)

    expect(screen.queryByRole('button')).toBeNull()
  })
})
