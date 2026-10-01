import type { ComponentManifest } from '@nomos/catalogue/contract'

/**
 * Le manifeste du Badge (ADR 0005). Il est écrit à la main : le type se génère,
 * l'usage s'écrit. Le test de cohérence du catalogue le confronte aux props réelles —
 * une variante ajoutée au composant sans passer ici fait rougir le test.
 */
export const badgeManifest: ComponentManifest = {
  name: 'badge',
  title: 'Badge',
  summary:
    "Une étiquette courte et non interactive, posée à côté d'un contenu pour le qualifier. " +
    "Tout attribut HTML est transmis tel quel à l'élément.",
  level: 'primitive',
  variants: [
    {
      name: 'variant',
      values: ['default', 'secondary', 'destructive', 'outline'],
      default: 'default',
      description:
        "Le ton de l'étiquette — c'est ce que l'appelant choisit selon l'usage, pas selon son goût.",
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
      name: 'title',
      type: 'string',
      required: false,
      check: 'attribute',
      description: "L'attribut HTML transmis tel quel, ici le libellé au survol.",
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      check: 'content',
      description: "Le texte porté par l'étiquette : court, jamais une phrase.",
    },
  ],
  usages: [
    {
      when: "un statut de production qu'on doit voir au premier coup d'œil",
      use: 'variant="destructive"',
      avoid: "variant=\"outline\", qui ne se distingue pas dans une ligne déjà dense",
    },
    {
      when: 'une étiquette neutre posée à côté du contenu',
      use: 'variant="secondary"',
      avoid: "variant=\"default\", réservé au ton principal de la vue",
    },
    {
      when: "une information à qualifier sans crier (compte, catégorie)",
      use: 'variant="outline"',
      avoid: "variant=\"destructive\" pour qualifier sans urgence : le ton doit dire la gravité réelle",
    },
  ],
}