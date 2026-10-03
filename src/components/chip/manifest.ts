import type { ComponentManifest } from '@nomos/catalogue/contract'
import { TONES } from '@nomos/lib/tone'

/** Le manifeste de la puce (ADR 0005, ADR 0015). Le ton réutilise `toneClasses`. */
export const chipManifest: ComponentManifest = {
  name: 'chip',
  title: 'Chip',
  summary:
    'A compact label, optionally removable. The tone comes from the core (an intent); ' +
    "the app provides the label, the icon and the remove action.",
  level: 'primitive',
  example: { tone: 'neutral', size: 'default', children: 'filter' },
  variants: [
    {
      name: 'tone',
      values: [...TONES],
      default: 'neutral',
      description: "The intent of the chip — what the caller chooses according to usage.",
    },
    {
      name: 'size',
      values: ['default', 'sm'],
      default: 'default',
      description: 'The size of the chip, from the most readable to the most discreet.',
    },
  ],
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      check: 'content',
      description: 'The chip label: short, never a sentence.',
    },
    {
      name: 'icon',
      type: 'ReactNode',
      required: false,
      check: 'accepted',
      description: "A leading icon, provided by the caller.",
    },
    {
      name: 'onRemove',
      type: '() => void',
      required: false,
      check: 'accepted',
      description: 'Shows a remove button and calls it on click.',
    },
    {
      name: 'removeLabel',
      type: 'string',
      required: false,
      check: 'accepted',
      description: "The accessible label of the remove button (required with `onRemove`).",
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      check: 'accepted',
      description: 'Disables the remove button.',
    },
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: "The caller's classes, merged after the core ones.",
    },
  ],
  usages: [
    {
      when: 'show an active filter that can be removed',
      use: '<Chip onRemove={…} removeLabel={…}>domain: ui</Chip>',
      avoid: 'a `Badge` for something removable: the `Badge` is not interactive',
    },
    {
      when: 'qualify an element with no action',
      use: 'a `Chip` without `onRemove`',
      avoid: 'a `Chip` for a production status: a `Badge` states the state without inviting a click',
    },
  ],
}