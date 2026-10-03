import { readFileSync, writeFileSync } from 'node:fs'

import {
  appViewFor,
  appViewUri,
  compositeViewFor,
  compositeViewUri,
} from '@nomos/mcp/app-view'
import { loadDefaultTokens } from '@nomos/mcp/default-tokens'
import { buildReferenceHost } from '@nomos/mcp/reference-host'
import { resolveSkin } from '@nomos/tokens/skin'

/**
 * Génère un hôte de référence portant une vue MCP Apps en HTML, pour les e2e. Lancé via
 * `tsx` depuis le paquet (les alias `@nomos` résolus), il évite que le processus Playwright
 * n'importe le design system. Un nom préfixé `scene:` cible une **scène composite**.
 *
 * `NOMOS_SKIN` (chemin d'un overlay) applique un **skin** (ADR 0022) : la vue porte alors
 * les valeurs de cette app, pas celles du défaut du cœur.
 */
const [target = 'freshness', out = 'e2e-view.html'] = process.argv.slice(2)
const isScene = target.startsWith('scene:')
const name = isScene ? target.slice('scene:'.length) : target
const viewUri = isScene ? compositeViewUri(name) : appViewUri(name)

const skinPath = process.env.NOMOS_SKIN
const skin = skinPath ? JSON.parse(readFileSync(skinPath, 'utf8')) : undefined
const tokens = resolveSkin(loadDefaultTokens(), skin)

const viewHtml = isScene ? compositeViewFor(name, tokens) : appViewFor(name, tokens)

// `NOMOS_VIEW_DATA` (JSON) simule les données que l'outil de rendu renvoie et que l'hôte
// pousse à la vue (ADR 0023).
const viewData = process.env.NOMOS_VIEW_DATA ? JSON.parse(process.env.NOMOS_VIEW_DATA) : undefined

writeFileSync(out, buildReferenceHost({ viewUri, viewHtml, data: viewData }))
