#!/usr/bin/env node
/**
 * Compile le CSS des vues MCP Apps (ADR 0022) : le raccord Tailwind du cœur + les
 * utilitaires que les composants emploient, sans aucune valeur de token. Le résultat est
 * écrit comme constante TypeScript committée (`src/mcp/view-css.generated.ts`) et se rejoue
 * par `npm run build:view-css` ; `--check` échoue s'il a dérivé — même régime que
 * `view.generated.ts` et `tokens.generated.css`.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import tailwindcss from '@tailwindcss/postcss'
import postcss from 'postcss'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const DS = path.resolve(HERE, '..')
const INPUT = path.join(DS, 'src', 'mcp', 'view.css')
const TARGET = path.join(DS, 'src', 'mcp', 'view-css.generated.ts')

const result = await postcss([tailwindcss()]).process(readFileSync(INPUT, 'utf8'), { from: INPUT })
const css = result.css

const header =
  '/**\n * Généré par scripts/build-view-css.mjs — ne pas éditer à la main.\n * Rejouer : npm run build:view-css\n */\n'
const next = `${header}export const VIEW_CSS = ${JSON.stringify(css)}\n`

if (process.argv.includes('--check')) {
  let current = ''
  try {
    current = readFileSync(TARGET, 'utf8')
  } catch {
    current = ''
  }
  if (current !== next) {
    console.error('src/mcp/view-css.generated.ts est périmé : rejouer `npm run build:view-css`.')
    process.exit(1)
  }
  console.log('à jour  src/mcp/view-css.generated.ts')
} else {
  writeFileSync(TARGET, next, 'utf8')
  console.log(`écrit   src/mcp/view-css.generated.ts (${css.length} octets)`)
}
