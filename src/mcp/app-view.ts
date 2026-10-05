import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { findComponent } from '@nomos/catalogue/registry'
import { findComposite } from '@nomos/composites'
import { renderCss } from '@nomos/tokens/build.mjs'
import type { TokensDocument } from '@nomos/tokens/build.mjs'
import { VIEW_CSS } from '@nomos/mcp/view-css.generated'
import { VIEW_BUNDLE } from '@nomos/mcp/view.generated'
import { VIEW_DATA_ID, VIEW_ROOT_ID } from '@nomos/mcp/view-contract'

/**
 * Les vues MCP Apps du design system (ADR 0013, 0033) : un composant du catalogue servi
 * comme ressource auto-suffisante (`text/html;profile=mcp-app`). Le document porte le markup
 * pré-rendu (repli sans JS), le CSS inline — les **valeurs** de tokens du skin *et* la
 * **couche utilitaires** du cœur (`VIEW_CSS`, ADR 0022) — les props en JSON et le bundle
 * qui monte le composant dans l'iframe, thème et densité sur sa **propre** racine.
 *
 * Ce module est **pur** : il prend le document de tokens déjà résolu et ne lit aucun
 * fichier, pour qu'un consommateur (serveur ou edge) puisse assembler une vue (ADR 0034).
 * Le chargement du défaut du cœur vit dans `@nomos/mcp/default-tokens` — réservé au serveur
 * MCP.
 *
 * Aucune couche composant ne connaît `postMessage` : le pont vit dans `view/bridge.ts`,
 * bundlé avec la vue.
 */

/** Un document DTCG déjà parsé (le défaut du cœur ou un skin résolu). */
export type TokenDoc = TokensDocument

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

/**
 * Une valeur qui ne survit pas à `JSON.stringify` : un élément React, ou une fonction
 * **imbriquée** (un objet de libellés, un formateur lu par le composant). Un rappel
 * d'exemple **de premier niveau** ne compte pas : il est retiré comme avant, et la vue
 * reste montée client (elle fournit ses propres gestionnaires).
 */
function containsUnserializable(value: unknown): boolean {
  if (typeof value === 'function') return true
  if (value === null || typeof value !== 'object') return false
  if ('$$typeof' in (value as object)) return true
  if (Array.isArray(value)) return value.some(containsUnserializable)
  return Object.values(value as Record<string, unknown>).some(containsUnserializable)
}

function viewProps(name: string): { client: boolean; props: Record<string, unknown> } {
  const example = (findComponent(name).manifest.example ?? {}) as Record<string, unknown>
  const losesOnSerialization = Object.values(example).some(
    (value) => typeof value === 'object' && value !== null && containsUnserializable(value),
  )
  if (losesOnSerialization) return { client: false, props: {} }
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

/** La vue d'un composant, dans les tokens du **skin** donné (ADR 0022). */
export function appViewFor(name: string, tokens: TokenDoc): string {
  const { client, props } = viewProps(name)
  return buildAppView({ name, markup: renderComponentMarkup(name), css: renderCss(tokens), client, props })
}

/** Le markup pré-rendu d'une scène composite. */
export function renderCompositeMarkup(name: string): string {
  return renderToStaticMarkup(findComposite(name).render())
}

/** La vue d'une scène composite : markup pré-rendu en repli, montée client pour recevoir des données (ADR 0023). */
export function compositeViewFor(name: string, tokens: TokenDoc): string {
  return buildAppView({
    name: `composite:${name}`,
    markup: renderCompositeMarkup(name),
    css: renderCss(tokens),
    client: true,
    props: {},
  })
}
