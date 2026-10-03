import type { ComponentManifest } from '@nomos/catalogue/contract'

/**
 * Le manifeste du CopyButton (ADR 0005). Il reprend les deux groupes de variantes du
 * Button — `variant` et `size` — que le test de cohérence confronte à la config réelle.
 */
export const copyButtonManifest: ComponentManifest = {
  name: 'copy-button',
  title: 'CopyButton',
  summary:
    'A button that copies text to the clipboard and shows a transient label. ' +
    'The labels and the icon are injected: the core has no i18n.',
  level: 'primitive',
  example: { value: 'npm install @nomosui/react' },
  variants: [
    {
      name: 'variant',
      values: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      default: 'default',
      description: "The action's tone, taken from the Button.",
    },
    {
      name: 'size',
      values: ['default', 'sm', 'lg', 'icon'],
      default: 'default',
      description: 'The size of the control, taken from the Button.',
    },
  ],
  props: [
    {
      name: 'value',
      type: 'string',
      required: true,
      check: 'accepted',
      description: 'The text to copy to the clipboard.',
    },
    {
      name: 'label',
      type: 'string',
      required: false,
      default: 'Copy',
      check: 'accepted',
      description: 'The resting label, injected by the app.',
    },
    {
      name: 'copiedLabel',
      type: 'string',
      required: false,
      default: 'Copied',
      check: 'accepted',
      description: 'The transient label shown after copying.',
    },
    {
      name: 'icon',
      type: 'ReactNode',
      required: false,
      check: 'accepted',
      description: 'An icon provided by the caller; the core exposes no icons.',
    },
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: "The caller's classes, merged after those of the variant.",
    },
  ],
  usages: [
    {
      when: 'offering to copy a short value (an identifier, a command)',
      use: 'value + label',
      avoid: 'a hard-coded label: the app injects the translated text',
    },
    {
      when: 'signaling the copy without changing the view',
      use: 'copiedLabel',
      avoid: 'an extra toast: the transient label is enough',
    },
    {
      when: 'placing an icon next to the label',
      use: 'icon',
      avoid: 'an icon alone without `aria-label`: the button becomes mute',
    },
  ],
}
