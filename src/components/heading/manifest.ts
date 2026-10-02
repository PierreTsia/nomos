import type { ComponentManifest } from '@nomos/catalogue/contract'

/**
 * Le manifeste du Titre (ADR 0005). `level` est la seule variante : elle choisit à la fois
 * la balise (`h1`..`h6`) et la taille sémantique, pour qu'un seul mot dise la hiérarchie.
 */
export const headingManifest: ComponentManifest = {
  name: 'heading',
  title: 'Heading',
  summary:
    'Un titre de section. Le niveau (`level`) choisit la balise `h1`..`h6` et la taille ' +
    "sémantique ; le texte vient de l'appelant.",
  level: 'primitive',
  example: { level: 2, children: 'Titre de section' },
  variants: [
    {
      name: 'level',
      values: ['1', '2', '3', '4', '5', '6'],
      default: '2',
      description:
        "Le niveau hiérarchique : il rend la balise `h1`..`h6` correspondante et lit la " +
        "taille sémantique (display, title, lead, body, caption, micro).",
    },
  ],
  props: [
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
      description: 'Le texte du titre : court, il nomme la section.',
    },
  ],
  usages: [
    {
      when: "le titre principal d'une vue",
      use: 'level={1}',
      avoid: 'plusieurs `level={1}` dans une même vue : un seul titre de premier niveau',
    },
    {
      when: 'un titre de section sous le titre principal',
      use: 'level={2}',
      avoid: 'sauter un niveau pour grossir un titre : la hiérarchie doit rester continue',
    },
    {
      when: 'un sous-titre de bloc ou de carte',
      use: 'level={3}',
      avoid: 'un `level` choisi pour sa taille plutôt que pour la structure du document',
    },
  ],
}
