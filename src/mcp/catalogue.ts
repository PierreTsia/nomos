import type { ComponentManifest } from '@nomos/catalogue/contract'
import { catalogue, findComponent } from '@nomos/catalogue/registry'
import { composites } from '@nomos/mcp/composites'
import { tokensResource } from '@nomos/tokens/resource'

/**
 * La couche de lecture du catalogue, pure et déterministe : c'est elle que le serveur
 * MCP expose, et elle ne dépend ni du transport ni du protocole (ADR 0003, ADR 0005).
 * La page de style et le serveur lisent donc le même inventaire — `catalogue`.
 */

export type ComponentSummary = {
  name: string
  title: string
  level: string
  summary: string
}

export type ComponentPreview = {
  name: string
  title: string
  example: Record<string, unknown>
  variants: ComponentManifest['variants']
  usages: ComponentManifest['usages']
}

/** Tout ce qui se cherche : le nom, le titre, le résumé et l'intention des usages. */
function haystack(manifest: ComponentManifest): string {
  return [
    manifest.name,
    manifest.title,
    manifest.summary,
    ...manifest.usages.map((usage) => `${usage.when} ${usage.use}`),
  ]
    .join(' ')
    .toLowerCase()
}

export function listComponents(query?: string): ComponentSummary[] {
  const term = (query ?? '').trim().toLowerCase()
  return catalogue
    .filter(({ manifest }) => !term || haystack(manifest).includes(term))
    .map(({ manifest }) => ({
      name: manifest.name,
      title: manifest.title,
      level: manifest.level,
      summary: manifest.summary,
    }))
}

export function getComponent(name: string): ComponentManifest {
  return findComponent(name).manifest
}

/** La recette de rendu d'un composant : ses props d'exemple, ses variantes, ses usages. */
export function previewComponent(name: string): ComponentPreview {
  const manifest = getComponent(name)
  return {
    name: manifest.name,
    title: manifest.title,
    example: manifest.example ?? {},
    variants: manifest.variants,
    usages: manifest.usages,
  }
}

export const componentNames: string[] = catalogue.map((entry) => entry.manifest.name)

/** Une **scène composite** : plusieurs briques assemblées, servie comme vue MCP Apps. */
export type SceneSummary = {
  name: string
  title: string
  summary: string
}

export function listScenes(): SceneSummary[] {
  return composites.map(({ name, title, summary }) => ({ name, title, summary }))
}

export const tokens: typeof tokensResource = tokensResource
