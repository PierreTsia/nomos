#!/usr/bin/env node
/**
 * The smoke of the **consumed** package: it `npm pack`s the package, installs it in a fresh
 * project, and checks what a consumer actually gets — importing a brick, starting the MCP
 * server (`nomos-mcp`) and reading a `ui://` view. It catches the *packaging* regressions
 * (a missing file, a broken export, a bin that does not start) that unit tests never see.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const DS = path.resolve(HERE, '..')
const pkg = JSON.parse(readFileSync(path.join(DS, 'package.json'), 'utf8'))
// The MCP SDK is no longer a dependency of the package (the bin inlines it, ADR 0035): a
// consumer that wants to use it as a **client** installs it itself.
const sdkSpec = `@modelcontextprotocol/sdk@${pkg.devDependencies?.['@modelcontextprotocol/sdk'] ?? '^1.31.0'}`

const run = (command, args, options) =>
  execFileSync(command, args, { stdio: 'inherit', ...options })
const capture = (command, args, options) =>
  execFileSync(command, args, { encoding: 'utf8', ...options }).trim()

const tmp = mkdtempSync(path.join(os.tmpdir(), 'nomos-smoke-'))
let tarball = ''
let failures = 0
const ok = (label) => console.log(`  ✓ ${label}`)
const fail = (label, detail) => {
  failures += 1
  console.error(`  ✗ ${label}${detail ? ` — ${detail}` : ''}`)
}

try {
  // 1. The tarball, exactly as it would ship.
  tarball = path.join(DS, capture('npm', ['pack', '--silent'], { cwd: DS }).split('\n').pop())

  // 1b. The tarball carries the app starter (ADR 0028, 0038): an external consumer receives it.
  const contents = capture('tar', ['-tzf', tarball])
  if (contents.includes('package/templates/starter/package.json')) {
    ok('the tarball ships templates/starter')
  } else {
    fail('the tarball is missing templates/starter')
  }

  // 2. A fresh consumer that has nothing but this tarball.
  writeFileSync(
    path.join(tmp, 'package.json'),
    JSON.stringify({ name: 'nomos-smoke-consumer', private: true, type: 'module' }, null, 2),
  )
  run('npm', ['install', tarball, sdkSpec, '--silent', '--no-audit', '--no-fund'], { cwd: tmp })

  // 2b. The starter lands on disk in the installed package, not only in the tarball listing.
  if (
    existsSync(
      path.join(tmp, 'node_modules', '@nomosui/react', 'templates', 'starter', 'package.json'),
    )
  ) {
    ok('the consumer receives templates/starter on disk')
  } else {
    fail('templates/starter absent from the installed package')
  }

  // 3. The core imports (runtime).
  writeFileSync(
    path.join(tmp, 'import.mjs'),
    [
      "import { Button, Badge, catalogue } from '@nomosui/react'",
      "import { createRequire } from 'node:module'",
      "if (typeof Button !== 'function') { console.error('Button absent'); process.exit(1) }",
      "if (!Array.isArray(catalogue) || catalogue.length === 0) { console.error('empty catalogue'); process.exit(1) }",
      "const require = createRequire(import.meta.url)",
      "for (const css of ['tokens/theme.css', 'tokens/tokens.generated.css', 'tokens/tokens.json']) require.resolve(`@nomosui/react/${css}`)",
      "console.log('core import ok')",
    ].join('\n'),
  )
  run('node', ['import.mjs'], { cwd: tmp })
  ok("the core imports (Button + catalogue + CSS/tokens as sub-exports)")

  // 4. The MCP server starts from the installed bin, and reads a view.
  writeFileSync(
    path.join(tmp, 'mcp.mjs'),
    [
      "import { Client } from '@modelcontextprotocol/sdk/client/index.js'",
      "import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'",
      "const bin = new URL('./node_modules/.bin/nomos-mcp', import.meta.url).pathname",
      "const client = new Client({ name: 'smoke', version: '0.0.0' })",
      "await client.connect(new StdioClientTransport({ command: bin }))",
      'const { tools } = await client.listTools()',
      "if (tools.length < 30) { console.error(`too few tools: ${tools.length}`); process.exit(1) }",
      "const view = await client.readResource({ uri: 'ui://nomos/badge' })",
      "const html = view.contents[0].text",
      "if (!html.includes('nomos-view') || !html.includes('.bg-primary')) { console.error('incomplete view'); process.exit(1) }",
      "await client.close()",
      "console.log('mcp ok')",
    ].join('\n'),
  )
  run('node', ['mcp.mjs'], { cwd: tmp })
  ok('the MCP server starts and serves a styled view (ui://nomos/badge)')

  // 5. An external consumer renders a view in its own skin (ADR 0034).
  writeFileSync(
    path.join(tmp, 'view.mjs'),
    [
      "import { renderView, appViewUri } from '@nomosui/react/view'",
      "import { createRequire } from 'node:module'",
      "const require = createRequire(import.meta.url)",
      "require.resolve('@nomosui/react/view.css')",
      "const skin = { semantic: { color: { background: { $value: { dark: '174 100% 39%', light: '174 100% 39%' } } } } }",
      "const html = renderView({ name: 'badge', skin })",
      "if (!html.includes('--nomos-color-background: 174 100% 39%;')) { console.error('skin value absent'); process.exit(1) }",
      "if (!html.includes('.bg-primary')) { console.error('utilities absent'); process.exit(1) }",
      "if (!html.includes('nomos-view')) { console.error('incomplete view'); process.exit(1) }",
      "if (appViewUri('badge') !== 'ui://nomos/badge') { console.error('uri'); process.exit(1) }",
      "console.log('view ok')",
    ].join('\n'),
  )
  run('node', ['view.mjs'], { cwd: tmp })
  ok('an external consumer renders a skinned view (@nomosui/react/view + view.css)')
} catch (error) {
  fail('consumer smoke', error.message)
} finally {
  rmSync(tmp, { recursive: true, force: true })
  if (tarball) rmSync(tarball, { force: true })
}

if (failures > 0) {
  console.error('\nconsumer smoke: FAILED')
  process.exit(1)
}
console.log('\nconsumer smoke: OK')
