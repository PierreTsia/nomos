#!/usr/bin/env node
/**
 * `create-nomos-app` — copies the packaged `templates/starter` into a target directory and
 * substitutes the app name. Deliberately thin: no network, no LLM, no generator runtime
 * (ADR 0038). The host agent does the generation; this only scaffolds.
 */
import { cpSync, existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const template = path.resolve(here, '..', 'templates', 'starter')

const [target] = process.argv.slice(2)

if (!target || target.startsWith('-')) {
  console.error('usage: create-nomos-app <directory>')
  process.exit(1)
}

if (!existsSync(template)) {
  console.error(
    'create-nomos-app: templates/starter is missing from the package — reinstall @nomosui/react.',
  )
  process.exit(1)
}

const targetDir = path.resolve(process.cwd(), target)
const name =
  path
    .basename(targetDir)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'nomos-app'

const existing = statSync(targetDir, { throwIfNoEntry: false })
if (existing && !existing.isDirectory()) {
  console.error(`create-nomos-app: ${target} exists and is not a directory.`)
  process.exit(1)
}

if (existing && readdirSync(targetDir).length > 0) {
  console.error(`create-nomos-app: ${target} exists and is not empty.`)
  process.exit(1)
}

// `cpSync` creates the destination directory itself.
cpSync(template, targetDir, {
  recursive: true,
  filter: (src) => !/(^|[\\/])(node_modules|dist)([\\/]|$)/.test(src),
})

const pkgPath = path.join(targetDir, 'package.json')
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
pkg.name = name
writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)

console.log(`Created ${name} in ${targetDir}\n`)
console.log('Next:')
console.log(`  cd ${target}`)
console.log('  npm install')
console.log('  npm run dev')
