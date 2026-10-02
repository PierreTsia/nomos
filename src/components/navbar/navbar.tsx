import type { ReactNode } from 'react'

import { cn } from '@nomos/lib/cn'

/**
 * La barre supérieure d'un site : une marque, des emplacements de navigation et un
 * groupe d'actions en fin. Sticky en haut, bordure basse, fond du cœur. Les slots sont
 * injectés — le cœur ne porte ni routing ni mot produit (ADR 0002, 0030).
 */
export type NavbarProps = {
  /** La marque : un wordmark, un logo, un badge de version. */
  brand?: ReactNode
  /** Les emplacements de navigation, fournis par l'appelant. */
  nav?: ReactNode
  /** Le groupe d'actions de fin : boutons, menu, avatar. */
  actions?: ReactNode
  /** Les classes de l'appelant, fusionnées après celles du cœur. */
  className?: string
}

export function Navbar({ brand, nav, actions, className }: NavbarProps) {
  return (
    <header
      className={cn(
        'sticky top-0 flex h-14 items-center gap-4 border-b border-border bg-background px-4 text-foreground',
        className,
      )}
    >
      {brand ? <div className="flex items-center gap-2 font-semibold">{brand}</div> : null}
      {nav ? <nav className="flex flex-1 items-center gap-4">{nav}</nav> : null}
      {actions ? <div className="ml-auto flex items-center gap-2">{actions}</div> : null}
    </header>
  )
}
