#!/usr/bin/env node
/**
 * Construit le paquet distribuable de Nomos (#52, #54) : une sortie ESM auto-suffisante
 * pour un consommateur externe.
 *
 * Le paquet s'écrit avec l'alias interne `@nomos/*`, que seuls le tsconfig/vite de CE
 * dépôt résolvent. Le build le résout (`alias`) et l'inline : la sortie ne garde que les
 * dépendances externes (react, Radix…). Les types sont émis par `tsc`, puis leurs
 * spécificateurs `@nomos/*` réécrits en relatif (sinon un consommateur ne résout rien).
 *
 * Deux entrées : le cœur (`dist/index.js`) et le **serveur MCP** (`dist/mcp/bin.js`,
 * exécutable). Le serveur lit `tokens/tokens.json` par un chemin relatif à la **racine du
 * paquet** : `dist/mcp/bin.js` est à deux niveaux, comme `src/mcp/bin.ts` — le même chemin
 * résout dans le dépôt et dans le paquet publié.
 */
import { execFileSync } from 'node:child_process'
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { build } from 'vite'

import { makeExternal } from './external.mjs'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const DS = path.resolve(HERE, '..')
const DIST = path.join(DS, 'dist')
const TYPES = path.join(DIST, 'types')
const TOKEN_TYPES = path.join(TYPES, 'tokens')

const pkg = JSON.parse(readFileSync(path.join(DS, 'package.json'), 'utf8'))
const deps = Object.keys(pkg.dependencies ?? {})

/** Toute dépendance externe : elle est installée par le consommateur, pas inlinée. */
const external = makeExternal(deps)

const alias = {
  '@nomos/derived': path.join(DS, 'tokens'),
  '@nomos': path.join(DS, 'src'),
}

/** Le cœur : un arbre ESM **par module** (`preserveModules`), pas un bundle unique. Un
 *  consommateur qui importe une brique ne doit pas embarquer les ~60 autres : sous un
 *  unique fichier, l'appel de module `validateCatalogue(...)` (`src/catalogue/registry.ts`)
 *  épingle tout l'index et zod quel que soit l'import, et `sideEffects: false` ne peut pas
 *  l'élaguer (le module est gardé, ses appels internes avec). En sortie par module, le
 *  module du catalogue devient élaguable quand personne ne l'importe (ADR 0035). */
async function buildCore() {
  await build({
    configFile: false,
    root: DS,
    logLevel: 'warn',
    define: { 'process.env.NODE_ENV': '"production"' },
    resolve: { alias },
    build: {
      outDir: DIST,
      emptyOutDir: true,
      minify: false,
      lib: { entry: path.join(DS, 'src', 'index.ts'), formats: ['es'], fileName: () => 'index.js' },
      rollupOptions: {
        external,
        output: {
          preserveModules: true,
          preserveModulesRoot: path.join(DS, 'src'),
          entryFileNames: '[name].js',
        },
      },
    },
  })
}

/** Le serveur MCP : un exécutable ESM, shebang en tête. **Auto-suffisant** — il bundle
 *  react/react-dom (le build CJS de `react-dom/server` laisserait sinon un `require` dans
 *  un ESM) : l'hôte n'a rien à installer pour le lancer. Seuls les modules `node:` sont
 *  externes. */
async function buildMcpBin() {
  await build({
    configFile: false,
    root: DS,
    logLevel: 'warn',
    define: { 'process.env.NODE_ENV': '"production"' },
    resolve: { alias },
    build: {
      outDir: path.join(DIST, 'mcp'),
      emptyOutDir: false,
      minify: false,
      lib: { entry: path.join(DS, 'src', 'mcp', 'bin.ts'), formats: ['es'], fileName: () => 'bin.js' },
      rollupOptions: {
        external: (id) => id.startsWith('node:'),
        output: { banner: '#!/usr/bin/env node' },
      },
    },
  })
}

/** Le builder de vues (ADR 0034) : l'entrée serveur/edge qui assemble un document
 *  `ui://` dans un skin. Le défaut du cœur y est inliné — aucun `node:fs` au runtime.
 *  React et les dépendances restent externes, comme pour le cœur : le consommateur les a
 *  (il importe Nomos), et bundler `react-dom/server` tirerait le scheduler navigateur, qui
 *  garde le processus Node en vie. */
async function buildViewEntry() {
  await build({
    configFile: false,
    root: DS,
    logLevel: 'warn',
    define: { 'process.env.NODE_ENV': '"production"' },
    resolve: { alias },
    build: {
      outDir: DIST,
      emptyOutDir: false,
      minify: false,
      lib: { entry: path.join(DS, 'src', 'view', 'index.ts'), formats: ['es'], fileName: () => 'view.js' },
      rollupOptions: { external },
    },
  })
}

/** Les types de la surface publique (`src` hors `mcp`, qui n'est pas dans `index`). */
function buildTypes() {
  execFileSync(
    'npx',
    [
      'tsc',
      '--project',
      'tsconfig.build.json',
      '--declaration',
      '--emitDeclarationOnly',
      '--outDir',
      TYPES,
      '--rootDir',
      'src',
      '--noEmit',
      'false',
    ],
    { cwd: DS, stdio: 'inherit' },
  )
}

