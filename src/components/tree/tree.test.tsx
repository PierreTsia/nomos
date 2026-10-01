import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { SelectionTree, Tree, type TreeNode } from '@nomos/components/tree/tree'

const nodes: TreeNode[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      { id: 'components', label: 'components' },
      { id: 'lib', label: 'lib' },
    ],
  },
  { id: 'docs', label: 'docs' },
]

/**
 * L'arbre tient sa promesse d'accessibilité (#43) : rôle `tree`/`treeitem`, `aria-expanded`,
 * et les flèches qui déplacent le focus. L'expansion et la sélection étant contrôlées, un
 * geste se prouve par le rappel reçu — jamais par un état que l'arbre posséderait.
 */
describe('Tree', () => {
  it('se rend en rôles tree/treeitem et n’affiche que les nœuds visibles', () => {
    render(<Tree nodes={nodes} expandedIds={[]} ariaLabel="Fichiers" />)

    expect(screen.getByRole('tree', { name: 'Fichiers' })).toBeInTheDocument()
    expect(screen.getAllByRole('treeitem').map((item) => item.textContent)).toEqual(['src', 'docs'])
  })

  it('ouvre un parent : les enfants apparaissent quand l’app étend la liste', () => {
    const { rerender } = render(<Tree nodes={nodes} expandedIds={[]} />)
    expect(screen.queryByText('components')).toBeNull()

    rerender(<Tree nodes={nodes} expandedIds={['src']} />)
    expect(screen.getByText('components')).toBeInTheDocument()
    expect(screen.getByRole('treeitem', { name: 'src' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('marque le nœud sélectionné', () => {
    render(<Tree nodes={nodes} expandedIds={['src']} selectedId="lib" />)

    expect(screen.getByRole('treeitem', { name: 'lib' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('treeitem', { name: 'docs' })).toHaveAttribute('aria-selected', 'false')
  })

  it('déplace le focus avec les flèches', async () => {
    const user = userEvent.setup()
    render(<Tree nodes={nodes} expandedIds={['src']} />)
    const items = screen.getAllByRole('treeitem')
    items[0].focus()

    await user.keyboard('{ArrowDown}')
    expect(items[1]).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    expect(items[2]).toHaveFocus()
    await user.keyboard('{ArrowUp}')
    expect(items[1]).toHaveFocus()
    await user.keyboard('{End}')
    expect(items[items.length - 1]).toHaveFocus()
    await user.keyboard('{Home}')
    expect(items[0]).toHaveFocus()
  })

  it('ouvre un parent fermé (flèche droite) et le referme (flèche gauche) par rappel', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    const { rerender } = render(<Tree nodes={nodes} expandedIds={[]} onToggle={onToggle} />)
    screen.getAllByRole('treeitem')[0].focus()

    await user.keyboard('{ArrowRight}')
    expect(onToggle).toHaveBeenCalledWith('src')

    onToggle.mockClear()
    rerender(<Tree nodes={nodes} expandedIds={['src']} onToggle={onToggle} />)
    screen.getAllByRole('treeitem')[0].focus()
    await user.keyboard('{ArrowLeft}')
    expect(onToggle).toHaveBeenCalledWith('src')
  })

  it('sélectionne au clavier (Entrée) et à la souris (clic)', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<Tree nodes={nodes} expandedIds={['src']} onSelect={onSelect} />)
    screen.getAllByRole('treeitem')[0].focus()

    await user.keyboard('{ArrowDown}{Enter}')
    expect(onSelect).toHaveBeenCalledWith('components')

    onSelect.mockClear()
    await user.click(screen.getByText('docs'))
    expect(onSelect).toHaveBeenCalledWith('docs')
  })
})

describe('SelectionTree', () => {
  it('est multi-sélectionnable et coche plusieurs nœuds', () => {
    render(
      <SelectionTree nodes={nodes} expandedIds={['src']} selectedIds={['lib', 'docs']} />,
    )

    expect(screen.getByRole('tree')).toHaveAttribute('aria-multiselectable', 'true')
    expect(screen.getByRole('treeitem', { name: 'lib' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('treeitem', { name: 'docs' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('treeitem', { name: 'src' })).toHaveAttribute('aria-selected', 'false')
  })
})
