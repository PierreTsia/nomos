import type { ComponentManifest } from '@nomos/catalogue/contract'
import { TONES } from '@nomos/lib/tone'

/** Le manifeste du kicker (ADR 0005). Le ton réutilise le vocabulaire du cœur. */
export const kickerManifest: ComponentManifest = {
  name: 'kicker',
  title: 'Kicker',
  summary:
    "A kicker label, repeated above a title: an optional tone dot and " +
    'a short uppercase label. The text is injected by the caller.',
  level: 'primitive',
  example: { tone: 'neutral', dot: true, children: 'section' },
  variants: [
    {
      name: 'tone',
      values: [...TONES],
      default: 'neutral',
      description: "The dot's intent — what the caller chooses based on usage.",
    },
  ],
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      check: 'content',
      description: "The kicker label: short, never a sentence.",
    },
    {
      name: 'dot',
      type: 'boolean',
      required: false,
      check: 'rendered',
      description: 'Displays a tone dot before the label.',
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
      when: 'topping a title with a short kicker',
      use: '<Kicker dot>section</Kicker>',
      avoid: 'a `Badge`: the kicker positions a title, it does not qualify a status',
    },
    {
      when: 'marking an intent on the kicker',
      use: '<Kicker tone="danger" dot>warning</Kicker>',
      avoid: 'a hardcoded color: tone is an intent, the token carries the value',
    },
  ],
}
