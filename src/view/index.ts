import defaultTokens from '@nomos/derived/tokens.json'

import {
  APP_VIEW_MIME,
  appViewFor,
  appViewUri,
  compositeViewFor,
  compositeViewUri,
} from '@nomos/mcp/app-view'
import type { TokensDocument } from '@nomos/tokens/build.mjs'
import { resolveSkin } from '@nomos/tokens/skin'

/**
 * L'entrée publique du **builder de vues** (ADR 0034, étend ADR 0025). Un consommateur
 * externe assemble le document auto-suffisant (`text/html;profile=mcp-app`) d'une vue
 * `ui://`, dans **son** skin : les valeurs viennent du skin, la couche utilitaires du cœur
 * est inlinée — aucun Tailwind au runtime. Le cœur reste app-agnostique (ADR 0002) : il ne
 * connaît qu'un nom de brique ou de scène et un document de tokens.
 *
 * Le défaut du cœur (`tokens.json`) est **inliné au build**, donc l'entrée ne lit aucun
 * fichier : elle tourne sur un serveur comme en edge.
 */

export type RenderViewOptions = {
  /** Le nom d'une brique du catalogue (exclusif avec `composite`). */
  name?: string
  /** Le nom d'une scène composite (exclusif avec `name`). */
  composite?: string
  /** Un overlay de tokens sémantiques (ADR 0022), fusionné par-dessus le défaut du cœur. */
  skin?: TokensDocument
  /** Un document DTCG déjà résolu ; court-circuite `skin`. */
  tokens?: TokensDocument
}

/** Rend le document auto-suffisant d'une brique ou d'une scène, dans le skin donné. */
export function renderView({ name, composite, skin, tokens }: RenderViewOptions): string {
  if (name && composite) {
    throw new Error('renderView: pass `name` or `composite`, not both.')
  }
  const doc = tokens ?? resolveSkin(defaultTokens, skin)
  if (composite) return compositeViewFor(composite, doc)
  if (name) return appViewFor(name, doc)
  throw new Error('renderView: pass `name` (a component) or `composite` (a scene).')
}

export { APP_VIEW_MIME, appViewUri, compositeViewUri }
export type { TokenDoc } from '@nomos/mcp/app-view'
