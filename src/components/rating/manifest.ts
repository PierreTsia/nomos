import type { ComponentManifest } from '@nomos/catalogue/contract'

/** Le manifeste du Rating (ADR 0005). */
export const ratingManifest: ComponentManifest = {
  name: 'rating',
  title: 'Note',
  summary:
    'Une note sur `max` étoiles, **contrôlée**. Interactive seulement si l’app fournit ' +
    '`onValueChange` ; sinon un affichage. A11y `radiogroup` (flèches, Home/End).',
  level: 'primitive',
  example: { value: 3, max: 5, ariaLabel: 'Note', onValueChange: () => {} },
  variants: [],
  props: [
    {
      name: 'value',
      type: 'number',
      required: true,
      check: 'rendered',
      description: 'La note actuelle, de 0 à `max`.',
    },
    {
      name: 'max',
      type: 'number',
      required: false,
      check: 'rendered',
      description: "Le nombre d'étoiles (5 par défaut).",
    },
    {
      name: 'onValueChange',
      type: '(value: number) => void',
      required: false,
      check: 'accepted',
      description: "Rend la note interactive quand fourni ; l'app décide de la suite.",
    },
    {
      name: 'readOnly',
      type: 'boolean',
      required: false,
      check: 'rendered',
      description: 'Force l’affichage seul, même si `onValueChange` est fourni.',
    },
    {
      name: 'ariaLabel',
      type: 'string',
      required: false,
      check: 'rendered',
      description: "Le nom accessible du groupe : le cœur n'a pas d'i18n.",
    },
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: "Les classes de l'appelant, fusionnées après celles du composant.",
    },
  ],
  usages: [
    {
      when: 'recueillir une note de l’utilisateur',
      use: '<Rating value={note} onValueChange={setNote} ariaLabel={t.rating.label} />',
      avoid: 'laisser le Rating posséder la valeur : la donnée appartient à l’app',
    },
    {
      when: 'montrer une note déjà posée',
      use: '<Rating value={4} readOnly ariaLabel={t.rating.label} />',
      avoid: 'un `onValueChange` sans intention de le consommer',
    },
  ],
}
