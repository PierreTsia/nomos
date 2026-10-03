import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { ReadResourceResult } from '@modelcontextprotocol/sdk/types.js'
import { z } from 'zod'

import { catalogue } from '@nomos/catalogue/registry'
import {
  APP_VIEW_MIME,
  appViewFor,
  appViewUri,
  compositeViewFor,
  compositeViewUri,
  loadDefaultTokens,
} from '@nomos/mcp/app-view'
import { composites } from '@nomos/composites'
import { getComponent, listComponents, listScenes, previewComponent } from '@nomos/mcp/catalogue'
import { buildResource } from '@nomos/tokens/build.mjs'
import { resolveSkin } from '@nomos/tokens/skin'

/**
 * Le serveur MCP local du design system (ADR 0003) : un inventaire, deux rendus — la
 * page de style pour un humain, ce serveur pour un agent. Il tourne en stdio, sans
 * jeton ni service externe, et **ne fait que lire** : tout ce qu'il sert vient du
 * catalogue et de la ressource de tokens, rien n'est écrit.
 *
 * Il **porte un skin** (ADR 0022) : `skin` est un overlay sémantique posé par-dessus le
 * défaut du cœur, qui fixe les valeurs servies — la ressource de tokens comme les vues.
 */

export const TOKENS_URI = 'nomos://tokens'
export const componentUri = (name: string) => `nomos://component/${name}`

const json = (uri: string, value: unknown): ReadResourceResult => ({
  contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(value, null, 2) }],
})

const text = (value: unknown) => ({
  content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }],
})

