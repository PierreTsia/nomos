import type { ComponentManifest } from '@nomos/catalogue/contract'

/**
 * Le manifeste de l'indicateur de frappe (ADR 0005). Une brique de présentation seule :
 * le libellé vient de l'app, le cœur ne porte aucun mot.
 */
export const typingIndicatorManifest: ComponentManifest = {
  name: 'typing-indicator',
  title: 'TypingIndicator',
  summary:
    'Three dots waiting for an assistant reply. The label is injected and carried by a ' +
    'live `status` region; the core invents no word.',
  level: 'primitive',
  example: { label: 'Assistant is typing' },
  variants: [],
  props: [
    {
      name: 'label',
      type: 'string',
      required: true,
      check: 'rendered',
      description: 'The accessible text announced by a screen reader.',
    },
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: "The caller's classes, merged after the variant ones.",
    },
  ],
  usages: [
    {
      when: 'waiting for the assistant before the first token arrives',
      use: 'TypingIndicator label="…"',
      avoid: 'showing it while a full message is already rendered: it would announce twice',
    },
  ],
}
