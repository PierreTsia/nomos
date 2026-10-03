import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { catalogue } from '@nomos/catalogue/registry'
import { appViewUri, compositeViewUri } from '@nomos/mcp/app-view'
import { composites } from '@nomos/composites'
import { TOKENS_URI, componentUri } from '@nomos/mcp/server'
import { INTENTS } from '@nomos/mcp/view-contract'

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

/** Les noms exportés d'un module (valeurs et types). */
function exportsOf(rel: string): string[] {
  const source = read(rel)
  const names = new Set<string>()
  for (const match of source.matchAll(/export\s+(?:type\s+)?\{([^}]+)\}/g)) {
    for (const raw of match[1].split(',')) {
      const name = raw.trim().replace(/^type\s+/, '').split(/\s+as\s+/).pop()?.trim()
      if (name) names.add(name)
    }
  }
  for (const match of source.matchAll(
    /export\s+(?:function|const|class|type|interface)\s+([A-Za-z0-9_]+)/g,
  )) {
    names.add(match[1])
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
    'The public surface of Nomos. A consumer depends on it: do not change it without meaning to, and edit this file in the same PR.',
  exports: exportsOf('src/index.ts'),
  view: {
    entry: './view',
    exports: exportsOf('src/view/index.ts'),
  },
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
    methods: literals(read('src/mcp/view-contract.ts'), /'(ui\/[^']+|notifications\/message)'/g),
    intents: [...INTENTS].sort(),
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
      'surface.generated.json is stale (public surface changed): replay `npm run build:surface`.',
    )
    process.exit(1)
  }
  console.log('up to date  surface.generated.json')
} else {
  writeFileSync(TARGET, next, 'utf8')
  console.log(
    `wrote   surface.generated.json (${surface.exports.length} exports, ${surface.mcp.tools.length} tools)`,
  )
}
