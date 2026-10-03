import type { ComponentManifest } from '@nomos/catalogue/contract'

/**
 * Le manifeste du Code inline (ADR 0005). Il est écrit à la main : le type se génère,
 * l'usage s'écrit. Le test de cohérence du catalogue le confronte aux props réelles.
 */
export const codeManifest: ComponentManifest = {
  name: 'code',
  title: 'Code',
  summary:
    'An inline code snippet: a discreet monospace surface, placed within a sentence. ' +
    'The inset background, border and radius come from the tokens; syntax highlighting ' +
    "is left to the app.",
  level: 'primitive',
  example: { children: 'npm install @nomosui/react' },
  variants: [],
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      check: 'content',
      description: "The snippet text, injected by the caller.",
    },
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: "The caller's classes, merged after the core's.",
    },
  ],
  usages: [
    {
      when: 'citing an identifier, a command or a file name within a sentence',
      use: 'Code',
      avoid: 'a `CodeBlock` for a word: the block breaks the line of text',
    },
    {
      when: "applying your own syntax highlighting",
      use: 'children with highlighted nodes',
      avoid: 'expecting highlighting from the core: it is out of scope',
    },
  ],
}
