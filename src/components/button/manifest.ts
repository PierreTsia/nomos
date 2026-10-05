import type { ComponentManifest } from '@nomos/catalogue/contract'

/**
 * Le manifeste du Bouton (ADR 0005). Il déclare les deux groupes de variantes —
 * `variant` (le ton) et `size` (la taille) — que le test de cohérence confronte à la
 * config réelle.
 */
export const buttonManifest: ComponentManifest = {
  name: 'button',
  title: 'Button',
  summary:
    "An action trigger. The tone (`variant`) states importance, the size (`size`) " +
    'states density. Every HTML button attribute is passed through as-is.',
  level: 'primitive',
  example: { children: 'Button' },
  variants: [
    {
      name: 'variant',
      values: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      default: 'default',
      description: "The tone of the action: primary, dangerous, secondary, discreet or link.",
    },
    {
      name: 'size',
      values: ['default', 'sm', 'lg', 'touch', 'icon', 'icon-lg'],
      default: 'default',
      description:
        'The size of the control, from the most discreet to the largest; `touch` is the ' +
        'mobile CTA height, `icon`/`icon-lg` the square icon-only sizes.',
    },
    {
      name: 'shape',
      values: ['default', 'pill'],
      default: 'default',
      description: 'The shape of the control: the default control radius, or fully rounded (`pill`).',
    },
  ],
  props: [
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: "The caller's classes, merged after the variant ones.",
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      check: 'content',
      description: "The action label, or an icon alone (with `aria-label`).",
    },
    {
      name: 'onClick',
      type: '(event: MouseEvent) => void',
      required: false,
      check: 'accepted',
      description: "The action triggered on click; the core does not know it.",
    },
  ],
  usages: [
    {
      when: "the main action of a view",
      use: 'variant="default"',
      avoid: 'several `default` side by side: the main tone must stay unique',
    },
    {
      when: 'a secondary action next to the main one',
      use: 'variant="outline"',
      avoid: '`ghost` for an action that must be visible without hover',
    },
    {
      when: 'a lone icon (close, paginate)',
      use: 'size="icon" + aria-label',
      avoid: 'an `icon` without `aria-label`: the button becomes mute for a screen reader',
    },
    {
      when: 'a fully rounded action (mobile CTA, tag-like)',
      use: 'shape="pill"',
      avoid: 'a `pill` where the control radius signals a form action',
    },
    {
      when: 'apply the button style to a link or another element',
      use: 'asChild with a single child',
      avoid: 'asChild with several children: Radix Slot only accepts one',
    },
  ],
}
