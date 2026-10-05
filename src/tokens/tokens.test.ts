import { readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'

import {
  buildResource,
  cssValue,
  defaultDensity,
  defaultMode,
  densities,
  modes,
  renderCss,
  resolve,
  semanticTokens,
  slotsFor,
} from '@nomos/tokens/build.mjs'

/**
 * Les tokens sont la source unique (ADR 0004). Ce fichier est la garde : il vérifie
 * qu'aucun mode n'oublie un emplacement, que les rendus sont à jour, et que rien ne
 * réintroduit une valeur en dur — ni dans l'app, ni dans un composant du design system.
 */

const HERE = path.resolve(import.meta.dirname)
const DS = path.resolve(HERE, '..', '..')

const SOURCE = path.join(DS, 'tokens', 'tokens.json')
const GENERATED_CSS = path.join(DS, 'tokens', 'tokens.generated.css')
const RESOURCE = path.join(DS, 'tokens', 'tokens.resource.json')

const doc = JSON.parse(readFileSync(SOURCE, 'utf8'))
const copy = () => JSON.parse(JSON.stringify(doc))

function walk(dir: string, extensions: string[]): string[] {
  const found: string[] = []
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) {
      if (entry === 'node_modules' || entry === 'dist') continue
      found.push(...walk(full, extensions))
    } else if (extensions.some((ext) => entry.endsWith(ext))) {
      found.push(full)
    }
  }
  return found
}

