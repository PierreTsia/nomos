import type { ComponentManifest } from '@nomos/catalogue/contract'

/** Le manifeste du champ de recherche (ADR 0005, ADR 0015). Le cœur ne connaît pas l'i18n. */
export const searchFieldManifest: ComponentManifest = {
  name: 'search-field',
  title: 'SearchField',
  summary:
    "Un champ de recherche avec icône et bouton d'effacement, contrôlé par props " +
    "(`value` + `onChange`). Le libellé « effacer » est injecté : le cœur n'a pas d'i18n.",
  level: 'primitive',
  example: { value: '', onChange: () => {}, clearLabel: 'Effacer', placeholder: 'rechercher' },
  variants: [],
  props: [
    {
      name: 'value',
      type: 'string',
      required: true,
      check: 'accepted',
      description: 'Le terme courant, contrôlé par l’appelant.',
    },
    {
      name: 'onChange',
      type: '(value: string) => void',
      required: true,
      check: 'accepted',
      description: 'Le rappel de saisie **et** d’effacement (le bouton renvoie la chaîne vide).',
    },
    {
      name: 'clearLabel',
      type: 'string',
      required: true,
      check: 'accepted',
      description: "Le libellé accessible du bouton d'effacement.",
    },
    {
      name: 'placeholder',
      type: 'string',
      required: false,
      check: 'attribute',
      description: "Le texte d'invite, affiché tant que le champ est vide.",
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
      when: 'chercher dans une liste ou une barre d’outils',
      use: "<SearchField value={v} onChange={set} clearLabel={t('clear')} />",
      avoid: 'un `Input type="search"` nu quand il faut l’icône et l’effacement',
    },
    {
      when: 'effacer la recherche',
      use: 'le bouton intégré, qui rappelle `onChange("")`',
      avoid: 'gérer l’effacement dans l’app quand le champ est déjà rempli',
    },
  ],
}
