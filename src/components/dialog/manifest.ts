import type { ComponentManifest } from '@nomos/catalogue/contract'

/**
 * Le manifeste de la modale (ADR 0005, 0019). Le cœur fournit la structure et la couche
 * flottante issue des tokens (ADR 0027) ; tous les textes — déclencheur, fermeture,
 * actions — viennent de l'app.
 */
export const dialogManifest: ComponentManifest = {
  name: 'dialog',
  title: 'Dialog',
  summary:
    'Une modale centrée sur un voile : un déclencheur, un titre, une description, un corps ' +
    'et un pied. L’empilement, le voile et le mouvement viennent des tokens ; aucun texte ' +
    'n’est propre au cœur.',
  level: 'bloc',
  example: {
    trigger: 'Ouvrir',
    title: 'Confirmer',
    description: 'Une action difficile à défaire.',
    body: 'Le contenu de la modale.',
    footer: 'Actions',
    closeLabel: 'Fermer',
    open: true,
  },
  variants: [],
  props: [
    {
      name: 'trigger',
      type: 'ReactNode',
      required: true,
      check: 'accepted',
      description: 'Le contenu du déclencheur : un mot ou un court libellé, jamais une phrase.',
    },
    {
      name: 'title',
      type: 'string',
      required: true,
      check: 'accepted',
      description: 'Le titre de la modale ; il nomme l’action ou la décision.',
    },
    {
      name: 'description',
      type: 'ReactNode',
      required: false,
      check: 'accepted',
      description: 'Un sous-titre sous le titre, pour expliquer sans alourdir le corps.',
    },
    {
      name: 'body',
      type: 'ReactNode',
      required: false,
      check: 'accepted',
      description: 'Le corps de la modale : le contenu à lire ou à décider.',
    },
    {
      name: 'footer',
      type: 'ReactNode',
      required: false,
      check: 'accepted',
      description: 'Les actions, alignées à droite sur grand écran.',
    },
    {
      name: 'closeLabel',
      type: 'string',
      required: true,
      check: 'accepted',
      description: 'Le libellé accessible du bouton de fermeture (le cœur n’a pas d’i18n).',
    },
    {
      name: 'open',
      type: 'boolean',
      required: false,
      check: 'accepted',
      description: 'L’état d’ouverture contrôlé : il vit dans l’app.',
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      required: false,
      check: 'accepted',
      description: 'L’état d’ouverture initial, quand l’app ne le contrôle pas.',
    },
    {
      name: 'onOpenChange',
      type: '() => void',
      required: false,
      check: 'accepted',
      description: 'Rappelé quand l’utilisateur demande à ouvrir ou fermer.',
    },
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: 'Les classes de l’appelant, fusionnées après celles du cœur.',
    },
  ],
  usages: [
    {
      when: 'demander une décision ou une saisie dans une surface centrée qui bloque la vue',
      use: '<Dialog trigger="Supprimer" title="Supprimer ?" closeLabel="Fermer">…</Dialog>',
      avoid: 'un `Dialog` pour une information non bloquante : un `Alert` suffit',
    },
    {
      when: 'contrôler l’ouverture depuis l’app (état, navigation)',
      use: '`open` + `onOpenChange`',
      avoid: 'mélanger `open` et `defaultOpen` : l’un est contrôlé, l’autre non',
    },
    {
      when: 'une action destructive dans le pied',
      use: 'un `Button` `variant="destructive"` dans `footer`',
      avoid: 'un texte d’action écrit par le cœur : les libellés viennent de l’app',
    },
  ],
}
