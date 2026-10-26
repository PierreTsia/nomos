import { useEffect, useState } from 'react'

/**
 * A deliberately tiny app-side router (ADR 0002): Nomos has no router, so the app owns
 * one. It reads the URL hash and exposes it — swap it for react-router once the app grows.
 */
function readHash(): string {
  const hash = window.location.hash.replace(/^#/, '')
  return hash === '' ? '/' : hash
}

export function useHashRoute(): string {
  const [path, setPath] = useState(readHash)

  useEffect(() => {
    const onChange = () => setPath(readHash())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return path
}

export function navigate(path: string): void {
  window.location.hash = path
}
