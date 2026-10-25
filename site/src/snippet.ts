import { isValidElement, type ReactNode } from 'react'

/**
 * Le snippet du **beat 1** : `manifest.example` sérialisé en JSX. C'est la seule source de
 * l'interface (le MCP lit le même objet), donc le snippet ne peut pas diverger du rendu —
 * il en est la projection textuelle. Aucune seconde source écrite à la main.
 *
 * Portée : les props simples (chaîne, nombre, booléen), les rappels en `() => {}`, les
 * objets/tableaux en littéral, et les éléments React imbriqués (les exemples en
 * `createElement`). C'est ce que le catalogue contient ; le test balaie les 59 exemples.
 */

/** Le nom du composant tel qu'il s'écrit dans le JSX : `displayName`, `name`, ou le titre. */
export function componentName(component: unknown, fallback: string): string {
  const fn = component as { displayName?: string; name?: string }
  return fn?.displayName ?? fn?.name ?? fallback
}

function tagName(type: unknown): string {
  if (typeof type === 'string') return type
  return componentName(type, 'Component')
}

/** Une valeur de prop, hors `children`, en expression JSX (`attr={…}` ou `attr="…"`). */
function attributeValue(value: unknown): string {
  if (typeof value === 'string') return JSON.stringify(value)
  if (typeof value === 'number' || typeof value === 'boolean' || value === null) {
    return `{${String(value)}}`
  }
  if (typeof value === 'function') return '{() => {}}'
  if (isValidElement(value)) return `{${element(value as AnyElement, 2)}}`
  return `{${literal(value)}}`
}

/** Un objet ou un tableau en littéral JS (les exemples de données n'ont ni fonction ni JSX). */
function literal(value: unknown): string {
  return JSON.stringify(value)
}

function attributes(props: Record<string, unknown>): string {
  return Object.entries(props)
    .map(([name, value]) => (value === true ? name : `${name}=${attributeValue(value)}`))
    .join(' ')
}

type AnyElement = { type: unknown; props: Record<string, unknown> }

function childText(children: ReactNode, indent: number): string | null {
  if (typeof children === 'string' || typeof children === 'number') return String(children)
  if (isValidElement(children)) return `\n${element(children as AnyElement, indent + 1)}`
  if (Array.isArray(children)) {
    const parts = children.map((child) => childText(child, indent)).filter(Boolean)
    return parts.length ? `\n${parts.join('\n')}` : null
  }
  return null
}

/** Un élément React en JSX, indenté sur `indent` (une profondeur = 2 espaces). */
function element(node: AnyElement, indent: number): string {
  const name = tagName(node.type)
  const { children, ...props } = node.props
  const attrs = attributes(props)
  const open = attrs ? `${name} ${attrs}` : name
  const body = childText(children as ReactNode, indent)
  if (body === null) return `<${open} />`
  const pad = '  '.repeat(indent)
  if (typeof body === 'string' && !body.startsWith('\n')) return `<${open}>${body}</${name}>`
  return `<${open}>${body}\n${pad}</${name}>`
}

/** Le JSX d'un exemple : `<Button variant="outline">Save</Button>`. */
export function snippetFromExample(name: string, example: Record<string, unknown>): string {
  const { children, ...props } = example
  const attrs = attributes(props)
  const open = attrs ? `${name} ${attrs}` : name
  const body = childText(children as ReactNode, 0)
  if (body === null) return `<${open} />`
  if (!body.startsWith('\n')) return `<${open}>${body}</${name}>`
  return `<${open}>${body}\n</${name}>`
}
