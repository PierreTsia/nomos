import type { ComponentManifest } from '@nomos/catalogue/contract'

/** Le manifeste du bloc de formulaire (ADR 0005, ADR 0015). Mise en page seule, sans moteur. */
export const formManifest: ComponentManifest = {
  name: 'form',
  title: 'Form',
  summary:
    "La mise en page d'un formulaire : une grille de champs et une zone d'actions, dans un " +
    "`<form>`. Aucune validation, aucun état, aucun texte — l'app fournit champs et actions.",
  level: 'bloc',
  example: { children: 'un champ', columns: 1, actions: 'actions' },
  variants: [],
  props: [
    {
      name: 'columns',
      type: '1 | 2',
      required: false,
      default: '1',
      check: 'accepted',
      description: 'Le nombre de colonnes de la grille de champs à partir du palier `md`.',
    },
    {
      name: 'actions',
      type: 'ReactNode',
      required: false,
      check: 'accepted',
      description: "La zone d'actions sous les champs (boutons fournis par l'app).",
    },
    {
      name: 'onSubmit',
      type: 'FormEventHandler<HTMLFormElement>',
      required: false,
      check: 'accepted',
      description: 'La soumission, gérée par l’appelant (le cœur ne soumet rien).',
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
      when: 'mettre en page un formulaire contrôlé',
      use: '<Form actions={<Button type="submit">…</Button>}><Fieldset>…</Fieldset></Form>',
      avoid: 'attendre du cœur qu’il valide, soumette ou affiche une erreur : il ne le fait pas',
    },
    {
      when: 'ranger des champs sur deux colonnes',
      use: '<Form columns={2}> (deux colonnes à partir du palier `md`)',
      avoid: 'une grille maison dans l’app quand le bloc la fournit déjà',
    },
  ],
}
