import type { ComponentType } from 'react'

/**
 * Le registre des **scénarios** (le beat 2 de #59). La scène d'une brique vit dans
 * `src/examples/<brique>.tsx` : le site la **rend** et montre son **fichier entier** via
 * `?raw` — le même fichier, donc le snippet ne peut pas être mort (il compile dans le build).
 *
 * Opt-in (#59) : une brique sans fichier n'a pas de beat 2, la page enchaîne 1 → 3. Le
 * `?raw` ne s'applique jamais au beat 1, qui reste `manifest.example` généré (`snippet.ts`).
 */

type Module = { default: ComponentType }
type SceneModule = Module & { title: string; summary: string }

const modules = import.meta.glob('./examples/*.tsx', { eager: true }) as Record<string, Module>
const sources = import.meta.glob('./examples/*.tsx', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const sceneModules = import.meta.glob('./examples/scenes/*.tsx', { eager: true }) as Record<
  string,
  SceneModule
>
const sceneSources = import.meta.glob('./examples/scenes/*.tsx', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

/** Les briques qui portent un scénario (le beat 2), dérivées du glob. */
export const scenarioNames: string[] = Object.keys(modules).map((path) =>
  path.replace('./examples/', '').replace('.tsx', ''),
)

export type Scenario = { Example: ComponentType; source: string }

/** Le scénario d'une brique, ou `undefined` si elle n'en a pas (le beat 2 est optionnel). */
export function scenarioFor(brick: string): Scenario | undefined {
  const path = `./examples/${brick}.tsx`
  const mod = modules[path]
  return mod ? { Example: mod.default, source: sources[path] } : undefined
}

export type Scene = { name: string; title: string; summary: string; Example: ComponentType; source: string }

/** Les scènes « écran entier » de la galerie (#41), dérivées de leurs fichiers. */
export const scenes: Scene[] = Object.entries(sceneModules)
  .map(([path, mod]) => ({
    name: path.replace('./examples/scenes/', '').replace('.tsx', ''),
    title: mod.title,
    summary: mod.summary,
    Example: mod.default,
    source: sceneSources[path],
  }))
  .sort((a, b) => a.name.localeCompare(b.name))