/**
 * Réécrit `@nomos/...` en relatif dans chaque `.d.ts`. La sortie de `tsc` est en miroir de
 * `src`, donc une référence `@nomos/<spec>` désigne le frère `dist/types/<spec>`.
 */
function rewriteTypeImports() {
  const files = walk(TYPES).filter((file) => file.endsWith('.d.ts'))
  for (const file of files) {
    const dir = path.dirname(file)
    const rewritten = readFileSync(file, 'utf8').replace(
      /(['"])@nomos\/([^'"]+)\1/g,
      (_match, quote, spec) => {
        let rel = path.relative(dir, path.join(TYPES, spec))
        if (!rel.startsWith('.')) rel = `./${rel}`
        return `${quote}${rel}${quote}`
      },
    )
    writeFileSync(file, rewritten)
  }
  return files.length
}

/**
 * Le module de dérivation est un `.mjs` (exécuté par le CLI en Node sans compilation) :
 * `tsc` ne l'émet pas, et son `build.d.mts` voisin n'est pas recopié. Or `index.d.ts`
 * le référence (`./tokens/build.mjs`) pour `renderCss` : sans cette copie, le type ne
 * résout plus chez un consommateur. On copie donc sa déclaration à côté des types émis.
 */
function copyTokenTypes() {
  mkdirSync(TOKEN_TYPES, { recursive: true })
  copyFileSync(path.join(DS, 'src', 'tokens', 'build.d.mts'), path.join(TOKEN_TYPES, 'build.d.mts'))
}

function walk(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry)
    return statSync(full).isDirectory() ? walk(full) : [full]
  })
}

/**
 * La sortie est **auto-suffisante** : plus aucun alias interne dans le JS, et chaque
 * référence relative des types résout. C'est le contrôle qui échoue si le paquet redevient
 * non distribuable (une nouvelle source d'alias, un fichier manquant).
 */
function assertSelfContained() {
  // Le cœur est un arbre par module (`preserveModules`) : on parcourt **tous** les `.js`
  // de `dist`, pas seulement l'entrée — un alias `@nomos/*` oublié dans un module interne
  // ne résoudrait pas chez un consommateur, sans bruit.
  for (const jsPath of walk(DIST).filter((file) => file.endsWith('.js'))) {
    const js = readFileSync(jsPath, 'utf8')
    if (js.includes('@nomos/')) throw new Error(`${path.relative(DS, jsPath)} keeps an @nomos/* alias`)
    if (js.includes('@nomosui/react/')) {
      throw new Error(`${path.relative(DS, jsPath)} keeps a package self-reference`)
    }
  }
  const bin = readFileSync(path.join(DIST, 'mcp', 'bin.js'), 'utf8')
  if (!bin.startsWith('#!/usr/bin/env node')) throw new Error('dist/mcp/bin.js has no shebang')

  const broken = []
  for (const file of walk(TYPES).filter((f) => f.endsWith('.d.ts'))) {
    const source = readFileSync(file, 'utf8')
    for (const match of source.matchAll(/from ['"](\.[^'"]+)['"]/g)) {
      const target = path.resolve(path.dirname(file), match[1])
      if (!resolvesAsType(target)) {
        broken.push(`${path.relative(TYPES, file)} -> ${match[1]}`)
      }
    }
  }
  if (broken.length) throw new Error(`unresolved types:\n  ${broken.join('\n  ')}`)
}

/** Un spécificateur relatif de type résout-il ? `.mjs` → son `build.d.mts` voisin. */
function resolvesAsType(target) {
  if (existsSync(target) || existsSync(`${target}.d.ts`) || existsSync(`${target}.d.mts`)) {
    return true
  }
  return target.endsWith('.mjs') && existsSync(`${target.slice(0, -'.mjs'.length)}.d.mts`)
}

/**
 * Les sous-exports (ADR 0025) doivent pointer un fichier **livré** : un chemin absent ou
 * non couvert par `files` rend le paquet inutilisable chez un consommateur, sans bruit.
 */
function assertExportsShipped() {
  const files = new Set(pkg.files ?? [])
  for (const [subpath, target] of Object.entries(pkg.exports)) {
    if (subpath === '.') continue
    const rel = typeof target === 'string' ? target : target.default
    const normalized = rel.replace(/^\.\//, '')
    if (!existsSync(path.join(DS, rel))) {
      throw new Error(`exports["${subpath}"] points to a missing file: ${rel}`)
    }
    const root = normalized.split('/')[0]
    if (!files.has(root) && !files.has(normalized)) {
      throw new Error(`exports["${subpath}"] (${rel}) is not covered by "files"`)
    }
  }
}

await buildCore()
await buildMcpBin()
await buildViewEntry()
buildTypes()
copyTokenTypes()
const rewritten = rewriteTypeImports()
assertSelfContained()
assertExportsShipped()

console.log(
  `wrote   dist/index.js + dist/mcp/bin.js + ${rewritten} type files + sub-exports (self-contained)`,
)
