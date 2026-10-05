import { existsSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { createElement } from 'react'
import { cleanup, render, screen } from '@testing-library/react'

import { catalogue } from '@nomos/catalogue/registry'

/**
 * La cohérence entre le manifeste et le composant qu'il décrit (ADR 0005). C'est ce
 * test qui empêche le catalogue de pourrir : une variante ajoutée au composant sans
 * passer par le manifeste rougit ici, et une prop documentée qui n'est plus acceptée
 * aussi. Le manifeste écrit à la main reste tenu par la machine.
 */

const COMPONENTS = path.resolve(import.meta.dirname, '..', 'components')

function componentDirs(): string[] {
  return readdirSync(COMPONENTS)
    .filter((entry) => statSync(path.join(COMPONENTS, entry)).isDirectory())
    .sort()
}

/**
 * Une sonde du même type que la prop déclarée : une chaîne envoyée à une prop numérique
 * ferait échouer le test pour la mauvaise raison (CSS invalide, pas prop ignorée).
 */
function probeFor(type: string, baseline: unknown): unknown {
  if (type.includes('=>')) return () => 'sonde-seuil'
  if (type.includes('[]')) return baseline
  if (/^number/.test(type)) return typeof baseline === 'number' ? baseline + 1 : 1
  if (/^boolean/.test(type)) return !baseline
  // Une prop objet (un type nommé, une `Date`…) se sonde avec l'exemple : un `'sonde'`
  // la ferait exploser pour la mauvaise raison. Plafond connu : un futur `check: 'rendered'`
  // sur une prop objet resterait insatisfiable (avec et sans l'exemple rendent pareil).
  if (baseline !== undefined && typeof baseline === 'object') return baseline
  return 'sonde'
}

describe('le catalogue et les composants du cœur', () => {
  it('chaque dossier de composant porte son manifeste et son composant', () => {
    for (const dir of componentDirs()) {
      const files = readdirSync(path.join(COMPONENTS, dir))
      expect(files, `${dir} : manifeste`).toContain('manifest.ts')
      expect(
        files.filter((file) => file.endsWith('.tsx') && !file.includes('.test.')),
        `${dir} : composant`,
      ).not.toHaveLength(0)
    }
  })

  it('chaque composant du cœur est au catalogue', () => {
    expect(catalogue.map((entry) => entry.manifest.name).sort()).toEqual(componentDirs())
  })

  it('le nom du manifeste est celui de son dossier', () => {
    for (const dir of componentDirs()) {
      expect(catalogue.find((entry) => entry.manifest.name === dir), `${dir}`).toBeDefined()
      expect(existsSync(path.join(COMPONENTS, dir, 'manifest.ts'))).toBe(true)
    }
  })

  it('chaque variante documentée existe dans la config, avec les mêmes valeurs et le même défaut', () => {
    for (const { manifest, variantsConfig } of catalogue) {
      for (const variant of manifest.variants) {
        const config = variantsConfig[variant.name]
        expect(config, `${manifest.name} : config de \`${variant.name}\``).toBeDefined()
        expect(
          Object.keys(config.variants?.[variant.name] ?? {}).sort(),
          `${manifest.name} : valeurs de \`${variant.name}\``,
        ).toEqual([...variant.values].sort())
        if (variant.default) {
          expect(
            config.defaultVariants?.[variant.name],
            `${manifest.name} : défaut de \`${variant.name}\``,
          ).toBe(variant.default)
        }
      }
    }
  })

  it('aucun groupe de variantes du composant n’est absent du manifeste', () => {
    for (const { manifest, variantsConfig } of catalogue) {
      const documented = manifest.variants.map((variant) => variant.name).sort()
      expect(Object.keys(variantsConfig).sort(), `${manifest.name} : groupes documentés`).toEqual(
        documented,
      )
    }
  })

  it('chaque prop documentée est réellement acceptée par le composant', () => {
    for (const { manifest, component } of catalogue) {
      // Les contrôles partent de l'exemple du manifeste : une prop se vérifie sur un
      // composant qui se rend, donc avec ses autres props requises déjà posées.
      const example = manifest.example ?? {}
      for (const prop of manifest.props) {
        if (prop.check === 'attribute') {
          render(createElement(component, { ...example, [prop.name]: 'sonde-coherence' }))
          expect(
            document.querySelector(`[${prop.name}="sonde-coherence"]`),
            `${manifest.name} : \`${prop.name}\` transmise au DOM`,
          ).not.toBeNull()
        }
        if (prop.check === 'class') {
          render(createElement(component, { ...example, [prop.name]: 'sonde-classe' }))
          expect(document.querySelector('.sonde-classe'), `${manifest.name} : \`${prop.name}\``).not.toBeNull()
        }
        if (prop.check === 'content') {
          render(createElement(component, { ...example }, 'sonde-contenu'))
          expect(screen.getByText('sonde-contenu'), `${manifest.name} : contenu`).toBeInTheDocument()
        }
        if (prop.check === 'rendered') {
          // Une prop consommée ne se voit pas dans le DOM : on rend avec et sans elle,
          // et c'est la différence qui prouve qu'elle est bien lue. La sonde doit avoir
          // le type déclaré — une chaîne envoyée à une prop numérique produirait un CSS
          // invalide, et le test échouerait pour la mauvaise raison.
          const { children, ...rest } = example
          const probe = example[prop.name]
          const other = probeFor(prop.type, probe)
          const withProp = render(
            createElement(component, { ...rest, [prop.name]: other }, children as never),
          ).container.innerHTML
          const without = render(
            createElement(component, { ...rest, [prop.name]: probe }, children as never),
          ).container.innerHTML
          expect(withProp, `${manifest.name} : \`${prop.name}\` change le rendu`).not.toEqual(
            without,
          )
        }
        if (prop.check === 'accepted') {
          // Une prop de données ou un rappel ne se voit pas dans le DOM : on prouve
          // qu'elle est acceptée en rendant le composant avec elle, sans qu'il lève.
          const { children, ...rest } = example
          const probe = probeFor(prop.type, example[prop.name])
          const { container } = render(
            createElement(component, { ...rest, [prop.name]: probe }, children as never),
          )
          expect(container.innerHTML, `${manifest.name} : \`${prop.name}\` acceptée`).not.toBe('')
        }
        // `cleanup` (pas `document.body.innerHTML = ''`) : un composant qui rend dans un
        // portail — `Dialog` — laisserait sinon React retirer un nœud déjà détaché.
        cleanup()
      }
    }
  })
})