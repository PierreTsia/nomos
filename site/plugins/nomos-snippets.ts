import { readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { catalogue } from '@nomosui/react'
import { createHighlighter, type Highlighter, type ThemeRegistrationRaw } from 'shiki'
import type { Plugin } from 'vite'

import { componentName, snippetFromExample } from '../src/snippet.ts'

/**
 * La coloration syntaxique des snippets, **au build** (et en dev), pour que le client n'en
 * porte pas le coût. Le thème est fait de **variables de tokens** : la coloration suit le
 * mode clair/sombre et le skin sans une seule couleur codée en dur (ADR 0003/0004).
 *
 * Le module virtuel `virtual:nomos-snippets` expose, par brique et par scène, la source
 * brute (à copier) et le HTML coloré (à afficher) — une source, déjà découpée en jetons.
 */
const VIRTUAL = 'virtual:nomos-snippets'
const RESOLVED = '\0' + VIRTUAL

const here = path.dirname(fileURLToPath(import.meta.url))
const EXAMPLES = path.resolve(here, '..', 'src', 'examples')
const SCENES = path.join(EXAMPLES, 'scenes')

/** Un thème Shiki en variables de tokens Nomos (aucune valeur en dur). */
const NOMOS_THEME: ThemeRegistrationRaw = {
  name: 'nomos',
  type: 'light',
  colors: { 'editor.background': 'transparent', 'editor.foreground': 'var(--color-foreground)' },
  settings: [
    {
      scope: ['comment', 'punctuation.definition.comment'],
      settings: { foreground: 'var(--color-muted-foreground)', fontStyle: 'italic' },
    },
    {
      scope: ['punctuation', 'meta.brace', 'meta.delimiter', 'keyword.operator'],
      settings: { foreground: 'var(--color-muted-foreground)' },
    },
    {
      scope: ['entity.name.tag', 'support.class.component', 'entity.name.type', 'support.type'],
      settings: { foreground: 'var(--color-primary)' },
    },
    {
      scope: ['entity.other.attribute-name', 'variable.other.property'],
      settings: { foreground: 'var(--color-status-info-ink)' },
    },
    {
      scope: ['string', 'string.quoted', 'punctuation.definition.string'],
      settings: { foreground: 'var(--color-status-success-ink)' },
    },
    {
      scope: ['keyword', 'storage', 'storage.type', 'storage.modifier'],
      settings: { foreground: 'var(--color-status-attention-ink)' },
    },
    {
      scope: ['constant.numeric', 'constant.language', 'constant.character'],
      settings: { foreground: 'var(--color-status-warning-ink)' },
    },
  ],
}

let highlighter: Promise<Highlighter> | undefined
function getHighlighter() {
  highlighter ??= createHighlighter({ themes: [NOMOS_THEME], langs: ['tsx'] })
  return highlighter
}

/** Le HTML coloré des jetons, sans le `<pre><code>` que `CodeBlock` fournit déjà. */
function highlight(hl: Highlighter, code: string): string {
  return hl
    .codeToHtml(code, { lang: 'tsx', theme: 'nomos' })
    .replace(/^<pre[^>]*><code[^>]*>/, '')
    .replace(/<\/code><\/pre>\s*$/, '')
}

function exampleFiles(dir: string): string[] {
  return readdirSync(dir).filter((name) => name.endsWith('.tsx') && statSync(path.join(dir, name)).isFile())
}

export async function buildSnippets() {
  const hl = await getHighlighter()
  const code = (raw: string) => ({ raw, html: highlight(hl, raw) })

  const bricks: Record<string, { interface?: unknown; scenario?: unknown }> = {}
  for (const { manifest, component } of catalogue) {
    if (!manifest.example) continue
    const snippet = snippetFromExample(
      componentName(component, manifest.title),
      manifest.example as Record<string, unknown>,
    )
    bricks[manifest.name] = { ...bricks[manifest.name], interface: code(snippet) }
  }

  for (const file of exampleFiles(EXAMPLES)) {
    const name = file.replace(/\.tsx$/, '')
    const raw = readFileSync(path.join(EXAMPLES, file), 'utf8')
    bricks[name] = { ...bricks[name], scenario: code(raw) }
  }

  const scenes: Record<string, unknown> = {}
  for (const file of exampleFiles(SCENES)) {
    const name = file.replace(/\.tsx$/, '')
    scenes[name] = code(readFileSync(path.join(SCENES, file), 'utf8'))
  }

  return { bricks, scenes }
}

export function nomosSnippets(): Plugin {
  return {
    name: 'nomos-snippets',
    resolveId(id) {
      return id === VIRTUAL ? RESOLVED : null
    },
    async load(id) {
      if (id !== RESOLVED) return null
      const { bricks, scenes } = await buildSnippets()
      return (
        `export const brickSnippets = ${JSON.stringify(bricks)}\n` +
        `export const sceneSnippets = ${JSON.stringify(scenes)}\n`
      )
    },
    configureServer(server) {
      // Un exemple touché (ou ajouté) invalide le module : la coloration se recalcule.
      server.watcher.add(EXAMPLES)
      const invalidate = (file: string) => {
        if (file.startsWith(EXAMPLES)) {
          const mod = server.moduleGraph.getModuleById(RESOLVED)
          if (mod) server.moduleGraph.invalidateModule(mod)
          server.ws.send({ type: 'full-reload' })
        }
      }
      server.watcher.on('add', invalidate)
      server.watcher.on('change', invalidate)
      server.watcher.on('unlink', invalidate)
    },
  }
}