describe('tokens.json — la source unique', () => {
  it('déclare ses modes et un mode par défaut qui en fait partie', () => {
    expect(modes(doc)).toEqual(['dark', 'light'])
    expect(defaultMode(doc)).toBe('dark')
  })

  it('déclare ses densités et une densité par défaut qui en fait partie', () => {
    expect(Object.keys(densities(doc))).toEqual(['comfortable', 'compact'])
    expect(defaultDensity(doc)).toBe('comfortable')
    expect(densities(doc).compact).toBeLessThan(densities(doc).comfortable)
  })

  it('pose la densité sur la racine, sans que les composants la connaissent', () => {
    const css = renderCss(doc)
    expect(css).toContain('--nomos-density: 1')
    expect(css).toContain("[data-density='compact']")
  })

  it('remplit chaque emplacement sémantique dans chacun de ses modes', () => {
    for (const mode of modes(doc)) {
      for (const token of semanticTokens(doc).keys()) {
        expect(() => resolve(doc, token, mode), `${token} / ${mode}`).not.toThrow()
      }
    }
  })

  it('rend les deux modes sur exactement les mêmes emplacements', () => {
    const perMode = modes(doc).map((mode) => Object.keys(slotsFor(doc, mode)).sort())
    for (const slots of perMode.slice(1)) expect(slots).toEqual(perMode[0])
    expect(perMode[0].length).toBeGreaterThan(0)
  })

  it('échoue quand un mode n’est pas rempli, au lieu de produire un blanc', () => {
    const broken = copy()
    delete broken.semantic.color.background.$value.light

    expect(() => resolve(broken, 'color.background', 'light')).toThrow(
      /does not fill the slot/,
    )
  })

  it('échoue quand un alias ne pointe nulle part', () => {
    const broken = copy()
    broken.semantic.color.border.$value.dark = '{primitive.color.absent.100}'

    expect(() => resolve(broken, 'color.border', 'dark')).toThrow(/does not exist/)
  })

  it('échoue sur un alias cyclique', () => {
    const broken = copy()
    broken.semantic.color.border.$value.dark = '{semantic.color.border.$value.dark}'

    expect(() => resolve(broken, 'color.border', 'dark')).toThrow(/points to/)
  })

  it('rend une couleur en triples HSL et une dimension en valeur + unité', () => {
    expect(cssValue({ colorSpace: 'hsl', components: [174, 100, 39] })).toBe('174 100% 39%')
    expect(cssValue({ value: 0.625, unit: 'rem' })).toBe('0.625rem')
    expect(cssValue(['ui-sans-serif', 'Segoe UI'], 'fontFamily')).toBe(
      'ui-sans-serif, "Segoe UI"',
    )
  })

  it('porte l’alpha et la courbe dans le token, pas dans la classe (ADR 0027)', () => {
    expect(cssValue({ colorSpace: 'hsl', components: [0, 0, 0, 0.8] })).toBe('0 0% 0% / 0.8')
    expect(cssValue([0.4, 0, 0.2, 1], 'cubicBezier')).toBe('cubic-bezier(0.4, 0, 0.2, 1)')
  })

  it('rend une ombre (mono- et multi-couche) en texte CSS', () => {
    const layer = { color: 'rgb(0 0 0 / 0.1)', offsetX: '0px', offsetY: '1px', blur: '2px', spread: '0px' }
    expect(cssValue([layer], 'shadow')).toBe('0px 1px 2px 0px rgb(0 0 0 / 0.1)')
    expect(cssValue([layer, { ...layer, offsetY: '4px' }], 'shadow')).toBe(
      '0px 1px 2px 0px rgb(0 0 0 / 0.1), 0px 4px 2px 0px rgb(0 0 0 / 0.1)',
    )
  })

  it('refuse un tableau sans type plutôt que de rendre un blanc', () => {
    expect(() => cssValue(['ui-sans-serif'])).toThrow(/requires its token's .\$type./)
  })
})

describe('les rendus dérivés', () => {
  it('le CSS de la source est celui qui est committé', () => {
    expect(readFileSync(GENERATED_CSS, 'utf8')).toBe(renderCss(doc))
  })

  it('la ressource servie aux agents est celle qui est committée', () => {
    expect(readFileSync(RESOURCE, 'utf8')).toBe(JSON.stringify(buildResource(doc), null, 2) + '\n')
  })

  it('le CSS remplit chaque mode sur les mêmes emplacements', () => {
    const css = readFileSync(GENERATED_CSS, 'utf8')
    const perMode = modes(doc).map((mode) => {
      const block = new RegExp(`\\.${mode}, \\[data-theme='${mode}'\\] \\{([\\s\\S]*?)\\n  \\}`)
      const match = css.match(block)
      expect(match, `bloc CSS du mode ${mode}`).not.toBeNull()
      return [...match![1].matchAll(/^\s*(--nomos-[a-z0-9-]+):/gm)].map((m) => m[1]).sort()
    })
    expect(perMode[1]).toEqual(perMode[0])
    expect(perMode[0]).toContain('--nomos-color-background')
    expect(perMode[0]).toContain('--nomos-color-outline')
    expect(perMode[0]).toContain('--nomos-elevation-md')
  })
})

describe('la disparition des valeurs en dur', () => {
  it('aucun composant du design system ne connaît le mode', () => {
    const offenders = walk(path.join(DS, 'src'), ['.ts', '.tsx'])
      .filter((file) => !file.endsWith('.test.ts') && !file.endsWith('.test.tsx'))
      .filter((file) => /\bdark:/.test(readFileSync(file, 'utf8')))
      .map((file) => path.relative(DS, file))

    expect(offenders).toEqual([])
  })

  it('aucun composant du cœur ne fige une longueur d’espacement ou de hauteur', () => {
    // L'espacement passe par l'échelle `--spacing`, que la densité multiplie (ADR 0008).
    // Une longueur figée (`p-[13px]`, `h-[2rem]`) échapperait à la densité : c'est ce
    // qu'on refuse. Les tailles de police (`text-[11px]`) ne sont pas de l'espacement.
    const fixed =
      /\b(?:min-w|max-w|min-h|max-h|size|gap|space-[xy]|p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|inset|top|right|bottom|left|h|w)-\[[0-9.]+(?:px|rem|em)\]/
    const offenders = walk(path.join(DS, 'src'), ['.ts', '.tsx'])
      .filter((file) => !file.endsWith('.test.ts') && !file.endsWith('.test.tsx'))
      .filter((file) => fixed.test(readFileSync(file, 'utf8')))
      .map((file) => path.relative(DS, file))

    expect(offenders).toEqual([])
  })
})
