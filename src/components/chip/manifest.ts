import type { ComponentManifest } from '@nomos/catalogue/contract'
import { TONES } from '@nomos/lib/tone'

/** Le manifeste de la puce (ADR 0005, ADR 0015). Le ton réutilise `toneClasses`. */
export const chipManifest: ComponentManifest = {
  name: 'chip',
  title: 'Chip',
  summary:
    'Une étiquette compacte, éventuellement retirable. Le ton vient du cœur (une intention) ; ' +
    "l'app fournit le libellé, l'icône et l'action de retrait.",
  level: 'primitive',
  example: { tone: 'neutral', size: 'default', children: 'filtre' },
  variants: [
    {
      name: 'tone',
      values: [...TONES],
      default: 'neutral',
      description: "L'intention de la puce — ce que l'appelant choisit selon l'usage.",
    },
    {
      name: 'size',
      values: ['default', 'sm'],
      default: 'default',
      description: 'La taille de la puce, du plus lisible au plus discret.',
    },
  ],
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      check: 'content',
      description: 'Le libellé de la puce : court, jamais une phrase.',
    },
    {
      name: 'icon',
      type: 'ReactNode',
      required: false,
      check: 'accepted',
      description: "Une icône de tête, fournie par l'appelant.",
    },
    {
      name: 'onRemove',
      type: '() => void',
      required: false,
      check: 'accepted',
      description: 'Affiche un bouton de retrait et le rappelle au clic.',
    },
    {
      name: 'removeLabel',
      type: 'string',
      required: false,
      check: 'accepted',
      description: "Le libellé accessible du bouton de retrait (requis avec `onRemove`).",
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      check: 'accepted',
      description: 'Désactive le bouton de retrait.',
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
      when: 'montrer un filtre actif qu’on peut retirer',
      use: '<Chip onRemove={…} removeLabel={…}>domaine : ui</Chip>',
      avoid: 'un `Badge` pour quelque chose de retirable : le `Badge` n’est pas interactif',
    },
    {
      when: 'qualifier un élément sans action',
      use: 'un `Chip` sans `onRemove`',
      avoid: 'un `Chip` pour un statut de production : un `Badge` dit l’état sans inviter au clic',
    },
  ],
}