import { fireEvent, render, screen } from '@testing-library/react'
import { act } from 'react'

import { ToastProvider, useToast } from '@nomos/features/toast'

/** Un consommateur minimal : deux boutons qui pilotent la file. */
function Harness() {
  const { show, update } = useToast()
  return (
    <>
      <button type="button" onClick={() => show({ message: 'premier' })}>
        show
      </button>
      <button
        type="button"
        onClick={() => {
          const id = show({ message: 'chargement', persistent: true })
          update(id, { message: 'terminé', tone: 'success', persistent: false })
        }}
      >
        show-update
      </button>
    </>
  )
}

function renderHarness(props: { closeLabel?: string; duration?: number } = {}) {
  return render(
    <ToastProvider {...props}>
      <Harness />
    </ToastProvider>,
  )
}

describe('ToastProvider', () => {
  it('affiche une notification au show, sans provider d’app autour', () => {
    renderHarness()

    fireEvent.click(screen.getByRole('button', { name: 'show' }))

    expect(screen.getByText('premier')).toBeInTheDocument()
  })

  it('met à jour une notification existante par son identifiant', () => {
    renderHarness()

    fireEvent.click(screen.getByRole('button', { name: 'show-update' }))

    expect(screen.getByText('terminé')).toBeInTheDocument()
    expect(screen.queryByText('chargement')).not.toBeInTheDocument()
  })

  it('ferme automatiquement une notification non persistante', () => {
    vi.useFakeTimers()
    try {
      renderHarness({ duration: 1000 })

      fireEvent.click(screen.getByRole('button', { name: 'show' }))
      expect(screen.getByText('premier')).toBeInTheDocument()

      act(() => {
        vi.advanceTimersByTime(1000)
      })

      expect(screen.queryByText('premier')).not.toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })

  it('dit quoi faire hors d’un provider', () => {
    function Orphan() {
      useToast()
      return null
    }

    expect(() => render(<Orphan />)).toThrow(/ToastProvider/)
  })
})