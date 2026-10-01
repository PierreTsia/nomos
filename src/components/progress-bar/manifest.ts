import type { ComponentManifest } from '@nomos/catalogue/contract'

/** Le manifeste de la ProgressBar (ADR 0005). */
export const progressBarManifest: ComponentManifest = {
  name: 'progress-bar',
  title: 'Barre de progression',
  summary:
    "L'avancement d'une tâche sur un total, sémantique ARIA `progressbar`. À préférer au " +
    '`Meter` quand il n’y a ni échelle ni seuil, juste une part accomplie.',
  level: 'primitive',
  example: { value: 60, max: 100, label: 'synchronisation', showValue: true },
  variants: [],
  props: [
    {
      name: 'value',
      type: 'number',
      required: true,
      check: 'rendered',
      description: "L'avancement, borné à `0..max` : c'est lui qui remplit la barre.",
    },
    {
      name: 'max',
      type: 'number',
      required: false,
      check: 'rendered',
      description: 'Le total (100 par défaut).',
    },
    {
      name: 'label',
      type: 'string',
      required: false,
      check: 'rendered',
      description: "Le nom de ce qui avance ; sert de nom accessible au rôle progressbar.",
    },
    {
      name: 'showValue',
      type: 'boolean',
      required: false,
      check: 'rendered',
      description: 'Affiche le pourcentage calculé à droite.',
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
      when: "une tâche qui avance vers un total (import, synchronisation)",
      use: '<ProgressBar value={60} max={100} label="import" showValue />',
      avoid: 'le Meter, réservé à une valeur située avec un seuil',
    },
    {
      when: 'une part accomplie sans échelle ni seuil',
      use: '<ProgressBar value={3} max={10} />',
      avoid: 'un libellé en dur dans le cœur : le texte vient de l’app',
    },
  ],
}
