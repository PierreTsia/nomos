import type { ComponentType } from 'react'

/**
 * The **scenario** registry (beat 2 of #59). A brick's scene lives in
 * `src/examples/<brick>.tsx`: the site **renders** it, and its highlighted code comes from
 * the `virtual:nomos-snippets` module (built at build time from the same file) — so the
 * snippet cannot be dead.
 *
 * Opt-in (#59): a brick with no file has no beat 2; the page goes 1 → 3.
 */

type Module = { default: ComponentType }
type SceneModule = Module & { title: string; summary: string }

const modules = import.meta.glob('./examples/*.tsx', { eager: true }) as Record<string, Module>
const sceneModules = import.meta.glob('./examples/scenes/*.tsx', { eager: true }) as Record<
  string,
  SceneModule
>

/** The scenario component per brick, derived from the glob (optional: not every brick has one). */
export const scenarioComponents: Record<string, ComponentType> = Object.fromEntries(
  Object.entries(modules).map(([path, mod]) => [
    path.replace('./examples/', '').replace('.tsx', ''),
    mod.default,
  ]),
)

/** The bricks that carry a scenario (beat 2). */
export const scenarioNames: string[] = Object.keys(scenarioComponents)

/** A brick's scenario component, or `undefined` (beat 2 is optional). */
export function scenarioFor(brick: string): ComponentType | undefined {
  return scenarioComponents[brick]
}

export type Scene = { name: string; title: string; summary: string; Example: ComponentType }

/** The gallery's whole-screen scenes (#41), derived from their files. */
export const scenes: Scene[] = Object.entries(sceneModules)
  .map(([path, mod]) => ({
    name: path.replace('./examples/scenes/', '').replace('.tsx', ''),
    title: mod.title,
    summary: mod.summary,
    Example: mod.default,
  }))
  .sort((a, b) => a.name.localeCompare(b.name))
