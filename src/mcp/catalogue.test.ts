import { componentNames, getComponent, listComponents, previewComponent } from '@nomos/mcp/catalogue'

/**
 * La couche de lecture du catalogue : ce que le serveur MCP sert. Elle est pure et
 * déterministe — aucune I/O, aucune API — donc testable seule.
 */
describe('la lecture du catalogue', () => {
  it('liste tous les composants, puis filtre sur un mot', () => {
    const all = listComponents()
    expect(all.map((entry) => entry.name).sort()).toEqual([...componentNames].sort())

    const filtered = listComponents('badge')
    expect(filtered.map((entry) => entry.name)).toContain('badge')
    expect(filtered).toHaveLength(1)
  })

  it('trouve un composant par l’intention de ses usages', () => {
    expect(listComponents('production').map((entry) => entry.name)).toContain('badge')
  })

  it('est déterministe : deux recherches du même mot rendent la même liste', () => {
    expect(listComponents('table')).toEqual(listComponents('table'))
  })

  it('rend le manifeste d’un composant, et lève sur un nom inconnu', () => {
    expect(getComponent('badge').title).toBe('Badge')
    expect(() => getComponent('grille')).toThrow(/introuvable/)
  })

  it('rend la recette de rendu d’un composant', () => {
    const preview = previewComponent('badge')
    expect(preview.name).toBe('badge')
    expect(preview.example).toBeDefined()
    expect(preview.usages.length).toBeGreaterThan(0)
  })
})
