import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'

/**
 * `create-nomos-app` copies `templates/starter` into a target directory and substitutes the
 * app name (ADR 0038). No network, no LLM, no generator — a thin scaffolder.
 */

const SCRIPT = path.resolve(import.meta.dirname, '..', '..', 'scripts', 'create-nomos-app.mjs')

describe('create-nomos-app', () => {
  it('scaffolds the starter and substitutes the app name', () => {
    const root = mkdtempSync(path.join(os.tmpdir(), 'nomos-create-'))
    const target = path.join(root, 'My Todo App')
    try {
      const result = spawnSync('node', [SCRIPT, target], { encoding: 'utf8' })
      expect(result.status, result.stderr).toBe(0)

      expect(existsSync(path.join(target, 'package.json'))).toBe(true)
      expect(existsSync(path.join(target, 'src', 'App.tsx'))).toBe(true)
      expect(existsSync(path.join(target, 'skin.json'))).toBe(true)
      // The starter ships unbuilt: the host installs its dependencies itself.
      expect(existsSync(path.join(target, 'node_modules'))).toBe(false)
      expect(existsSync(path.join(target, 'dist'))).toBe(false)

      const pkg = JSON.parse(readFileSync(path.join(target, 'package.json'), 'utf8'))
      expect(pkg.name).toBe('my-todo-app')
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  it('refuses a non-empty target directory', () => {
    const root = mkdtempSync(path.join(os.tmpdir(), 'nomos-create-'))
    const target = path.join(root, 'existing')
    try {
      mkdirSync(target)
      writeFileSync(path.join(target, 'keep.txt'), 'x')

      const result = spawnSync('node', [SCRIPT, target], { encoding: 'utf8' })
      expect(result.status).toBe(1)
      expect(result.stderr).toMatch(/not empty/)
      expect(existsSync(path.join(target, 'keep.txt'))).toBe(true)
      expect(existsSync(path.join(target, 'package.json'))).toBe(false)
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })
})
