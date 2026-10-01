import { render, screen } from '@testing-library/react'

import { CompactMeter, Meter } from '@nomos/components/meter/meter'

/**
 * Le Meter est le premier atome du kit (ADR 0010) : il doit se rendre **seul**, sans
 * aucun provider d'app, et servir aussi bien une cellule qu'une carte. C'est ce test
 * qui prouve que l'atome tient debout hors de la table dont il vient.
 */
describe('Meter', () => {
  it('se rend seul, sans provider d’app', () => {
    render(<Meter label="blast" value={2} max={3} />)

    expect(screen.getByText('blast')).toBeInTheDocument()
    expect(screen.getByText('2.00')).toBeInTheDocument()
  })

  it('remplit la barre au prorata de l’échelle', () => {
    const { container } = render(<Meter label="blast" value={1} max={4} />)

    expect(container.querySelector('[style*="width: 25%"]')).not.toBeNull()
  })

  it('borne la valeur à l’échelle au lieu de déborder', () => {
    const { container } = render(<Meter label="blast" value={9} max={3} />)

    expect(container.querySelector('[style*="width: 100%"]')).not.toBeNull()
  })

  it('marque le seuil quand il y en a un, et seulement alors', () => {
    const withThreshold = render(
      <Meter label="spec" value={1} max={3} threshold={2} thresholdLabel={(v) => `seuil ${v}`} />,
    )
    expect(withThreshold.container.querySelector('[title="seuil 2"]')).not.toBeNull()

    const without = render(<Meter label="spec" value={1} max={3} />)
    expect(without.container.querySelector('[title^="seuil"]')).toBeNull()
  })

  it('affiche la confiance quand elle est connue', () => {
    const { container: known } = render(<Meter label="spec" value={1} max={3} confidence={0.8} />)
    expect(known.textContent).toContain('c0.80')

    const { container: unknown } = render(<Meter label="spec" value={1} max={3} />)
    expect(unknown.textContent).not.toContain('c0.')
  })

  it('n’écrit aucun libellé produit dans son propre texte', () => {
    render(<Meter label="spec" value={1} max={3} threshold={2} />)

    // Le seuil est marqué sans texte : c'est l'appelant qui fournit le libellé.
    expect(screen.queryByText(/seuil/)).toBeNull()
  })

  it('rend la version compacte avec sa propre échelle', () => {
    const { container } = render(<CompactMeter label="spec" value={3} max={3} />)

    expect(screen.getByText('spec')).toBeInTheDocument()
    expect(container.querySelector('[style*="width: 100%"]')).not.toBeNull()
  })

  it('ne produit pas de CSS invalide sur une donnée cassée', () => {
    // Une valeur non numérique (`NaN` d'un JSON mal lu) ne doit pas fabriquer un
    // `width: NaN%` : la barre tombe à zéro et la page reste lisible.
    const { container } = render(<Meter label="spec" value={Number.NaN} max={3} />)

    expect(container.querySelector('[style*="NaN"]')).toBeNull()
    expect(container.querySelector('[style*="width: 0%"]')).not.toBeNull()
  })

  it('laisse l’appelant fusionner ses classes', () => {
    const { container } = render(<Meter label="spec" value={1} max={3} className="status-ok" />)

    expect(container.querySelector('.status-ok')).not.toBeNull()
  })
})