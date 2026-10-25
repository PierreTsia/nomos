import type { ComponentType } from 'react'

/**
 * Le registre des **scénarios** (le beat 2 de #59). La scène d'une brique vit dans
 * `src/examples/<brique>.tsx` : le site la **rend**, et son code coloré vient du module
 * `virtual:nomos-snippets` (généré au build depuis le même fichier) — donc le snippet ne
 * peut pas être mort.
 *
 * Opt-in (#59) : une brique sans fichier n'a pas de beat 2, la page enchaîne 1 → 3.
 */

type Module = { default: ComponentType }
type SceneModule = Module & { title: string; summary: string }

const modules = import.meta.glob('./examples/*.tsx', { eager: true }) as Record<string, Module>
const sceneModules = import.meta.glob('./examples/scenes/*.tsx', { eager: true }) as Record<
  string,
  SceneModule
>

/** Le composant de scénario par brique, dérivé du glob (optionnel : toutes n'en ont pas). */
export const scenarioComponents: Record<string, ComponentType> = Object.fromEntries(
  Object.entries(modules).map(([path, mod]) => [
    path.replace('./examples/', '').replace('.tsx', ''),
    mod.default,
  ]),
)

/** Les briques qui portent un scénario (le beat 2). */
export const scenarioNames: string[] = Object.keys(scenarioComponents)

/** Le composant de scénario d'une brique, ou `undefined` (le beat 2 est optionnel). */
export function scenarioFor(brick: string): ComponentType | undefined {
  return scenarioComponents[brick]
}

export type Scene = { name: string; title: string; summary: string; Example: ComponentType }

/** Les scènes « écran entier » de la galerie (#41), dérivées de leurs fichiers. */
export const scenes: Scene[] = Object.entries(sceneModules)
  .map(([path, mod]) => ({
    name: path.replace('./examples/scenes/', '').replace('.tsx', ''),
    title: mod.title,
    summary: mod.summary,
    Example: mod.default,
  }))
  .sort((a, b) => a.name.localeCompare(b.name))
