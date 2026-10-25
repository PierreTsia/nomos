/// <reference types="vite/client" />

declare module 'virtual:nomos-snippets' {
  /** Un snippet prêt à afficher : la source brute (à copier) et le HTML coloré (à rendre). */
  export type SnippetCode = { raw: string; html: string }
  /** Les snippets d'une brique : l'interface (générée) et le scénario (son fichier). */
  export type BrickSnippet = { interface?: SnippetCode; scenario?: SnippetCode }

  export const brickSnippets: Record<string, BrickSnippet>
  export const sceneSnippets: Record<string, SnippetCode>
}
