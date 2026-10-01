import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

/**
 * Le contrat de distribution (ADR 0025) : ce qu'un consommateur externe peut importer.
 * Le paquet n'exposait que `.` ; les CSS du cœur doivent suivre en sous-exports, sinon une
 * app ne peut pas charger le raccord Tailwind ni les valeurs de tokens.
 */
const DS = path.resolve(import.meta.dirname, '..')
const pkg = JSON.parse(readFileSync(path.join(DS, 'package.json'), 'utf8')) as {
  exports: Record<string, string | { default?: string }>
  files: string[]
}

const CSS_SUBPATHS = [
  './tokens/theme.css',
  './tokens/tokens.generated.css',
  './tokens/tokens.json',
]

describe('les sous-exports du paquet', () => {
  it('expose le CSS et les tokens du cœur', () => {
    for (const subpath of CSS_SUBPATHS) {
      expect(pkg.exports[subpath], subpath).toBeDefined()
    }
  })

  it('pointe chaque sous-export vers un fichier livré', () => {
    for (const [subpath, target] of Object.entries(pkg.exports)) {
      if (subpath === '.') continue
      const rel = typeof target === 'string' ? target : (target.default ?? '')
      expect(existsSync(path.join(DS, rel)), subpath).toBe(true)
    }
  })

  it('embarque le dossier tokens dans files', () => {
    expect(pkg.files).toContain('tokens')
  })

  it('déclare le paquet compilé comme source Tailwind', () => {
    // Les classes des composants vivent dans `dist`, que le Tailwind du consommateur ne
    // scanne pas (il ignore node_modules) : sans cette source, `bg-popover`, `z-popover`,
    // `shadow-md`… ne se compilent pas et la surcouche se rend transparente.
    const theme = readFileSync(path.join(DS, 'tokens/theme.css'), 'utf8')
    expect(theme).toMatch(/@source\s+['"]\.\.\/dist\/index\.js['"]/)
  })
})
