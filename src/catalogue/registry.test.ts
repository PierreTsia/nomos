import {
  catalogue,
  componentNames,
  findComponent,
  validateCatalogue,
  type CatalogueEntry,
} from '@nomos/catalogue/registry'
import { badgeManifest } from '@nomos/components/badge/manifest'

/**
 * L'index du catalogue : ce que la page de style rend et ce que le serveur MCP servira.
 * Un index refusé doit dire quel composant et pourquoi — sinon la garde est muette.
 */
const entry = (over: Partial<CatalogueEntry> = {}): CatalogueEntry =>
  ({
    manifest: badgeManifest,
    component: () => null,
    variantsConfig: {},
    ...over,
  }) as CatalogueEntry

describe('le catalogue', () => {
  it('expose le Badge par son nom', () => {
    expect(componentNames).toContain('badge')
    expect(findComponent('badge').manifest.title).toBe('Badge')
  })

  it('expose le Meter, un atome qui se rend hors de la table', () => {
    expect(componentNames).toContain('meter')
    expect(findComponent('meter').manifest.level).toBe('primitive')
  })

  it('rend un composant, pas seulement une description', () => {
    expect(typeof findComponent('badge').component).toBe('function')
  })

  it('lève sur un nom inconnu, en nommant les composants connus', () => {
    expect(() => findComponent('grille')).toThrow(/introuvable.*badge/s)
  })

  it('refuse un manifeste qui ne respecte pas le contrat, en le nommant', () => {
    expect(() => validateCatalogue([entry({ manifest: { ...badgeManifest, usages: [] } })])).toThrow(
      /badge.*contrat/s,
    )
  })

  it('refuse deux composants du même nom', () => {
    expect(() => validateCatalogue([entry(), entry()])).toThrow(/deux manifestes.*badge/)
  })

  it('accepte l’index réel : c’est bien lui qui est exposé', () => {
    expect(validateCatalogue(catalogue)).toEqual(catalogue)
  })
})