import type { ComponentManifest } from '@nomos/catalogue/contract'

/** Le manifeste de la case à cocher (ADR 0005, ADR 0015). */
export const checkboxManifest: ComponentManifest = {
  name: 'checkbox',
  title: 'Checkbox',
  summary:
    "Une case à cocher, contrôlée par props (`checked` + `onCheckedChange`). Le cœur ne " +
    "possède ni l'état ni la validation ; l'a11y vient de Radix.",
  level: 'primitive',
  example: { checked: true, onCheckedChange: () => {} },
  variants: [],
  props: [
    {
      name: 'checked',
      type: 'boolean',
      required: false,
      check: 'rendered',
      description: 'Cochée ou non ; la valeur est chez l’appelant.',
    },
    {
      name: 'onCheckedChange',
      type: '(checked: boolean) => void',
      required: false,
      check: 'accepted',
      description: 'Le rappel de bascule.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      check: 'accepted',
      description: 'Désactive la case.',
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
      when: 'cocher une option indépendante',
      use: '<Checkbox checked={v} onCheckedChange={set} />',
      avoid: 'attendre un état interne : la valeur reste dans l’app',
    },
    {
      when: 'nommer la case',
      use: 'un `Label htmlFor` ou un `aria-label`',
      avoid: 'une case sans libellé : elle devient muette pour un lecteur d’écran',
    },
  ],
}