export function createDesignSystemServer({
  skin,
}: { skin?: Record<string, unknown> } = {}) {
  const server = new McpServer({ name: 'nomos', version: '0.0.0' })

  // Le skin (ADR 0022) fixe les valeurs servies : la ressource de tokens comme les vues.
  const tokensDoc = resolveSkin(loadDefaultTokens(), skin)
  const tokensResource = buildResource(tokensDoc)

  server.registerResource(
    'tokens',
    TOKENS_URI,
    { title: 'Design system tokens', mimeType: 'application/json' },
    (uri) => json(uri.href, tokensResource),
  )

  for (const { manifest } of catalogue) {
    server.registerResource(
      `component:${manifest.name}`,
      componentUri(manifest.name),
      { title: manifest.title, mimeType: 'application/json' },
      (uri) => json(uri.href, manifest),
    )
  }

  // Les vues MCP Apps (ADR 0013) : un composant rendu, dans un document auto-suffisant.
  for (const { manifest } of catalogue) {
    server.registerResource(
      `view:${manifest.name}`,
      appViewUri(manifest.name),
      { title: `${manifest.title} — view`, mimeType: APP_VIEW_MIME },
      (uri) => ({
        contents: [{ uri: uri.href, mimeType: APP_VIEW_MIME, text: appViewFor(manifest.name, tokensDoc) }],
      }),
    )
  }

  // Les scènes composites : plusieurs briques assemblées en une vue auto-suffisante.
  for (const composite of composites) {
    server.registerResource(
      `scene:${composite.name}`,
      compositeViewUri(composite.name),
      { title: `${composite.title} — scene`, mimeType: APP_VIEW_MIME },
      (uri) => ({
        contents: [
          { uri: uri.href, mimeType: APP_VIEW_MIME, text: compositeViewFor(composite.name, tokensDoc) },
        ],
      }),
    )
  }

  server.registerTool(
    'list_components',
    {
      title: 'List the design system components',
      description: [
        'USAGE — when you need to know which bricks exist and which one to pick. The search is local and deterministic: it filters on the name, the title, the summary and the intent of the usages, with no API call.',
        'INPUTS — `query` (optional): a word to search for, e.g. "badge", "table", "overlay".',
        'OUTPUT — the matching components: name, title, level and summary.',
        'EXAMPLES — `list_components {}` lists everything; `list_components {"query":"filter"}` finds the facet filter.',
      ].join('\n'),
      inputSchema: { query: z.string().optional().describe('The word to search for.') },
    },
    ({ query }) => text(listComponents(query)),
  )

  server.registerTool(
    'get_component',
    {
      title: 'Describe a design system component',
      description: [
        'USAGE — when you need the full contract of a brick before using it: its props, its variants, its usages.',
        'INPUTS — `name`: the component name, as returned by `list_components`.',
        'OUTPUT — the component manifest (props, variants, example, usages).',
        'EXAMPLES — `get_component {"name":"badge"}`; chain from `list_components`.',
      ].join('\n'),
      inputSchema: { name: z.string().describe('The component name.') },
    },
    ({ name }) => {
      try {
        return text(getComponent(name))
      } catch (error) {
        return { content: [{ type: 'text' as const, text: String(error) }], isError: true }
      }
    },
  )

  server.registerTool(
    'preview_component',
    {
      title: 'Preview a design system component',
      description: [
        'USAGE — when you need the rendering recipe of a brick: enough to drop it into a mock-up or code.',
        'INPUTS — `name`: the component name.',
        'OUTPUT — its example props, its variants and its usages (the packaged visual render will come elsewhere).',
        'EXAMPLES — `preview_component {"name":"meter"}` for a Meter’s example props.',
      ].join('\n'),
      inputSchema: { name: z.string().describe('The component name.') },
    },
    ({ name }) => {
      try {
        return text(previewComponent(name))
      } catch (error) {
        return { content: [{ type: 'text' as const, text: String(error) }], isError: true }
      }
    },
  )

  server.registerTool(
    'list_scenes',
    {
      title: 'List the design system composite scenes',
      description: [
        'USAGE — when you need a view assembled from several bricks (a form, a status card), not a single component.',
        'INPUTS — none.',
        'OUTPUT — the available scenes: name, title, summary.',
        'EXAMPLES — `list_scenes {}`; then `render_scene_<name>` to show one.',
      ].join('\n'),
      inputSchema: {},
    },
    () => text(listScenes()),
  )

  // L'outil de rendu d'un composant : sa vue est référencée par `_meta.ui.resourceUri`.
  for (const { manifest } of catalogue) {
    server.registerTool(
      `render_${manifest.name}`,
      {
        title: `Render ${manifest.title} in conversation`,
        description: [
          'USAGE — when you need to show a design system component in the conversation, not just describe it.',
          'INPUTS — `props` (optional): the data to display (JSON object). The host passes them to the view via `set-data`; without them, the view shows its example.',
          'OUTPUT — the rendering recipe and the props; the host renders the view referenced by `_meta.ui.resourceUri`.',
          `EXAMPLES — \`render_${manifest.name} {}\` for the example; \`render_${manifest.name} {"props":{"...":…}}\` for data.`,
        ].join('\n'),
        inputSchema: {
          props: z
            .record(z.string(), z.unknown())
            .optional()
            .describe('The view data (JSON props, ADR 0023).'),
        },
        _meta: { ui: { resourceUri: appViewUri(manifest.name) } },
      },
      ({ props }) => text({ ...previewComponent(manifest.name), props: props ?? {} }),
    )
  }

  // L'outil de rendu d'une scène composite : sa vue est référencée de même.
  for (const composite of composites) {
    server.registerTool(
      `render_scene_${composite.name}`,
      {
        title: `Render ${composite.title} in conversation`,
        description: [
          'USAGE — when you need to show a design system composite scene in the conversation, not just a component.',
          'INPUTS — `props` (optional): the scene data (JSON object), passed via `set-data`.',
          'OUTPUT — the recipe and the props; the host renders the view referenced by `_meta.ui.resourceUri`.',
          `EXAMPLES — \`render_scene_${composite.name} {}\`.`,
        ].join('\n'),
        inputSchema: {
          props: z
            .record(z.string(), z.unknown())
            .optional()
            .describe('The scene data (JSON props, ADR 0023).'),
        },
        _meta: { ui: { resourceUri: compositeViewUri(composite.name) } },
      },
      ({ props }) =>
        text({ name: composite.name, title: composite.title, summary: composite.summary, props: props ?? {} }),
    )
  }

  return server
}
