import type { ComponentManifest } from '@nomos/catalogue/contract'

/**
 * Le manifeste du CopyButton (ADR 0005). Il reprend les deux groupes de variantes du
 * Button — `variant` et `size` — que le test de cohérence confronte à la config réelle.
 */
export const copyButtonManifest: ComponentManifest = {
  name: 'copy-button',
  title: 'CopyButton',
  summary:
    'Un bouton qui copie un texte dans le presse-papiers et affiche un libellé ' +
    'transitoire. Les libellés et l’icône sont injectés : le cœur n’a pas d’i18n.',
  level: 'primitive',
  example: { value: 'npm install @nomosui/react' },
  variants: [
    {
      name: 'variant',
      values: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      default: 'default',
      description: "Le ton de l'action, repris du Button.",
    },
    {
      name: 'size',
      values: ['default', 'sm', 'lg', 'icon'],
      default: 'default',
      description: 'La taille du contrôle, reprise du Button.',
    },
  ],
  props: [
    {
      name: 'value',
      type: 'string',
      required: true,
      check: 'accepted',
      description: 'Le texte à copier dans le presse-papiers.',
    },
    {
      name: 'label',
      type: 'string',
      required: false,
      default: 'Copy',
      check: 'accepted',
      description: 'Le libellé au repos, injecté par l’app.',
    },
    {
      name: 'copiedLabel',
      type: 'string',
      required: false,
      default: 'Copied',
      check: 'accepted',
      description: 'Le libellé transitoire affiché après la copie.',
    },
    {
      name: 'icon',
      type: 'ReactNode',
      required: false,
      check: 'accepted',
      description: 'Une icône fournie par l’appelant ; le cœur n’expose pas d’icônes.',
    },
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: "Les classes de l'appelant, fusionnées après celles de la variante.",
    },
  ],
  usages: [
    {
      when: 'offrir de copier une valeur courte (un identifiant, une commande)',
      use: 'value + label',
      avoid: 'un libellé produit en dur : l’app injecte le texte traduit',
    },
    {
      when: 'signaler la copie sans changer de vue',
      use: 'copiedLabel',
      avoid: 'un toast en plus : le libellé transitoire suffit',
    },
    {
      when: 'poser une icône à côté du libellé',
      use: 'icon',
      avoid: 'une icône seule sans `aria-label` : le bouton devient muet',
    },
  ],
}
