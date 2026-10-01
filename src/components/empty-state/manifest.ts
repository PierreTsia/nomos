import type { ComponentManifest } from '@nomos/catalogue/contract'

/** Le manifeste de l'état vide (ADR 0005, ADR 0015). Présentation seule, sans moteur. */
export const emptyStateManifest: ComponentManifest = {
  name: 'empty-state',
  title: 'EmptyState',
  summary:
    "L'état vide d'une vue : une carte centrée (icône, titre, description, détail brut, " +
    'action). Aucun texte propre au cœur — l’app fournit tout, y compris le pourquoi de l’absence.',
  level: 'bloc',
  example: {
    title: 'aucune donnée',
    description: 'le lot est vide.',
    detail: 'flux introuvable : 404 (script de sync non lancé)',
    wrap: true,
  },
  variants: [],
  props: [
    {
      name: 'title',
      type: 'string',
      required: true,
      check: 'rendered',
      description: "Le titre de l'état : court, jamais une phrase.",
    },
    {
      name: 'description',
      type: 'string',
      required: false,
      check: 'rendered',
      description: 'Une description d’une phrase, sous le titre.',
    },
    {
      name: 'detail',
      type: 'string',
      required: false,
      check: 'rendered',
      description: 'Le détail brut (message d’erreur, cause), affiché tel quel.',
    },
    {
      name: 'wrap',
      type: 'boolean',
      required: false,
      default: 'true',
      check: 'rendered',
      description: 'Passe le détail sur plusieurs lignes au lieu de le laisser défiler.',
    },
    {
      name: 'icon',
      type: 'ReactNode',
      required: false,
      check: 'accepted',
      description: "L'illustration ou l'icône, fournie par l'appelant.",
    },
    {
      name: 'action',
      type: 'ReactNode',
      required: false,
      check: 'accepted',
      description: 'Ce qu’on peut faire devant cet état : un bouton, un lien.',
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
      when: 'une vue n’a pas de donnée à montrer',
      use: "<EmptyState title={t('empty')} description={…} action={<Button…/>} />",
      avoid: 'un `<div>` stylé au coup par coup : on perd les tokens de la carte',
    },
    {
      when: 'un lot est illisible (pas vide, mais en panne)',
      use: 'le `detail` brut, pour nommer la vraie panne plutôt que la masquer',
      avoid: 'un zéro ou un vide silencieux là où le signal est illisible',
    },
  ],
}
