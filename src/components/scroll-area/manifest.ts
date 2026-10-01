import type { ComponentManifest } from '@nomos/catalogue/contract'

/**
 * Le manifeste de la zone défilante (ADR 0005). Purement cosmétique : le défilement reste
 * natif, le cœur ne le remplace pas.
 */
export const scrollAreaManifest: ComponentManifest = {
  name: 'scroll-area',
  title: 'ScrollArea',
  summary:
    'Une surface bornée dont le contenu plus grand défile, avec une barre stylée. ' +
    'Cosmétique — le défilement reste natif ; le contenu vient de l’app.',
  level: 'primitive',
  example: {
    className: 'h-24 w-48 rounded-md border',
    children: 'Un contenu plus grand que la surface.',
  },
  variants: [],
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      check: 'accepted',
      description: 'Le contenu qui défile.',
    },
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: 'Les classes de l’appelant, fusionnées après celles du cœur (ici la hauteur et la largeur).',
    },
    {
      name: 'type',
      type: "'auto' | 'always' | 'scroll' | 'hover'",
      required: false,
      check: 'accepted',
      description: 'Quand la barre apparaît. Défaut `hover`.',
    },
  ],
  usages: [
    {
      when: 'borner une sous-vue dense (journal, liste de fichiers) dans une hauteur fixe',
      use: '<ScrollArea className="h-64">…</ScrollArea>',
      avoid: 'une `ScrollArea` qui prend toute la page : le défilement est celui du document',
    },
  ],
}
