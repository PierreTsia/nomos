import { act, fireEvent, render, screen } from '@testing-library/react'

import { CopyButton } from '@nomos/components/copy-button/copy-button'

/** Le CopyButton se rend à partir de ses seules props, sans provider d'app. */
describe('CopyButton', () => {
  it('copies the value and shows the copied label, then reverts', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    })

    vi.useFakeTimers()
    try {
      render(<CopyButton value="npm install" label="Copier" copiedLabel="Copié" />)

      fireEvent.click(screen.getByRole('button', { name: 'Copier' }))
      await act(async () => {})

      expect(writeText).toHaveBeenCalledWith('npm install')
      expect(screen.getByRole('button', { name: 'Copié' })).toBeInTheDocument()

      act(() => {
        vi.advanceTimersByTime(2000)
      })

      expect(screen.getByRole('button', { name: 'Copier' })).toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })

  it('renders an injected icon and merges the caller classes', () => {
    render(<CopyButton value="x" icon={<span data-testid="icone" />} className="w-full" />)

    expect(screen.getByTestId('icone')).toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveClass('w-full')
  })
})
