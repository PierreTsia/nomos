import type { ComponentManifest } from '@nomos/catalogue/contract'

/** Le manifeste du libellé (ADR 0005, ADR 0015). */
export const labelManifest: ComponentManifest = {
  name: 'label',
  title: 'Label',
  summary:
    "Le libellé d'un champ, associé au contrôle par `htmlFor`. Le texte vient de l'appelant " +
    "(le cœur n'a pas d'i18n) ; la typographie vient des tokens.",
  level: 'primitive',
  example: { children: 'Libellé' },
  variants: [],
  props: [
    {
      name: 'htmlFor',
      type: 'string',
      required: false,
      check: 'accepted',
      description: "L'`id` du contrôle associé : clique le libellé et le champ prend le focus (rendu en attribut `for`).",
    },
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
      description: "Le texte du libellé, injecté par l'app.",
    },
  ],
  usages: [
    {
      when: 'nommer un champ et l’associer à son contrôle',
      use: '<Label htmlFor="email">Adresse</Label>',
      avoid: 'un libellé sans `htmlFor` : le clic ne donne pas le focus au champ',
    },
    {
      when: 'poser un libellé hors d’un `Field`',
      use: 'le même atome, avec ton propre espacement',
      avoid: 'coder un `<label>` stylé à la main : on perd la typographie des tokens',
    },
  ],
}
