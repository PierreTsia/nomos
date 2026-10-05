import type { ComponentManifest } from '@nomos/catalogue/contract'

/**
 * Le manifeste du Badge (ADR 0005). Il est écrit à la main : le type se génère,
 * l'usage s'écrit. Le test de cohérence du catalogue le confronte aux props réelles —
 * une variante ajoutée au composant sans passer ici fait rougir le test.
 */
export const badgeManifest: ComponentManifest = {
  name: 'badge',
  title: 'Badge',
  summary:
    "A short, non-interactive label placed next to content to qualify it. " +
    "Every HTML attribute is passed through as-is to the element.",
  level: 'primitive',
  variants: [
    {
      name: 'variant',
      values: ['default', 'secondary', 'destructive', 'outline', 'subtle'],
      default: 'default',
      description:
        "The tone of the label — it is what the caller chooses according to usage, not taste. " +
        "`subtle` is the tinted tone (primary ink on a primary-tinted surface).",
    },
    {
      name: 'size',
      values: ['default', 'sm', 'xs'],
      default: 'default',
      description: 'The size of the label, from the default to the most compact.',
    },
    {
      name: 'shape',
      values: ['default', 'square'],
      default: 'default',
      description: 'The shape: fully rounded (`default`), or the field radius (`square`).',
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
      name: 'title',
      type: 'string',
      required: false,
      check: 'attribute',
      description: "The HTML attribute passed through as-is, here the hover label.",
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      check: 'content',
      description: "The text carried by the label: short, never a sentence.",
    },
  ],
  usages: [
    {
      when: "a production status that must be visible at a glance",
      use: 'variant="destructive"',
      avoid: "variant=\"outline\", which does not stand out in an already dense line",
    },
    {
      when: 'a neutral label placed next to the content',
      use: 'variant="secondary"',
      avoid: "variant=\"default\", reserved for the main tone of the view",
    },
    {
      when: "information to qualify without shouting (count, category)",
      use: 'variant="outline"',
      avoid: "variant=\"destructive\" to qualify without urgency: the tone must state the real severity",
    },
    {
      when: 'a category or a difficulty, tinted in the brand ink',
      use: 'variant="subtle"',
      avoid: 'a raw `bg-primary/10 text-primary`: the tinted tone is the `subtle` variant',
    },
  ],
}