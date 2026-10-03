import { useEffect, useState } from 'react'

export type DocsSlug = 'getting-started' | 'boundary' | 'contributing'

const DOCS: DocsSlug[] = ['getting-started', 'boundary', 'contributing']

export const docsSlugs = DOCS

export const isDocsSlug = (value: string): value is DocsSlug => DOCS.includes(value as DocsSlug)

export type Route =
  | { kind: 'home' }
  | { kind: 'catalogue' }
  | { kind: 'tokens' }
  | { kind: 'brick'; name: string }
  | { kind: 'docs'; slug: DocsSlug }

export function parseHash(hash: string): Route {
  const path = hash.replace(/^#/, '') || '/'
  if (path === '/') return { kind: 'home' }
  if (path === '/catalogue') return { kind: 'catalogue' }
  if (path === '/tokens') return { kind: 'tokens' }
  const brick = /^\/brick\/(.+)$/.exec(path)
  if (brick) return { kind: 'brick', name: brick[1] }
  const docs = /^\/docs\/(.+)$/.exec(path)
  if (docs && isDocsSlug(docs[1])) return { kind: 'docs', slug: docs[1] }
  return { kind: 'home' }
}

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parseHash(window.location.hash))
  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash))
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}
