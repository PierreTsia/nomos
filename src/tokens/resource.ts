import resource from '@nomos/derived/tokens.resource.json'

import type { TokensResource } from '@nomos/tokens/build.mjs'

/**
 * La ressource de tokens, servie telle quelle à la page de style (et, plus tard, au
 * serveur MCP). C'est le rendu dérivé de `tokens/tokens.json` par
 * `npm run tokens` — ne pas l'éditer à la main : le test des tokens échoue si le
 * fichier committé n'est plus celui que la source produit.
 */
export const tokensResource = resource as TokensResource
