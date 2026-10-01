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
    "Un déclencheur d'action. Le ton (`variant`) dit l'importance, la taille (`size`) " +
    'dit la densité. Tout attribut HTML de bouton est transmis tel quel.',
  level: 'primitive',
  example: { children: 'Bouton' },
  variants: [
    {
      name: 'variant',
      values: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      default: 'default',
      description: "Le ton de l'action : principale, dangereuse, secondaire, discrète ou lien.",
    },
    {
      name: 'size',
      values: ['default', 'sm', 'lg', 'icon'],
      default: 'default',
      description: 'La taille du contrôle, du plus discret au plus large, ou icon-only.',
    },
  ],
  props: [
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: "Les classes de l'appelant, fusionnées après celles de la variante.",
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      check: 'content',
      description: "Le libellé de l'action, ou une icône seule (avec `aria-label`).",
    },
    {
      name: 'onClick',
      type: '(event: MouseEvent) => void',
      required: false,
      check: 'accepted',
      description: "L'action déclenchée au clic ; le cœur ne la connaît pas.",
    },
  ],
  usages: [
    {
      when: "l'action principale d'une vue",
      use: 'variant="default"',
      avoid: 'plusieurs `default` côte à côte : le ton principal doit rester unique',
    },
    {
      when: 'une action secondaire à côté de la principale',
      use: 'variant="outline"',
      avoid: '`ghost` pour une action qu’on doit voir sans survol',
    },
    {
      when: 'une icône seule (fermer, paginer)',
      use: 'size="icon" + aria-label',
      avoid: 'un `icon` sans `aria-label` : le bouton devient muet pour un lecteur d’écran',
    },
    {
      when: 'poser le style du bouton sur un lien ou un autre élément',
      use: 'asChild avec un seul enfant',
      avoid: 'asChild avec plusieurs enfants : Radix Slot n’en accepte qu’un',
    },
  ],
}
