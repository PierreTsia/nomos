import type { ComponentManifest } from '@nomos/catalogue/contract'

/** Le manifeste du Counter (ADR 0005). */
export const counterManifest: ComponentManifest = {
  name: 'counter',
  title: 'Compteur',
  summary:
    'Un nombre mis en avant, avec un suffixe et un libellé fournis par l’app. Aucun ' +
    'formatage ni unité dans le cœur : le texte et le nombre viennent de l’appelant.',
  level: 'primitive',
  example: { value: 128, suffix: 'issues', label: 'ouvertes' },
  variants: [],
  props: [
    {
      name: 'value',
      type: 'number',
      required: true,
      check: 'rendered',
      description: 'Le nombre mis en avant.',
    },
    {
      name: 'suffix',
      type: 'string',
      required: false,
      check: 'rendered',
      description: "L'unité ou le signe qui suit le nombre, fourni par l'appelant.",
    },
    {
      name: 'label',
      type: 'string',
      required: false,
      check: 'rendered',
      description: 'Le nom de ce qui est compté.',
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
      when: 'un total à lire au premier coup d’œil (issues ouvertes, PR en attente)',
      use: '<Counter value={128} suffix="issues" label="ouvertes" />',
      avoid: 'un nombre noyé dans une phrase : le compteur est fait pour être vu seul',
    },
    {
      when: 'un chiffre sans unité',
      use: '<Counter value={7} />',
      avoid: 'inventer une unité dans le cœur : elle appartient à l’app',
    },
  ],
}
