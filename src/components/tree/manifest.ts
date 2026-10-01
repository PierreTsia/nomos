import type { ComponentManifest } from '@nomos/catalogue/contract'

/**
 * Le manifeste de l'Arbre (ADR 0005, ADR 0015). Il documente les deux exports du même
 * atome : `Tree` (navigation, sélection simple) et `SelectionTree` (sélection multiple),
 * comme le Meter documente ses deux tailles.
 */
export const treeManifest: ComponentManifest = {
  name: 'tree',
  title: 'Arbre',
  summary:
    "Une hiérarchie de nœuds, l'ouverture et la sélection **portées par l'app** (props " +
    "contrôlées + rappels). Deux exports : `Tree` navigue, `SelectionTree` coche plusieurs " +
    'nœuds. Le focus clavier est interne, la donnée ne l’est jamais.',
  level: 'bloc',
  example: {
    nodes: [
      {
        id: 'src',
        label: 'src',
        children: [
          { id: 'src/components', label: 'components' },
          { id: 'src/lib', label: 'lib' },
        ],
      },
      { id: 'docs', label: 'docs' },
    ],
    expandedIds: ['src'],
    selectedId: 'src/lib',
    ariaLabel: 'Arborescence de démonstration',
  },
  variants: [],
  props: [
    {
      name: 'nodes',
      type: 'TreeNode[]',
      required: true,
      check: 'accepted',
      description: "La hiérarchie : chaque nœud a un `id`, un `label` et d'éventuels `children`.",
    },
    {
      name: 'expandedIds',
      type: 'string[]',
      required: false,
      check: 'accepted',
      description: "Les ids des nœuds ouverts (contrôlé) : l'app porte l'expansion, pas l'arbre.",
    },
    {
      name: 'selectedId',
      type: 'string | null',
      required: false,
      check: 'rendered',
      description: "Le nœud sélectionné de `Tree` (contrôlé, sélection simple).",
    },
    {
      name: 'onToggle',
      type: '(id: string) => void',
      required: false,
      check: 'accepted',
      description: "Appelé pour ouvrir/fermer un nœud (flèche droite/gauche, chevron).",
    },
    {
      name: 'onSelect',
      type: '(id: string) => void',
      required: false,
      check: 'accepted',
      description: "Appelé au clic ou à Entrée/Espace — l'app décide de la suite.",
    },
    {
      name: 'ariaLabel',
      type: 'string',
      required: false,
      check: 'rendered',
      description: "Le nom accessible de l'arbre : le cœur n'a pas d'i18n (ADR 0015).",
    },
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: "Les classes de l'appelant, fusionnées après celles du composant.",
    },
  ],
  usages: [
    {
      when: 'une navigation hiérarchique (fichiers, catégories) où un nœud est actif',
      use: '<Tree nodes={nodes} expandedIds={open} onToggle={…} selectedId={active} onSelect={…} />',
      avoid: 'laisser l’arbre posséder l’état : la donnée appartient à l’app',
    },
    {
      when: 'cocher plusieurs nœuds (filtres, périmètre)',
      use: '<SelectionTree nodes={nodes} expandedIds={open} onToggle={…} selectedIds={checked} onSelect={…} />',
      avoid: '<Tree>, qui ne porte qu’un nœud actif à la fois',
    },
    {
      when: 'le nom accessible de l’arbre',
      use: 'ariaLabel={t.tree.label} (le texte vient de l’app)',
      avoid: 'un aria-label en dur dans le cœur : il serait monolingue',
    },
  ],
}
