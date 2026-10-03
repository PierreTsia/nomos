import type { ComponentManifest } from '@nomos/catalogue/contract'

/**
 * Le manifeste de l'Arbre (ADR 0005, ADR 0015). Il documente les deux exports du même
 * atome : `Tree` (navigation, sélection simple) et `SelectionTree` (sélection multiple),
 * comme le Meter documente ses deux tailles.
 */
export const treeManifest: ComponentManifest = {
  name: 'tree',
  title: 'Tree',
  summary:
    "A hierarchy of nodes, with expansion and selection **carried by the app** (controlled " +
    "props + callbacks). Two exports: `Tree` navigates, `SelectionTree` checks several " +
    'nodes. Keyboard focus is internal, the data never is.',
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
    ariaLabel: 'Demonstration tree',
  },
  variants: [],
  props: [
    {
      name: 'nodes',
      type: 'TreeNode[]',
      required: true,
      check: 'accepted',
      description: "The hierarchy: each node has an `id`, a `label` and optional `children`.",
    },
    {
      name: 'expandedIds',
      type: 'string[]',
      required: false,
      check: 'accepted',
      description: "The ids of open nodes (controlled): the app carries expansion, not the tree.",
    },
    {
      name: 'selectedId',
      type: 'string | null',
      required: false,
      check: 'rendered',
      description: "The selected node of `Tree` (controlled, single selection).",
    },
    {
      name: 'onToggle',
      type: '(id: string) => void',
      required: false,
      check: 'accepted',
      description: "Called to open/close a node (right/left arrow, chevron).",
    },
    {
      name: 'onSelect',
      type: '(id: string) => void',
      required: false,
      check: 'accepted',
      description: "Called on click or Enter/Space — the app decides what happens next.",
    },
    {
      name: 'ariaLabel',
      type: 'string',
      required: false,
      check: 'rendered',
      description: "The accessible name of the tree: the core has no i18n (ADR 0015).",
    },
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: "The caller's classes, merged after the component's.",
    },
  ],
  usages: [
    {
      when: 'a hierarchical navigation (files, categories) where one node is active',
      use: '<Tree nodes={nodes} expandedIds={open} onToggle={…} selectedId={active} onSelect={…} />',
      avoid: 'letting the tree own the state: the data belongs to the app',
    },
    {
      when: 'checking several nodes (filters, scope)',
      use: '<SelectionTree nodes={nodes} expandedIds={open} onToggle={…} selectedIds={checked} onSelect={…} />',
      avoid: '<Tree>, which carries only one active node at a time',
    },
    {
      when: 'the accessible name of the tree',
      use: 'ariaLabel={t.tree.label} (the text comes from the app)',
      avoid: 'a hardcoded aria-label in the core: it would be monolingual',
    },
  ],
}
