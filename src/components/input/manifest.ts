import type { ComponentManifest } from '@nomos/catalogue/contract'

/**
 * Le manifeste du champ de saisie (ADR 0005). Le cœur ne pose ni validation ni état :
 * l'appelant passe ses props HTML, la valeur et le rappel restent chez lui.
 */
export const inputManifest: ComponentManifest = {
  name: 'input',
  title: 'Input',
  summary:
    "Un champ de saisie d'une ligne. Il porte le style des tokens et transmet tout " +
    "attribut HTML d'`<input>` ; la valeur et le changement restent à l'appelant.",
  level: 'primitive',
  example: { placeholder: 'rechercher' },
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
      name: 'type',
      type: 'string',
      required: false,
      check: 'attribute',
      description: "Le type HTML du champ (`text`, `search`, `password`…).",
    },
    {
      name: 'placeholder',
      type: 'string',
      required: false,
      check: 'attribute',
      description: "Le texte d'invite, affiché tant que le champ est vide.",
    },
  ],
  usages: [
    {
      when: 'un champ de recherche dans une barre d’outils',
      use: '<Input type="search" placeholder={…} />',
      avoid: 'un placeholder à la place d’un libellé durable, pour un champ de formulaire',
    },
    {
      when: 'un champ contrôlé',
      use: '<Input value={v} onChange={…} /> (l’état reste dans l’app)',
      avoid: 'attendre un état interne du cœur : il n’en a pas',
    },
  ],
}
