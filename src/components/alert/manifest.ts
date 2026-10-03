import type { ComponentManifest } from '@nomos/catalogue/contract'
import { TONES } from '@nomos/lib/tone'

/** Le manifeste du bandeau (ADR 0005, ADR 0015). Le ton réutilise le vocabulaire `toneClasses`. */
export const alertManifest: ComponentManifest = {
  name: 'alert',
  title: 'Alert',
  summary:
    'An inline banner that states an information, a warning, a success or an error. ' +
    "The tone comes from the core (an intent, not a color); all text is provided by the app.",
  level: 'primitive',
  example: { tone: 'info', title: 'information', children: 'a detail to read.' },
  variants: [
    {
      name: 'tone',
      values: [...TONES],
      default: 'info',
      description:
        "The intent of the banner — it is what the caller chooses according to usage, not taste.",
    },
  ],
  props: [
    {
      name: 'title',
      type: 'string',
      required: true,
      check: 'rendered',
      description: 'The banner title: short, never a sentence.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: false,
      check: 'content',
      description: 'The detailed content, under the title.',
    },
    {
      name: 'action',
      type: 'ReactNode',
      required: false,
      check: 'accepted',
      description: 'What can be done: a button, a link.',
    },
    {
      name: 'icon',
      type: 'ReactNode',
      required: false,
      check: 'accepted',
      description: "Replaces the default icon for the tone.",
    },
    {
      name: 'onClose',
      type: '() => void',
      required: false,
      check: 'accepted',
      description: 'Shows a close button and calls it on click.',
    },
    {
      name: 'closeLabel',
      type: 'string',
      required: false,
      check: 'accepted',
      description: "The accessible label of the close button (required with `onClose`).",
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
      when: 'signal a state that demands attention without blocking the view',
      use: '<Alert tone="warning" title={…}>…</Alert>',
      avoid: 'an `Alert` for decorative information: the banner must say something',
    },
    {
      when: 'a banner that can be closed',
      use: 'onClose + closeLabel (both together)',
      avoid: 'onClose without closeLabel: the button becomes mute for a screen reader',
    },
  ],
}
