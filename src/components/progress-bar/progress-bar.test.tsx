import { render, screen } from '@testing-library/react'

import { ProgressBar } from '@nomos/components/progress-bar/progress-bar'

describe('ProgressBar', () => {
  it('expose un rôle progressbar avec ses bornes', () => {
    render(<ProgressBar value={3} max={10} label="import" />)

    const bar = screen.getByRole('progressbar', { name: 'import' })
    expect(bar).toHaveAttribute('aria-valuenow', '3')
    expect(bar).toHaveAttribute('aria-valuemin', '0')
    expect(bar).toHaveAttribute('aria-valuemax', '10')
  })

  it('remplit la barre au prorata et borne la valeur', () => {
    const { container: half } = render(<ProgressBar value={5} max={10} />)
    expect(half.querySelector('[style*="width: 50%"]')).not.toBeNull()

    const { container: over } = render(<ProgressBar value={30} max={10} />)
    expect(over.querySelector('[style*="width: 100%"]')).not.toBeNull()
  })

  it('affiche le pourcentage calculé seulement sur demande', () => {
    const { container } = render(<ProgressBar value={60} max={100} showValue />)
    expect(container.textContent).toContain('60%')

    const { container: plain } = render(<ProgressBar value={60} max={100} />)
    expect(plain.textContent).not.toContain('%')
  })

  it('ne produit pas de CSS invalide sur une donnée cassée', () => {
    const { container } = render(<ProgressBar value={Number.NaN} max={10} />)
    expect(container.querySelector('[style*="NaN"]')).toBeNull()
  })
})
