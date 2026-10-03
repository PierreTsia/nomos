import { useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import { Composer } from '@nomos/components/composer/composer'

function Harness(props: { onSubmit?: () => void; onStop?: () => void; busy?: boolean }) {
  const [value, setValue] = useState('')
  return (
    <Composer
      value={value}
      onChange={setValue}
      placeholder="Écrire"
      sendLabel="Envoyer"
      stopLabel="Arrêter"
      {...props}
    />
  )
}

describe('Composer', () => {
  it('envoie sur Entrée mais pas sur Maj+Entrée', () => {
    const onSubmit = vi.fn()
    render(<Harness onSubmit={onSubmit} />)
    const field = screen.getByPlaceholderText('Écrire')

    fireEvent.change(field, { target: { value: 'salut' } })
    fireEvent.keyDown(field, { key: 'Enter' })
    expect(onSubmit).toHaveBeenCalledTimes(1)

    fireEvent.keyDown(field, { key: 'Enter', shiftKey: true })
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('ne soumet pas pendant une composition IME', () => {
    const onSubmit = vi.fn()
    render(<Harness onSubmit={onSubmit} />)
    const field = screen.getByPlaceholderText('Écrire')

    fireEvent.change(field, { target: { value: 'ni' } })
    fireEvent.keyDown(field, { key: 'Enter', isComposing: true })

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('bascule sur l’action d’arrêt quand une réponse est en cours', () => {
    const onStop = vi.fn()
    render(<Harness onStop={onStop} busy />)

    const stop = screen.getByRole('button', { name: 'Arrêter' })
    fireEvent.click(stop)

    expect(onStop).toHaveBeenCalledTimes(1)
  })
})
