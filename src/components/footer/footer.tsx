import type { ReactNode } from 'react'

import { cn } from '@nomos/lib/cn'

/**
 * Le pied de page : une marque, une rangée de liens, une ligne légale. Même frontière
 * que la barre de navigation (ADR 0015) — des emplacements injectés, aucun routing, aucun
 * libellé propre au cœur (ADR 0002). L'app fournit le wordmark, les liens et le texte légal.
 */
export type FooterProps = {
  /** Le wordmark ou le logo, fourni par l'appelant. */
  brand?: ReactNode
  /** La rangée de liens, fournie par l'appelant (des `Link`, par exemple). */
  links?: ReactNode
  /** La ligne légale (copyright, mentions), fournie par l'appelant. */
  legal?: ReactNode
  /** Les classes de l'appelant, fusionnées après celles du cœur. */
  className?: string
}

export function Footer({ brand, links, legal, className }: FooterProps) {
  return (
    <footer className={cn('border-t bg-background text-foreground', className)}>
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        {brand ? <div className="font-semibold">{brand}</div> : null}
        {links ? (
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">{links}</nav>
        ) : null}
      </div>
      {legal ? (
        <div className="border-t">
          <div className="mx-auto max-w-6xl px-6 py-4 text-sm text-muted-foreground">{legal}</div>
        </div>
      ) : null}
    </footer>
  )
}
