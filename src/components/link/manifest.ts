import type { ComponentManifest } from '@nomos/catalogue/contract'

/**
 * Le manifeste du Lien (ADR 0005). Il est écrit à la main : le type se génère,
 * l'usage s'écrit. Le test de cohérence du catalogue le confronte aux props réelles.
 */
export const linkManifest: ComponentManifest = {
  name: 'link',
  title: 'Link',
  summary:
    "A text link that renders an `<a>`. `href` and the label are injected: the core carries " +
    'no routing. Any HTML anchor attribute is passed through as-is.',
  level: 'primitive',
  example: { children: 'Documentation', href: '#' },
  variants: [],
  props: [
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: "The caller's classes, merged after the core's.",
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      check: 'content',
      description: 'The link’s label, injected by the caller.',
    },
    {
      name: 'href',
      type: 'string',
      required: false,
      check: 'attribute',
      description: "The destination, passed through to the anchor; the core does not know it.",
    },
  ],
  usages: [
    {
      when: 'navigating to a URL',
      use: 'Link with `href`',
      avoid: 'a `Button` for navigation: the link must remain an `<a>`',
    },
    {
      when: 'applying link styling to an app routing component',
      use: 'asChild with a single child',
      avoid: 'asChild with multiple children: Radix Slot accepts only one',
    },
  ],
}
