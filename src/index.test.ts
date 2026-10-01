import { renderCss, resolveSkin } from '@nomos/index'

/**
 * La surface publique : ce qu'un consommateur **externe** importe. Le thème (ADR 0022)
 * doit sortir du paquet — sans quoi une app ne peut pas dériver son CSS du skin.
 */
describe('la surface publique', () => {
  it('expose la dérivation du thème', () => {
    expect(typeof resolveSkin).toBe('function')
    expect(typeof renderCss).toBe('function')
  })
})
