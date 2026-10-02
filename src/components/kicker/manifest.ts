import type { ComponentManifest } from '@nomos/catalogue/contract'
import { TONES } from '@nomos/lib/tone'

/** Le manifeste du kicker (ADR 0005). Le ton réutilise le vocabulaire du cœur. */
export const kickerManifest: ComponentManifest = {
  name: 'kicker',
  title: 'Kicker',
  summary:
    "Une étiquette d'accroche, répétée au-dessus d'un titre : un point de ton optionnel et " +
    'un libellé court en majuscules. Le texte est injecté par l’appelant.',
  level: 'primitive',
  example: { tone: 'neutral', dot: true, children: 'section' },
  variants: [
    {
      name: 'tone',
      values: [...TONES],
      default: 'neutral',
      description: "L'intention du point — ce que l'appelant choisit selon l'usage.",
    },
  ],
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      check: 'content',
      description: "Le libellé d'accroche : court, jamais une phrase.",
    },
    {
      name: 'dot',
      type: 'boolean',
      required: false,
      check: 'rendered',
      description: 'Affiche un point de ton devant le libellé.',
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
      when: 'coiffer un titre d’une accroche courte',
      use: '<Kicker dot>section</Kicker>',
      avoid: 'un `Badge` : le kicker situe un titre, il ne qualifie pas un statut',
    },
    {
      when: 'marquer une intention sur l’accroche',
      use: '<Kicker tone="danger" dot>attention</Kicker>',
      avoid: 'une couleur en dur : le ton est une intention, le token porte la valeur',
    },
  ],
}
