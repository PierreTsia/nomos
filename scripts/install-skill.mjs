#!/usr/bin/env node
/**
 * Installe la skill « nomos » livrée avec le paquet (#54) : copie son `SKILL.md` là où un
 * hôte lit ses skills. Par défaut `~/.claude/skills/nomos` ; `--dir <dossier>` pour un
 * autre hôte (opencode, etc.).
 */
import { copyFileSync, mkdirSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const source = path.resolve(here, '..', 'SKILL.md')

const args = process.argv.slice(2)
const dirIndex = args.indexOf('--dir')
const targetDir =
  dirIndex >= 0 ? args[dirIndex + 1] : path.join(os.homedir(), '.claude', 'skills', 'nomos')

if (!targetDir) {
  console.error('usage : nomos-skill [--dir <dossier>]')
  process.exit(1)
}

mkdirSync(targetDir, { recursive: true })
const dest = path.join(targetDir, 'SKILL.md')
copyFileSync(source, dest)
console.log(`Skill « nomos » installée : ${dest}`)
