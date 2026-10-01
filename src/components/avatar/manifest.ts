import type { ComponentManifest } from '@nomos/catalogue/contract'

/**
 * Le manifeste de l'avatar (ADR 0005). Natif `<img>` + repli — **aucune dépendance**
 * (ADR 0002, 0019) : le repli et le texte alternatif viennent de l'app.
 */
export const avatarManifest: ComponentManifest = {
  name: 'avatar',
  title: 'Avatar',
  summary:
    'Une image ronde avec un repli quand elle manque ou échoue. Pas de dépendance : le ' +
    'natif `<img>` et son `onError` suffisent ; le repli et le texte alternatif viennent de l’app.',
  level: 'primitive',
  example: {
    alt: 'Photo de profil',
    fallback: 'PT',
  },
  variants: [],
  props: [
    {
      name: 'src',
      type: 'string',
      required: false,
      check: 'attribute',
      description: 'L’URL de l’image ; absente, le repli s’affiche directement.',
    },
    {
      name: 'alt',
      type: 'string',
      required: true,
      check: 'accepted',
      description: 'Le texte alternatif : il nomme la personne (fourni par l’app).',
    },
    {
      name: 'fallback',
      type: 'ReactNode',
      required: true,
      check: 'rendered',
      description: 'Le repli quand il n’y a pas d’image, ou qu’elle échoue : des initiales, une icône.',
    },
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: 'Les classes de l’appelant, fusionnées après celles du cœur.',
    },
  ],
  usages: [
    {
      when: 'représenter une personne ou une entité par son image',
      use: 'un `src` et un `fallback` (initiales) fourni par l’app',
      avoid: 'attendre une image qui peut échouer : toujours un `fallback`',
    },
    {
      when: 'une image décorative sans personne derrière',
      use: 'une simple `<img>` de l’app',
      avoid: 'un `Avatar` sans `alt` : il nomme une personne, il ne décore pas',
    },
  ],
}
