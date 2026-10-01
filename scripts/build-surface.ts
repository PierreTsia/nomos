import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { catalogue } from '@nomos/catalogue/registry'
import { appViewUri, compositeViewUri } from '@nomos/mcp/app-view'
import { composites } from '@nomos/mcp/composites'
import { TOKENS_URI, componentUri } from '@nomos/mcp/server'

/**
 * Le **snapshot de la surface publique** de Nomos (ADR 0024). Il liste ce dont un
 * consommateur dépend — les exports JS, les noms d'outils et d'URIs MCP, les littéraux des
 * messages, les emplacements de tokens — et un `surface:check` en CI rougit à toute dérive :
 * **on ne peut pas changer la surface sans éditer ce fichier dans la même PR**, c'est l'acte
 * de documenter. Même idiome que `tokens:check` / `view:check`.
 */
const HERE = path.dirname(fileURLToPath(import.meta.url))
const DS = path.resolve(HERE, '..')
const TARGET = path.join(DS, 'surface.generated.json')

const read = (rel: string) => readFileSync(path.join(DS, rel), 'utf8')

/** Les noms exportés de `src/index.ts` (valeurs et types) — la surface JS. */
function indexExports(): string[] {
  const names = new Set<string>()
  for (const match of read('src/index.ts').matchAll(/export\s+(?:type\s+)?\{([^}]+)\}/g)) {
    for (const raw of match[1].split(',')) {
      const name = raw.trim().replace(/^type\s+/, '').split(/\s+as\s+/).pop()?.trim()
      if (name) names.add(name)
    }
  }
  return [...names].sort()
}

function literals(text: string, re: RegExp): string[] {
  return [...new Set([...text.matchAll(re)].map((m) => m[1]))].sort()
}

const componentNames = catalogue.map((entry) => entry.manifest.name)
const sceneNames = composites.map((composite) => composite.name)

const tokens = JSON.parse(read('tokens/tokens.resource.json')) as {
  modes: string[]
  densities: Record<string, unknown>
  slots: Record<string, Record<string, string>>
}

const surface = {
  $description:
    'Surface publique de Nomos. Un consommateur en dépend : ne la changez pas sans le vouloir, et éditez ce fichier dans la même PR.',
  exports: indexExports(),
  mcp: {
    tools: [
      'get_component',
      'list_components',
      'list_scenes',
      'preview_component',
      ...componentNames.map((name) => `render_${name}`),
      ...sceneNames.map((name) => `render_scene_${name}`),
    ].sort(),
    resources: [
      TOKENS_URI,
      ...componentNames.map((name) => componentUri(name)),
      ...componentNames.map((name) => appViewUri(name)),
      ...sceneNames.map((name) => compositeViewUri(name)),
    ].sort(),
  },
  messages: {
    host: literals(read('src/mcp/view-contract.ts'), /type:\s*'([a-z-]+)'/g),
    intents: literals(
      read('src/mcp/view/bridge.ts') + read('src/mcp/view/entry.tsx'),
      /emit\('([a-z]+)'/g,
    ),
  },
  tokens: {
    modes: [...tokens.modes].sort(),
    densities: Object.keys(tokens.densities).sort(),
    slots: Object.fromEntries(
      tokens.modes.map((mode) => [mode, Object.keys(tokens.slots[mode] ?? {}).sort()]),
    ),
  },
}

const next = `${JSON.stringify(surface, null, 2)}\n`

if (process.argv.includes('--check')) {
  let current: string
  try {
    current = readFileSync(TARGET, 'utf8')
  } catch {
    current = ''
  }
  if (current !== next) {
    console.error(
      'surface.generated.json est périmé (surface publique modifiée) : rejouer `npm run build:surface`.',
    )
    process.exit(1)
  }
  console.log('à jour  surface.generated.json')
} else {
  writeFileSync(TARGET, next, 'utf8')
  console.log(
    `écrit   surface.generated.json (${surface.exports.length} exports, ${surface.mcp.tools.length} outils)`,
  )
}
