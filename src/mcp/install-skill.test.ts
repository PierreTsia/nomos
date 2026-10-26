import { spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, rmSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'

/**
 * `nomos-skill` copies the skill **and** the `templates/starter` app beside it (ADR 0028,
 * 0038): the bootstrapper recipe needs the skeleton on disk for the host to copy.
 */

const SCRIPT = path.resolve(import.meta.dirname, '..', '..', 'scripts', 'install-skill.mjs')

describe('install-skill', () => {
  it('installs SKILL.md and templates/starter into the target', () => {
    const dir = mkdtempSync(path.join(os.tmpdir(), 'nomos-skill-'))
    try {
      const result = spawnSync('node', [SCRIPT, '--dir', dir], { encoding: 'utf8' })
      expect(result.status, result.stderr).toBe(0)
      expect(existsSync(path.join(dir, 'SKILL.md'))).toBe(true)
      expect(existsSync(path.join(dir, 'templates', 'starter', 'package.json'))).toBe(true)
      expect(existsSync(path.join(dir, 'templates', 'starter', 'skin.json'))).toBe(true)
      // The starter ships unbuilt: the host installs its dependencies itself.
      expect(existsSync(path.join(dir, 'templates', 'starter', 'node_modules'))).toBe(false)
      expect(existsSync(path.join(dir, 'templates', 'starter', 'dist'))).toBe(false)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })
})
