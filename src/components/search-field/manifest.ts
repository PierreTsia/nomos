import type { ComponentManifest } from '@nomos/catalogue/contract'

/** Le manifeste du champ de recherche (ADR 0005, ADR 0015). Le cœur ne connaît pas l'i18n. */
export const searchFieldManifest: ComponentManifest = {
  name: 'search-field',
  title: 'SearchField',
  summary:
    "A search field with an icon and a clear button, controlled by props " +
    "(`value` + `onChange`). The “clear” label is injected: the core has no i18n.",
  level: 'primitive',
  example: { value: '', onChange: () => {}, clearLabel: 'Clear', placeholder: 'search' },
  variants: [],
  props: [
    {
      name: 'value',
      type: 'string',
      required: true,
      check: 'accepted',
      description: 'The current term, controlled by the caller.',
    },
    {
      name: 'onChange',
      type: '(value: string) => void',
      required: true,
      check: 'accepted',
      description: 'The callback for typing **and** clearing (the button returns the empty string).',
    },
    {
      name: 'clearLabel',
      type: 'string',
      required: true,
      check: 'accepted',
      description: "The accessible label of the clear button.",
    },
    {
      name: 'placeholder',
      type: 'string',
      required: false,
      check: 'attribute',
      description: 'The prompt text, shown while the field is empty.',
    },
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: "The caller's classes, merged after the core's.",
    },
  ],
  usages: [
    {
      when: 'searching in a list or a toolbar',
      use: "<SearchField value={v} onChange={set} clearLabel={t('clear')} />",
      avoid: 'a bare `Input type="search"` when the icon and clearing are needed',
    },
    {
      when: 'clearing the search',
      use: 'the built-in button, which calls `onChange("")`',
      avoid: 'handling clearing in the app when the field already does it',
    },
  ],
}
