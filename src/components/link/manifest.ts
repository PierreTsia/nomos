import type { ComponentManifest } from '@nomos/catalogue/contract'

/**
 * Le manifeste du Lien (ADR 0005). Il est écrit à la main : le type se génère,
 * l'usage s'écrit. Le test de cohérence du catalogue le confronte aux props réelles.
 */
export const linkManifest: ComponentManifest = {
  name: 'link',
  title: 'Link',
  summary:
    "Un lien texte qui rend un `<a>`. `href` et le libellé sont injectés : le cœur ne " +
    'porte aucun routing. Tout attribut HTML d’ancre est transmis tel quel.',
  level: 'primitive',
  example: { children: 'Documentation', href: '#' },
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
      name: 'children',
      type: 'ReactNode',
      required: true,
      check: 'content',
      description: 'Le libellé du lien, injecté par l’appelant.',
    },
    {
      name: 'href',
      type: 'string',
      required: false,
      check: 'attribute',
      description: "La destination, transmise telle quelle à l'ancre ; le cœur ne la connaît pas.",
    },
  ],
  usages: [
    {
      when: 'naviguer vers une URL',
      use: 'Link avec `href`',
      avoid: 'un `Button` pour une navigation : le lien doit rester un `<a>`',
    },
    {
      when: 'poser le style du lien sur un composant de routing de l’app',
      use: 'asChild avec un seul enfant',
      avoid: 'asChild avec plusieurs enfants : Radix Slot n’en accepte qu’un',
    },
  ],
}
