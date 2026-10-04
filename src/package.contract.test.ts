import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

/**
 * Le contrat de distribution (ADR 0025) : ce qu'un consommateur externe peut importer.
 * Le paquet n'exposait que `.` ; les CSS du cœur doivent suivre en sous-exports, sinon une
 * app ne peut pas charger le raccord Tailwind ni les valeurs de tokens.
 */
const DS = path.resolve(import.meta.dirname, '..')
const pkg = JSON.parse(readFileSync(path.join(DS, 'package.json'), 'utf8')) as {
  exports: Record<string, string | { default?: string; source?: string }>
  files: string[]
  sideEffects?: boolean | string[]
  dependencies?: Record<string, string>
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
      const entry = typeof target === 'string' ? { default: target } : target
      // Les sous-exports compilés vivent dans `dist` (absent avant `build:package`) : on
      // vérifie leur `source`, livré dans le dépôt.
      const rel = entry.default?.startsWith('./dist/') ? entry.source : entry.default
      expect(rel, subpath).toBeDefined()
      expect(existsSync(path.join(DS, rel as string)), subpath).toBe(true)
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
    // Une source **large** (`dist`), pas une liste de répertoires qui oublierait le prochain.
    expect(theme).toMatch(/@source\s+['"]\.\.\/dist['"]/)
    expect(theme).toMatch(/@source\s+not\s+['"]\.\.\/dist\/mcp['"]/)
  })

  it('est élagable : `sideEffects` ne protège que le CSS (ADR 0035)', () => {
    // Le JS doit être déclaré sans effet de bord pour que le barrel s'élague ; le CSS, lui,
    // s'importe pour son effet (un bundler ne doit pas le supprimer).
    expect(pkg.sideEffects).not.toBe(true)
    expect(pkg.sideEffects).toContain('**/*.css')
  })

  it('garde le SDK MCP hors des dépendances d\'un consommateur (ADR 0035)', () => {
    // `dist/mcp/bin.js` est auto-suffisant (le SDK y est inliné) : le déclarer en
    // `dependencies` alourdirait l'installation de chaque consommateur du cœur sans raison.
    expect(pkg.dependencies?.['@modelcontextprotocol/sdk']).toBeUndefined()
  })
})
