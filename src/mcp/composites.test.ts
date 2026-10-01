import { renderToStaticMarkup } from 'react-dom/server'

import { compositeNames, composites, findComposite } from '@nomos/mcp/composites'

/** Les scènes composites assemblent des briques du catalogue ; elles se rendent seules. */
describe('les scènes composites', () => {
  it('porte un nom unique et se rend sans provider d’app', () => {
    expect(new Set(compositeNames).size).toBe(composites.length)

    for (const composite of composites) {
      expect(renderToStaticMarkup(composite.render()).length, composite.name).toBeGreaterThan(0)
    }
  })

  it('dit ce qui est connu quand le nom est introuvable', () => {
    expect(() => findComposite('inconnu')).toThrow(/introuvable/)
  })
})
