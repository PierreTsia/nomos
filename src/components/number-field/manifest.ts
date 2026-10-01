import type { ComponentManifest } from '@nomos/catalogue/contract'

/** Le manifeste du champ numérique (ADR 0005, ADR 0015). Le natif porte pas et bornes. */
export const numberFieldManifest: ComponentManifest = {
  name: 'number-field',
  title: 'NumberField',
  summary:
    "Un champ numérique (`<input type=\"number\">`) : le pas et les bornes viennent du " +
    "natif (`step`, `min`, `max`). La valeur et le rappel restent à l'appelant.",
  level: 'primitive',
  example: { placeholder: '0', step: 1, min: 0, max: 10 },
  variants: [],
  props: [
    {
      name: 'step',
      type: 'number',
      required: false,
      check: 'attribute',
      description: 'Le pas du compteur natif.',
    },
    {
      name: 'min',
      type: 'number',
      required: false,
      check: 'attribute',
      description: 'La borne basse.',
    },
    {
      name: 'max',
      type: 'number',
      required: false,
      check: 'attribute',
      description: 'La borne haute.',
    },
    {
      name: 'placeholder',
      type: 'string',
      required: false,
      check: 'attribute',
      description: "Le texte d'invite, affiché tant que le champ est vide.",
    },
    {
      name: 'value',
      type: 'string',
      required: false,
      check: 'accepted',
      description: 'La valeur courante, contrôlée par l’appelant.',
    },
    {
      name: 'onChange',
      type: 'ChangeEventHandler<HTMLInputElement>',
      required: false,
      check: 'accepted',
      description: 'Le rappel de saisie.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      check: 'accepted',
      description: 'Désactive le champ.',
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
      when: 'poser un nombre borné avec un pas',
      use: '<NumberField min={0} max={100} step={5} value={v} onChange={…} />',
      avoid: 'attendre une validation ou un formatage du cœur : ils appartiennent à l’app',
    },
    {
      when: 'un champ contrôlé',
      use: '<NumberField value={v} onChange={…} /> (l’état reste dans l’app)',
      avoid: 'un état interne : le cœur n’en a pas',
    },
  ],
}
