import type { ComponentManifest } from '@nomos/catalogue/contract'

/**
 * Le manifeste du CodeBlock (ADR 0005). Il est écrit à la main : le type se génère,
 * l'usage s'écrit. Le test de cohérence du catalogue le confronte aux props réelles.
 */
export const codeBlockManifest: ComponentManifest = {
  name: 'code-block',
  title: 'CodeBlock',
  summary:
    'Un bloc de code monospace scrollable, avec un bouton de copie. `code` est le texte ' +
    'brut copié, `children` le rendu (l’app peut y poser sa coloration) ; les libellés ' +
    "sont injectés, le cœur n'a pas d'i18n.",
  level: 'primitive',
  example: { code: 'npm install @nomosui/react', showCopy: true },
  variants: [],
  props: [
    {
      name: 'code',
      type: 'string',
      required: false,
      check: 'accepted',
      description: 'Le texte brut à copier, et le contenu affiché si `children` est absent.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: false,
      check: 'content',
      description: 'Le contenu affiché ; permet à l’app de poser sa propre coloration.',
    },
    {
      name: 'copyLabel',
      type: 'string',
      required: false,
      check: 'accepted',
      description: 'Le libellé du bouton de copie, injecté par l’app.',
    },
    {
      name: 'copiedLabel',
      type: 'string',
      required: false,
      check: 'accepted',
      description: 'Le libellé transitoire affiché après la copie.',
    },
    {
      name: 'showCopy',
      type: 'boolean',
      required: false,
      default: 'true',
      check: 'rendered',
      description: 'Affiche le bouton de copie.',
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
      when: 'montrer un extrait de code de plusieurs lignes',
      use: 'CodeBlock avec `code`',
      avoid: 'un `Code` inline : le bloc est fait pour un extrait, pas un mot',
    },
    {
      when: 'offrir de copier l’extrait',
      use: 'showCopy (défaut) + copyLabel/copiedLabel injectés',
      avoid: 'un libellé produit en dur : l’app injecte le texte traduit',
    },
    {
      when: 'colorer la syntaxe',
      use: 'children avec des nœuds colorés, `code` restant le texte copié',
      avoid: 'attendre la coloration du cœur : elle est hors périmètre',
    },
  ],
}
