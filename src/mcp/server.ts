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
    { title: 'Tokens du design system', mimeType: 'application/json' },
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
      { title: `${manifest.title} — vue`, mimeType: APP_VIEW_MIME },
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
      { title: `${composite.title} — scène`, mimeType: APP_VIEW_MIME },
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
      title: 'Lister les composants du design system',
      description: [
        'USAGE — quand il faut savoir quelles briques existent et laquelle prendre. La recherche est locale et déterministe : elle filtre sur le nom, le titre, le résumé et l’intention des usages, sans appel d’API.',
        'INPUTS — `query` (optionnel) : un mot à chercher, ex. « badge », « table », « surcouche ».',
        'OUTPUT — la liste des composants qui correspondent : nom, titre, niveau et résumé.',
        'EXAMPLES — `list_components {}` liste tout ; `list_components {"query":"filtre"}` retrouve le filtre à facettes.',
      ].join('\n'),
      inputSchema: { query: z.string().optional().describe('Le mot à chercher.') },
    },
    ({ query }) => text(listComponents(query)),
  )

  server.registerTool(
    'get_component',
    {
      title: 'Décrire un composant du design system',
      description: [
        'USAGE — quand il faut le contrat complet d’une brique avant de l’utiliser : ses props, ses variantes, ses usages.',
        'INPUTS — `name` : le nom du composant, tel que rendu par `list_components`.',
        'OUTPUT — le manifeste du composant (props, variantes, exemple, usages).',
        'EXAMPLES — `get_component {"name":"badge"}` ; enchaîner depuis `list_components`.',
      ].join('\n'),
      inputSchema: { name: z.string().describe('Le nom du composant.') },
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
      title: 'Prévisualiser un composant du design system',
      description: [
        'USAGE — quand il faut la recette de rendu d’une brique : de quoi la poser dans une maquette ou du code.',
        'INPUTS — `name` : le nom du composant.',
        'OUTPUT — son exemple de props, ses variantes et ses usages (le rendu visuel packagé viendra ailleurs).',
        'EXAMPLES — `preview_component {"name":"meter"}` pour les props d’exemple d’un Meter.',
      ].join('\n'),
      inputSchema: { name: z.string().describe('Le nom du composant.') },
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
      title: 'Lister les scènes composites du design system',
      description: [
        'USAGE — quand il faut une vue montée de plusieurs briques (un formulaire, une carte de statut), pas un seul composant.',
        'INPUTS — aucun.',
        'OUTPUT — les scènes disponibles : nom, titre, résumé.',
        'EXAMPLES — `list_scenes {}` ; puis `render_scene_<nom>` pour la montrer.',
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
        title: `Rendre ${manifest.title} en conversation`,
        description: [
          'USAGE — quand il faut montrer un composant du design system dans la conversation, pas seulement le décrire.',
          'INPUTS — `props` (optionnel) : les données à afficher (objet JSON). L’hôte les remet à la vue par `set-data` ; sans elles, la vue montre son exemple.',
          'OUTPUT — la recette de rendu et les props ; l’hôte rend la vue référencée par `_meta.ui.resourceUri`.',
          `EXAMPLES — \`render_${manifest.name} {}\` pour l’exemple ; \`render_${manifest.name} {"props":{"...":…}}\` pour des données.`,
        ].join('\n'),
        inputSchema: {
          props: z
            .record(z.string(), z.unknown())
            .optional()
            .describe('Les données de la vue (props JSON, ADR 0023).'),
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
        title: `Rendre ${composite.title} en conversation`,
        description: [
          'USAGE — quand il faut montrer une scène composite du design system dans la conversation, pas seulement un composant.',
          'INPUTS — `props` (optionnel) : les données de la scène (objet JSON), remises par `set-data`.',
          'OUTPUT — la recette et les props ; l’hôte rend la vue référencée par `_meta.ui.resourceUri`.',
          `EXAMPLES — \`render_scene_${composite.name} {}\`.`,
        ].join('\n'),
        inputSchema: {
          props: z
            .record(z.string(), z.unknown())
            .optional()
            .describe('Les données de la scène (props JSON, ADR 0023).'),
        },
        _meta: { ui: { resourceUri: compositeViewUri(composite.name) } },
      },
      ({ props }) =>
        text({ name: composite.name, title: composite.title, summary: composite.summary, props: props ?? {} }),
    )
  }

  return server
}
