import { Fragment, isValidElement, type ReactNode } from 'react'

import * as nomos from '@nomosui/react'

/**
 * The **beat 1** snippet: `manifest.example` serialized to JSX. It is the single source of
 * the interface (the MCP reads the same object), so the snippet cannot drift from the render
 * — it is its textual projection. No second, hand-written source.
 *
 * Scope: simple props (string, number, boolean), callbacks as `() => {}`, objects/arrays as
 * a literal, and nested React elements (the `createElement` examples). A `Fragment` renders
 * as its children, with no tag (otherwise a phantom `<Component>` would appear). The test
 * sweeps all 59 examples.
 */

/**
 * The JSX name of a component. The package's `forwardRef` parts have neither `displayName`
 * nor `name` — but they **are exported**, and the manifests' `createElement` uses the
 * exported object: it is identified by identity (a WeakMap over the exports). Falls back to
 * `displayName`/`name`, then the title.
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

/** A prop value, outside `children`, as a JSX expression (`attr={…}` or `attr="…"`). */
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
 * The body of a `children`: text (inline) or already-indented lines (block). A `Fragment`
 * passes through without adding a level; an array lines its children up.
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

/** A React element as JSX, its first line indented by `indent`. */
function element(node: AnyElement, indent: number): string {
  if (isFragment(node.type)) {
    // Transparent: its children stay at the parent's level (one step above the fragment).
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

/** The JSX of an example: `<Button variant="outline">Save</Button>`. */
export function snippetFromExample(name: string, example: Record<string, unknown>): string {
  return element({ type: name, props: example }, 0)
}
