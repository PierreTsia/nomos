import { Fragment, isValidElement, type ReactNode } from 'react'

import * as nomos from '@nomosui/react'

/**
 * Le snippet du **beat 1** : `manifest.example` sérialisé en JSX. C'est la seule source de
 * l'interface (le MCP lit le même objet), donc le snippet ne peut pas diverger du rendu —
 * il en est la projection textuelle. Aucune seconde source écrite à la main.
 *
 * Portée : les props simples (chaîne, nombre, booléen), les rappels en `() => {}`, les
 * objets/tableaux en littéral, et les éléments React imbriqués (les exemples en
 * `createElement`). Un `Fragment` s'affiche comme ses enfants, sans balise (sinon on
 * produirait un `<Component>` fantôme). Le test balaie les 59 exemples.
 */

/**
 * Le nom JSX d'un composant. Les parts en `forwardRef` du paquet n'ont ni `displayName` ni
 * `name` — mais elles **sont exportées**, et le `createElement` des manifestes emploie
 * l'objet exporté : on l'identifie par identité (WeakMap sur les exports). Repli sur
 * `displayName`/`name`, puis le titre.
 */
const EXPORT_NAMES = new WeakMap<object, string>()
for (const [exportName, value] of Object.entries(nomos)) {
  if (value && (typeof value === 'object' || typeof value === 'function')) {
    EXPORT_NAMES.set(value as object, exportName)
  }
}

export function componentName(component: unknown, fallback: string): string {
  if (component && (typeof component === 'object' || typeof component === 'function')) {
    const found = EXPORT_NAMES.get(component as object)
    if (found) return found
    const fn = component as { displayName?: string; name?: string }
    return fn.displayName ?? fn.name ?? fallback
  }
  return fallback
}

type AnyElement = { type: unknown; props: Record<string, unknown> }
type Body = { inline: string } | { block: string }

const PAD = '  '
const pad = (indent: number) => PAD.repeat(indent)

function isFragment(type: unknown): boolean {
  return type === Fragment || type === Symbol.for('react.fragment')
}

/** Une valeur de prop, hors `children`, en expression JSX (`attr={…}` ou `attr="…"`). */
function attributeValue(value: unknown): string {
  if (typeof value === 'string') return JSON.stringify(value)
  if (typeof value === 'number' || typeof value === 'boolean' || value === null) {
    return `{${String(value)}}`
  }
  if (typeof value === 'function') return '{() => {}}'
  if (isValidElement(value)) return `{${element(value as AnyElement, 0)}}`
  return `{${JSON.stringify(value)}}`
}

function attributes(props: Record<string, unknown>): string {
  return Object.entries(props)
    .map(([name, value]) => (value === true ? name : `${name}=${attributeValue(value)}`))
    .join(' ')
}

/**
 * Le corps d'un `children` : du texte (inline) ou des lignes déjà indentées (block). Un
 * `Fragment` traverse sans ajouter de niveau ; un tableau aligne ses enfants.
 */
function bodyOf(children: ReactNode, indent: number): Body | null {
  if (typeof children === 'string' || typeof children === 'number') {
    return { inline: String(children) }
  }
  if (isValidElement(children)) {
    return { block: element(children as AnyElement, indent + 1) }
  }
  if (Array.isArray(children)) {
    const lines = children.flatMap((child) => {
      const body = bodyOf(child, indent)
      if (body === null) return []
      return 'inline' in body ? [`${pad(indent + 1)}${body.inline}`] : [body.block]
    })
    return lines.length ? { block: lines.join('\n') } : null
  }
  return null
}

/** Un élément React en JSX, sa première ligne indentée sur `indent`. */
function element(node: AnyElement, indent: number): string {
  if (isFragment(node.type)) {
    // Transparent : ses enfants restent au niveau du parent (un cran au-dessus du fragment).
    const body = bodyOf(node.props.children as ReactNode, indent - 1)
    if (!body) return ''
    return 'inline' in body ? body.inline : body.block
  }

  const name = typeof node.type === 'string' ? node.type : componentName(node.type, 'Component')
  const { children, ...props } = node.props
  const attrs = attributes(props)
  const open = attrs ? `${name} ${attrs}` : name
  const line = `${pad(indent)}<${open}`
  const body = bodyOf(children as ReactNode, indent)

  if (body === null) return `${line} />`
  if ('inline' in body) return `${line}>${body.inline}</${name}>`
  return `${line}>\n${body.block}\n${pad(indent)}</${name}>`
}

/** Le JSX d'un exemple : `<Button variant="outline">Save</Button>`. */
export function snippetFromExample(name: string, example: Record<string, unknown>): string {
  return element({ type: name, props: example }, 0)
}
