import type { ComponentManifest } from '@nomos/catalogue/contract'

/** Le manifeste du séparateur (ADR 0005). */
export const separatorManifest: ComponentManifest = {
  name: 'separator',
  title: 'Separator',
  summary:
    'A border line that separates two pieces of content, horizontal or vertical. Decorative by ' +
    'default: it carries no meaning for a screen reader unless explicitly requested.',
  level: 'primitive',
  example: { orientation: 'horizontal' },
  variants: [],
  props: [
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      required: false,
      check: 'rendered',
      description: 'The direction of the line; horizontal by default.',
    },
    {
      name: 'decorative',
      type: 'boolean',
      required: false,
      check: 'accepted',
      description: 'Decorative (true by default): hidden from assistive technologies.',
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
      when: 'separating two blocks in a card or a bar',
      use: '<Separator />',
      avoid: 'a manual border: the separator carries the border color from the tokens',
    },
    {
      when: 'a vertical line between two aligned controls',
      use: '<Separator orientation="vertical" className="h-5" />',
      avoid: 'forgetting the height: a vertical separator has no size of its own',
    },
  ],
}
