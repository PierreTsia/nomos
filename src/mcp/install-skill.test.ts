import { spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, rmSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'

/**
 * `nomos-skill` copie la skill **et** le starter `templates/starter` à côté (ADR 0028, 0038) :
 * la recette de bootstrap a besoin du squelette sur disque pour que l'hôte le copie.
 */

const SCRIPT = path.resolve(import.meta.dirname, '..', '..', 'scripts', 'install-skill.mjs')

describe('install-skill', () => {
  it('installe SKILL.md et templates/starter dans la cible', () => {
    const dir = mkdtempSync(path.join(os.tmpdir(), 'nomos-skill-'))
    try {
      const result = spawnSync('node', [SCRIPT, '--dir', dir], { encoding: 'utf8' })
      expect(result.status, result.stderr).toBe(0)
      expect(existsSync(path.join(dir, 'SKILL.md'))).toBe(true)
      expect(existsSync(path.join(dir, 'templates', 'starter', 'package.json'))).toBe(true)
      expect(existsSync(path.join(dir, 'templates', 'starter', 'skin.json'))).toBe(true)
      // Le starter part sans ses dépendances : l'hôte installe lui-même.
      expect(existsSync(path.join(dir, 'templates', 'starter', 'node_modules'))).toBe(false)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })
})
