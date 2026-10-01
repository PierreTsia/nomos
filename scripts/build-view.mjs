#!/usr/bin/env node
/**
 * Construit le bundle de la vue MCP App et l'écrit comme constante TypeScript committée
 * (`src/mcp/view.generated.ts`), sur le même principe que les tokens : la source est le
 * code, le rendu est généré, et il se rejoue par `npm run build:view`.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { build } from 'vite'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const DS = path.resolve(HERE, '..')
const OUT = path.join(DS, '.view-dist')
const TARGET = path.join(DS, 'src', 'mcp', 'view.generated.ts')

await build({
  configFile: false,
  root: DS,
  logLevel: 'warn',
  // Sans ça, React arrive avec `process.env.NODE_ENV` non remplacé dans le bundle, et la
  // vue lève un `ReferenceError` dans l'iframe (pas de `process` côté navigateur).
  define: { 'process.env.NODE_ENV': '"production"' },
  resolve: {
    alias: {
      '@nomos/derived': path.join(DS, 'tokens'),
      '@nomos': path.join(DS, 'src'),
    },
  },
  build: {
    outDir: OUT,
    emptyOutDir: true,
    minify: true,
    lib: {
      entry: path.join(DS, 'src', 'mcp', 'view', 'entry.tsx'),
      formats: ['iife'],
      name: 'AgentOsView',
      fileName: () => 'view.js',
    },
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
})

const js = readFileSync(path.join(OUT, 'view.js'), 'utf8')
const header =
  '/**\n * Généré par scripts/build-view.mjs — ne pas éditer à la main.\n * Rejouer : npm run build:view\n */\n'
const next = `${header}export const VIEW_BUNDLE = ${JSON.stringify(js)}\n`

const check = process.argv.includes('--check')
if (check) {
  let current = ''
  try {
    current = readFileSync(TARGET, 'utf8')
  } catch {
    current = ''
  }
  if (current !== next) {
    console.error('src/mcp/view.generated.ts est périmé : rejouer `npm run build:view`.')
    process.exit(1)
  }
  console.log('à jour  src/mcp/view.generated.ts')
} else {
  writeFileSync(TARGET, next, 'utf8')
  console.log(`écrit   src/mcp/view.generated.ts (${js.length} octets)`)
}
