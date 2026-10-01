import type { ComponentManifest } from '@nomos/catalogue/contract'
import { TONES } from '@nomos/lib/tone'

/** Le manifeste de la notification (ADR 0005, ADR 0020). Le ton réutilise `toneClasses`. */
export const toastManifest: ComponentManifest = {
  name: 'toast',
  title: 'Toast',
  summary:
    'Une notification flottante : un message, un détail, une action, une fermeture. Le ton ' +
    'vient du cœur ; la file et les minuteurs vivent dans `ToastProvider`.',
  level: 'primitive',
  example: { tone: 'success', message: 'réindexé', description: '12 éléments' },
  variants: [
    {
      name: 'tone',
      values: [...TONES],
      default: 'info',
      description: "L'intention de la notification — ce que l'appelant choisit selon l'usage.",
    },
  ],
  props: [
    {
      name: 'message',
      type: 'ReactNode',
      required: true,
      check: 'rendered',
      description: 'Le message principal : une ligne, jamais une phrase.',
    },
    {
      name: 'description',
      type: 'ReactNode',
      required: false,
      check: 'rendered',
      description: 'Un détail sous le message, plus discret.',
    },
    {
      name: 'action',
      type: 'ReactNode',
      required: false,
      check: 'accepted',
      description: 'Une action : un bouton, un lien.',
    },
    {
      name: 'icon',
      type: 'ReactNode',
      required: false,
      check: 'accepted',
      description: "Remplace l'icône par défaut du ton.",
    },
    {
      name: 'onClose',
      type: '() => void',
      required: false,
      check: 'accepted',
      description: 'Affiche un bouton de fermeture et le rappelle au clic.',
    },
    {
      name: 'closeLabel',
      type: 'string',
      required: false,
      check: 'accepted',
      description: "Le libellé accessible du bouton de fermeture (requis avec `onClose`).",
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
      when: 'dire ce qu’une action a produit, sans bloquer la vue',
      use: 'via `useToast().show({ message })` (le `ToastProvider` gère la file)',
      avoid: 'un `Toast` monté à la main : la file et l’auto-dismiss vivent dans le provider',
    },
    {
      when: 'signaler un échec qu’on doit voir',
      use: 'tone "danger" et un `description` qui nomme la cause',
      avoid: 'un toast pour une erreur de chargement de page : c’est un `EmptyState`',
    },
  ],
}