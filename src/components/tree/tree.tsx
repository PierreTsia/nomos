import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { ChevronRight } from 'lucide-react'

import { cn } from '@nomos/lib/cn'

/**
 * L'arbre (ADR 0015) : une hiérarchie de nœuds, **contrôlée par props**. Le cœur ne
 * possède ni l'expansion ni la sélection — l'app les porte (`expandedIds`, `selectedId`
 * ou `selectedIds`) et reçoit les gestes par rappel, comme la `DataTable` reçoit son état
 * (ADR 0010). Seul le **focus** (navigation clavier) est interne : c'est de la mécanique,
 * pas une donnée d'app.
 *
 * `Tree` navigue et ouvre (sélection simple) ; `SelectionTree` coche plusieurs nœuds.
 * A11y : rôle `tree` / `treeitem`, `aria-expanded`, `aria-selected`, et les flèches.
 */

export type TreeNode = {
  id: string
  label: string
  /** Les enfants : un nœud sans enfants est une feuille. */
  children?: TreeNode[]
}

type FlatNode = {
  node: TreeNode
  level: number
  parentId: string | null
  hasChildren: boolean
  posinset: number
  setsize: number
}

/** Aplati les nœuds **visibles** (les enfants d'un nœud fermé n'y sont pas) pour piloter
 *  le focus et les flèches comme une seule liste. */
function flatten(
  nodes: TreeNode[],
  expanded: ReadonlySet<string>,
  level = 1,
  parentId: string | null = null,
): FlatNode[] {
  const out: FlatNode[] = []
  nodes.forEach((node, index) => {
    const hasChildren = Boolean(node.children && node.children.length)
    out.push({ node, level, parentId, hasChildren, posinset: index + 1, setsize: nodes.length })
    if (hasChildren && expanded.has(node.id)) {
      out.push(...flatten(node.children ?? [], expanded, level + 1, node.id))
    }
  })
  return out
}

type TreeBaseProps = {
  nodes: TreeNode[]
  /** Les ids des nœuds ouverts (contrôlé). */
  expandedIds?: string[]
  /** Appelé pour ouvrir/fermer un nœud — l'app décide du nouvel état. */
  onToggle?: (id: string) => void
  /** Les ids des nœuds sélectionnés (contrôlé). */
  selectedIds?: string[]
  /** Appelé au clic ou à Entrée/Espace — l'app décide de la suite. */
  onSelect?: (id: string) => void
  multi?: boolean
  /** Le nom accessible de l'arbre ; le cœur n'invente aucun libellé. */
  ariaLabel?: string
  className?: string
}

function TreeBase({
  nodes,
  expandedIds = [],
  onToggle,
  selectedIds = [],
  onSelect,
  multi = false,
  ariaLabel,
  className,
}: TreeBaseProps) {
  const expanded = useMemo(() => new Set(expandedIds), [expandedIds])
  const selected = useMemo(() => new Set(selectedIds), [selectedIds])
  const visible = useMemo(() => flatten(nodes, expanded), [nodes, expanded])
  const [focusedId, setFocusedId] = useState<string | null>(visible[0]?.node.id ?? null)
  const items = useRef(new Map<string, HTMLDivElement>())
  const interacted = useRef(false)

  // Le nœud focalisé peut disparaître (l'app referme son parent) : on retombe alors sur le
  // premier nœud visible, calculé pendant le rendu plutôt que dans un effet.
  const activeId = visible.some((entry) => entry.node.id === focusedId)
    ? focusedId
    : (visible[0]?.node.id ?? null)

  useEffect(() => {
    if (interacted.current && activeId) items.current.get(activeId)?.focus()
  }, [activeId])

  const focusAt = useCallback(
    (index: number) => {
      const target = visible[index]
      if (!target) return
      interacted.current = true
      setFocusedId(target.node.id)
      items.current.get(target.node.id)?.focus()
    },
    [visible],
  )

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = visible.findIndex((entry) => entry.node.id === activeId)
    if (index < 0) return
    const current = visible[index]
    const parentIndex = () => visible.findIndex((entry) => entry.node.id === current.parentId)

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        focusAt(Math.min(index + 1, visible.length - 1))
        break
      case 'ArrowUp':
        event.preventDefault()
        focusAt(Math.max(index - 1, 0))
        break
      case 'Home':
        event.preventDefault()
        focusAt(0)
        break
      case 'End':
        event.preventDefault()
        focusAt(visible.length - 1)
        break
      case 'ArrowRight':
        event.preventDefault()
        if (current.hasChildren && !expanded.has(current.node.id)) onToggle?.(current.node.id)
        else if (current.hasChildren) focusAt(index + 1)
        break
      case 'ArrowLeft':
        event.preventDefault()
        if (current.hasChildren && expanded.has(current.node.id)) onToggle?.(current.node.id)
        else if (parentIndex() >= 0) focusAt(parentIndex())
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        onSelect?.(current.node.id)
        break
    }
  }

  return (
    <div
      role="tree"
      aria-label={ariaLabel}
      aria-multiselectable={multi || undefined}
      onKeyDown={onKeyDown}
      className={cn('flex flex-col', className)}
    >
      {visible.map((entry) => {
        const { node, level, hasChildren, posinset, setsize } = entry
        const isExpanded = hasChildren && expanded.has(node.id)
        return (
          <div
            key={node.id}
            ref={(element) => {
              if (element) items.current.set(node.id, element)
              else items.current.delete(node.id)
            }}
            role="treeitem"
            aria-level={level}
            aria-posinset={posinset}
            aria-setsize={setsize}
            aria-selected={selected.has(node.id)}
            aria-expanded={hasChildren ? isExpanded : undefined}
            tabIndex={node.id === activeId ? 0 : -1}
            onClick={() => {
              interacted.current = true
              setFocusedId(node.id)
              items.current.get(node.id)?.focus()
              onSelect?.(node.id)
            }}
            style={{ paddingLeft: `${(level - 1) * 16}px` }}
            className={cn(
              'flex cursor-default items-center gap-1 rounded px-1.5 py-1 text-sm outline-none',
              'focus-visible:ring-2 focus-visible:ring-ring',
              selected.has(node.id) && 'bg-accent text-accent-foreground',
            )}
          >
            {hasChildren ? (
              <span
                aria-hidden
                onClick={(event) => {
                  event.stopPropagation()
                  onToggle?.(node.id)
                }}
                className="flex size-4 shrink-0 items-center justify-center text-muted-foreground"
              >
                <ChevronRight
                  className={cn('size-4 transition-transform', isExpanded && 'rotate-90')}
                />
              </span>
            ) : (
              <span aria-hidden className="size-4 shrink-0" />
            )}
            <span className="truncate">{node.label}</span>
          </div>
        )
      })}
    </div>
  )
}

export type TreeProps = Omit<TreeBaseProps, 'selectedIds' | 'multi'> & {
  /** Le nœud sélectionné (contrôlé, optionnel) : la navigation. */
  selectedId?: string | null
}

export function Tree({ selectedId, ...props }: TreeProps) {
  return <TreeBase {...props} selectedIds={selectedId ? [selectedId] : []} />
}

export type SelectionTreeProps = Omit<TreeBaseProps, 'multi'> & {
  /** Les nœuds cochés (contrôlé) : la sélection multiple. */
  selectedIds?: string[]
}

export function SelectionTree(props: SelectionTreeProps) {
  return <TreeBase {...props} multi />
}
