import type { ComponentManifest } from '@nomos/catalogue/contract'

/**
 * Le manifeste du Texte (ADR 0005). `size` lit l'échelle typographique sémantique ; `as`
 * choisit l'élément rendu (paragraphe ou `span` inline).
 */
export const textManifest: ComponentManifest = {
  name: 'text',
  title: 'Text',
  summary:
    "Le texte courant. La taille (`size`) vient de l'échelle sémantique ; `as` choisit " +
    "l'élément rendu, un paragraphe ou un `span` inline.",
  level: 'primitive',
  example: { size: 'body', children: 'Un paragraphe de texte courant.' },
  variants: [
    {
      name: 'size',
      values: ['lead', 'body', 'caption', 'micro'],
      default: 'body',
      description:
        "La taille sémantique : `lead` pour une accroche, `body` pour le texte courant, " +
        '`caption` et `micro` pour les mentions secondaires.',
    },
  ],
  props: [
    {
      name: 'as',
      type: "'p' | 'span'",
      required: false,
      check: 'rendered',
      description: "L'élément rendu : un paragraphe par défaut, un `span` pour un texte inline.",
    },
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: "Les classes de l'appelant, fusionnées après celles de la variante.",
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      check: 'content',
      description: 'Le contenu textuel, fourni par l’app.',
    },
  ],
  usages: [
    {
      when: 'un paragraphe de texte courant',
      use: 'size="body"',
      avoid: 'un `size` plus grand pour « faire ressortir » : la hiérarchie passe par `Heading`',
    },
    {
      when: 'une accroche ou un chapeau au-dessus du corps',
      use: 'size="lead"',
      avoid: 'un `lead` pour tout le corps : il perd son rôle d’accroche',
    },
    {
      when: 'une mention secondaire (légende, aide, horodatage)',
      use: 'size="caption"',
      avoid: 'un `caption` pour du contenu essentiel : il est fait pour être discret',
    },
    {
      when: 'un texte inline dans une phrase',
      use: 'as="span"',
      avoid: 'un `span` pour un paragraphe entier : le navigateur perd la structure',
    },
  ],
}
