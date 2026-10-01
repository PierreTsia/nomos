import { readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'

/**
 * La frontière du cœur tient aussi au router (ADR 0014) : la synchro URL est une
 * couture contrôlée côté app, donc aucun fichier du design system ne doit importer
 * `react-router` — sinon la table cesserait d'être app-agnostique.
 */
describe('la frontière du design system', () => {
  it('n’importe jamais le router', () => {
    const source = path.resolve(import.meta.dirname, '..')
    const walk = (dir: string): string[] =>
      readdirSync(dir).flatMap((entry) => {
        const full = path.join(dir, entry)
        return statSync(full).isDirectory() ? walk(full) : [full]
      })
    const offenders = walk(source)
      .filter((file) => /\.(ts|tsx|mjs|mts)$/.test(file) && !/\.test\./.test(file))
      .filter((file) => /from\s+['"]react-router(-\w+)?['"]/.test(readFileSync(file, 'utf8')))
      .map((file) => path.relative(source, file))

    expect(offenders).toEqual([])
  })
})
