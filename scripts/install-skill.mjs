#!/usr/bin/env node
/**
 * Installe la skill « nomos » livrée avec le paquet (#54) : copie son `SKILL.md`, puis le
 * starter `templates/starter` à côté, là où un hôte lit ses skills — pour que la recette de
 * bootstrap (ADR 0038) ait le squelette d'app sur disque. Par défaut `~/.claude/skills/nomos` ;
 * `--dir <dossier>` pour un autre hôte (opencode, etc.).
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

// Le starter accompagne la skill pour que l'hôte puisse le copier (ADR 0038). Il n'est pas
// installé (pas de node_modules/dist) : seuls les fichiers sources le sont.
if (existsSync(starterSource)) {
  const starterDest = path.join(targetDir, 'templates', 'starter')
  cpSync(starterSource, starterDest, {
    recursive: true,
    filter: (src) => !/(^|[\\/])(node_modules|dist)([\\/]|$)/.test(src),
  })
  console.log(`Starter installed: ${starterDest}`)
}
