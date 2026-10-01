import { render, screen } from '@testing-library/react'

import { Counter } from '@nomos/components/counter/counter'

describe('Counter', () => {
  it('met le nombre en avant avec son suffixe et son libellé', () => {
    render(<Counter value={128} suffix="issues" label="ouvertes" />)

    expect(screen.getByText('128')).toBeInTheDocument()
    expect(screen.getByText('issues')).toBeInTheDocument()
    expect(screen.getByText('ouvertes')).toBeInTheDocument()
  })

  it('n’ajoute ni suffixe ni libellé quand ils sont absents', () => {
    const { container } = render(<Counter value={7} />)

    expect(container.textContent).toBe('7')
  })

  it('transmet les attributs et les classes de l’appelant', () => {
    const { container } = render(<Counter value={1} className="text-primary" title="total" />)

    expect(container.querySelector('.text-primary')).not.toBeNull()
    expect(container.querySelector('[title="total"]')).not.toBeNull()
  })
})
