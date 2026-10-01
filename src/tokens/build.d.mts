/**
 * Les types de la dérivation des tokens (ADR 0004). Le module lui-même est en
 * JavaScript (`.mjs`) : il est exécuté par le CLI en Node sans étape de compilation,
 * donc ses types vivent ici, à côté — même convention que `scripts/api-lib.d.mts`.
 */

/** Un token DTCG tel qu'il vit dans `tokens.json`. */
export interface Token {
  $type: string
  $value: unknown
  $description?: string
}

export interface TokensDocument {
  $description?: string
  $extensions?: Record<string, Record<string, unknown>>
  primitive?: Record<string, unknown>
  semantic?: Record<string, unknown>
}

export interface TokensResource {
  $description: string
  namespace: string
  defaultMode: string
  modes: string[]
  densities: Record<string, number>
  defaultDensity: string
  slots: Record<string, Record<string, string>>
}

/** Les modes déclarés par la source (`$extensions["org.nomos"].modes`). */
export function modes(doc: TokensDocument): string[]

/** Le mode par défaut, qui doit être l'un des modes déclarés. */
export function defaultMode(doc: TokensDocument): string

/** Les densités déclarées (ADR 0008) : un nom et son multiplicateur d'espacement. */
export function densities(doc: TokensDocument): Record<string, number>

/** La densité par défaut, qui doit être l'une des densités déclarées. */
export function defaultDensity(doc: TokensDocument): string

/** Les primitives aplaties, `chemin -> token`. */
export function primitives(doc: TokensDocument): Map<string, Token>

/** Les emplacements sémantiques aplatis, `chemin -> token`. */
export function semanticTokens(doc: TokensDocument): Map<string, Token>

/** Tous les tokens du document, aplatis depuis sa racine (résolution des alias). */
export function allTokens(doc: TokensDocument): Map<string, Token>

/** Résout un emplacement pour un mode, en suivant les alias jusqu'au bout. */
export function resolve(doc: TokensDocument, path: string, mode: string): unknown

/** Rend une valeur DTCG en texte CSS. Le type n'est requis que pour un tableau. */
export function cssValue(value: unknown, type?: string): string

/** Le nom de la custom property d'un emplacement sémantique. */
export function cssName(path: string, namespace: string): string

/** Les emplacements d'un mode, `nom CSS -> valeur`. */
export function slotsFor(doc: TokensDocument, mode: string): Record<string, string>

/** L'inventaire plat que le serveur MCP du design system servira. */
export function buildResource(doc: TokensDocument): TokensResource

/** Le CSS dérivé, en entier. */
export function renderCss(doc: TokensDocument): string
