import type { ComponentManifest } from '@nomos/catalogue/contract'

/** Le manifeste de l'interrupteur (ADR 0005, ADR 0015). */
export const switchManifest: ComponentManifest = {
  name: 'switch',
  title: 'Switch',
  summary:
    'Un interrupteur qui bascule un état tout de suite, contrôlé par props ' +
    "(`checked` + `onCheckedChange`). Le cœur ne possède ni l'état ni l'action.",
  level: 'primitive',
  example: { checked: true, onCheckedChange: () => {} },
  variants: [],
  props: [
    {
      name: 'checked',
      type: 'boolean',
      required: false,
      check: 'rendered',
      description: 'Activé ou non ; la valeur est chez l’appelant.',
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
      description: 'Désactive l’interrupteur.',
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
      when: 'activer/désactiver une option qui prend effet immédiatement',
      use: '<Switch checked={v} onCheckedChange={set} aria-label={…} />',
      avoid: 'un `Switch` pour un choix qui exige un bouton « Enregistrer » : préférer une `Checkbox`',
    },
  ],
}
