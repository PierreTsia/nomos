import type { ComponentManifest } from '@nomos/catalogue/contract'
import { TONES } from '@nomos/lib/tone'

/** Le manifeste du bandeau (ADR 0005, ADR 0015). Le ton réutilise le vocabulaire `toneClasses`. */
export const alertManifest: ComponentManifest = {
  name: 'alert',
  title: 'Alert',
  summary:
    'Un bandeau inline qui dit une information, un avertissement, un succès ou une erreur. ' +
    "Le ton vient du cœur (une intention, pas une couleur) ; tout texte est fourni par l'app.",
  level: 'primitive',
  example: { tone: 'info', title: 'information', children: 'un détail à lire.' },
  variants: [
    {
      name: 'tone',
      values: [...TONES],
      default: 'info',
      description:
        "L'intention du bandeau — c'est ce que l'appelant choisit selon l'usage, pas son goût.",
    },
  ],
  props: [
    {
      name: 'title',
      type: 'string',
      required: true,
      check: 'rendered',
      description: 'Le titre du bandeau : court, jamais une phrase.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: false,
      check: 'content',
      description: 'Le contenu détaillé, sous le titre.',
    },
    {
      name: 'action',
      type: 'ReactNode',
      required: false,
      check: 'accepted',
      description: 'Ce qu’on peut faire : un bouton, un lien.',
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
      when: 'signaler un état qui demande l’attention sans bloquer la vue',
      use: '<Alert tone="warning" title={…}>…</Alert>',
      avoid: 'un `Alert` pour une information décorative : le bandeau doit dire quelque chose',
    },
    {
      when: 'un bandeau qu’on peut refermer',
      use: 'onClose + closeLabel (les deux ensemble)',
      avoid: 'onClose sans closeLabel : le bouton devient muet pour un lecteur d’écran',
    },
  ],
}
