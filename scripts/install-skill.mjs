#!/usr/bin/env node
/**
 * Installs the "nomos" skill shipped with the package (#54): copies its `SKILL.md`, then the
 * `templates/starter` app beside it, where a host reads its skills — so the bootstrapper
 * recipe (ADR 0038) finds the app skeleton on disk. Defaults to `~/.claude/skills/nomos`;
 * `--dir <folder>` for another host (opencode, …).
 */
import { copyFileSync, cpSync, existsSync, mkdirSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const skillSource = path.resolve(here, '..', 'SKILL.md')
const starterSource = path.resolve(here, '..', 'templates', 'starter')

const args = process.argv.slice(2)
const dirIndex = args.indexOf('--dir')
const targetDir =
  dirIndex >= 0 ? args[dirIndex + 1] : path.join(os.homedir(), '.claude', 'skills', 'nomos')

if (!targetDir) {
  console.error('usage: nomos-skill [--dir <folder>]')
  process.exit(1)
}

mkdirSync(targetDir, { recursive: true })

const skillDest = path.join(targetDir, 'SKILL.md')
copyFileSync(skillSource, skillDest)
console.log(`Skill "nomos" installed: ${skillDest}`)

// The starter accompanies the skill so the host can copy it (ADR 0038). It ships unbuilt:
// only source files, no node_modules/dist.
if (existsSync(starterSource)) {
  const starterDest = path.join(targetDir, 'templates', 'starter')
  cpSync(starterSource, starterDest, {
    recursive: true,
    filter: (src) => !/(^|[\\/])(node_modules|dist)([\\/]|$)/.test(src),
  })
  console.log(`Starter installed: ${starterDest}`)
} else {
  console.warn('No templates/starter beside the skill — skipped (an older tarball).')
}
