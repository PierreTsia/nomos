import type { ComponentManifest } from '@nomos/catalogue/contract'

/** Le manifeste de l'état vide (ADR 0005, ADR 0015). Présentation seule, sans moteur. */
export const emptyStateManifest: ComponentManifest = {
  name: 'empty-state',
  title: 'EmptyState',
  summary:
    "A view's empty state: a centered card (icon, title, description, raw detail, " +
    'action). No core-owned text — the app provides everything, including why it’s empty.',
  level: 'bloc',
  example: {
    title: 'no data',
    description: 'the batch is empty.',
    detail: 'stream not found: 404 (sync script not started)',
    wrap: true,
  },
  variants: [],
  props: [
    {
      name: 'title',
      type: 'string',
      required: true,
      check: 'rendered',
      description: "The state's title: short, never a sentence.",
    },
    {
      name: 'description',
      type: 'string',
      required: false,
      check: 'rendered',
      description: 'A one-sentence description, below the title.',
    },
    {
      name: 'detail',
      type: 'string',
      required: false,
      check: 'rendered',
      description: 'The raw detail (error message, cause), shown as-is.',
    },
    {
      name: 'wrap',
      type: 'boolean',
      required: false,
      default: 'true',
      check: 'rendered',
      description: 'Wraps the detail onto multiple lines instead of letting it scroll.',
    },
    {
      name: 'icon',
      type: 'ReactNode',
      required: false,
      check: 'accepted',
      description: "The illustration or icon, provided by the caller.",
    },
    {
      name: 'action',
      type: 'ReactNode',
      required: false,
      check: 'accepted',
      description: 'What can be done in this state: a button, a link.',
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
      when: 'a view has no data to show',
      use: "<EmptyState title={t('empty')} description={…} action={<Button…/>} />",
      avoid: 'an ad-hoc styled `<div>`: the card tokens are lost',
    },
    {
      when: 'a batch is unreadable (not empty, but broken)',
      use: 'the raw `detail`, to name the real failure rather than hide it',
      avoid: 'a silent zero or blank where the signal is unreadable',
    },
  ],
}
