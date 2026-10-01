import type { ComponentManifest } from '@nomos/catalogue/contract'

/** Le manifeste du regroupement de champs (ADR 0005, ADR 0015). */
export const fieldsetManifest: ComponentManifest = {
  name: 'fieldset',
  title: 'Fieldset',
  summary:
    'Un regroupement de champs apparentés. Sémantique (`fieldset`) et espacement des tokens ; ' +
    "le titre du groupe (`legend`) vient de l'app.",
  level: 'primitive',
  example: { children: 'groupe de champs' },
  variants: [],
  props: [
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: "Les classes de l'appelant, fusionnées après celles du cœur.",
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      check: 'content',
      description: 'Les champs regroupés (et leur `legend`).',
    },
  ],
  usages: [
    {
      when: 'regrouper des champs apparentés d’un formulaire',
      use: '<Fieldset><legend>…</legend> …champs… </Fieldset>',
      avoid: 'un `<div>` : on perd la sémantique de groupe de formulaire',
    },
  ],
}
