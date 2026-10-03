import { readFileSync } from 'node:fs'
import path from 'node:path'

import type { TokenDoc } from '@nomos/mcp/app-view'

/**
 * Le défaut du cœur, lu sur disque — **réservé au serveur MCP** (ADR 0033, 0034). Le
 * builder de vues (`mcp/app-view`) est pur ; un consommateur qui n'a pas de système de
 * fichiers passe son skin au sous-export `view`, où `tokens.json` est inliné au build.
 */

const TOKENS_SOURCE = path.resolve(import.meta.dirname, '..', '..', 'tokens', 'tokens.json')
let defaultTokens: TokenDoc | null = null

/** Le document de tokens par défaut du cœur (`tokens.json`), lu une fois. */
export function loadDefaultTokens(): TokenDoc {
  defaultTokens ??= JSON.parse(readFileSync(TOKENS_SOURCE, 'utf8')) as TokenDoc
  return defaultTokens
}
