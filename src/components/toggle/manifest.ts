import type { ComponentManifest } from '@nomos/catalogue/contract'

/** Le manifeste de la bascule (ADR 0005, ADR 0015). Deux états, contrôlés par props. */
export const toggleManifest: ComponentManifest = {
  name: 'toggle',
  title: 'Toggle',
  summary:
    'Un bouton à deux états : pressé ou non. Une bascule ponctuelle (mode, filtre), pas un ' +
    'réglage qui persiste comme `Switch`. Contrôlé par props, a11y par Radix.',
  level: 'primitive',
  example: { children: 'compact', defaultPressed: true },
  variants: [
    {
      name: 'variant',
      values: ['default', 'outline'],
      default: 'default',
      description: 'Le ton du bouton — plein discret, ou bordé pour une barre d’outils.',
    },
    {
      name: 'size',
      values: ['default', 'sm', 'lg'],
      default: 'default',
      description: 'La taille du contrôle, du plus discret au plus large.',
    },
  ],
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      check: 'content',
      description: 'Le libellé ou l’icône de la bascule.',
    },
    {
      name: 'pressed',
      type: 'boolean',
      required: false,
      check: 'accepted',
      description: 'L’état pressé, contrôlé par l’appelant.',
    },
    {
      name: 'onPressedChange',
      type: '(pressed: boolean) => void',
      required: false,
      check: 'accepted',
      description: 'Le rappel de bascule.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      check: 'accepted',
      description: 'Désactive la bascule.',
    },
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: "Les classes de l'appelant, fusionnées après celles du cœur.",
    },
  ],
  usages: [
    {
      when: 'un mode ou un filtre qu’on active ponctuellement',
      use: '<Toggle pressed={v} onPressedChange={set}>compact</Toggle>',
      avoid: 'un `Toggle` pour un réglage qui persiste : c’est un `Switch`',
    },
    {
      when: 'laisser la bascule libre de son état',
      use: 'defaultPressed (non contrôlé)',
      avoid: 'mélanger `pressed` et `defaultPressed` : l’un annule l’autre',
    },
  ],
}
