import type { ComponentManifest } from '@nomos/catalogue/contract'

/** Le manifeste de l'emplacement de champ (ADR 0005, ADR 0015). */
export const fieldManifest: ComponentManifest = {
  name: 'field',
  title: 'Field',
  summary:
    "L'emplacement d'un champ : libellé, contrôle (fourni par l'app), puis aide ou message " +
    "d'erreur. Aucun moteur : l'app possède l'état, la validation et les textes.",
  level: 'primitive',
  example: { label: 'Libellé', hint: 'Aide', children: 'champ' },
  variants: [],
  props: [
    {
      name: 'label',
      type: 'ReactNode',
      required: false,
      check: 'rendered',
      description: "Le libellé du champ ; absent, aucun libellé n'est rendu.",
    },
    {
      name: 'hint',
      type: 'ReactNode',
      required: false,
      check: 'rendered',
      description: "L'aide sous le champ, affichée quand il n'y a pas d'erreur.",
    },
    {
      name: 'error',
      type: 'string | null',
      required: false,
      check: 'rendered',
      description: "Le message d'erreur, **déjà formaté** par l'app : il remplace l'aide.",
    },
    {
      name: 'htmlFor',
      type: 'string',
      required: false,
      check: 'accepted',
      description: "L'`id` du contrôle, transmis au libellé en attribut `for`.",
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
      description: 'Le contrôle (Input, Select, …), fourni par l’appelant.',
    },
  ],
  usages: [
    {
      when: 'poser un libellé, un contrôle et une aide',
      use: '<Field label="Adresse" hint="…"><Input … /></Field>',
      avoid: 'attendre une validation du cœur : le message d’erreur est injecté, pas calculé',
    },
    {
      when: 'montrer une erreur de validation',
      use: '<Field label="Adresse" error={message}>…</Field>',
      avoid: 'passer la règle ou le champ fautif : le cœur ne connaît que le texte final',
    },
  ],
}
