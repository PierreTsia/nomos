#!/usr/bin/env node
/**
 * Le CLI de dérivation : lit la source unique, écrit les deux rendus (ADR 0004).
 *
 *   npm run tokens          écrit le CSS et la ressource MCP
 *   npm run tokens -- --check   n'écrit rien, sort en 1 si un rendu est périmé
 *
 * `--check` est ce qui rend le test de parité utile en pratique : une valeur changée
 * dans tokens.json sans rejouer la génération fait rougir la vérification, au lieu de
 * passer inaperçue jusqu'à ce que quelqu'un voie un blanc dans l'interface.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { buildResource, renderCss } from '../src/tokens/build.mjs'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const DS = path.resolve(HERE, '..')
const SOURCE = path.join(DS, 'tokens', 'tokens.json')
const TARGETS = [
  {
    file: path.join(DS, 'tokens', 'tokens.generated.css'),
    render: (doc) => renderCss(doc),
  },
  {
    file: path.join(DS, 'tokens', 'tokens.resource.json'),
    render: (doc) => JSON.stringify(buildResource(doc), null, 2) + '\n',
  },
]

const check = process.argv.includes('--check')
const doc = JSON.parse(readFileSync(SOURCE, 'utf8'))

let stale = 0
for (const target of TARGETS) {
  const next = target.render(doc)
  let current = null
  try {
    current = readFileSync(target.file, 'utf8')
  } catch {
    current = null
  }
  const relative = path.relative(DS, target.file)
  if (current === next) {
    console.log(`à jour  ${relative}`)
    continue
  }
  if (check) {
    stale += 1
    const currentLine = current === null ? 0 : current.split('\n').length
    console.log(`périmé  ${relative} (${currentLine} → ${next.split('\n').length} lignes)`)
    continue
  }
  writeFileSync(target.file, next, 'utf8')
  console.log(`écrit   ${relative} (${next.split('\n').length} lignes)`)
}

if (check && stale > 0) {
  console.error(
    `\n${stale} rendu(s) périmé(s) : la source unique a changé sans que la dérivation soit rejouée.`,
  )
  console.error('Rejouer : npm run tokens')
  process.exit(1)
}
