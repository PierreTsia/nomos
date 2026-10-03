import { readFileSync } from 'node:fs'
import path from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { findComponent } from '@nomos/catalogue/registry'
import { findComposite } from '@nomos/composites'
import { renderCss } from '@nomos/tokens/build.mjs'
import { VIEW_CSS } from '@nomos/mcp/view-css.generated'
import { VIEW_BUNDLE } from '@nomos/mcp/view.generated'
import { VIEW_DATA_ID, VIEW_ROOT_ID } from '@nomos/mcp/view-contract'

/**
 * Les vues MCP Apps du design system (ADR 0013) : un composant du catalogue servi comme
 * ressource auto-suffisante (`text/html;profile=mcp-app`). Le document porte le markup
 * pré-rendu (repli sans JS), le CSS inline — les **valeurs** de tokens du skin *et* la
 * **couche utilitaires** du cœur (`VIEW_CSS`, ADR 0022) — les props en JSON et le bundle
 * qui monte le composant dans l'iframe, thème et densité sur sa **propre** racine.
 *
 * Aucune couche composant ne connaît `postMessage` : le pont vit dans `view/bridge.ts`,
 * bundlé avec la vue.
 */

export const APP_VIEW_MIME = 'text/html;profile=mcp-app'
export const appViewUri = (name: string) => `ui://nomos/${name}`
/** L'URI d'une **scène composite** — un rendu de plusieurs briques, pas un composant. */
export const compositeViewUri = (name: string) => `ui://nomos/composite/${name}`

/** Le markup d'un composant du catalogue, rendu à partir de l'exemple de son manifeste. */
export function renderComponentMarkup(name: string): string {
  const { manifest, component } = findComponent(name)
  const example = manifest.example ?? {}
  const { children, ...rest } = example as Record<string, unknown>
  return renderToStaticMarkup(createElement(component, rest, (children ?? undefined) as never))
}

/** Un exemple qui contient un élément React ne se sérialise pas : la vue reste pré-rendue. */
function containsElement(value: unknown): boolean {
  if (value === null || typeof value !== 'object') return false
  if ('$$typeof' in (value as object)) return true
  if (Array.isArray(value)) return value.some(containsElement)
  return Object.values(value as Record<string, unknown>).some(containsElement)
}

function viewProps(name: string): { client: boolean; props: Record<string, unknown> } {
  const example = (findComponent(name).manifest.example ?? {}) as Record<string, unknown>
  if (containsElement(example)) return { client: false, props: {} }
  // Les fonctions (rappels d'exemple) tombent ici : la vue fournit les siennes, qui
  // émettent des intentions.
  return { client: true, props: JSON.parse(JSON.stringify(example)) as Record<string, unknown> }
}

/** Le document auto-suffisant d'une vue. */
export function buildAppView({
  name,
  markup,
  css,
  client,
  props,
}: {
  name: string
  markup: string
  css: string
  client: boolean
  props: Record<string, unknown>
}): string {
  const data = JSON.stringify({ name, props, client })
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>${css}
${VIEW_CSS}</style>
</head>
<body>
<div id="${VIEW_ROOT_ID}" data-component="${name}" data-theme="dark" data-density="comfortable">${markup}</div>
<script type="application/json" id="${VIEW_DATA_ID}">${data}</script>
<script>${VIEW_BUNDLE}</script>
</body>
</html>
`
}

type TokenDoc = Record<string, unknown>

const TOKENS_SOURCE = path.resolve(import.meta.dirname, '..', '..', 'tokens', 'tokens.json')
let defaultTokens: TokenDoc | null = null

/** Le document de tokens par défaut du cœur (`tokens.json`), lu une fois. */
export function loadDefaultTokens(): TokenDoc {
  defaultTokens ??= JSON.parse(readFileSync(TOKENS_SOURCE, 'utf8')) as TokenDoc
  return defaultTokens
}

/** La vue d'un composant, dans les tokens du **skin** donné (défaut du cœur sinon, ADR 0022). */
export function appViewFor(name: string, tokens: TokenDoc = loadDefaultTokens()): string {
  const { client, props } = viewProps(name)
  return buildAppView({ name, markup: renderComponentMarkup(name), css: renderCss(tokens), client, props })
}

/** Le markup pré-rendu d'une scène composite. */
export function renderCompositeMarkup(name: string): string {
  return renderToStaticMarkup(findComposite(name).render())
}

/** La vue d'une scène composite : markup pré-rendu en repli, montée client pour recevoir des données (ADR 0023). */
export function compositeViewFor(name: string, tokens: TokenDoc = loadDefaultTokens()): string {
  return buildAppView({
    name: `composite:${name}`,
    markup: renderCompositeMarkup(name),
    css: renderCss(tokens),
    client: true,
    props: {},
  })
}
