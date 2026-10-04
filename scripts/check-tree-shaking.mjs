#!/usr/bin/env node
/**
 * Garde de l'élagage (#104, ADR 0035). Le paquet publié est un arbre ESM par module ; un
 * consommateur qui importe **une** brique ne doit pas embarquer le reste du catalogue.
 *
 * Le test construit le paquet **déjà compilé** (`dist`, donc `build:package` doit avoir
 * tourné) comme le ferait un consommateur : une entrée qui n'importe qu'un `Badge`, les
 * dépendances externes laissées au consommateur. Puis il vérifie que le code interne reste
 * minuscule et ne porte **aucun** marqueur du catalogue ou de zod — le symptôme exact de
 * #104 (`import { Badge }` embarquait les ~60 composants).
 */
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { build } from 'vite'

import { makeExternal } from './external.mjs'

const DS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST_ENTRY = path.join(DS, 'dist', 'index.js')

const CEILING_BYTES = 24 * 1024
/** Des symboles présents seulement si le module du catalogue (et zod) entre dans le bundle. */
const FORBIDDEN = ['FacetedDataTable', 'findComponent', 'compositeNames', 'componentManifestSchema']

const pkg = JSON.parse(readFileSync(path.join(DS, 'package.json'), 'utf8'))
const external = makeExternal(Object.keys(pkg.dependencies ?? {}))

const tmp = mkdtempSync(path.join(os.tmpdir(), 'nomos-size-'))
const outDir = path.join(tmp, 'out')
const entry = path.join(tmp, 'entry.js')
writeFileSync(entry, "import { Badge } from '@nomosui/react'\nconsole.log(Badge)\n")

let failure = ''

try {
  await build({
    configFile: false,
    root: DS,
    logLevel: 'error',
    resolve: { alias: { '@nomosui/react': DIST_ENTRY } },
    build: {
      outDir,
      emptyOutDir: true,
      minify: false,
      lib: { entry, formats: ['es'], fileName: () => 'bundle.js' },
      rollupOptions: { external },
    },
  })

  const bundle = readFileSync(path.join(outDir, 'bundle.js'), 'utf8')
  const bytes = Buffer.byteLength(bundle)
  const leaked = FORBIDDEN.filter((marker) => bundle.includes(marker))

  if (leaked.length) {
    failure = `tree-shaking: importing Badge pulled the catalogue (markers: ${leaked.join(', ')}).`
  } else if (bytes > CEILING_BYTES) {
    failure = `tree-shaking: importing Badge produced ${bytes} B (> ${CEILING_BYTES} B) — the barrel is not shaken.`
  } else {
    console.log(`up to date  tree-shaking (Badge alone → ${bytes} B, no catalogue leak)`)
  }
} finally {
  rmSync(tmp, { recursive: true, force: true })
}

if (failure) {
  console.error(failure)
  process.exitCode = 1
}
