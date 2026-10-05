import { readFileSync } from 'node:fs'
import path from 'node:path'

import { cn } from '@nomos/lib/cn'

/**
 * La garde de `cn` : les tailles sémantiques du cœur (`text-lead`, `text-body`…) doivent
 * être déclarées à tailwind-merge, sinon il les prend pour des couleurs de texte et les
 * efface dès qu'une couleur suit. La liste vit dans `tokens/theme.css` ; ce test lit cette
 * source unique pour qu'un nouveau palier ne retombe pas silencieusement dans le bug.
 */
describe('cn — l’échelle typographique du cœur', () => {
  const theme = readFileSync(
    path.resolve(import.meta.dirname, '..', '..', 'tokens', 'theme.css'),
    'utf8',
  )
  const sizes = [...theme.matchAll(/--text-([a-z]+):/g)].map((match) => match[1])

  it('déclare au moins un palier', () => {
    expect(sizes.length).toBeGreaterThan(0)
  })

  it('garde chaque taille quand une couleur de texte la suit', () => {
    for (const size of sizes) {
      expect(cn(`text-${size}`, 'text-muted-foreground'), `text-${size}`).toContain(
        `text-${size}`,
      )
    }
  })

  it('résout deux tailles qui se contredisent', () => {
    expect(cn('text-lead', 'text-body')).toBe('text-body')
  })
})
