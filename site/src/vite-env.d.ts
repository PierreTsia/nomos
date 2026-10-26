/// <reference types="vite/client" />

declare module 'virtual:nomos-snippets' {
  /** A snippet ready to show: the raw source (to copy) and the highlighted HTML (to render). */
  export type SnippetCode = { raw: string; html: string }
  /** A brick's snippets: the interface (generated) and the scenario (its file). */
  export type BrickSnippet = { interface?: SnippetCode; scenario?: SnippetCode }

  export const brickSnippets: Record<string, BrickSnippet>
  export const sceneSnippets: Record<string, SnippetCode>
}
