import type { ComponentManifest } from '@nomos/catalogue/contract'

/**
 * Le manifeste du CodeBlock (ADR 0005). Il est écrit à la main : le type se génère,
 * l'usage s'écrit. Le test de cohérence du catalogue le confronte aux props réelles.
 */
export const codeBlockManifest: ComponentManifest = {
  name: 'code-block',
  title: 'CodeBlock',
  summary:
    'A scrollable monospace code block, with a copy button. `code` is the raw text ' +
    'that gets copied, `children` the rendering (the app can apply its own syntax ' +
    "highlighting); labels are injected, the core has no i18n.",
  level: 'primitive',
  example: { code: 'npm install @nomosui/react', showCopy: true },
  variants: [],
  props: [
    {
      name: 'code',
      type: 'string',
      required: false,
      check: 'accepted',
      description: 'The raw text to copy, and the content displayed when `children` is absent.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: false,
      check: 'content',
      description: 'The content displayed; lets the app apply its own syntax highlighting.',
    },
    {
      name: 'copyLabel',
      type: 'string',
      required: false,
      check: 'accepted',
      description: 'The copy button label, injected by the app.',
    },
    {
      name: 'copiedLabel',
      type: 'string',
      required: false,
      check: 'accepted',
      description: 'The transient label shown after copying.',
    },
    {
      name: 'showCopy',
      type: 'boolean',
      required: false,
      default: 'true',
      check: 'rendered',
      description: 'Shows the copy button.',
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
      when: 'showing a multi-line code snippet',
      use: 'CodeBlock with `code`',
      avoid: 'an inline `Code`: the block is made for a snippet, not a word',
    },
    {
      when: 'offering to copy the snippet',
      use: 'showCopy (default) + injected copyLabel/copiedLabel',
      avoid: 'a hard-coded label: the app injects the translated text',
    },
    {
      when: 'highlighting the syntax',
      use: 'children with highlighted nodes, `code` remaining the copied text',
      avoid: 'expecting highlighting from the core: it is out of scope',
    },
  ],
}
