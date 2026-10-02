import { useEffect, useState } from 'react'

export type Route =
  | { kind: 'home' }
  | { kind: 'tokens' }
  | { kind: 'brick'; name: string }

export function parseHash(hash: string): Route {
  const path = hash.replace(/^#/, '') || '/'
  if (path === '/') return { kind: 'home' }
  if (path === '/tokens') return { kind: 'tokens' }
  const brick = /^\/brick\/(.+)$/.exec(path)
  if (brick) return { kind: 'brick', name: brick[1] }
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
