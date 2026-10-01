import type { ComponentManifest } from '@nomos/catalogue/contract'

/** Le manifeste du squelette de chargement (ADR 0005). */
export const skeletonManifest: ComponentManifest = {
  name: 'skeleton',
  title: 'Skeleton',
  summary:
    "Un bloc qui pulse pour tenir la place d'un contenu en cours de chargement. " +
    'Sa largeur et sa hauteur viennent des classes de l’appelant.',
  level: 'primitive',
  example: { className: 'h-8 w-72' },
  variants: [],
  props: [
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: "Les classes de l'appelant (dimensions) : le cœur ne connaît que le style de pulsation.",
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: false,
      check: 'content',
      description: 'Rarement utilisé : un squelette est une surface vide.',
    },
  ],
  usages: [
    {
      when: 'tenir la place d’un texte ou d’un bloc pendant le chargement',
      use: '<Skeleton className="h-8 w-72" />',
      avoid: 'un `Skeleton` aux dimensions par défaut : il n’a pas de taille propre',
    },
    {
      when: 'plusieurs lignes de chargement',
      use: 'plusieurs `Skeleton` empilés',
      avoid: 'un spinner : le squelette montre la forme du contenu qui arrive',
    },
  ],
}
