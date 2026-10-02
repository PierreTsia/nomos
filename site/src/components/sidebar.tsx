import type { ReactNode } from 'react'

import { Link } from '@nomosui/react'

import { bricks, levels } from '../catalogue'
import { docsSlugs, type DocsSlug, type Route } from '../router'

const docsLabels: Record<DocsSlug, string> = {
  'getting-started': 'Getting started',
  boundary: 'The boundary rule',
  contributing: 'Contributing',
}

const itemBase = 'block rounded-md px-3 py-1.5 text-sm'
const itemIdle = 'text-muted-foreground hover:bg-muted hover:text-foreground'
const itemActive = 'bg-secondary font-medium text-secondary-foreground'

function Item({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: string
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`${itemBase} ${active ? itemActive : itemIdle}`}
    >
      {children}
    </Link>
  )
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="px-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      {children}
    </div>
  )
}

/**
 * The catalogue navigation, derived from the exported `catalogue` (ADR 0005): a new brick
 * appears here with no hand edit. Rendered twice by `Sidebar` — once for wide screens,
 * once inside the small-screen disclosure.
 */
export function SidebarNav({ route }: { route: Route }) {
  return (
    <nav className="flex flex-col gap-6" aria-label="Catalogue">
      <Group title="Tokens">
        <Item href="#/tokens" active={route.kind === 'tokens'}>
          Tokens
        </Item>
      </Group>

      {levels.map((level) => {
        const group = bricks.filter((brick) => brick.level === level)
        if (group.length === 0) return null
        return (
          <Group key={level} title={level}>
            {group.map((brick) => (
              <Item
                key={brick.name}
                href={`#/brick/${brick.name}`}
                active={route.kind === 'brick' && route.name === brick.name}
              >
                {brick.title}
              </Item>
            ))}
          </Group>
        )
      })}

      <Group title="Docs">
        {docsSlugs.map((slug) => (
          <Item
            key={slug}
            href={`#/docs/${slug}`}
            active={route.kind === 'docs' && route.slug === slug}
          >
            {docsLabels[slug]}
          </Item>
        ))}
      </Group>
    </nav>
  )
}

/**
 * A persistent left column on wide screens; a native `<details>` disclosure on small ones.
 * No router, no state — the hash carries the route.
 */
export function Sidebar({ route }: { route: Route }) {
  return (
    <>
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="sticky top-20">
          <SidebarNav route={route} />
        </div>
      </aside>

      <details className="lg:hidden">
        <summary className="cursor-pointer rounded-md border border-border px-3 py-2 text-sm text-muted-foreground">
          Browse the catalogue
        </summary>
        <div className="pt-4">
          <SidebarNav route={route} />
        </div>
      </details>
    </>
  )
}
